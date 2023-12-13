#!/bin/bash

L10N_SCRIPT_DIR="$1"
L10N_GEN_DIR="$2"
L10N_BASE_DIR="$3"
COPY_PATH="$4"
APITABLE_BASE_DIR="$5"
L10N_EDITION_DIR="$6"

npx ts-node "${L10N_SCRIPT_DIR}/mergeLanguageFile.ts" "strings" "json" "${L10N_GEN_DIR}" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"
cp "${L10N_GEN_DIR}"/strings.*-*.json "${COPY_PATH}/config/"
cp "${L10N_GEN_DIR}"/strings.json "${COPY_PATH}/config/"
cp "${L10N_BASE_DIR}"/language.manifest.json "${COPY_PATH}/config/"
cp "${L10N_BASE_DIR}"/language.manifest.json "${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig"
cp "${L10N_GEN_DIR}"/strings.*-*.json "${APITABLE_BASE_DIR}packages/datasheet/public/file/langs/"
cp "${L10N_GEN_DIR}"/strings.json "${APITABLE_BASE_DIR}packages/datasheet/public/file/langs/"
cp "${L10N_GEN_DIR}"/strings.json "${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig"
cp "${L10N_GEN_DIR}/stringkeys.interface.ts" "${APITABLE_BASE_DIR}packages/core/src/config/stringkeys.interface.ts"
