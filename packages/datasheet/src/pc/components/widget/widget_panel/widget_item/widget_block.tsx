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

import { useUnmount } from 'ahooks';
import classnames from 'classnames';

import * as React from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line no-restricted-imports
import * as components from '@apitable/components';
import * as core from '@apitable/core';
import { getLanguage, Selectors, StoreActions } from '@apitable/core';
import * as icons from '@apitable/icons';
import * as widgetSdk from '@apitable/widget-sdk';
import { ConnectStatus, IExpandRecordProps, initRootWidgetState, mainMessage, MessageType, RuntimeEnv, ErrorMessage } from '@apitable/widget-sdk';
import { IRecordPickerProps } from 'pc/components/record_picker';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getDependenceByDstIds } from 'pc/utils/dependence_dst';
// import { getDependenceByDstIds } from 'pc/utils/dependence_dst';
import { getEnvVariables } from 'pc/utils/env';
import { useManageWidgetRenderTask, useWidgetCanRender } from '../../context';
import { widgetRenderTask } from '../../context/widget_render_task';
import { useCloudStorage } from '../../hooks/use_cloud_storage';
import { expandWidgetDevConfig } from '../../widget_center/widget_create_modal';
import { patchDatasheet } from './utils';
import { WidgetLoading } from './widget_loading';
// @ts-ignore
import { isSocialWecom } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

(() => {
  if (!process.env.SSR) {
    const prefix = getEnvVariables().WIDGET_REPO_PREFIX;
    window['_React'] = React;
    window['_ReactDom'] = ReactDOM;
    window['_@apitable/components'] = components;
    window['_@apitable/widget-sdk'] = widgetSdk;
    window['_@apitable/core'] = core;
    window['_@apitable/icons'] = icons;
    if (prefix !== 'apitable') {
      window[`_@${prefix}/components`] = components;
      window[`_@${prefix}/widget-sdk`] = widgetSdk;
      window[`_@${prefix}/core`] = core;
      window[`_@${prefix}/icons`] = icons;
    }
  }
})();

let WIDGET_IFRAME_PATH: string;
if (process.env.NODE_ENV !== 'production') {
  WIDGET_IFRAME_PATH = process.env.NEXT_PUBLIC_REACT_APP_WIDGET_IFRAME
    ? `${process.env.NEXT_PUBLIC_REACT_APP_WIDGET_IFRAME}/widget-stage`
    : 'http://localhost:3000/widget-stage';
} else {
  if (!process.env.SSR) {
    WIDGET_IFRAME_PATH = `${window.location.origin}/widget-stage`;
  }
}

export interface IWidgetBlockRefs {
  refresh: () => void;
  setCodeUrl?: React.Dispatch<React.SetStateAction<string | undefined>>;
  codeUrl?: string;
}

export const WidgetBlockBase: React.ForwardRefRenderFunction<
  IWidgetBlockRefs,
  {
    widgetId: string;
    widgetPackageId: string;
    isExpandWidget: boolean;
    isSettingOpened: boolean;
    toggleSetting(state?: boolean | undefined): any;
    toggleFullscreen(state?: boolean | undefined): any;
    expandRecord(props: IExpandRecordProps): any;
    expandRecordPicker: (props: IRecordPickerProps) => any;
    nodeId: string;
    isDevMode?: boolean;
    setDevWidgetId?: ((widgetId: string) => void) | undefined;
    dragging?: boolean;
    runtimeEnv: RuntimeEnv;
  }
