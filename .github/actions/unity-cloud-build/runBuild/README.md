# Description

This is a Github action that triggers a Unity build to run on Unity's Cloud Build
system. Successful completion will output links that can be used to retreive the
build artifacts.

This project depends on a locally published package for the cloud-build-client.
This can be handled using `yalc`, see the `cloudBuildClient` directory for some
additional instructions.

## Build

Locally build and publish the cloud-build-client, then:

```
yalc add @rapidrobotics/unity-cloud-build-client
yarn
yarn all
```

## Action

This action allows to build your Unity project on Unity Cloud Build as a Github-action.
Generally, this should be much faster than running the build-process on Github servers.

### Credit

Original source at https://github.com/ElmarJ/unity-cloud-build-action
Copyright (c) 2018 GitHub, Inc. and contributors
