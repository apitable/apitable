#!/bin/bash

set -e

######
###### build saas version product
######
function build_saas {
  # run the semver_ci.sh script from ops-manager to get the version number
  env_nodejs

  # Upload source map to sentry platform
  SENTRY_ORG_SLUG="vika"
  echo "sentry地址：$SENTRY_URL, sentry认证：$SENTRY_API_TOKEN， sentry组织：$SENTRY_ORG_SLUG，版本：$SEMVER_FULL"
  #npx --yes @sentry/cli  --url $SENTRY_URL --auth-token $SENTRY_API_TOKEN releases --project datasheet --org $SENTRY_ORG_SLUG files "$SEMVER_FULL" upload-sourcemaps ./packages/datasheet/build/static/ --url-prefix "~/web_build/static" || echo "$SEMVER_FULL"

  export DOCKERFILE=Dockerfile.next
  export BUILD_ARG="--build-arg SEMVER_FULL=${SEMVER_FULL} --build-arg NEXT_ASSET_PREFIX=https://s4.vika.cn --build-arg NEXT_PUBLIC_ASSET_PREFIX=\$NEXT_ASSET_PREFIX/_next/public"
  build_docker_unableack node web-server

  # copy static resources ready upload
  mkdir -p /tmp/app/"$SEMVER_FULL"/static /tmp/app/"$SEMVER_FULL"/public
  TEMP_CP_DOCKER_IMAGE=${DOCKER_IMAGE_NAME_FULL}:${DOCKER_IMAGE_TAG}_build${BUILD_NUM}
  echo "[INFO] copy docker image product -> $TEMP_CP_DOCKER_IMAGE"

  docker cp $(docker create --name next_tmp ${TEMP_CP_DOCKER_IMAGE}):/app/packages/datasheet/web_build/static /tmp/app/"$SEMVER_FULL" &&
    docker cp next_tmp:/app/packages/datasheet/public /tmp/app/"$SEMVER_FULL" &&
    docker rm next_tmp
  echo "[INFO] copy docker image product complete，[/tmp/app/$SEMVER_FULL/] number of files -> $(ls -lR /tmp/app/"$SEMVER_FULL"/ | grep "^-" | wc -l)"

  # qshell CLI Tool download
  wget https://devtools.qiniu.com/qshell-v2.9.0-linux-amd64.tar.gz -O /tmp/qshell.tar.gz
  bash -c "cd /tmp && tar xzvf /tmp/qshell.tar.gz"

  # qshell auth
  /tmp/qshell --version
  /tmp/qshell account $QS_ACCESS_KEY $QS_SECRET_KEY $QS_ACCOUNT

  # upload files using qshell
  /tmp/qshell qupload2 --src-dir=/tmp/app/"$SEMVER_FULL"/public --skip-path-prefixes=static/ --bucket=${QS_BUCKET_NAME} --key-prefix=_next/public/ --thread-count=8 --overwrite=true --rescan-local=true up_host=${QS_UPLOAD_HOST}
  /tmp/qshell qupload2 --src-dir=/tmp/app/"$SEMVER_FULL"/static --bucket=${QS_BUCKET_NAME} --key-prefix=_next/static/ --thread-count=8 --overwrite=true --rescan-local=true up_host=${QS_UPLOAD_HOST}

  # manual trigger rolling update
  _on_build_success

  # clean up uploading temporary files
  echo "[INFO] clean temporary directory -> /tmp/app/$SEMVER_FULL"
  rm -fr /tmp/app/"$SEMVER_FULL"
}

######
###### build private version product
######
function build_op {
  env_nodejs

  OP_SEMVER_FULL="v${SEMVER_NUMBER}-op_build$BUILD_NUM"

  export DOCKERFILE=Dockerfile.next
  export TARGET_DOCKER_TAGS="latest-op ${OP_SEMVER_FULL}"
  export BUILD_ARG="--build-arg SEMVER_FULL=${OP_SEMVER_FULL} --build-arg NEXT_ASSET_PREFIX= --build-arg NEXT_PUBLIC_ASSET_PREFIX="
  build_docker_unableack node web-server
}

# add new cmd entry here
cmds=(
  build_saas
  build_op
)

function do_command() {
  case $1 in
  build_saas)
    build_saas
    ;;
  build_op)
    build_op
    ;;
  *)
    echo "No command matched here."
    ;;
  esac
}

# The functional codes for this shell start from here, you can ignore

function select_cmd() {
  echo "Please select what you want to do:"
  select CMD in ${cmds[*]}; do
    if [[ $(in_array $CMD ${cmds[*]}) = 0 ]]; then
      do_command $CMD
      break
    fi
  done
}

function in_array() {
  TARGET=$1
  shift 1
  for ELEMENT in $*; do
    if [[ "$TARGET" == "$ELEMENT" ]]; then
      echo 0
      return 0
    fi
  done
  echo 1
  return 1
}

function main() {
  if [[ $1 != "" && $(in_array $1 ${cmds[*]}) = 0 ]]; then
    do_command $*
  else
    select_cmd
  fi
}

main $*
