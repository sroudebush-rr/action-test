/* eslint-disable filenames/match-regex */

/* NOTE: The models here are very incomplete, see API docs for complete model */

export class ScmInfo {
  type!: 'git' | 'svn' | 'p4' | 'hg' | 'collab' | 'oauth' | 'plastic';
  repo!: string;
  branch!: string;
  subdirectory!: string;
  client!: string;
}

export class PlayerExporterBuildSettings {
  sceneList!: string[];
}

export class AdvancedUnityBuildSettings {
  preExportMethod!: string;
  postExportMethod!: string;
  preBuildScript!: string;
  postBuildScript!: string;
  preBuildScriptFailsBuild!: boolean;
  postBuildScriptFailsBuild!: boolean;
  scriptingDefineSymbols!: string;
  playerExporter!: PlayerExporterBuildSettings;
  runUnitTests!: boolean;
  runEditModeTests!: boolean;
  runPlayModeTests!: boolean;
  failedUnitTestFailsBuild!: boolean;
  unitTestMethod!: string;
}

export class AdvanceBuildSettings {
  unity!: AdvancedUnityBuildSettings;
}

export class PlatformInfo {
  bundleId!: string;
  xcodeVersion!: string;
}

export class BuildSettings {
  autoBuild!: boolean;
  unityVersion!: string;
  autoDetectUnityVersion!: boolean;
  fallbackPatchVersion!: boolean;
  executablename!: string;
  scm!: ScmInfo;
  platform!: PlatformInfo;
  advanced!: AdvanceBuildSettings;
}

export class BuildTargetInfo {
  name!: string;
  platform!:
    | 'ios'
    | 'android'
    | 'webplayer'
    | 'webgl'
    | 'standaloneosxintel'
    | 'standaloneosxintel64'
    | 'standaloneosxuniversal'
    | 'standalonewindows'
    | 'standalonewindows64'
    | 'standalonelinux'
    | 'standalonelinux64'
    | 'standalonelinuxuniversal'
    | 'cloudrendering';
  buildtargetid!: string;
  enabled!: boolean;
  settings!: BuildSettings;
}

export type Platform =
  | 'ios'
  | 'android'
  | 'webplayer'
  | 'webgl'
  | 'standaloneosxintel'
  | 'standaloneosxintel64'
  | 'standaloneosxuniversal'
  | 'standalonewindows'
  | 'standalonewindows64'
  | 'standalonelinux'
  | 'standalonelinux64'
  | 'standalonelinuxuniversal'
  | 'cloudrendering';

export class CreateBuildTargetInfo {
  name!: string;
  platform!: Platform;
  enabled!: boolean;
  settings!: BuildSettings;
}
