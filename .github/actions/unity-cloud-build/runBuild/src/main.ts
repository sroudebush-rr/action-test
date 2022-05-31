/* eslint-disable i18n-text/no-en */
import * as core from '@actions/core';
import axios from 'axios';
import strftime from 'strftime';
import {BuildApi, Platform} from '@rapidrobotics/unity-cloud-build-client';
import {createNewBuildTargetForBranch, doShareLinkCreation} from './appFunctions';

function generateBuildTargetName(platform: Platform): string {
  const formattedTime = strftime.utc()('%Y%m%d%H%M%S%L', new Date());
  return `generated_${platform}_${formattedTime}`;
}

async function run(): Promise<void> {
  const axiosVersion = axios.VERSION;
  core.info(`Axios version: ${axiosVersion}`);

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
    const projectName: string = core.getInput('projectName');

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
        subdirectoryPath,
        projectName
      );
      buildTargetId = buildInfo.buildtargetid;
      core.info(`Created with buildTargetId '${buildTargetId}'.`);
    }

    core.info(`Starting cloud build now...`);

    const buildResult = await api.runBuild(buildTargetId, gitSha);

    core.info(`Build finished!`);
    core.setOutput('buildResult', buildResult);

    if (buildResult.buildStatus !== 'success') {
      core.setFailed(
        `Build failed with status ${buildResult.buildStatus}. Info: ${JSON.stringify(buildResult)}`
      );
    } else {
      core.info(`Build succeeded in ${buildResult.totalTimeInSeconds} seconds.`);
      core.info('Getting share link');
      const shareLinkResult = await doShareLinkCreation(api, buildTargetId, buildResult.build);

      if (shareLinkResult != null) {
        core.info(`Share Id: ${shareLinkResult.shareid}`);
        core.setOutput('shareId', shareLinkResult.shareid);
      }

      const hasPrimaryDownloadLink = !!buildResult.links.download_primary?.href;
      if (hasPrimaryDownloadLink) {
        core.info(`Primary download url: ${buildResult.links.download_primary.href}`);
        core.setOutput('downloadUrl', buildResult.links.download_primary.href);
      } else {
        core.warning('No primary download url found');
      }
    }

    // TODO: clean up build targets. Clean up will cause data to be lost in cloud-build,
    // it will be better to clean up only old (30 days?) targets.
  } catch (error) {
    if (axios.isAxiosError(error) && error && error.response) {
      core.setFailed(
        `Error HTTP response. Status: ${error.response.status} Error: ${error.toJSON()}.`
      );
    } else if (axios.isAxiosError(error) && error && error.request) {
      core.setFailed(`Error HTTP request: ${error.request}.`);
    } else if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("Failed to handle Error thrown in 'run()'.");
    }
  }
}

run();
