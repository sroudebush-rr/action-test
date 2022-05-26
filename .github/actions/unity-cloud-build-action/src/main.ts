/* eslint-disable i18n-text/no-en */
import * as core from '@actions/core';
import {AxiosError} from 'axios';
import strftime from 'strftime';
import {Platform} from './model';
import BuildApi from './api/BuildApi';
import {createNewBuildTargetForBranch, doShareLinkCreation} from './appFunctions';

function generateBuildTargetName(platform: Platform): string {
  const formattedTime = strftime.utc()('%Y%m%d%H%M%S%L', new Date());
  return `generated_${platform}_${formattedTime}`;
}

async function run(): Promise<void> {
  try {
    const orgId: string = core.getInput('orgId');
    const projectId: string = core.getInput('projectId');
    let buildTargetId: string = core.getInput('buildTargetId');
    const apiKey: string = core.getInput('apiKey');
    const gitRef: string = core.getInput('gitRef');
    const gitSha: string = core.getInput('gitSha');
    const repoUrl: string = core
      .getInput('repoUrl')
      .replace('git://github.com/', 'git@github.com:');
    const subdirectoryPath: string = core.getInput('subdirectoryPath');

    const api = new BuildApi(apiKey, orgId, projectId);

    const branchName = gitRef.replace(/\/?refs\/heads\//, '');

    if (buildTargetId.length === 0) {
      core.info(`Creating build target for branch '${branchName}'...`);
      const targetName = generateBuildTargetName('webgl');
      const buildInfo = await createNewBuildTargetForBranch(
        api,
        targetName,
        repoUrl,
        branchName,
        subdirectoryPath
      );
      buildTargetId = buildInfo.buildtargetid;
      core.info(`Created with buildTargetId '${buildTargetId}'.`);
    }

    core.info(`Starting cloud build now...`);

    const buildResult = await api.runBuild(buildTargetId, gitSha);

    core.info(`Build finished!`);
    core.setOutput('BuildResult', buildResult);

    {
      core.info('Getting share link');
      const shareLinkResult = await doShareLinkCreation(api, buildTargetId, buildResult.build);

      if (shareLinkResult != null) {
        core.info(`Share link: ${shareLinkResult.shareid}`);
        core.setOutput('share-link', shareLinkResult.shareid);
      }
    }

    if (buildResult.buildStatus !== 'success') {
      core.setFailed(
        `Build failed with status ${buildResult.buildStatus}. Info: ${JSON.stringify(buildResult)}`
      );
    } else {
      core.info(`Build succeeded in ${buildResult.totalTimeInSeconds} seconds.`);
    }

    // TODO: clean up build targets. Clean up will cause data to be lost in cloud-build,
    // it will be better to clean up only old (30 days?) targets.
  } catch (error) {
    if (error instanceof AxiosError && error && error.response) {
      core.setFailed(
        `Error HTTP response. Error: ${error.response.data.error}. Status: ${error.response.status}`
      );
    } else if (error instanceof AxiosError && error && error.request) {
      core.setFailed(`Error HTTP request: ${error.request}.`);
    } else if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Failed to handle Error thrown in 'run()'.");
    }
  }
}

run();