> = (props, ref) => {
  const {
    widgetId,
    widgetPackageId,
    isExpandWidget,
    isSettingOpened,
    isDevMode,
    nodeId,
    toggleFullscreen,
    toggleSetting,
    expandRecord,
    dragging,
    setDevWidgetId,
    runtimeEnv,
    expandRecordPicker,
  } = props;
  useManageWidgetRenderTask(widgetId);
  const [connected, setConnected] = useState<boolean>();
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const widgetCanRender = useWidgetCanRender(widgetId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [codeUrl, setCodeUrl] = useCloudStorage<string | undefined>(`widget_loader_code_url_${widgetPackageId}`, widgetId);
  const nodeConnected = useAppSelector((state) => {
    const datasheet = Selectors.getDatasheet(state, nodeId);
    const bindDatasheetLoaded = datasheet && !datasheet.isPartOfData;
    // The initialization of the widget must be done after the datasheet loaded.
    if (!bindDatasheetLoaded) {
      return false;
    }
    const { templateId } = state.pageParams;
    return templateId || nodeId !== state.pageParams.nodeId || Selectors.getDatasheetPack(state, nodeId)?.connected;
  });
  const errorCode = useAppSelector((state) => {
    const widget = Selectors.getWidget(state, widgetId)!;
    const { sourceId, datasheetId } = widget.snapshot;
    return sourceId?.startsWith('mir') ? Selectors.getMirrorErrorCode(state, sourceId) : Selectors.getDatasheetErrorCode(state, datasheetId);
  });
  const theme = useAppSelector((state) => state.theme);

  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);

  const isWecom = isSocialWecom?.(spaceInfo);

  useImperativeHandle(ref, () => ({
    refresh: () => mainMessage.refreshWidget(widgetId),
    setCodeUrl,
    codeUrl,
  }));

  useUnmount(() => {
    mainMessage.unMounted(widgetId);
    widgetRenderTask.clearTask(widgetId);
  });

  useEffect(() => {
    if (widgetCanRender && nodeConnected) {
      mainMessage.onConnectWidget(widgetId, (status: ConnectStatus) => {
        switch (status) {
          case ConnectStatus.ESTABLISHED:
            setConnected(true);
            break;
          case ConnectStatus.SYN_SENT: {
            if (!iframeRef?.current?.contentWindow) {
              console.error('%s widget iframe load error', widgetId);
              return;
            }
            mainMessage.initWidgetWindow(
              widgetId,
              {
                window: iframeRef.current.contentWindow,
                origin: WIDGET_IFRAME_PATH,
              },
              nodeId,
            );
          }
        }
      });
    }
    return () => {
      mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_CONNECT);
      mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_CONNECT_ES);
    };
  }, [widgetId, nodeConnected, setConnected, widgetCanRender, nodeId]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    const state = store.getState();
    const datasheetId = Selectors.getWidgetSnapshot(state, widgetId)?.datasheetId;
    if (!datasheetId) {
      throw new Error("Unexpected errors: Can't get the datasheetId bound by the widget");
    }
    const foreignDatasheetIds = getDependenceByDstIds(state, datasheetId);

    mainMessage.initWidget(widgetId, {
      ...initRootWidgetState(state, widgetId, { foreignDatasheetIds }),
      widgetConfig: {
        isFullscreen: isExpandWidget,
        isShowingSettings: isSettingOpened,
        isDevMode,
      },
    });
    widgetRenderTask.nextWidgetRunTask(widgetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, nodeConnected]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainMessage.syncWidgetConfig(widgetId, {
      isFullscreen: isExpandWidget,
      isShowingSettings: isSettingOpened,
      isDevMode,
    });
  }, [widgetId, isExpandWidget, isSettingOpened, isDevMode, connected]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainMessage.onSyncCmdOptions(widgetId, async (res) => {
      mainMessage.syncCmdOptionsResult(widgetId, await resourceService.instance!.commandManager.execute(res));
    });

    mainMessage.onFetchDatasheet(widgetId, (fetchDatasheet, messageId) => {
      patchDatasheet({
        ...fetchDatasheet,
        widgetId,
        messageId,
      });
    });

    mainMessage.onSyncWidgetSubscribeView(widgetId, (newsSubscribeViews) => {
      const state = store.getState();
      newsSubscribeViews.forEach(({ datasheetId, viewId }) => {
        if (!Selectors.getViewDerivatePrepared(state, datasheetId, viewId)) {
          store.dispatch(StoreActions.triggerViewDerivationComputed(datasheetId, viewId));
          return;
        }
        mainMessage.syncAction(
          widgetId,
          StoreActions.setViewDerivation(datasheetId, {
            viewId: Selectors.getViewIdByNodeId(state, datasheetId, viewId)!,
            viewDerivation: Selectors.getViewDerivation(state, datasheetId, viewId),
          }),
        );
      });
    });

    return () => {
      mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_SYNC_COMMAND);
      mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_FETCH_VIEW);
      mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_FETCH_DATASHEET);
      mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_SUBSCRIBE_CHANGE);
    };
  }, [connected, widgetId]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainMessage.onWidgetConfig(widgetId, (res) => {
      if (res.isFullscreen !== undefined && res.isFullscreen !== isExpandWidget) {
        toggleFullscreen();
      }
      if (res.isShowingSettings !== undefined && res.isShowingSettings !== isSettingOpened) {
        toggleSetting();
      }
    });
    return () => mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_SYNC_WIDGET_CONFIG);
  }, [toggleFullscreen, toggleSetting, connected, widgetId, isExpandWidget, isSettingOpened]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainMessage.onExpandRecord(widgetId, expandRecord);
    return () => mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_EXPAND_RECORD);
  }, [connected, widgetId, expandRecord]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainMessage.onExpandRecordPicker(widgetId, (datasheetId: string, messageId?: string) =>
      expandRecordPicker({
        datasheetId,
        isSingle: true,
        onSave: (recordIds: string[]) => {
          mainMessage.syncRecordPickerResult(widgetId, recordIds, messageId);
        },
        onClose: () => mainMessage.syncRecordPickerResult(widgetId, [], messageId),
      }),
    );
    return () => mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_EXPAND_RECORD_PICKER);
  }, [connected, widgetId, expandRecordPicker]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainMessage.onExpandDevConfig(widgetId, () => {
      expandWidgetDevConfig({
        codeUrl,
        widgetPackageId,
        widgetId,
        onConfirm: (devUrl) => {
          setCodeUrl?.(devUrl);
        },
      });
    });
    return () => mainMessage.removeListenEvent(widgetId, MessageType.WIDGET_EXPAND_DEV_CONFIG);
  }, [connected, setDevWidgetId, setCodeUrl, widgetPackageId, widgetId, codeUrl]);

  if (errorCode) {
    return <ErrorMessage errorCode={errorCode} themeName={theme} />;
  }

  if (!widgetCanRender || !nodeConnected) {
    return <WidgetLoading />;
  }

  return (
    <>
      {/* A transparent mask div to solve the problem of mouse being hijacked by iframe when dragging and zooming. */}
      <div className={classnames(styles.iframeMask, dragging && styles.iframeMasking)} />
      {iframeLoading && (
        <div className={styles.iframeLoadingWarp}>
          <WidgetLoading />
        </div>
      )}
      <iframe
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          borderRadius: '0 0 8px 8px',
        }}
        onLoad={() => setIframeLoading(false)}
        ref={iframeRef}
        src={`${WIDGET_IFRAME_PATH}/?widgetId=${widgetId}&lang=${getLanguage()}&isSocialWecom=${isWecom}&runtimeEnv=${runtimeEnv}`}
      />
    </>
  );
};

export const WidgetBlock = React.forwardRef(WidgetBlockBase);
