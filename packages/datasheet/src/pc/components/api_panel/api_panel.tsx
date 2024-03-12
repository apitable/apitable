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

import { Tabs } from 'antd';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Checkbox, Divider, useThemeColors } from '@apitable/components';
import { ResourceType, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { ApiOutlined, BookOutlined, AdjustmentOutlined, CloseOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { Message } from '../common';
import { InlineNodeName } from '../common/inline_node_name';
import { AccountCenterModal } from '../navigation/account_center_modal';
import { CodeLanguage, CodeType } from './field_codes/enum';
import { FieldCode } from './field_codes/field_codes';
import { FieldDocs } from './field_docs';
import styles from './styles.module.less';

export const ApiPanel: React.FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const isApiPanelOpen = useAppSelector((state) => state.space.isApiPanelOpen);
  const apiToken = useAppSelector((state) => state.user.info!.apiKey);
  const dispatch = useDispatch();
  const datasheetId = useAppSelector((state) => Selectors.getActiveDatasheetId(state))!;
  const datasheetLoaded = useAppSelector((state) => Boolean(Selectors.getSnapshot(state)));
  const datasheet = useAppSelector((state) => Selectors.getDatasheet(state, datasheetId));
  const [byFieldId, setByFieldId] = useState(false);
  const [showApiToken, _setShowApiToken] = useState(false);
  const [paneType, setPaneType] = useState('fields');
  const [language, setLanguage] = useState(CodeLanguage.Curl);
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const token = showApiToken ? apiToken : t(Strings.api_your_token);
  const isWidgetPanelOpening = useAppSelector((state) => {
    const widgetPanelStatus = Selectors.getResourceWidgetPanelStatus(state, datasheetId, ResourceType.Datasheet);
    return widgetPanelStatus?.opening;
  });
  const { APIFOX_HOME_URL } = getEnvVariables();

  useEffect(() => {
    if (isWidgetPanelOpening && isApiPanelOpen) {
      dispatch(StoreActions.toggleWidgetPanel(datasheetId, ResourceType.Datasheet));
    }
  }, [datasheetId, dispatch, isApiPanelOpen, isWidgetPanelOpening]);

  if (!datasheetLoaded || !isApiPanelOpen) {
    return null;
  }

  const setShowApiToken = (checked: boolean) => {
    if (apiToken) {
      _setShowApiToken(checked);
    } else {
      Message.warning({ content: t(Strings.api_token_generate_tip), duration: 6 });
      setShowAccountCenter(true);
    }
  };

  return (
    <div className={styles.apiPanelContainer}>
      <h1 className={styles.panelTitle}>
        <ApiOutlined size={24} color={colors.primaryColor} />
        {t(Strings.api_panel_title)}
        {getEnvVariables().API_PANEL_HELP_URL && (
          <Button
            onClick={() => {
              window.open(getEnvVariables().API_PANEL_HELP_URL, '_blank', 'noopener=yes,noreferrer=yes');
            }}
            variant="fill"
            color={colors.blackBlue[1000]}
            prefixIcon={<BookOutlined />}
            className={styles.linkButton}
          >
            {t(Strings.document_detail)}
          </Button>
        )}
        <Divider orientation="vertical" style={{ margin: 0, background: colors.fc5, opacity: 0.3 }} />
        {APIFOX_HOME_URL && (
          <Button
            onClick={() => {
              window.open(APIFOX_HOME_URL, '_blank', 'noopener=yes,noreferrer=yes');
            }}
            variant="fill"
            color={colors.blackBlue[1000]}
            prefixIcon={<AdjustmentOutlined />}
            className={styles.linkButton}
          >
            {t(Strings.request_in_api_panel)}
          </Button>
        )}
      </h1>
      <h2 className={styles.panelName}>
        <InlineNodeName className={styles.nodeName} nodeId={datasheetId} nodeName={datasheet?.name} nodeIcon={datasheet?.icon} withIcon />
      </h2>

      <CloseOutlined className={styles.iconDelete} onClick={() => dispatch(StoreActions.toggleApiPanel())} size={24} color="white" />

      <div className={styles.operationArea}>
        <div className={styles.switchApiToken}>
          <Checkbox size={14} onChange={setShowApiToken} checked={showApiToken}>
            <span>{t(Strings.api_show_token)}</span>
          </Checkbox>
        </div>
        <div className={styles.switchFieldId}>
          <Checkbox size={14} onChange={setByFieldId} checked={byFieldId}>
            <span>{t(Strings.by_field_id)}</span>
          </Checkbox>
        </div>
      </div>

      <Tabs defaultActiveKey={paneType} onChange={setPaneType} hideAdd>
        <Tabs.TabPane tab={t(Strings.api_fields)} key="fields">
          <FieldDocs />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t(Strings.api_get)} key="get">
          <FieldCode
            language={language}
            setLanguage={setLanguage}
            token={token}
            codeType={CodeType.Get}
            byFieldId={byFieldId}
            showApiToken={showApiToken}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t(Strings.api_add)} key="add">
          <FieldCode
            language={language}
            setLanguage={setLanguage}
            token={token}
            codeType={CodeType.Add}
            byFieldId={byFieldId}
            showApiToken={showApiToken}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t(Strings.api_update)} key="update">
          <FieldCode
            language={language}
            setLanguage={setLanguage}
            token={token}
            codeType={CodeType.Update}
            byFieldId={byFieldId}
            showApiToken={showApiToken}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t(Strings.api_delete)} key="delete">
          <FieldCode
            language={language}
            setLanguage={setLanguage}
            token={token}
            codeType={CodeType.Delete}
            byFieldId={byFieldId}
            showApiToken={showApiToken}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t(Strings.api_upload)} key="upload">
          <FieldCode
            language={language}
            setLanguage={setLanguage}
            token={token}
            codeType={CodeType.Upload}
            byFieldId={byFieldId}
            showApiToken={showApiToken}
          />
        </Tabs.TabPane>
      </Tabs>

      {showAccountCenter && <AccountCenterModal defaultActiveItem={4} setShowAccountCenter={setShowAccountCenter} />}
    </div>
  );
};
