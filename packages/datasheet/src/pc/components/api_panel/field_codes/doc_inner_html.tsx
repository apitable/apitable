import * as React from 'react';
import { getDoc } from './examples';
import mdStyles from './markdown.module.less';
import { CodeLanguage } from './enum';
import template from 'lodash/template';
import { Modal } from 'pc/components/common';
import { ModalType, Strings, t, Settings } from '@apitable/core';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { useSelector } from 'react-redux';

export interface IDocInnerHtmlProps {
  language: CodeLanguage;
  exampleConfig: any;
  showApiToken?: boolean;
}

const shellDebugMap = {
  GET: Settings.api_apifox_get_url.value,
  PATCH: Settings.api_apiffox_patch_url.value,
  DELETE: Settings.api_apifox_delete_url.value,
  POST: Settings.api_apiffox_post_url.value,
  UPLOAD: Settings.api_apifox_upload_url.value,
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
    // 各个浏览器url长度限制不同，所以取小点
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
    // 如果body长度过长就不带body
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
