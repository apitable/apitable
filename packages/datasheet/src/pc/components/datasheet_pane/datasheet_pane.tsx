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

import { useToggle } from 'ahooks';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import { get } from 'lodash';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Alert, Button, Skeleton } from '@apitable/components';
import {
  ConfigConstant,
  Events,
  Player,
  PREVIEW_DATASHEET_BACKUP,
  PREVIEW_DATASHEET_ID,
  ResourceType,
  Selectors,
  StatusCode,
  StoreActions,
  Strings,
  SystemConfig,
  t,
} from '@apitable/core';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { ApiPanel } from 'pc/components/api_panel';
import { automationHistoryAtom } from 'pc/components/automation/controller';
import AutomationHistoryPanel from 'pc/components/automation/run_history/modal/modal';
import { Message, VikaSplitPanel } from 'pc/components/common';

import { JobTaskProvider } from 'pc/components/editors/button_editor/job_task';
import { TimeMachine } from 'pc/components/time_machine';
import { useMountWidgetPanelShortKeys } from 'pc/components/widget/hooks';
import { SideBarClickType, SideBarContext, SideBarType, useSideBar } from 'pc/context';
import { useResponsive } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { exportDatasheetBase } from 'pc/utils';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { DevToolsPanel } from '../development/dev_tools_panel';
import { closeAllExpandRecord } from '../expand_record';
import { ExpandRecordPanel } from '../expand_record_panel';
import { ServerError } from '../invalid_page/server_error';
import { MobileToolBar } from '../mobile_tool_bar';
import { NoPermission } from '../no_permission';
import { SuspensionPanel } from '../suspension_panel';
import { TabBar } from '../tab_bar';
import { ViewContainer } from '../view_container';
import { WidgetPanel } from '../widget';
// @ts-ignore
import { Copilot } from 'enterprise/Copilot';
// @ts-ignore
import { createBackupSnapshot } from 'enterprise/time_machine/backup/backup';
// @ts-ignore
import { WeixinShareWrapper } from 'enterprise/wechat/weixin_share_wrapper/weixin_share_wrapper';
import styles from './style.module.less';

const RobotPanel = dynamic(() => import('pc/components/robot/robot_panel/robot_panel'), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <Skeleton count={1} width="38%" />
      <Skeleton count={2} />
      <Skeleton count={1} width="61%" />
    </div>
  ),
});

interface IDatasheetMain {
  loading: boolean;
  datasheetErrorCode?: number | null;
  isNoPermission: boolean;
  shareId?: string;
  datasheetId?: string;
  preview?: any;
  testFunctions: any;
  handleExitTest: any;
  mirrorId?: string;
  embedId?: string;
}

const DatasheetMain = (props: IDatasheetMain) => {
  const { loading, datasheetErrorCode, isNoPermission, shareId, datasheetId, preview, testFunctions, handleExitTest, mirrorId, embedId } = props;
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const previewDstType = useAppSelector((state) => {
    const datasheet = Selectors.getDatasheet(state);
    return datasheet && datasheet?.type;
  });

  const isShowViewbar = embedId ? get(embedInfo, 'viewControl.tabBar', true) : true;

  const exportPreviewCsv = () => {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state, 'previewDatasheet');
    if (!snapshot) {
      return;
    }
    const view = Selectors.getViewById(snapshot, state.pageParams.viewId!);
    exportDatasheetBase('previewDatasheet', ConfigConstant.EXPORT_TYPE_XLSX, { view, ignorePermission: true });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className={classNames(styles.dataspaceRight, 'dataspaceRight', loading && styles.loading)} style={{ height: '100%' }}>
        {!datasheetErrorCode ? (
          <>
            {!mirrorId && (
              <>
                {isShowViewbar && (
                  <ComponentDisplay minWidthCompatible={ScreenSize.md}>
                    <TabBar loading={loading} />
                  </ComponentDisplay>
                )}
                <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
                  <MobileToolBar loading={loading} />
                </ComponentDisplay>
              </>
            )}

            <ViewContainer loading={loading} />
          </>
        ) : isNoPermission ? (
          <NoPermission />
        ) : (
          <ServerError />
        )}
      </div>
      <SuspensionPanel shareId={shareId} datasheetId={datasheetId} />
      {(preview || testFunctions) && previewDstType !== PREVIEW_DATASHEET_BACKUP &&
          <Alert
            className={styles.previewing}
            type="default"
            content={(
              <div className={styles.previewTip}>
                <span>{preview ? t(Strings.preview_time_machine, { version: preview }) :
                  t(Strings.experience_test_function, { testFunctions })}</span>
                <Button
                  size="small"
                  color="primary"
                  onClick={exportPreviewCsv}
                >{t(Strings.export_current_preview_view_data)}</Button>
              </div>
            )}
          />
      }
    </div>
  );
};

