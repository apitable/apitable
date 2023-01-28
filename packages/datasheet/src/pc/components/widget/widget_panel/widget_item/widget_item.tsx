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

import { Divider, IconButton, Loading, useContextMenu, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  ExecuteResult,
  ResourceType,
  Selectors,
  StoreActions,
  Strings,
  t,
  WidgetPackageStatus,
  WidgetReleaseType,
} from '@apitable/core';
import {
  CloseMiddleOutlined, DragOutlined, MoreOutlined, RefreshOutlined, SettingOutlined, WidgetExpandOutlined, WidgetNarrowOutlined,
} from '@apitable/icons';
import { mainWidgetMessage, RuntimeEnv } from '@apitable/widget-sdk';
import { WidgetLoadError } from '@apitable/widget-sdk/dist/initialize_widget';
import { useToggle } from 'ahooks';
import type { InputRef } from 'antd';
import { Input } from 'antd';
import classNames from 'classnames';
import Image from 'next/image';
import { SimpleEmitter } from 'modules/shared/simple_emitter';
import { Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { SearchPanel } from 'pc/components/datasheet_search_panel';
import { expandRecordInCenter } from 'pc/components/expand_record';
import { useCheckInput, useResponsive } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getTestFunctionAvailable } from 'pc/utils/storage';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PngLinkdatasheet from 'static/icon/datasheet/chart/linkdatasheet.png';
import IconExpand from 'static/icon/datasheet/datasheet_icon_expand_record.svg';
import { closeWidgetRoute, expandWidgetRoute } from '../../expand_widget';
import { useDevLoadCheck, useFullScreen } from '../../hooks';
import { useCloudStorage } from '../../hooks/use_cloud_storage';
import { usePreLoadError } from '../../hooks/use_pre_load_error';
import { expandWidgetDevConfig } from '../../widget_center/widget_create_modal';
import { ErrorWidget, IWidgetLoaderRefs } from '../../widget_loader';
import { WIDGET_MENU } from '../widget_list';
import { IWidgetPropsBase } from './interface';
import styles from './style.module.less';
import { WidgetBlock } from './widget_block';
import { WidgetHeaderMobile } from './widget_header';
import { WidgetIframe } from './widget_iframe';

export const simpleEmitter = new SimpleEmitter();

interface IWidgetItemProps extends IWidgetPropsBase {
  widgetId: string;
  widgetPanelId?: string;
  readonly?: boolean;
  isMobile?: boolean;
  setDevWidgetId?: (widgetId: string) => void;
  dragging: boolean;
  setDragging: Function;
  index?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    __pressTimer: Date;
  }
}

