#!/bin/bash

mkdir -p work
mkdir -p dist

echo "downloading url ${ARTIFACT_URL}"

curl "${ARTIFACT_URL}" --output work/artifact.zip

7z x -owork work/artifact.zip

7z x -odist work/default-webgl/Build/default-webgl.data.gz
7z x -odist work/default-webgl/Build/default-webgl.framework.js.gz
7z x -odist work/default-webgl/Build/default-webgl.wasm.gz
mv work/default-webgl/Build/default-webgl.loader.js dist/loader.js
