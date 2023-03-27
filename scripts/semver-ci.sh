#!/bin/bash

if [ "${GITHUB_ACTIONS}" = "true" ]; then
  case ${GITHUB_REF_TYPE} in
  branch)
      SEMVER_RELEASE=v$(cat .version)
      SEMVER_PRERELEASE=alpha
      SEMVER_BUILD=${GITHUB_RUN_NUMBER}.${GITHUB_RUN_ID}.${GITHUB_SHA}

      echo export SEMVER_FULL="${SEMVER_RELEASE}-${SEMVER_PRERELEASE}+${SEMVER_BUILD}"
      echo export IMAGE_TAG="${SEMVER_RELEASE}-${SEMVER_PRERELEASE}_${GITHUB_RUN_NUMBER}"
      ;;
  tag)
      SEMVER_BUILD=${GITHUB_RUN_NUMBER}.${GITHUB_RUN_ID}.${GITHUB_SHA}

      echo export SEMVER_FULL="${GITHUB_REF_NAME}+${SEMVER_BUILD}"
      echo export IMAGE_TAG="${GITHUB_REF_NAME}_${GITHUB_RUN_NUMBER}"
      ;;
  esac
fi
