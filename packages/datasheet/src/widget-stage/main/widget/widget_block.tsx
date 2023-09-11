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

import { useMount } from 'ahooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useThemeMode } from '@apitable/components';
import {
  widgetMessage,
  initWidgetMessage,
  WidgetProvider,
  getWidgetStore,
  getLanguage,
  initWidgetStore,
  RuntimeEnv,
  MouseListenerType,
  IWidgetConfigIframePartial,
  MessageType,
} from '@apitable/widget-sdk';
import { WidgetLoading } from 'pc/components/widget/widget_panel/widget_item/widget_loading';
import { WidgetLoader } from './widget_loader';

const query = new URLSearchParams(window.location.search);
const widgetId = query.get('widgetId');

declare const window: any;
// __initialization_data__
window.__initialization_data__ = window.__initialization_data__ || {};
window.__initialization_data__.lang = query.get('lang');
widgetId && initWidgetMessage(widgetId);

const isSocialWecom = query.get('isSocialWecom');
window['_isSocialWecom'] = isSocialWecom;
window['_widget_iframe'] = true;

const widgetRuntimeEnv = query.get('runtimeEnv') as RuntimeEnv;

export const WidgetBlock: React.FC<React.PropsWithChildren<{ widgetId: string }>> = ({ widgetId }) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isShowingSettings, setIsShowingSettings] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>();
  const [init, setInit] = useState<boolean>();
  const theme = useThemeMode();
  const [widgetStore, setWidgetStore] = useState<any>(getWidgetStore(widgetId));

  useMount(() => {
    widgetMessage.connectWidget(() => {
      setConnected(true);
      console.log('%s connected', widgetId);
    });
  });

  useEffect(() => {
    if (widgetId && connected) {
      widgetMessage.onInitWidget((data) => {
        const { widgetConfig, ...widgetState } = data;
        // redux
        const store = initWidgetStore(widgetState, widgetId);
        setWidgetStore(store);
        // config
        setIsFullscreen(widgetConfig.isFullscreen);
        setIsShowingSettings(widgetConfig.isShowingSettings);
        setIsDevMode(Boolean(widgetConfig.isDevMode));
        setInit(true);
        console.log('%s init data', widgetId);
      });
    }
  }, [connected, widgetId, setInit]);

  useEffect(() => {
    if (connected && widgetMessage && widgetStore) {
      // TODO Handling updates action.
      widgetMessage.onSyncAction((action) => {
        widgetStore.dispatch(action);
      });
    }
    return () => {
      widgetMessage.removeListenEvent(MessageType.MAIN_SYNC_ACTION);
    };
  }, [connected, widgetStore]);

  useEffect(() => {
    if (connected && widgetMessage && widgetStore) {
      widgetMessage.onSyncRecordPickerResult();
    }
    return () => {
      widgetMessage.removeListenEvent(MessageType.MAIN_SYNC_RECORD_PICKER_RESULT);
    };
  }, [connected, widgetStore]);

  useEffect(() => {
    if (widgetMessage && widgetStore && connected) {
      /** update widget config */
      widgetMessage.onSyncWidgetConfig((data) => {
        setIsFullscreen(data.isFullscreen);
        setIsShowingSettings(data.isShowingSettings);
        setIsDevMode(Boolean(data.isDevMode));
      });
    }
    return () => {
      widgetMessage.removeListenEvent(MessageType.MAIN_SYNC_WIDGET_CONFIG);
    };
  }, [setIsFullscreen, setIsShowingSettings, connected, widgetStore]);

  const updateConfig = useCallback((config: IWidgetConfigIframePartial) => {
    widgetMessage.syncWidgetConfig(config);
  }, []);

  const toggleSetting = useCallback(() => {
    const config = {
      isShowingSettings: !isShowingSettings,
    };
    updateConfig(config);
  }, [isShowingSettings, updateConfig]);

  const toggleFullscreen = useCallback(() => {
    const config = {
      isFullscreen: !isFullscreen,
    };
    updateConfig(config);
  }, [isFullscreen, updateConfig]);

  const expandRecord = useCallback((props: any) => {
    widgetMessage.expandRecord(props);
  }, []);

  const expandDevConfig = () => {
    widgetMessage.expandDevConfig();
  };

  useEffect(() => {
    if (!connected) {
      return;
    }
    const fn = (e: { type: MouseListenerType }) => {
      if (!e?.type) {
        return;
      }
      widgetMessage.mouseListener(e.type);
    };
    window.document.addEventListener(MouseListenerType.ENTER, fn);
    window.document.addEventListener(MouseListenerType.LEAVE, fn);
    return () => {
      window.document.removeEventListener(MouseListenerType.ENTER, fn);
      window.document.removeEventListener(MouseListenerType.LEAVE, fn);
    };
  }, [connected]);

  if (!widgetId) {
    return <>Error: no widgetId</>;
  }
  if (!connected) {
    return <WidgetLoading />;
  }

  if (!init) {
    return <WidgetLoading />;
  }

  return (
    <WidgetProvider
      id={widgetId}
      locale={getLanguage()}
      theme={theme}
      runtimeEnv={widgetRuntimeEnv}
      widgetStore={widgetStore}
      isFullscreen={isFullscreen}
      isShowingSettings={isShowingSettings}
      toggleSettings={toggleSetting}
      toggleFullscreen={toggleFullscreen}
      expandRecord={expandRecord}
    >
      <WidgetLoader expandDevConfig={expandDevConfig} isDevMode={isDevMode} />
    </WidgetProvider>
  );
};
