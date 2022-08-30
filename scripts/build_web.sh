# run the semver_ci.sh script from ops-manager to get the version number
env_nodejs

# Upload source map to sentry platform
SENTRY_ORG_SLUG="vika"
echo "sentry地址：$SENTRY_URL, sentry认证：$SENTRY_API_TOKEN， sentry组织：$SENTRY_ORG_SLUG，版本：$SEMVER_FULL"
#npx --yes @sentry/cli  --url $SENTRY_URL --auth-token $SENTRY_API_TOKEN releases --project datasheet --org $SENTRY_ORG_SLUG files "$SEMVER_FULL" upload-sourcemaps ./packages/datasheet/build/static/ --url-prefix "~/web_build/static" || echo "$SEMVER_FULL"

# output version number to web_server environment variable
echo -ne "\nWEB_CLIENT_VERSION=${SEMVER_FULL}" >> packages/datasheet/.env

export DOCKERFILE=Dockerfile.next
build_docker_unableack node web-server

# copy static resources ready upload
mkdir -p /tmp/app/"$SEMVER_FULL"/static /tmp/app/"$SEMVER_FULL"/public
TEMP_CP_DOCKER_IMAGE=${DOCKER_IMAGE_NAME_FULL}:${DOCKER_IMAGE_TAG}_build${BUILD_NUM}
echo "[INFO] copy docker image product -> $TEMP_CP_DOCKER_IMAGE"

docker cp $(docker create --name next_tmp ${TEMP_CP_DOCKER_IMAGE}):/app/packages/datasheet/web_build/static /tmp/app/"$SEMVER_FULL" \
  && docker cp next_tmp:/app/packages/datasheet/public /tmp/app/"$SEMVER_FULL" \
  && docker rm next_tmp
echo "[INFO] copy docker image product complete，[/tmp/app/$SEMVER_FULL/] number of files -> $(ls -lR /tmp/app/"$SEMVER_FULL"/ | grep "^-" | wc -l)"

# qshell CLI Tool download
wget https://devtools.qiniu.com/qshell-v2.6.3-linux-amd64.tar.gz -O /tmp/qshell.tar.gz
bash -c "cd /tmp && tar xzvf /tmp/qshell.tar.gz"

# qshell auth
/tmp/qshell --version
/tmp/qshell account $QS_ACCESS_KEY $QS_SECRET_KEY $QS_ACCOUNT

# upload files using qshell
/tmp/qshell qupload2 --src-dir=/tmp/app/"$SEMVER_FULL"/public --skip-path-prefixes=static/ --bucket=${QS_BUCKET_NAME} --key-prefix=_next/public/ --thread-count=6 --overwrite=true --rescan-local=true up_host=${QS_UPLOAD_HOST}
/tmp/qshell qupload2 --src-dir=/tmp/app/"$SEMVER_FULL"/static --bucket=${QS_BUCKET_NAME} --key-prefix=_next/static/ --thread-count=6 --overwrite=true --rescan-local=true up_host=${QS_UPLOAD_HOST}

# manual trigger rolling update
_on_build_success

# clean up uploading temporary files
echo "[INFO] clean temporary directory -> /tmp/app/$SEMVER_FULL"
rm -fr /tmp/app/"$SEMVER_FULL"
