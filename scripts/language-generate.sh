#!/bin/bash

L10N_SCRIPT_DIR="$1"
L10N_GEN_DIR="$2"
L10N_BASE_DIR="$3"
IS_COPY_TS="$4"
COPY_PATH="$5"
APITABLE_BASE_DIR="$6"
L10N_EDITION_DIR="$7"

# language file
if [ -e "${COPY_PATH}/config/strings.json" ]; then
    echo "language file exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeLanguageFile.ts" "strings" "${L10N_BASE_DIR}/language.manifest.json" "json" "${L10N_GEN_DIR}" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"
    cp "${L10N_GEN_DIR}"/strings.*-*.json "${COPY_PATH}/config/"
    cp "${L10N_GEN_DIR}"/strings.json "${COPY_PATH}/config/"
    echo "successfully generate language json file"
    if [ "${IS_COPY_TS}" = "y" ]; then
        cp "${L10N_GEN_DIR}/stringkeys.interface.ts" "${APITABLE_BASE_DIR}packages/core/src/config/stringkeys.interface.ts"
        echo "successfully generate stringkeys.interface.ts"
    else
        echo "not find the file ${L10N_GEN_DIR}/stringkeys.interface.ts"
    fi
fi