export const WidgetItem: React.FC<IWidgetItemProps> = props => {
  const { widgetPanelId, widgetId, readonly, isMobile, config, setDevWidgetId, dragging, setDragging } = props;

  const widget = useSelector(state => Selectors.getWidget(state, widgetId));
  const widgetSnapshot = widget?.snapshot;
  const widgetBindDatasheetId = widgetSnapshot ? widgetSnapshot.datasheetId : '';
  const doNotBindDatasheet = !widgetBindDatasheetId;

  const linkId = useSelector(Selectors.getLinkId);
  const rootNodeId = useSelector(state => state.catalogTree.rootId);
  const isExpandWidget = useSelector(state => Boolean(state.pageParams.widgetId === widgetId));
  const errorCode = useSelector(state => Selectors.getDatasheetErrorCode(state, widgetBindDatasheetId));

  const dispatch = useAppDispatch();

  const [searchPanelVisible, setSearchPanelVisible] = useState(false);
  const [isSettingOpened, { toggle: toggleSettingOpened }] = useToggle(false);
  // Widget full screen button, different from fullScreen in widget-sdk.
  const [isFullScreenWidget, toggleFullScreenWidget] = useFullScreen(widgetId);
  const widgetLoader = useRef<IWidgetLoaderRefs>(null);

  // Whether to enable sandbox (enable to use iframe to render).
  const isTestFunctionAvailable = getTestFunctionAvailable('widgetIframe');
  const [devSandbox, devSandboxLoading, error, refreshVersion] = useDevLoadCheck(widgetId, config?.isDevMode);
  const sandbox = config?.isDevMode ? devSandbox : widget?.sandbox;
  const sandboxLoad = widget?.snapshot && !devSandboxLoading;
  const isCiLowVersion = error === WidgetLoadError.CliLowVersion;

  const PreLoadError = usePreLoadError(widget);

  const { screenIsAtMost } = useResponsive();
  const runtimeEnv = screenIsAtMost(ScreenSize.md) ? RuntimeEnv.Mobile : RuntimeEnv.Desktop;

  useEffect(() => {
    if (!widgetBindDatasheetId) {
      return;
    }
    const state = store.getState();
    if (widgetSnapshot?.sourceId?.startsWith('mir')) {
      dispatch(StoreActions.fetchMirrorPack(widgetSnapshot?.sourceId));
      return;
    }
    const datasheet = Selectors.getDatasheet(state, widgetBindDatasheetId);
    if (datasheet && !datasheet.isPartOfData) {
      return;
    }
    dispatch(StoreActions.fetchDatasheet(widgetBindDatasheetId));
  }, [widgetBindDatasheetId, dispatch, widgetSnapshot?.sourceId]);

  // Try to clear the setting status when closing the expand widget.
  useEffect(() => {
    if ((isSettingOpened && !isExpandWidget) || (!isSettingOpened && isExpandWidget)) {
      toggleSetting();
    }
    // eslint-disable-next-line
  }, [isExpandWidget]);

  const setDepDatasheetId = ({ datasheetId, mirrorId }) => {
    if (mirrorId) {
      datasheetId = Selectors.getMirrorSourceInfo(store.getState(), mirrorId)!.datasheetId;
    }
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetWidgetDepDstId,
      resourceId: widgetId,
      resourceType: ResourceType.Widget,
      dstId: datasheetId,
      sourceId: mirrorId,
    });
    if (result.result === ExecuteResult.Success) {
      dispatch(StoreActions.fetchDatasheet(datasheetId));
    }
    setSearchPanelVisible(false);
  };

  const toggleFullscreen = useCallback(
    (state?) => {
      (state == null || state === true) && (isExpandWidget ? closeWidgetRoute(widgetId) : expandWidgetRoute(widgetId));
    },
    [widgetId, isExpandWidget],
  );

  const toggleSetting = useCallback(() => {
    (isExpandWidget || isSettingOpened) && toggleSettingOpened();
  }, [isExpandWidget, toggleSettingOpened, isSettingOpened]);

  return (
    <div
      className={classNames(
        styles.widgetWrapper,
        isExpandWidget && styles.widgetWrapperExpand,
        isFullScreenWidget && styles.widgetWrapperFullscreen,
        isMobile && styles.widgetWrapperMobile,
        isExpandWidget && isMobile && styles.widgetWrapperExpandMobile,
      )}
      onClick={() => toggleFullscreen()}
    >
      <div className={styles.widgetContainer} onClick={e => e.stopPropagation()}>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <WidgetHeader
            widgetId={widgetId}
            widgetPanelId={widgetPanelId}
            config={{
              ...config,
              hideExpand: isExpandWidget || Boolean(isMobile || doNotBindDatasheet || errorCode),
              hideDrag: readonly || isExpandWidget,
              hideSetting: !isExpandWidget || readonly,
              hideEditName: readonly,
            }}
            dragging={dragging}
            setDragging={setDragging}
            isSettingOpened={isSettingOpened}
            toggleSetting={toggleSetting}
            widgetLoader={widgetLoader}
            refreshVersion={refreshVersion}
            isFullScreenWidget={isFullScreenWidget}
            toggleFullScreenWidget={toggleFullScreenWidget}
          />
        </ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <WidgetHeaderMobile
            widgetId={widgetId}
            widgetPanelId={widgetPanelId}
            config={{
              ...config,
              hideExpand: isExpandWidget,
              hideDrag: readonly || isExpandWidget,
              hideEditName: readonly,
            }}
            dragging={dragging}
          />
        </ComponentDisplay>
        <div className={classNames(styles.widgetBody, isExpandWidget && styles.widgetIsExpandBody)}>
          {widget &&
            (doNotBindDatasheet ? (
              <div className={styles.mask}>
                <Image src={PngLinkdatasheet} alt='' />
                {!linkId && (
                  <span
                    onClick={() => {
                      if (readonly) {
                        return;
                      }
                      setSearchPanelVisible(true);
                    }}
                  >
                    {t(Strings.bind_resource)}
                  </span>
                )}
              </div>
            ) : (
              PreLoadError ||
              (sandboxLoad ? (
                isCiLowVersion ? (
                  <ErrorWidget content={t(Strings.widget_cli_upgrade_tip)} />
                ) : mainWidgetMessage.enable && (isTestFunctionAvailable || sandbox) ? (
                  <WidgetIframe
                    widgetId={widgetId}
                    widgetPackageId={widget.widgetPackageId}
                    ref={widgetLoader}
                    nodeId={widgetBindDatasheetId!}
                    isExpandWidget={isExpandWidget}
                    isSettingOpened={isSettingOpened}
                    toggleSetting={toggleSetting}
                    toggleFullscreen={toggleFullscreen}
                    expandRecord={expandRecordInCenter}
                    isDevMode={config?.isDevMode}
                    setDevWidgetId={setDevWidgetId}
                    dragging={dragging}
                    key={props.index}
                    runtimeEnv={runtimeEnv}
                  />
                ) : (
                  <WidgetBlock
                    widgetId={widgetId}
                    nodeId={widgetBindDatasheetId!}
                    isExpandWidget={isExpandWidget}
                    isSettingOpened={isSettingOpened}
                    toggleSetting={toggleSetting}
                    toggleFullscreen={toggleFullscreen}
                    expandRecord={expandRecordInCenter}
                    widgetLoader={widgetLoader}
                    isDevMode={config?.isDevMode}
                    setDevWidgetId={setDevWidgetId}
                    runtimeEnv={runtimeEnv}
                  />
                )
              ) : (
                <div>
                  <Loading />
                </div>
              ))
            ))}
        </div>
        {searchPanelVisible && !readonly && (
          <SearchPanel
            folderId={rootNodeId}
            activeDatasheetId={''}
            setSearchPanelVisible={setSearchPanelVisible}
            onChange={setDepDatasheetId}
            noCheckPermission
            showMirrorNode
          />
        )}
      </div>
    </div>
  );
};

