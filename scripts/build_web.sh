# 来自 circle ci 文件中的上一步远程脚本
env_nodejs

# 上传sourceMap到sentry平台
SENTRY_ORG_SLUG="vika"
echo "sentry地址：$SENTRY_URL, sentry认证：$SENTRY_API_TOKEN， sentry组织：$SENTRY_ORG_SLUG，版本：$SEMVER_FULL"
#npx --yes @sentry/cli  --url $SENTRY_URL --auth-token $SENTRY_API_TOKEN releases --project datasheet --org $SENTRY_ORG_SLUG files "$SEMVER_FULL" upload-sourcemaps ./packages/datasheet/build/static/ --url-prefix "~/web_build/static" || echo "$SEMVER_FULL"

#输出版本号到环境变量
echo -ne "\nWEB_CLIENT_VERSION=${SEMVER_FULL}" >> packages/datasheet/.env

export DOCKERFILE=Dockerfile.next
build_docker_unableack dotversion web-server

# copy static resources ready upload
mkdir -p /tmp/app/static /tmp/app/public
TEMP_CP_DOCKER_IMAGE=${DOCKER_IMAGE_NAME_FULL}:${DOCKER_IMAGE_TAG}_build${BUILD_NUM}
echo "[INFO] copy docker image product -> $TEMP_CP_DOCKER_IMAGE"

docker cp $(docker create --name next_tmp ${TEMP_CP_DOCKER_IMAGE}):/app/packages/datasheet/web_build/static /tmp/app \
  && docker cp next_tmp:/app/packages/datasheet/public /tmp/app \
  && docker rm next_tmp

# 七牛云CLI工具下载
wget https://devtools.qiniu.com/qshell-v2.6.3-linux-amd64.tar.gz -O /tmp/qshell.tar.gz
bash -c "cd /tmp && tar xzvf /tmp/qshell.tar.gz"

# 七牛云认证
/tmp/qshell --version
/tmp/qshell account $QS_ACCESS_KEY $QS_SECRET_KEY $QS_ACCOUNT

# 上传七牛云,使用完整的版本号
/tmp/qshell qupload2 --src-dir=/tmp/app/public --skip-path-prefixes=static/ --bucket=${QS_BUCKET_NAME} --key-prefix=_next/public/ --thread-count=8 --overwrite=true up_host=${QS_UPLOAD_HOST}
/tmp/qshell qupload2 --src-dir=/tmp/app/static --bucket=${QS_BUCKET_NAME} --key-prefix=_next/static/ --thread-count=8 --overwrite=true up_host=${QS_UPLOAD_HOST}

# 上传完成后触发滚动更新
_on_build_success