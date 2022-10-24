import { Skeleton } from '@vikadata/components';
import { Events, Player, PREVIEW_DATASHEET_ID, ResourceType, Selectors, StatusCode, StoreActions, Strings, SystemConfig, t } from '@apitable/core';
import { useToggle } from 'ahooks';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { ApiPanel } from 'pc/components/api_panel';
import { VikaSplitPanel } from 'pc/components/common';
import { TimeMachine } from 'pc/components/time_machine';
import { useMountWidgetPanelShortKeys } from 'pc/components/widget/hooks';
import { SideBarClickType, SideBarType, useSideBar } from 'pc/context';
import { useResponsive, useWeixinShare } from 'pc/hooks';
import { store } from 'pc/store';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import * as React from 'react';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
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
import styles from './style.module.less';

const RobotPanel = dynamic(() => import('pc/components/robot/robot_panel/robot_panel'), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <Skeleton count={1} width='38%' />
      <Skeleton count={2} />
      <Skeleton count={1} width='61%' />
    </div>
  ),
});

const DatasheetMain = ({ loading, datasheetErrorCode, isNoPermission, shareId, datasheetId, preview, testFunctions, handleExitTest, mirrorId }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className={classNames(styles.dataspaceRight, 'dataspaceRight', loading && styles.loading)} style={{ height: '100%' }}>
        {!datasheetErrorCode ? (
          <>
            {!mirrorId && (
              <>
                <ComponentDisplay minWidthCompatible={ScreenSize.md}>
                  <TabBar loading={loading} />
                </ComponentDisplay>
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
      {(preview || testFunctions) && (
        <div className={styles.previewing}>
          <div className={styles.previewTip}>
            {preview ? t(Strings.preview_time_machine, { version: preview }) : t(Strings.experience_test_function, { testFunctions })}
            {testFunctions && <a onClick={handleExitTest}>{t(Strings.exist_experience)}</a>}
          </div>
        </div>
      )}
    </div>
  );
};

const DefaultPanelWidth = {
  Empty: 0,
  DevTool: 320,
  TimeMachine: 320,
  Api: '50%',
  Robot: 320,
  SideRecord: 450,
} as const;

const DISABLED_CLOSE_SIDEBAR_WIDTH = 1920;

const DataSheetPaneBase: FC<{ panelLeft?: JSX.Element }> = props => {
  const { shareId, datasheetId, templateId, mirrorId } = useSelector(state => {
    const { shareId, datasheetId, templateId, mirrorId } = state.pageParams;
    return { shareId, datasheetId, templateId, mirrorId };
  }, shallowEqual);
  const isShareMode = shareId || templateId;
  const { isMobile } = useResponsive();
  const rightPanelWidth = useSelector(state => state.rightPane.width);
  const datasheetErrorCode = useSelector(state => Selectors.getDatasheetErrorCode(state));
  const loading = useSelector(state => {
    const datasheet = Selectors.getDatasheet(state);
    return Boolean(!datasheet || datasheet.isPartOfData || datasheet.sourceId);
  });
  const preview = useSelector(state => {
    const datasheet = Selectors.getDatasheet(state);
    return datasheet && datasheet.preview;
  });
  const activeDatasheetId = useSelector(Selectors.getActiveDatasheetId);
  const dispatch = useDispatch();
  const testFunctions = useMemo(() => {
    const funcs = getStorage(StorageName.TestFunctions) || {};
    return Object.keys(funcs)
      .filter(k => ![SystemConfig.test_function.render_prompt.feature_key, 'canvas'].includes(k))
      .map(k => funcs[k])
      .join(' , ');
  }, []);

  const widgetPanelStatus = useSelector(state => {
    const { mirrorId, datasheetId } = state.pageParams;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    const resourceId = mirrorId || datasheetId || '';
    return Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType);
  })!;
  const isApiPanelOpen = useSelector(state => state.space.isApiPanelOpen);
  const isSideRecordOpen = useSelector(state => state.space.isSideRecordOpen);
  const isTimeMachinePanelOpen = useSelector(state => {
    const clientState = Selectors.getDatasheetClient(state, datasheetId);
    return clientState && clientState.isTimeMachinePanelOpen;
  });
  useMountWidgetPanelShortKeys();

  const [isDevToolsOpen, { toggle: toggleDevToolsOpen, set: setDevToolsOpen }] = useToggle();
  const [isRobotPanelOpen, { toggle: toggleRobotPanelOpen, set: setRobotPanelOpen }] = useToggle();
  const toggleTimeMachineOpen = useCallback(
    (state?: boolean) => {
      if (activeDatasheetId) {
        dispatch(StoreActions.toggleTimeMachinePanel(activeDatasheetId, state));
      }
    },
    [dispatch, activeDatasheetId],
  );
  const { onSetSideBarVisibleByOhter, onSetPanelVisible, toggleType, clickType, sideBarVisible } = useSideBar();

  // TODO: 统一优化右侧边栏展开/收起状态的控制逻辑
  useEffect(() => {
    if (isApiPanelOpen) {
      dispatch(StoreActions.toggleSideRecord(false));
      closeAllExpandRecord();
    }
  }, [dispatch, isApiPanelOpen]);

  useEffect(() => {
    if (isSideRecordOpen) {
      dispatch(StoreActions.toggleApiPanel(false));
    } else {
      if (widgetPanelStatus?.opening) {
        window.dispatchEvent(new Event('resize')); // 触发组件面板的宽度响应
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
    if (!activeDatasheetId) {
      return;
    }
    dispatch(StoreActions.setRobotPanelStatus(isRobotPanelOpen, activeDatasheetId));
  }, [isRobotPanelOpen, dispatch, activeDatasheetId]);

  useEffect(() => {
    // 数表变化退出开发者面板
    setDevToolsOpen(false);
    // 切换表格时候关闭机器人面板
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

  useWeixinShare();

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

    // 本地缓存小组件宽度
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

    // 展开侧边卡片情况下，记录好宽度。
    if (isSideRecordOpen) {
      setStorage(StorageName.SideRecordWidth, newSize, StorageMethod.Set);
    }

    window.dispatchEvent(new Event('resize'));
  };

  const handleExitTest = () => {
    setStorage(StorageName.TestFunctions, {}, StorageMethod.Set);
    window.location.reload();
  };

  /**
   * 获取除开目录树的宽度
   */
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
    if (isDevToolsOpen) {
      return DefaultPanelWidth.DevTool;
    }
    if (isTimeMachinePanelOpen) {
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

  /**
   * 监听面板的开关状态，根据面板的开关判断是否展开或者收缩目录树
   * 阻止触发逻辑
   * 1、用户强制展开目录树时
   * 2、搜索栏展开时
   */
  useEffect(() => {
    // 设置面板的开关
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

    // 点击态为工具栏触发时（tip：必须添加此判断，因为在初始化时，effect 也会被触发）
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
    />
  );

  return (
    <AutoSizer style={{ width: '100%', height: '100%' }}>
      {({ width, height }) =>
        panelSize ? (
          <VikaSplitPanel
            panelLeft={datasheetMain}
            panelRight={
              <div style={{ width: '100%', height: '100%' }}>
                {isSideRecordOpen && <ExpandRecordPanel />}
                <WidgetPanel />
                {!isShareMode && <ApiPanel />}
                {isDevToolsOpen && <DevToolsPanel onClose={setDevToolsOpen} />}
                {isRobotPanelOpen && <RobotPanel />}
                {isTimeMachinePanelOpen && <TimeMachine onClose={toggleTimeMachineOpen} />}
              </div>
            }
            primary='second'
            split='vertical'
            minSize={isSideRecordOpen ? 450 : 320}
            maxSize={width / 2}
            onChange={paneSizeChange}
            size={panelSize}
            style={isShareMode ? shareStyle : {}}
            allowResize={isApiPanelOpen ? false : Boolean(panelSize)}
            pane1Style={{ overflow: 'hidden' }}
            className='contentSplitPanel'
          />
        ) : (
          datasheetMain
        )
      }
    </AutoSizer>
  );
};

export const DataSheetPane = React.memo(DataSheetPaneBase);
