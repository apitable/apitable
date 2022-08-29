import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { IWidgetConfig, IWidgetContext, IWidgetState, RuntimeEnv } from 'interface';
import { ErrorHandler } from '../error_handler';
import { connectWidgetStore } from '../store/connector';
import { uniqueId } from 'lodash';
import { IWidgetStore } from 'store';
import { Store } from 'redux';
import { ThemeName } from '@vikadata/components';
/**
 * 1. 提供小程序数据源的读写能力
 * 
 * 2. 提供数表数据的读写能力
 */
export const WidgetContext = React.createContext<IWidgetContext>(null!);

export type IWidgetProviderProps = Omit<IWidgetContext, 'locale' | 'widgetStore'> & Omit<IWidgetConfig, 'mountId'> & {
  locale?: string;
  /** 可选，给组件最外层 div 加一个类 */
  className?: string;
  /** 可选，给组件最外层 div 加样式 */
  style?: React.CSSProperties;
  widgetStore?: Store<IWidgetState>;
};

/**
 * 提供小程序外层 UI 状态获取与控制能力
 */
export const WidgetConfigContext = React.createContext<IWidgetConfig>(null!);

/**
 * 在主工程内，使用小程序之前需要包装 WidgetProvider
 */
export const WidgetProvider: React.FC<IWidgetProviderProps> = props => {
  const {
    id, globalStore, resourceService, className, style, locale = 'zh-CN', theme = ThemeName.Light,
    runtimeEnv = RuntimeEnv.Desktop, isShowingSettings, isFullscreen, toggleSettings, toggleFullscreen, expandRecord, children
  } = props;
  const [widgetStore, setWidgetStore] = useState<IWidgetStore>();
  const [mountId] = useState(() => id + uniqueId());
  const [datasheetId, setDatasheetId] = useState<string>();

  useEffect(() => {
    if (props.widgetStore) {
      setWidgetStore(props.widgetStore);
      setDatasheetId(props.widgetStore.getState().widget?.snapshot.datasheetId);
      return;
    }
    const connected = connectWidgetStore({ globalStore, id });
    setWidgetStore(connected.widgetStore);
    setDatasheetId(connected.widgetStore.getState().widget?.snapshot.datasheetId);
    return () => {
      connected.unSubscribe();
    };
  }, [globalStore, id, props.widgetStore]);

  const widgetConfigValue = useMemo(() => {
    return { mountId, isShowingSettings, isFullscreen, toggleFullscreen, toggleSettings, expandRecord };
  }, [mountId, isShowingSettings, isFullscreen, toggleFullscreen, expandRecord, toggleSettings]);

  const widgetContextValue: IWidgetContext = useMemo(() => {
    return { id, locale, theme, datasheetId, globalStore: globalStore || widgetStore, resourceService, widgetStore, runtimeEnv } as IWidgetContext;
  }, [id, locale, theme, datasheetId, globalStore, resourceService, widgetStore, runtimeEnv]);

  if (!widgetStore) {
    return null;
  }

  return (
    <Provider store={widgetStore}>
      <WidgetContext.Provider value={widgetContextValue}>
        <WidgetConfigContext.Provider value={widgetConfigValue}>
          <div className={className} style={{ height: '100%', width: '100%', ...(style as any) }}>
            <ErrorHandler>{children}</ErrorHandler>
          </div>
        </WidgetConfigContext.Provider>
      </WidgetContext.Provider>
    </Provider>
  );
};
