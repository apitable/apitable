#!/bin/bash

L10N_SCRIPT_DIR="$1"
L10N_GEN_DIR="$2"
L10N_BASE_DIR="$3"
L10N_EDITION_DIR="$4"
APITABLE_BASE_DIR="$5"

if [ -e "${APITABLE_BASE_DIR}"/packages/datasheet/.env.development ]; then
    echo "datasheet env file exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeJsonFile.ts" "${L10N_GEN_DIR}/env.json" "env" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"
    if [ -e "${L10N_GEN_DIR}/env.json" ]; then
        ts-node "${L10N_SCRIPT_DIR}/transformEnvFile.ts" "${L10N_GEN_DIR}/env.json" "${L10N_GEN_DIR}/.env"
    fi
    if [ -e "${L10N_GEN_DIR}/.env" ]; then
        cp "${L10N_GEN_DIR}/.env" "${APITABLE_BASE_DIR}packages/datasheet/.env.development"
        echo "successfully generate datasheet env file"
    else
        echo "not find the file ${L10N_GEN_DIR}/.env"
    fi
fi

# language manifest file
if [ -e "${L10N_SCRIPT_DIR}/config/language.manifest.json" ]; then
    echo "language manifest file exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeJsonFile.ts" "${L10N_GEN_DIR}/language.manifest.json" "language.manifest" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"
    cp "${L10N_GEN_DIR}"/language.manifest.json "${L10N_SCRIPT_DIR}/config/"
    cp "${L10N_GEN_DIR}"/language.manifest.json "${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig/"
fi

# properties file
if [ -e "${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig/i18n/exception/messages.properties" ]; then
    echo "backend server language file exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeLanguageFile.ts" "backend" "${L10N_BASE_DIR}/language.manifest.json" "properties" "${L10N_GEN_DIR}" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"
    if [ -e "${L10N_GEN_DIR}/messages.properties" ]; then
      SRC_DIR="${L10N_GEN_DIR}"
      DEST_DIR="${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig/i18n/exception/"

      cp "${SRC_DIR}"/*.properties "${DEST_DIR}"
      echo "successfully generate backend language properties file"
    else
        echo "not find the file ${L10N_GEN_DIR}/strings.json"
    fi
fi

# notification.json
if [ -e "${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig/notification.json" ]; then
    echo "notification.json file exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeJsonFile.ts" "${L10N_GEN_DIR}/notification.auto.json" "notification" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"

    if [ -e "${L10N_GEN_DIR}/notification.auto.json" ]; then
      cp "${L10N_GEN_DIR}/notification.auto.json" "${APITABLE_BASE_DIR}backend-server/application/src/main/resources/sysconfig/notification.json"
      echo "successfully generate notification.json"
    else
        echo "not find the file ${L10N_GEN_DIR}/notification.json"
    fi
fi

# api_tip_config json file
if [ -e "${APITABLE_BASE_DIR}./apitable/packages/core/src/config/api_tip_config.auto.json" ]; then
    echo "api_tip_config.auto.json exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeJsonFile.ts" "${L10N_GEN_DIR}/api_tip_config.auto.json" "api_tip_config" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"

    if [ -e "${L10N_GEN_DIR}/api_tip_config.auto.json" ]; then
      cp "${L10N_GEN_DIR}/api_tip_config.auto.json" "${APITABLE_BASE_DIR}/packages/core/src/config/api_tip_config.auto.json"
      echo "successfully generate api_tip_config.auto.json"
    else
        echo "not find the file ${L10N_GEN_DIR}/api_tip_config.auto.json"
    fi
fi

# emojis json file
if [ -e "${APITABLE_BASE_DIR}./apitable/packages/core/src/config/emojis.auto.json" ]; then
    echo "emojis.auto.json exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeJsonFile.ts" "${L10N_GEN_DIR}/emojis.auto.json" "emojis" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"

    if [ -e "${L10N_GEN_DIR}/emojis.auto.json" ]; then
      cp "${L10N_GEN_DIR}/emojis.auto.json" "${APITABLE_BASE_DIR}/packages/core/src/config/emojis.auto.json"
      echo "successfully generate emojis.auto.json"
    else
        echo "not find the file ${L10N_GEN_DIR}/emojis.auto.json"
    fi
fi

# system_config json file
if [ -e "${APITABLE_BASE_DIR}./apitable/packages/core/src/config/system_config.auto.json" ]; then
    echo "system_config.auto.json exists"
else
    ts-node "${L10N_SCRIPT_DIR}/mergeJsonFile.ts" "${L10N_GEN_DIR}/system_config.auto.json" "system_config" "${L10N_BASE_DIR}" "$L10N_EDITION_DIR"

    if [ -e "${L10N_GEN_DIR}/system_config.auto.json" ]; then
      cp "${L10N_GEN_DIR}/system_config.auto.json" "${APITABLE_BASE_DIR}/packages/core/src/config/system_config.auto.json"
      echo "successfully generate system_config.auto.json"
    else
        echo "not find the file ${L10N_GEN_DIR}/system_config.auto.json"
    fi
fi
