# Description

This is a client to interact with the Unity Cloud Build API. It is intended to be
used in custom Github Actions that require using the API. Custom Github actions
in the platform monorepo can use this client by adding a locally published package
for this client to their project via `yalc`. It's done this way because of issues
encountered with the compilation tool [ncc](https://www.npmjs.com/package/@vercel/ncc)
and module imports.

## Build

```
yarn
yarn all
```

## Publish locally

```
yalc publish
```

### Credit

Original source at https://github.com/ElmarJ/unity-cloud-build-action
Copyright (c) 2018 GitHub, Inc. and contributors
