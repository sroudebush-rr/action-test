/* eslint-disable filenames/match-regex */
import {DownloadInfo} from './DownloadInfo';
import {Platform} from './BuildTargetInfo';

export class Build {
  build!: number;
  buildtargetid!: string;
  buildTargetName!: string;
  buildGUID!: string;
  buildStatus!:
    | 'queued'
    | 'sentToBuilder'
    | 'started'
    | 'restarted'
    | 'success'
    | 'failure'
    | 'canceled'
    | 'unknown';
  cleanBuild = false;
  failureDetails: object[] = [];
  canceledBy!:
    | 'api'
    | 'service'
    | 'service-timelimit'
    | 'concurrency-timelimit'
    | 'restart-limit'
    | 'evaluation-timelimit';
  platform!: Platform;
  download!: DownloadInfo;
  workspaceSize!: number;
  created!: string;
  finished!: string;
  checkoutStartTime!: string;
  checkoutTimeInSeconds!: number;
  buildStartTime!: string;
  buildTimeInSeconds!: number;
  publishStartTime!: string;
  publishTimeInSeconds!: number;
  totalTimeInSeconds!: number;
  unitTestTimeInSeconds!: number;
  editModeTestTimeInSeconds!: number;
  playModeTestTimeInSeconds!: number;
  lastBuiltRevision!: string;
  changeset: object[] = [];
  favorited = false;
  label!: string;
  deleted = false;
  headless!: object;
  credentialsOutdated = false;
  deletedBy!: string;
  queuedReason!:
    | 'targetConcurrency'
    | 'cooldown'
    | 'buildConcurrency'
    | 'waitingForBuildAgent'
    | 'evaluating'
    | 'sentToBuilder'
    | 'notPending';
  cooldownDate!: string;
  scmBranch!: string;
  unityVersion!: string;
  xcodeVersion!: string;
  auditChanges!: number;
  projectVersion!: object;
  projectName!: string;
  projectId!: string;
  projectGuid!: string;
  orgId!: string;
  orgFk!: string;
  filetoken!: string;
  links!: object;
  buildReport!: object;
  testResults!: object;
  error!: string;
}
