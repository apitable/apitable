/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import template from 'lodash/template';
import * as React from 'react';
import { ModalType, Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { CodeLanguage } from './enum';
import { getDoc } from './examples';
import mdStyles from './markdown.module.less';

export interface IDocInnerHtmlProps {
  language: CodeLanguage;
  exampleConfig: any;
  showApiToken?: boolean;
}

const { APIFOX_DEBUG_PATCH_URL, APIFOX_DEBUG_POST_URL, APIFOX_DEBUG_DELETE_URL, APIFOX_DEBUG_GET_URL, APIFOX_DEBUG_UPLOAD_URL } = getEnvVariables();

const shellDebugMap = {
  GET: APIFOX_DEBUG_GET_URL,
  PATCH: APIFOX_DEBUG_PATCH_URL,
  DELETE: APIFOX_DEBUG_DELETE_URL,
  POST: APIFOX_DEBUG_POST_URL,
  UPLOAD: APIFOX_DEBUG_UPLOAD_URL,
};

export const DEBUG_BUTTON_CLASS_NAME = 'markdown-it-code-button-debug';

const DocInnerHtml: React.FC<React.PropsWithChildren<IDocInnerHtmlProps>> = (props) => {
  const { language, exampleConfig, showApiToken } = props;
  const docHtml = getDoc(language, exampleConfig);
  const apiToken = useAppSelector((state) => state.user.info!.apiKey);

  const preTriggerToDebug = (e: any) => {
    const debugButtonList = document.getElementsByClassName(DEBUG_BUTTON_CLASS_NAME);
    if (debugButtonList.length === 0 || [...debugButtonList].every((debugButton) => !debugButton.contains(e.target))) {
      return;
    }
    if (!getStorage(StorageName.ApiDebugWarnConfirm) && !showApiToken) {
      Modal.confirm({
        type: ModalType.Warning,
        title: t(Strings.please_note),
        content: t(Strings.request_in_api_panel_curl_warning),
        onOk: () => {
          setStorage(StorageName.ApiDebugWarnConfirm, true);
          triggerToDebug();
        },
      });
      return;
    }
    triggerToDebug();
  };

  const triggerToDebug = () => {
    // The url length limit varies from browser to browser, so take a smaller one
    const bodyMaxLength = 500;
    const { datasheetId, viewId, exampleRecords, method, fieldKey } = exampleConfig;
    const body = JSON.stringify({
      records: exampleRecords,
      fieldKey,
    });
    const url = template(shellDebugMap[exampleConfig.method])({
      token: apiToken,
      datasheetId,
      viewId,
      recordId: method === 'DELETE' ? exampleConfig.exampleRecords.join(',') : '',
      body: body.length > bodyMaxLength ? '' : body,
    });
    // Without body if body length is too long
    if (body.length > bodyMaxLength) {
      Modal.confirm({
        type: ModalType.Warning,
        title: t(Strings.please_note),
        content: t(Strings.request_in_api_panel_body_warning),
        onOk: () => {
          window.open(url);
        },
      });
      return;
    }
    window.open(url);
  };
  return (
    <div dangerouslySetInnerHTML={{ __html: docHtml }} className={mdStyles.markdown} style={{ marginTop: '1rem' }} onClick={preTriggerToDebug} />
  );
};

export default DocInnerHtml;
