import { Button, Checkbox, Divider, useThemeColors } from '@vikadata/components';
import { ResourceType, Selectors, Settings, StoreActions, Strings, t } from '@vikadata/core';
import { ApiOutlined, BookOutlined, DebugOutlined } from '@vikadata/icons';
import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconDelete from 'static/icon/common/common_icon_close_small.svg';
import { Message } from '../common';
import { InlineNodeName } from '../common/inline_node_name';
import { AccountCenterModal } from '../navigation/account_center_modal';
import { FieldCode } from './field_codes/field_codes';
import { CodeLanguage, CodeType } from './field_codes/enum';
import { FieldDocs } from './field_docs';
import styles from './styles.module.less';

export const ApiPanel: React.FC = () => {
  const colors = useThemeColors();
  const isApiPanelOpen = useSelector(state => state.space.isApiPanelOpen);
  const apiToken = useSelector(state => state.user.info!.apiKey);
  const dispatch = useDispatch();
  const datasheetId = useSelector(state => Selectors.getActiveDatasheetId(state))!;
  const datasheetLoaded = useSelector(state => Boolean(Selectors.getSnapshot(state)));
  const datasheet = useSelector(state => Selectors.getDatasheet(state, datasheetId));
  const [byFieldId, setByFieldId] = useState(false);
  const [showApiToken, _setShowApiToken] = useState(false);
  const [paneType, setPaneType] = useState('fields');
  const [language, setLanguage] = useState(CodeLanguage.Curl);
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const token = showApiToken ? apiToken : t(Strings.api_your_token);
  const isWidgetPanelOpening = useSelector(state => {
    const widgetPanelStatus = Selectors.getResourceWidgetPanelStatus(state, datasheetId, ResourceType.Datasheet);
    return widgetPanelStatus?.opening;
  });

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
        <Button
          onClick={() => {
            window.open(Settings.guide_api_getting_start.value, '_blank', 'noopener=yes,noreferrer=yes');
          }}
          variant="fill"
          color={colors.blackBlue[1000]}
          prefixIcon={<BookOutlined />}
          className={styles.linkButton}
        >
          {t(Strings.document_detail)}
        </Button>
        <Divider orientation="vertical" style={{ margin: 0, background: colors.fc5, opacity: 0.3 }} />
        <Button
          onClick={() => {
            window.open(Settings.apifox_link.value, '_blank', 'noopener=yes,noreferrer=yes');
          }}
          variant="fill"
          color={colors.blackBlue[1000]}
          prefixIcon={<DebugOutlined />}
          className={styles.linkButton}
        >
          {t(Strings.request_in_api_panel)}
        </Button>
      </h1>
      <h2 className={styles.panelName}>
        <InlineNodeName nodeId={datasheetId} nodeName={datasheet?.name} nodeIcon={datasheet?.icon} withIcon />
      </h2>

      <IconDelete className={styles.iconDelete} onClick={() => dispatch(StoreActions.toggleApiPanel())} width={24} height={24} fill="white" />

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
