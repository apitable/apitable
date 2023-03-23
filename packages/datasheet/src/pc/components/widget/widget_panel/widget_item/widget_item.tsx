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

import { ThemeName } from '@apitable/components';
import { CollaCommandName, ExecuteResult, ResourceType, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { RuntimeEnv } from '@apitable/widget-sdk';
import { WidgetLoadError } from '@apitable/widget-sdk/dist/initialize_widget';
import { useToggle } from 'ahooks';
import classNames from 'classnames';
import { SimpleEmitter } from 'modules/shared/simple_emitter';
import Image from 'next/image';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { SearchPanel } from 'pc/components/datasheet_search_panel';
// @ts-ignore
import { EmbedContext } from 'enterprise';
import { expandRecordInCenter } from 'pc/components/expand_record';
import { WidgetHeader } from 'pc/components/widget/widget_panel/widget_item/widget_header';
import { WidgetHeaderMobile } from 'pc/components/widget/widget_panel/widget_item/widget_header_mobile';
import { useResponsive } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PngLinkdatasheetDark from 'static/icon/datasheet/chart/dashboard_widget_empty_dark.png';
import PngLinkdatasheetLight from 'static/icon/datasheet/chart/dashboard_widget_empty_light.png';
import { closeWidgetRoute, expandWidgetRoute } from '../../expand_widget';
import { useDevLoadCheck, useFullScreen } from '../../hooks';
import { usePreLoadError } from '../../hooks/use_pre_load_error';
import { ErrorWidget } from '../../error_widget';
import { IWidgetPropsBase } from './interface';
import styles from './style.module.less';
import { IWidgetBlockRefs, WidgetBlock } from './widget_block';
import { WidgetBlockMain } from './widget_block_main';
import { WidgetLoading } from './widget_loading';
import { expandRecordPicker } from 'pc/components/record_picker';

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

export const WidgetItem: React.FC<React.PropsWithChildren<IWidgetItemProps>> = props => {
  const { widgetPanelId, widgetId, readonly, isMobile, config, setDevWidgetId, dragging, setDragging } = props;

  const { folderId: folderIdForEmbed } = useContext(EmbedContext || createContext({})) as any || {};

  const widget = useSelector(state => Selectors.getWidget(state, widgetId));
  const widgetSnapshot = widget?.snapshot;
  const widgetBindDatasheetId = widgetSnapshot ? widgetSnapshot.datasheetId : '';
  const doNotBindDatasheet = !widgetBindDatasheetId;
  const { templateId, shareId } = useSelector(state => state.pageParams);
  const linkId = templateId || shareId;
  const rootNodeId = useSelector(state => folderIdForEmbed || state.catalogTree.rootId);
  const isExpandWidget = useSelector(state => Boolean(state.pageParams.widgetId === widgetId));
  const errorCode = useSelector(state => Selectors.getDatasheetErrorCode(state, widgetBindDatasheetId));
  const dispatch = useAppDispatch();
  const themeName = useSelector(state => state.theme);
  const PngLinkdatasheet = themeName === ThemeName.Light ? PngLinkdatasheetLight : PngLinkdatasheetDark;

  const [searchPanelVisible, setSearchPanelVisible] = useState(false);
  const [isSettingOpened, { toggle: toggleSettingOpened }] = useToggle(false);
  // Widget full screen button, different from fullScreen in widget-sdk.
  const [isFullScreenWidget, toggleFullScreenWidget] = useFullScreen(widgetId);
  const widgetLoader = useRef<IWidgetBlockRefs>(null);

  // Whether to enable sandbox (enable to use iframe to render).
  const [devSandbox, devSandboxLoading, error, refreshVersion] = useDevLoadCheck(widgetId, config?.isDevMode);
  const isCiLowVersion = error === WidgetLoadError.CliLowVersion;
  const sandbox = config?.isDevMode ? devSandbox : widget?.sandbox;
  const sandboxLoad = widget?.snapshot && !devSandboxLoading;

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
    if (readonly) {
      return;
    }
    if ((isSettingOpened && !isExpandWidget) || (!isSettingOpened && isExpandWidget)) {
      toggleSetting();
    }
    // eslint-disable-next-line
  }, [isExpandWidget]);

  const setDepDatasheetId = ({ datasheetId, mirrorId }: { datasheetId?: string, mirrorId?: string }) => {
    if (mirrorId) {
      datasheetId = Selectors.getMirrorSourceInfo(store.getState(), mirrorId)!.datasheetId;
    }
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetWidgetDepDstId,
      resourceId: widgetId,
      resourceType: ResourceType.Widget,
      dstId: datasheetId!,
      sourceId: mirrorId,
    });
    if (result.result === ExecuteResult.Success) {
      dispatch(StoreActions.fetchDatasheet(datasheetId!));
    }
    setSearchPanelVisible(false);
  };

  const toggleFullscreen = useCallback(
    (state?: any) => {
      (state == null || state === true) && (isExpandWidget ? closeWidgetRoute(widgetId) : expandWidgetRoute(widgetId));
    },
    [widgetId, isExpandWidget],
  );

  const toggleSetting = useCallback(() => {
    (isExpandWidget || isSettingOpened) && toggleSettingOpened();
  }, [isExpandWidget, toggleSettingOpened, isSettingOpened]);

  const WidgetBox = sandbox ? WidgetBlock : WidgetBlockMain;

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
                <Image src={PngLinkdatasheet} alt='' width={160} height={120} objectFit='contain' />
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
              (
                !sandboxLoad ? <WidgetLoading /> : (isCiLowVersion ? 
                  <ErrorWidget content={t(Strings.widget_cli_upgrade_tip)} /> :
                  <WidgetBox
                    widgetId={widgetId}
                    widgetPackageId={widget.widgetPackageId}
                    ref={widgetLoader}
                    nodeId={widgetBindDatasheetId!}
                    isExpandWidget={isExpandWidget}
                    isSettingOpened={isSettingOpened}
                    toggleSetting={toggleSetting}
                    toggleFullscreen={toggleFullscreen}
                    expandRecord={expandRecordInCenter}
                    expandRecordPicker={expandRecordPicker}
                    isDevMode={config?.isDevMode}
                    setDevWidgetId={setDevWidgetId}
                    dragging={dragging}
                    key={props.index}
                    runtimeEnv={runtimeEnv}
                  />
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

