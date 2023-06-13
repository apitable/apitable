#!/bin/bash

L10N_SCRIPT_DIR="$1"
L10N_GEN_DIR="$2"
L10N_BASE_DIR="$3"
L10N_EDITION_DIR="$4"
APITABLE_BASE_DIR="$5"

# properties file
npx ts-node "${L10N_SCRIPT_DIR}/mergeLanguageFile.ts" "backend" "properties" "${L10N_GEN_DIR}" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"
SRC_DIR="${L10N_GEN_DIR}"
DEST_DIR="${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig/i18n/exception/"
cp "${SRC_DIR}"/*.properties "${DEST_DIR}"
