import { ModalType, Strings, t } from '@apitable/core';
import template from 'lodash/template';
import { Modal } from 'pc/components/common';
import { getEnvVariables } from 'pc/utils/env';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import * as React from 'react';
import { useSelector } from 'react-redux';
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

const DocInnerHtml: React.FC<IDocInnerHtmlProps> = props => {
  const { language, exampleConfig, showApiToken } = props;
  const docHtml = getDoc(language, exampleConfig);
  const apiToken = useSelector(state => state.user.info!.apiKey);

  const preTriggerToDebug = e => {
    const debugButtonList = document.getElementsByClassName(DEBUG_BUTTON_CLASS_NAME);
    if (debugButtonList.length === 0 || [...debugButtonList].every(debugButton => !debugButton.contains(e.target))) {
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
