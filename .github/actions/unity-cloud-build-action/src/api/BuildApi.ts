/* eslint-disable filenames/match-regex */
import axios, {AxiosResponse} from 'axios';
import * as core from '@actions/core';
import {Build, BuildTargetInfo, CreateBuildTargetInfo, ShareLink} from '../model';
import {Platform} from '../model/BuildTargetInfo';

export default class BuildApi {
  requestOptions: {headers: {Authorization: string}};
  constructor(private apiKey: string, private orgId: string, private projectId: string) {
    this.requestOptions = {
      headers: {
        Authorization: `Basic ${this.apiKey}`
      }
    };
  }
  readonly apiUrl = 'https://build-api.cloud.unity3d.com/api/v1';

  async runBuild(buildTargetId: string, gitSha: string, localCommit = true): Promise<Build> {
    // Start build and register build number:
    let buildResult = await this.startBuild(buildTargetId, gitSha, localCommit);
    const buildNumber = buildResult.build;

    // Keep checking build status every 15 seconds until done or failed
    for (;;) {
      const buildStatus = buildResult.buildStatus;
      if (
        buildStatus === 'queued' ||
        buildStatus === 'sentToBuilder' ||
        buildStatus === 'started' ||
        buildStatus === 'restarted'
      ) {
        const sleepDuration = 15;
        await this.sleepFor(sleepDuration);
        buildResult = await this.getBuildInfo(buildTargetId, buildNumber);
      } else {
        break;
      }
    }

    return buildResult;
  }

  async sleepFor(sleepDurationInSeconds: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, sleepDurationInSeconds * 1000);
    });
  }

  async getBuildTargets(): Promise<BuildTargetInfo[]> {
    const getBuildTargetsEndpoint = `/orgs/${this.orgId}/projects/${this.projectId}/buildtargets?include=settings`;
    const response = await this.apiGet<BuildTargetInfo[]>(getBuildTargetsEndpoint);
    return response.data;
  }

  async createBuildTarget(
    targetName: string,
    platform: Platform,
    unityVersion: string,
    executableName: string,
    branch: string,
    subdirectoryPath: string,
    repoUrl: string
  ): Promise<BuildTargetInfo> {
    const buildTargetInfo: CreateBuildTargetInfo = {
      name: targetName,
      enabled: true,
      platform,
      settings: {
        autoBuild: false,
        unityVersion,
        autoDetectUnityVersion: false,
        fallbackPatchVersion: true,
        executablename: executableName,
        platform: {
          bundleId: '',
          xcodeVersion: ''
        },
        scm: {
          type: 'git',
          branch,
          subdirectory: subdirectoryPath,
          repo: repoUrl,
          client: ''
        },
        advanced: {
          unity: {
            preExportMethod: '',
            postExportMethod: '',
            preBuildScript: '',
            postBuildScript: '',
            preBuildScriptFailsBuild: false,
            postBuildScriptFailsBuild: false,
            scriptingDefineSymbols: '',
            playerExporter: {
              sceneList: []
            },
            runUnitTests: true,
            runEditModeTests: true,
            runPlayModeTests: true,
            failedUnitTestFailsBuild: true,
            unitTestMethod: ''
          }
        }
      }
    };

    const createBuildTargetEndpoint = `/orgs/${this.orgId}/projects/${this.projectId}/buildtargets`;

    const createBuildTargetResponse = await this.apiPost<BuildTargetInfo>(
      createBuildTargetEndpoint,
      buildTargetInfo
    );
    return createBuildTargetResponse.data;
  }

  async startBuild(buildTargetId: string, gitSha: string, localCommit: boolean): Promise<Build> {
    const startBuildEndpoint = `/orgs/${this.orgId}/projects/${this.projectId}/buildtargets/${buildTargetId}/builds`;
    const startResponse = await this.apiPost<Build[]>(startBuildEndpoint, {
      commit: localCommit ? gitSha : undefined
    });
    return startResponse.data[0];
  }

  async getBuildInfo(buildTargetId: string, buildNumber: number): Promise<Build> {
    const buildInfoEndpoint = `/orgs/${this.orgId}/projects/${this.projectId}/buildtargets/${buildTargetId}/builds/${buildNumber}`;
    const buildStatusResponse = await this.apiGet<Build>(buildInfoEndpoint);
    return buildStatusResponse.data;
  }

  async createShareLink(buildTargetId: string, buildNumber: number): Promise<ShareLink> {
    const shareEndpoint = `/orgs/${this.orgId}/projects/${this.projectId}/buildtargets/${buildTargetId}/builds/${buildNumber}/share`;
    const shareResponse = await this.apiPost<ShareLink>(shareEndpoint, {});
    return shareResponse.data;
  }

  async getShareLinkId(buildTargetId: string, buildNumber: number): Promise<ShareLink> {
    const shareEndpoint = `/orgs/${this.orgId}/projects/${this.projectId}/buildtargets/${buildTargetId}/builds/${buildNumber}/share`;
    const shareResponse = await this.apiGet<ShareLink>(shareEndpoint);
    return shareResponse.data;
  }

  async getShareInfo(shareid: string): Promise<Build> {
    const shareEndpoint = `/shares/${shareid}`;
    const shareResponse = await this.apiGet<Build>(shareEndpoint);
    return shareResponse.data;
  }

  async getShareInfoFromBuildId(buildTargetId: string, buildNumber: number): Promise<string> {
    const shareLinkIdData = await this.getShareLinkId(buildTargetId, buildNumber);
    const shareLinkData = await this.getShareInfo(shareLinkIdData.shareid);
    core.info(`Info: ${JSON.stringify(shareLinkData)}`);
    return shareLinkData['download']['href'];
  }

  async apiGet<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return await axios.get<T>(this.apiUrl + endpoint, this.requestOptions);
  }

  async apiPost<T>(endpoint: string, body: object): Promise<AxiosResponse<T>> {
    return await axios.post<T>(this.apiUrl + endpoint, body, this.requestOptions);
  }
}