const DefaultPanelWidth = {
  Empty: 0,
  DevTool: 320,
  TimeMachine: 320,
  Api: '50%',
  Robot: 360,
  SideRecord: 450,
  Copilot: 480,
} as const;

const DISABLED_CLOSE_SIDEBAR_WIDTH = 1920;

const DataSheetPaneBase: FC<React.PropsWithChildren<{ panelLeft?: JSX.Element }>> = (props) => {
  const { shareId, datasheetId, templateId, mirrorId, embedId } = useAppSelector((state) => {
    return state.pageParams;
  });
  const isLogin = useAppSelector((state) => state.user.isLogin);

  const isShareMode = shareId || templateId || (embedId && !isLogin);
  const { isMobile } = useResponsive();
  const rightPanelWidth = useAppSelector((state) => state.rightPane.width);
  const datasheetErrorCode = useAppSelector((state) => Selectors.getDatasheetErrorCode(state));
  const loading = useAppSelector((state) => {
    const datasheet = Selectors.getDatasheet(state);
    return Boolean(!datasheet || datasheet.isPartOfData || datasheet.sourceId);
  });
  const preview = useAppSelector((state) => {
    const datasheet = Selectors.getDatasheet(state);
    return datasheet && datasheet.preview;
  });
  const manageable = useAppSelector((state) => Selectors.getPermissions(state, datasheetId).manageable);
  const activeDatasheetId = useAppSelector(Selectors.getActiveDatasheetId);
  const dispatch = useAppDispatch();
  const testFunctions = useMemo(() => {
    const funcs = getStorage(StorageName.TestFunctions) || {};
    return Object.keys(funcs)
      .filter((k) => ![SystemConfig.test_function.render_prompt.feature_key, 'canvas'].includes(k))
      .map((k) => funcs[k])
      .join(' , ');
  }, []);

  const widgetPanelStatus = useAppSelector((state) => {
    const { mirrorId, datasheetId } = state.pageParams;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    const resourceId = mirrorId || datasheetId || '';
    return Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType);
  })!;
  const isApiPanelOpen = useAppSelector((state) => state.space.isApiPanelOpen);
  const isSideRecordOpen = useAppSelector((state) => state.space.isSideRecordOpen);
  const isTimeMachinePanelOpen = useAppSelector((state) => {
    const clientState = Selectors.getDatasheetClient(state, datasheetId);
    return clientState && clientState.isTimeMachinePanelOpen;
  });

  const isArchivedRecordsPanelOpen = useAppSelector((state) => {
    const clientState = Selectors.getDatasheetClient(state, datasheetId);
    return clientState && clientState.isArchivedRecordsPanelOpen;
  });

  useMountWidgetPanelShortKeys();

  const [historyDialog, setHistoryDialog] = useAtom(automationHistoryAtom);
  const [isDevToolsOpen, { toggle: toggleDevToolsOpen, set: setDevToolsOpen }] = useToggle();
  const [isRobotPanelOpen, { toggle: toggleRobotPanelOpen, set: setRobotPanelOpen }] = useToggle();
  const [isCopilotPanelOpen, { toggle: toggleCopilotPanelOpen, set: setCopilotPanelOpen }] = useToggle();

  const toggleTimeMachineOpen = useCallback(
    (state?: boolean) => {
      if (activeDatasheetId) {
        dispatch(StoreActions.toggleTimeMachinePanel(activeDatasheetId, state));
      }
    },
    [dispatch, activeDatasheetId],
  );

  const { setNewTdbId } = useContext(SideBarContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _createBackupSnapshot = async () => {
    const res = await createBackupSnapshot(datasheetId!);
    if (res.data.success) {
      setNewTdbId?.(res?.data?.data?.tbdId || '');
      Message.success({
        content: t(Strings.backup_create_success),
      });
    } else {
      Message.error({
        content: res.data.message,
      });
    }
  };
  const { onSetSideBarVisibleByOhter, onSetPanelVisible, toggleType, clickType, sideBarVisible } = useSideBar();

  // TODO: Unified control logic for right sidebar expand/collapse states
  useEffect(() => {
    if (isApiPanelOpen) {
      dispatch(StoreActions.toggleSideRecord(false));
      closeAllExpandRecord(); // async
    }
  }, [dispatch, isApiPanelOpen]);

  useEffect(() => {
    if (isSideRecordOpen) {
      dispatch(StoreActions.toggleApiPanel(false));
    } else {
      if (widgetPanelStatus?.opening) {
        window.dispatchEvent(new Event('resize')); // Trigger the width response of the component panel
      }
    }
  }, [dispatch, isSideRecordOpen, widgetPanelStatus]);

  useEffect(() => {
    ShortcutActionManager.bind(ShortcutActionName.ToggleDevPanel, toggleDevToolsOpen);
  }, [toggleDevToolsOpen]);

  useEffect(() => {
    ShortcutActionManager.bind(ShortcutActionName.ToggleRobotPanel, toggleRobotPanelOpen);
  }, [toggleRobotPanelOpen]);

  useEffect(() => {
    ShortcutActionManager.bind(ShortcutActionName.ToggleTimeMachinePanel, toggleTimeMachineOpen);
  }, [toggleTimeMachineOpen]);

  useEffect(() => {
    ShortcutActionManager.bind(ShortcutActionName.ToggleCopilotPanel, toggleCopilotPanelOpen);
  }, [toggleCopilotPanelOpen]);

  useEffect(() => {
    if (manageable && Boolean(createBackupSnapshot)) {
      ShortcutActionManager.bind(ShortcutActionName.CreateBackup, () => {
        _createBackupSnapshot();
      });
    }
  }, [_createBackupSnapshot, manageable]);

  useEffect(() => {
    if (!activeDatasheetId) {
      return;
    }
    dispatch(StoreActions.setRobotPanelStatus(isRobotPanelOpen, activeDatasheetId));
  }, [isRobotPanelOpen, dispatch, activeDatasheetId]);

  useEffect(() => {
    if (!activeDatasheetId) {
      return;
    }
    dispatch(StoreActions.setCoPilotPanelStatus(isCopilotPanelOpen, activeDatasheetId));
  }, [isCopilotPanelOpen, dispatch, activeDatasheetId]);

  useEffect(() => {
    setDevToolsOpen(false);
    setRobotPanelOpen(false);
    toggleTimeMachineOpen(false);

    dispatch(StoreActions.resetDatasheet(PREVIEW_DATASHEET_ID));
    // eslint-disable-next-line
  }, [activeDatasheetId]);

  useEffect(() => {
    if (!isTimeMachinePanelOpen) {
      dispatch(StoreActions.resetDatasheet(PREVIEW_DATASHEET_ID));
    }
    // eslint-disable-next-line
  }, [isTimeMachinePanelOpen]);

  const isNoPermission =
    datasheetErrorCode === StatusCode.NODE_NOT_EXIST ||
    datasheetErrorCode === StatusCode.NOT_PERMISSION ||
    datasheetErrorCode === StatusCode.NODE_DELETED;

  const shareStyle: React.CSSProperties = {
    overflow: 'hidden',
    borderRadius: '8px',
    height: '100%',
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    Player.doTrigger(Events.datasheet_shown);
  }, [loading]);

  useEffect(() => {
    if (widgetPanelStatus?.opening || isApiPanelOpen || isSideRecordOpen) {
      setRobotPanelOpen(false);
    }
  }, [widgetPanelStatus?.opening, isApiPanelOpen, setRobotPanelOpen, isSideRecordOpen, dispatch]);

  const paneSizeChange = (newSize: number) => {
    const widgetPanelStatusMap = getStorage(StorageName.WidgetPanelStatusMap);
    dispatch(StoreActions.setRightPaneWidth(newSize));

    if (widgetPanelStatusMap && !isRobotPanelOpen && !isSideRecordOpen) {
      const state = store.getState();
      const spaceId = state.space.activeId;
      const { datasheetId, mirrorId } = state.pageParams;
      const resourceId = mirrorId || datasheetId;
      const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;

      const status = widgetPanelStatusMap[`${spaceId},${resourceId}`];
      dispatch(StoreActions.changeWidgetPanelWidth(newSize, resourceId!, resourceType));
      setStorage(StorageName.WidgetPanelStatusMap, {
        [`${spaceId},${resourceId}`]: {
          width: newSize,
          opening: true,
          activePanelId: status?.activePanelId,
        },
      });
    }

    if (isSideRecordOpen) {
      setStorage(StorageName.SideRecordWidth, newSize, StorageMethod.Set);
    }

    window.dispatchEvent(new Event('resize'));
  };

  const handleExitTest = () => {
    setStorage(StorageName.TestFunctions, {}, StorageMethod.Set);
    window.location.reload();
  };

  const getContentWidth = (visible: boolean) => {
    if (!visible) {
      return window.innerWidth;
    }
    const leftMenuWidth = getStorage(StorageName.SplitPos) || 335;
    return window.innerWidth - leftMenuWidth - 1;
  };

  const panelSize = (() => {
    if (isMobile || isNoPermission) {
      return DefaultPanelWidth.Empty;
    }
    if (isCopilotPanelOpen) {
      return DefaultPanelWidth.Copilot;
    }
    if (isDevToolsOpen) {
      return DefaultPanelWidth.DevTool;
    }
    if (isTimeMachinePanelOpen) {
      return DefaultPanelWidth.TimeMachine;
    }
    if (isArchivedRecordsPanelOpen) {
      return DefaultPanelWidth.TimeMachine;
    }
    if (isApiPanelOpen) {
      return DefaultPanelWidth.Api;
    }
    if (isRobotPanelOpen) {
      return DefaultPanelWidth.Robot;
    }
    if (isSideRecordOpen) {
      const width = getStorage(StorageName.SideRecordWidth);

      return width && width < window.innerWidth && width > DefaultPanelWidth.SideRecord ? width : DefaultPanelWidth.SideRecord;
    }
    if (widgetPanelStatus?.opening) {
      return widgetPanelStatus.width;
    }
    return DefaultPanelWidth.Empty;
  })();

  useEffect(() => {
    dispatch(StoreActions.setRightPaneWidth(panelSize));
  }, [dispatch, panelSize]);

  useEffect(() => {
    const panelVisible = Boolean(panelSize);
    onSetPanelVisible && onSetPanelVisible(panelVisible);

    if (
      !onSetSideBarVisibleByOhter ||
      toggleType === SideBarType.User ||
      clickType === SideBarClickType.FindInput ||
      window.innerWidth > DISABLED_CLOSE_SIDEBAR_WIDTH
    ) {
      return;
    }

    if (clickType === SideBarClickType.ToolBar) {
      const contentWidth = getContentWidth(sideBarVisible);
      if (rightPanelWidth < contentWidth / 2) {
        if (rightPanelWidth === 0) {
          onSetSideBarVisibleByOhter(true);
        }
        return;
      }
      onSetSideBarVisibleByOhter(!panelVisible);
    }
  }, [panelSize, sideBarVisible, rightPanelWidth, onSetSideBarVisibleByOhter, onSetPanelVisible, toggleType, clickType]);

  const datasheetMain = props.panelLeft || (
    <JobTaskProvider>
      <DatasheetMain
        loading={loading}
        datasheetErrorCode={datasheetErrorCode}
        isNoPermission={isNoPermission}
        shareId={shareId}
        datasheetId={datasheetId}
        mirrorId={mirrorId}
        preview={preview}
        testFunctions={testFunctions}
        handleExitTest={handleExitTest}
        embedId={embedId}
      />
    </JobTaskProvider>
  );
  const childComponent = (
    <AutoSizer style={{ width: '100%', height: '100%' }}>
      {({ width }) =>
        panelSize ? (
          <VikaSplitPanel
            panelLeft={
              datasheetMain
            }
            panelRight={
              <div style={{ width: '100%', height: '100%' }}>
                {isSideRecordOpen && <ExpandRecordPanel />}
                { isCopilotPanelOpen && <Copilot onClose={setCopilotPanelOpen} /> }
                <WidgetPanel />
                {!isShareMode && <ApiPanel />}
                {isDevToolsOpen && <DevToolsPanel onClose={setDevToolsOpen} />}
                {isRobotPanelOpen && <RobotPanel />}
                {isTimeMachinePanelOpen && <TimeMachine onClose={toggleTimeMachineOpen} />}
              </div>
            }
            primary="second"
            split="vertical"
            minSize={isSideRecordOpen ? 450 : 320}
            maxSize={width / 2}
            onChange={paneSizeChange}
            size={panelSize}
            style={isShareMode ? shareStyle : {}}
            allowResize={isApiPanelOpen ? false : Boolean(panelSize)}
            pane1Style={{ overflow: 'hidden' }}
            className="contentSplitPanel"
          />
        ) : (
          datasheetMain
        )
      }
    </AutoSizer>
  );

  return <>
    {historyDialog.dialogVisible && (
      <AutomationHistoryPanel
        onClose={() => {
          setHistoryDialog((draft) => ({
            ...draft,
            dialogVisible: false,
          }));
        }}
      />
    )}
    {WeixinShareWrapper ? <WeixinShareWrapper>{childComponent}</WeixinShareWrapper> : childComponent}</>;
};

export const DataSheetPane = React.memo(DataSheetPaneBase);
