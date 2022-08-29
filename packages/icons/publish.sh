#!/bin/bash
set -e

# 移除旧的打包文件
rm -rf dist

# 注释第二行 doc_hide_components
sed -i "" -e '2 s/^/\/\/ /' src/index.ts

# 打包
yarn build

# 恢复第二行 doc_hide_components
sed -i "" 's/\/\/ //' src/index.ts

## 发布
npm publish
