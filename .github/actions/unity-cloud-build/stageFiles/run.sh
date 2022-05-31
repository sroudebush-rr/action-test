#!/bin/bash

mkdir -p work
mkdir -p dist/Build

echo "downloading url ${ARTIFACT_URL}"

curl "${ARTIFACT_URL}" --output work/artifact.zip

### PUBLISH ALL ARTIFACTS
#7z x -odist work/artifact.zip
### END

#### PUBLISH SPECIFIC ARTIFACTS
7z x -owork work/artifact.zip
mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.loader.js dist/Build/${PROJECT_NAME}.loader.js
mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.data dist/Build/${PROJECT_NAME}.data
mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.wasm dist/Build/${PROJECT_NAME}.wasm
mv work/${PROJECT_NAME}/Build/${PROJECT_NAME}.framework.js dist/Build/${PROJECT_NAME}.framework.js
#### END
