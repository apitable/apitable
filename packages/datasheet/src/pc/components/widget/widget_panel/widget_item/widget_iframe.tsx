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

import { Loading } from '@apitable/components';
import { getLanguage, Selectors, StoreActions } from '@apitable/core';
import { IExpandRecordProps, mainWidgetMessage, RuntimeEnv } from '@apitable/widget-sdk';
import { WidgetMessageType } from '@apitable/widget-sdk/dist/iframe_message/interface';
import { useUnmount } from 'ahooks';
import classnames from 'classnames';
// @ts-ignore
import { isSocialWecom } from 'enterprise';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getDependenceByDstIds } from 'pc/utils/dependence_dst';
import * as React from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCloudStorage } from '../../hooks/use_cloud_storage';
import { expandWidgetDevConfig } from '../../widget_center/widget_create_modal';
import { IWidgetLoaderRefs } from '../../widget_loader';
import styles from './style.module.less';

interface IWidgetTask {
  widgetId: string;
  toRun: () => void;
}

const WIDGET_RUN_TASK_MAX = 4;

const widgetWaitTask: IWidgetTask[] = [];
const widgetRunTask: IWidgetTask[] = [];
const addWidgetTask = (widgetId: string, toRun: () => void) => {
  if (widgetRunTask.length < WIDGET_RUN_TASK_MAX) {
    toRun();
    widgetRunTask.push({ widgetId, toRun });
  } else {
    widgetWaitTask.push({ widgetId, toRun });
  }
};

const nextWidgetRunTask = (id: string) => {
  const index = widgetRunTask.findIndex(({ widgetId }) => widgetId === id);
  widgetRunTask.splice(index, 1);
  const widget = widgetWaitTask.shift();
  if (widget) {
    widget.toRun();
    widgetRunTask.push(widget);
  }
};

const removeWidgetTask = (id: string) => {
  const indexRun = widgetRunTask.findIndex(({ widgetId }) => widgetId === id);
  widgetRunTask.splice(indexRun, 1);
  const indexWait = widgetWaitTask.findIndex(({ widgetId }) => widgetId === id);
  widgetWaitTask.splice(indexWait, 1);
};

let WIDGET_IFRAME_PATH;
if (process.env.NODE_ENV !== 'production') {
  WIDGET_IFRAME_PATH = process.env.NEXT_PUBLIC_REACT_APP_WIDGET_IFRAME ? `${process.env.NEXT_PUBLIC_REACT_APP_WIDGET_IFRAME}/widget-stage` :
    'http://localhost:3000/widget-stage';
} else {
  if (!process.env.SSR) {
    WIDGET_IFRAME_PATH = `${window.location.origin}/widget-stage`;
  }
}

