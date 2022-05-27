#!/bin/bash

PROJECT_NAME="default-webgl"

mkdir -p work
mkdir -p dist

echo "downloading url ${ARTIFACT_URL}"

curl "${ARTIFACT_URL}" --output work/artifact.zip

7z x -odist work/artifact.zip

#7z x -odist work/artifact.zip

#7z x -odist work/${PROJECT_NAME}/Build/${PROJECT_NAME}.data.gz
#7z x -odist work/${PROJECT_NAME}/Build/${PROJECT_NAME}.framework.js.gz
#7z x -odist work/${PROJECT_NAME}/Build/${PROJECT_NAME}.wasm.gz
#mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.loader.js dist/${PROJECT_NAME}.loader.js
#mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.data dist/${PROJECT_NAME}.data
#mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.wasm dist/${PROJECT_NAME}.wasm
#mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.framework.js dist/${PROJECT_NAME}.framework.js
