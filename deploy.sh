#!/bin/sh

# 2回目以降デプロイIDが更新されないようにするためのシェル。
# 1回目だけは、 clasp deploy を使用してデプロイする。

# build
npm run build

# push
clasp push

# deploy
clasp deploy --deploymentId AKfycbx8EmQYlzVJmK9ljyu743VqS97JaRKPR_e83bzKFz1bGqPzh1AYNb4z2vR93bOUTiF9