export const WidgetIframeBase: React.ForwardRefRenderFunction<IWidgetLoaderRefs, {
  widgetId: string;
  widgetPackageId: string;
  isExpandWidget: boolean;
  isSettingOpened: boolean;
  toggleSetting(state?: boolean | undefined): any;
  toggleFullscreen(state?: boolean | undefined): any;
  expandRecord(props: IExpandRecordProps): any;
  nodeId: string;
  isDevMode?: boolean;
  setDevWidgetId?: ((widgetId: string) => void) | undefined;
  dragging?: boolean;
  runtimeEnv: RuntimeEnv;
}> = (props, ref) => {
  const {
    widgetId, widgetPackageId, isExpandWidget, isSettingOpened, isDevMode, nodeId, toggleFullscreen, toggleSetting, expandRecord, dragging,
    setDevWidgetId, runtimeEnv
  } = props;
  const [iframeOnload, setIframeOnload] = useState<boolean>();
  const [connected, setConnected] = useState<boolean>();
  const [canRun, setCanRun] = useState<boolean>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [codeUrl, setCodeUrl] = useCloudStorage<string | undefined>(`widget_loader_code_url_${widgetPackageId}`, widgetId);
  const nodeConnected = useSelector(state => {
    const { templateId } = state.pageParams;
    return templateId || nodeId !== state.pageParams.nodeId || Selectors.getDatasheetPack(state, nodeId)?.connected;
  });

  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  const isWecom = isSocialWecom?.(spaceInfo);

  useImperativeHandle(ref, () => ({
    refresh: () => mainWidgetMessage.refreshWidget(widgetId),
    setCodeUrl,
    codeUrl
  }));

  useUnmount(() => {
    mainWidgetMessage.removeWindow(widgetId);
  });

  useEffect(() => {
    if (!canRun && widgetId) {
      addWidgetTask(widgetId, () => setCanRun(true));
    }
    return () => removeWidgetTask(widgetId);
    // eslint-disable-next-line
  }, [widgetId, setCanRun]);

  useEffect(() => {
    if (canRun && iframeOnload && nodeConnected && !mainWidgetMessage.widgets[widgetId]?.connected) {
      mainWidgetMessage.addWindow(widgetId, { window: iframeRef.current?.contentWindow!, origin: WIDGET_IFRAME_PATH });
      mainWidgetMessage.connectWidget(widgetId, window.location.origin, () => {
        setConnected(true);
        // The first link is to make sure that the datasheet associated with the widget has been loaded, so it is set to true directly here.
        mainWidgetMessage.widgets[widgetId].listenDatasheetMap[nodeId] = { loading: true };
      });
    }
    return () => mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.CONNECT_IFRAME);
  }, [iframeOnload, widgetId, nodeConnected, setConnected, canRun, nodeId]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainWidgetMessage.onInitWidget(widgetId, res => {
      const state = store.getState();
      const widget = Selectors.getWidget(state, widgetId)!;
      const datasheetId = widget?.snapshot.datasheetId;
      if (!res.success || res.data !== widgetId || !datasheetId) {
        return null;
      }
      const datasheet = Selectors.getDatasheetPack(state, widget?.snapshot.datasheetId)!;
      const datasheetMap = {
        [datasheetId]: datasheet
      };
      const dstIds = getDependenceByDstIds(state, datasheetId);
      dstIds.forEach(datasheetId => {
        datasheetMap[datasheetId] = state.datasheetMap[datasheetId];
      });

      const mirrorId = widget.snapshot?.sourceId;
      const mirrorMap = mirrorId ? { [mirrorId]: state.mirrorMap[mirrorId] } : undefined;
      nextWidgetRunTask(widgetId);
      return {
        widget,
        datasheetMap,
        dashboard: Selectors.getDashboardPack(state) || undefined,
        unitInfo: state.unitInfo,
        pageParams: state.pageParams,
        share: state.share,
        labs: state.labs,
        mirrorMap,
        user: state.user.info,
        widgetConfig: {
          isFullscreen: isExpandWidget,
          isShowingSettings: isSettingOpened,
          isDevMode
        }
      };
    });
    return () => mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.INIT_WIDGET);
    // eslint-disable-next-line
  }, [connected, nodeConnected]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainWidgetMessage?.syncWidgetConfig(widgetId, {
      isFullscreen: isExpandWidget,
      isShowingSettings: isSettingOpened,
      isDevMode
    });
    // eslint-disable-next-line
  }, [isExpandWidget, isSettingOpened, isDevMode, connected]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainWidgetMessage.onSyncCmdOptions(widgetId, res => {
      mainWidgetMessage.syncCmdOptionsResult(widgetId, resourceService.instance!.commandManager.execute(res));
    });
    mainWidgetMessage.onLoadOtherDatasheetInit(widgetId, datasheetId => {
      const state = store.getState();
      const otherDatasheet = Selectors.getDatasheetPack(store.getState(), datasheetId);
      mainWidgetMessage.widgets[widgetId].listenDatasheetMap[datasheetId] = { loading: otherDatasheet?.loading };
      if (otherDatasheet?.loading && !otherDatasheet?.errorCode && !otherDatasheet.datasheet?.isPartOfData) {
        const map = {
          [datasheetId]: otherDatasheet
        };
        const dstIds = getDependenceByDstIds(state, datasheetId);
        const datasheetMap = state.datasheetMap;
        dstIds.forEach(datasheetId => {
          map[datasheetId] = datasheetMap[datasheetId];
        });
        mainWidgetMessage.loadOtherDatasheetInit(datasheetId, map);
      } else {
        store.dispatch(StoreActions.fetchDatasheet(datasheetId));
      }
    });
    mainWidgetMessage.onInitCalcCache(widgetId, (datasheetId, viewId) => {
      const state = store.getState();
      const datasheetPack = Selectors.getDatasheetPack(state, datasheetId);
      if (!datasheetPack || datasheetPack.loading || datasheetPack.datasheet?.isPartOfData) {
        return;
      }
      const keyword = Selectors.getSearchKeyword(state, datasheetId);
      const snapshot = Selectors.getSnapshot(state, datasheetId)!;
      const fieldPermissionMap = Selectors.getFieldPermissionMap(state, datasheetId);
      const view = Selectors.getCurrentViewBase(snapshot, viewId, datasheetId, fieldPermissionMap);
      const cache = Selectors.getVisibleRowsBase(state, snapshot, view, keyword);
      mainWidgetMessage.syncCalcCacheWidget(widgetId, datasheetId, viewId, cache);
    });

    return () => {
      mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.SYNC_COMMAND);
      mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.LOAD_OTHER_DATASHEET_INIT);
      mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.CALC_CACHE);
    };
  }, [connected, widgetId]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainWidgetMessage.onWidgetConfig(widgetId, res => {
      if (res.isFullscreen !== undefined && res.isFullscreen !== isExpandWidget) {
        toggleFullscreen();
      }
      if (res.isShowingSettings !== undefined && res.isShowingSettings !== isSettingOpened) {
        toggleSetting();
      }
    });
    return () => mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.SYNC_WIDGET_CONFIG);
  }, [toggleFullscreen, toggleSetting, connected, widgetId, isExpandWidget, isSettingOpened]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainWidgetMessage.onExpandRecord(widgetId, expandRecord);
    return () => mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.EXPAND_RECORD);
  }, [connected, widgetId, expandRecord]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    mainWidgetMessage.onExpandDevConfig(widgetId, () => {
      expandWidgetDevConfig({
        codeUrl, widgetPackageId, widgetId, onConfirm: (devUrl) => {
          setCodeUrl?.(devUrl);
        }
      });
    });
    return () => mainWidgetMessage.removeListenEvent(widgetId, WidgetMessageType.EXPAND_DEV_CONFIG);
  }, [connected, setDevWidgetId, setCodeUrl, widgetPackageId, widgetId, codeUrl]);

  if (!canRun) {
    console.log(widgetId, ' waiting load...');
    return <Loading />;
  }

  if (!nodeConnected) {
    return <Loading />;
  }

  return <>
    {/* A transparent mask div to solve the problem of mouse being hijacked by iframe when dragging and zooming. */}
    <div className={classnames(
      styles.iframeMask,
      dragging && styles.iframeMasking,
    )} />
    <iframe
      style={{
        width: '100%',
        height: '100%',
        border: 0
      }}
      ref={iframeRef}
      onLoad={() => {
        setTimeout(() => setIframeOnload(true), 2000);
      }}
      src={`${WIDGET_IFRAME_PATH}/?widgetId=${widgetId}&lang=${getLanguage()}&isSocialWecom=${isWecom}&runtimeEnv=${runtimeEnv}`} />
  </>;
};

export const WidgetIframe = React.forwardRef(WidgetIframeBase);