interface IWidgetHeaderProps extends IWidgetPropsBase {
  widgetId: string;
  className?: string;
  widgetPanelId?: string;
  displayMode?: 'hover' | 'always';
  closeModal?: () => void;
  isSettingOpened?: boolean;
  toggleSetting?: () => void;
  toggleWidgetDevMode?: () => void;
  dragging: boolean;
  setDragging: Function;
  widgetLoader: React.RefObject<IWidgetLoaderRefs>;
  refreshVersion: (delta?: number | undefined) => void;
  isFullScreenWidget: boolean;
  toggleFullScreenWidget: () => void;
}

export const WidgetHeader: React.FC<IWidgetHeaderProps> = props => {
  const {
    className,
    widgetId,
    widgetPanelId,
    displayMode = 'hover',
    dragging,
    setDragging,
    config = {},
    closeModal,
    isSettingOpened,
    toggleSetting,
    toggleWidgetDevMode,
    widgetLoader,
    refreshVersion,
    isFullScreenWidget,
    toggleFullScreenWidget,
  } = props;
  const colors = useThemeColors();
  const inputRef = React.useRef<InputRef>(null);
  const [rename, setRename] = React.useState(false);
  const { errTip, setErrTip, onCheck } = useCheckInput({
    checkLength: { max: 30, min: 0, tip: t(Strings.widget_name_length_error), trim: true },
  });

  const { show, hideAll } = useContextMenu({ id: WIDGET_MENU });
  const widget = useSelector(state => Selectors.getWidget(state, widgetId));
  const isExpandWidget = useSelector(state => state.pageParams.widgetId === widgetId);
  const [pickerViewId] = useCloudStorage<string | undefined>('_picker_view_id', widgetId);

  const tooltipPlacement = isFullScreenWidget ? 'bottom' : undefined;

  const triggerMenu = (e: React.MouseEvent<HTMLElement>) => {
    show(e, {
      props: {
        widgetId,
        widgetPanelId,
        pickerViewId,
        widget,
        renameCb: () => {
          setRename(true);
        },
        deleteCb: () => {
          closeModal && closeModal();
          isExpandWidget && closeWidgetRoute(widgetId);
        },
        toggleWidgetDevMode: (devWidgetId: string | undefined, setDevWidgetId: (value?: string) => void) => {
          const { setCodeUrl, codeUrl } = widgetLoader?.current || {};
          if (devWidgetId === widgetId) {
            setDevWidgetId(undefined);
            return;
          }
          widget?.widgetPackageId &&
          setCodeUrl &&
          expandWidgetDevConfig({
            codeUrl,
            widgetId,
            onConfirm: devUrl => {
              devUrl && setCodeUrl(devUrl);
            },
            widgetPackageId: widget.widgetPackageId,
          });
          toggleWidgetDevMode?.();
        },
        toggleSetting,
        refreshWidget: () => {
          refreshVersion();
          widgetLoader.current?.refresh();
        },
      },
    });
  };

  const saveWidgetName = e => {
    setDragging(false);
    const value = e.target.value;
    setRename(false);
    setErrTip('');
    if (errTip || value === widget?.snapshot.widgetName) {
      return;
    }
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetWidgetName,
      resourceId: widgetId,
      resourceType: ResourceType.Widget,
      newWidgetName: e.target.value,
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onCheck(value);
  };

  const expand = () => {
    if (config.hideExpand) {
      return;
    }
    expandWidgetRoute(widgetId);
  };
  const ReactIconExpand = () => <IconExpand width={16} height={16} fill={colors.thirdLevelText} />;
  const ReactMoreOutlined = () => <MoreOutlined size={16} color={colors.thirdLevelText} className={styles.rotateIcon} />;

  const DividerMargin8 = () => <Divider style={{ margin: '8px' }} orientation='vertical' />;

  const nameMouseUp = e => {
    setDragging(false);
    const now = new Date();
    // fixme: Here you should find a time less than the native dragstart trigger, 
    // the document did not find a temporary first set 200ms, 
    // there will be cursor into grabbing a flash of the problem, let go of the slow will not be able to enter the editor.
    if (now.getTime() - window.__pressTimer.getTime() < 200) {
      if (config.hideEditName) {
        return;
      }
      setRename(true);
    } else {
      e.stopPropagation();
    }
  };

  const nameMouseDown = () => (window.__pressTimer = new Date());

  // TODO: The action buttons on the widget header need to be refactored, it's too messy here.
  return (
    <div
      className={classNames(
        styles.widgetHeader,
        config.isDevMode && styles.widgetHeaderDev,
        isExpandWidget && styles.widgetIsExpandHeader,
        className,
        !config.hideDrag && 'dragHandle',
        dragging && styles.dragging,
      )}
    >
      {!config.hideDrag && (
        <span className={classNames(styles.dragHandle, styles.operateButton)}>
          <DragOutlined size={10} color={colors.thirdLevelText} />
        </span>
      )}
      <span className={styles.widgetName}>
        {rename && !config.hideEditName ? (
          <Tooltip title={errTip} visible={Boolean(errTip)} placement={tooltipPlacement}>
            <Input
              defaultValue={widget?.snapshot.widgetName}
              ref={inputRef}
              onPressEnter={saveWidgetName}
              size='small'
              style={{ height: 24, fontSize: '12px' }}
              onBlur={saveWidgetName}
              autoFocus
              onChange={onChange}
              onMouseDown={e => {
                e.stopPropagation();
              }}
              className={classNames({
                [styles.error]: Boolean(errTip),
              })}
            />
          </Tooltip>
        ) : (
          <>
            <span onMouseDown={nameMouseDown} onMouseUp={nameMouseUp} onTouchEnd={nameMouseUp} onTouchStart={nameMouseDown} className={styles.name}>
              {widget?.snapshot.widgetName}
            </span>
            {config.isDevMode ? (
              <span className={classNames(styles.tag, styles.tagSuccess)}>{t(Strings.widget_item_developing)}</span>
            ) : (
              widget?.releaseType === WidgetReleaseType.Space && (
                <span className={classNames(styles.tag, styles.tagPrimary)}>{t(Strings.widget_item_build)}</span>
              )
            )}
          </>
        )}
      </span>
      {!config.hideSetting && (widget?.status !== WidgetPackageStatus.Developing || config.isDevMode) && (
        <span
          className={classNames(
            {
              [styles.npOpacity]: displayMode === 'always' || config.isDevMode || isExpandWidget,
            },
            styles.operateButton,
          )}
          onClick={() => toggleSetting?.()}
          onMouseDown={e => e.stopPropagation()}
        >
          <Tooltip
            title={isSettingOpened ? t(Strings.widget_hide_settings_tooltip) : t(Strings.widget_show_settings_tooltip)}
            placement={tooltipPlacement}
          >
            <IconButton icon={SettingOutlined} active={isSettingOpened} />
          </Tooltip>
        </span>
      )}

      {!config.hideExpand && (
        <span
          className={classNames(
            {
              [styles.npOpacity]: displayMode === 'always' || config.isDevMode,
            },
            styles.operateButton,
            'dragHandleDisabled',
          )}
          onClick={expand}
          onMouseDown={e => {
            hideAll();
          }}
        >
          <Tooltip title={isExpandWidget ? t(Strings.widget_collapse_tooltip) : t(Strings.widget_expand_tooltip)} placement={tooltipPlacement}>
            <IconButton icon={ReactIconExpand} />
          </Tooltip>
        </span>
      )}
      {config.isDevMode && (
        <span
          data-guide-id='WIDGET_ITEM_REFRESH'
          className={classNames(styles.npOpacity, styles.operateButton, 'dragHandleDisabled')}
          onClick={() => {
            refreshVersion();
            widgetLoader?.current?.refresh?.();
          }}
        >
          <Tooltip title={t(Strings.widget_operate_refresh)} placement={tooltipPlacement}>
            <IconButton icon={RefreshOutlined} size='small' />
          </Tooltip>
        </span>
      )}
      {!config.hideMoreOperate && (
        <span
          data-guide-id='WIDGET_ITEM_MORE'
          className={classNames(
            {
              [styles.npOpacity]: displayMode === 'always' || config.isDevMode || isExpandWidget,
            },
            styles.operateButton,
            'dragHandleDisabled',
          )}
          onClick={triggerMenu}
        >
          <Tooltip title={t(Strings.widget_more_settings_tooltip)} placement={tooltipPlacement}>
            <IconButton icon={ReactMoreOutlined} />
          </Tooltip>
        </span>
      )}
      {isExpandWidget && (
        <>
          <DividerMargin8 />
          <Tooltip
            title={isFullScreenWidget ? t(Strings.widget_disable_fullscreen) : t(Strings.widget_enable_fullscreen)}
            placement={tooltipPlacement}
          >
            <IconButton
              icon={isFullScreenWidget ? WidgetNarrowOutlined : WidgetExpandOutlined}
              style={{ marginRight: 8 }}
              onClick={() => toggleFullScreenWidget()}
            />
          </Tooltip>
          <IconButton
            icon={CloseMiddleOutlined}
            size='small'
            onClick={() => {
              isFullScreenWidget && toggleFullScreenWidget();
              closeWidgetRoute(widgetId);
            }}
          />
        </>
      )}
    </div>
  );
};
