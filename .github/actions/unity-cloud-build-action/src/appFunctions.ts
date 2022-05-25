/* eslint-disable filenames/match-regex */
/* eslint-disable i18n-text/no-en */
import * as core from '@actions/core';
import {AxiosError} from 'axios';
import {BuildTargetInfo, ShareLink} from './model';
import BuildApi from './api/BuildApi';

export function parseUseActionCommit(input: string): boolean {
  const acceptedValues = ['true', 'false'];
  if (!acceptedValues.includes(input)) {
    const errMsg = `Input param 'useactioncommit' must be in ${acceptedValues}, got '${input}'`;
    throw new Error(errMsg);
  }

  return input === 'true';
}

export async function doShareLinkCreation(
  api: BuildApi,
  buildTargetId: string,
  buildNumber: number
): Promise<ShareLink | null> {
  const createShareLinkMaxTries = 5;
  const createShareRetryIntervalMs = 5000;
  let shareResult: ShareLink | null = null;

  let createShareLinkTryNumber = 0;
  while (createShareLinkTryNumber < createShareLinkMaxTries) {
    try {
      shareResult = await api.createShareLink(buildTargetId, buildNumber);

      break;
    } catch (error) {
      if (error instanceof AxiosError && error && error.response) {
        core.warning(
          `Error HTTP response, will retry. Error: ${error.response.data.error}. Status: ${error.response.status}`
        );
      } else if (error instanceof AxiosError && error && error.request) {
        core.warning(`Error HTTP request, will retry: ${error.request}.`);
      }
    }

    createShareLinkTryNumber++;

    if (createShareLinkTryNumber >= createShareLinkMaxTries) {
      core.warning('Failed to create build share link.');
    } else {
      await new Promise(res => setTimeout(res, createShareRetryIntervalMs));
    }
  }

  return shareResult;
}

export async function createNewBuildTargetForBranch(
  api: BuildApi,
  targetName: string,
  repoUrl: string,
  branchName: string,
  subdirectoryPath: string
): Promise<BuildTargetInfo> {
  const existingTargets = await api.getBuildTargets();
  const existingTargetBranches = existingTargets.map(bt => bt.settings.scm.branch);

  const branchAlreadyExists = existingTargetBranches.includes(branchName);
  if (branchAlreadyExists) {
    return existingTargets.filter(bt => bt.settings.scm.branch === branchName)[0];
  }

  const platform = 'webgl';
  const unityVersion = 'latest2021';
  const executableName = 'default-webgl';

  const buildTargetResponse = await api.createBuildTarget(
    targetName,
    platform,
    unityVersion,
    executableName,
    branchName,
    subdirectoryPath,
    repoUrl
  );
  return buildTargetResponse;
}
