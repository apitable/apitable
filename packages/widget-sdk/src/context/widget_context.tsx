import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { IWidgetConfig, IWidgetContext, IWidgetState, RuntimeEnv } from 'interface';
import { ErrorHandler } from '../error_handler';
import { connectWidgetStore } from '../store/connector';
import { uniqueId } from 'lodash';
import { IWidgetStore } from 'store';
import { Store } from 'redux';
import { ThemeName } from '@apitable/components';
/**
 * 1. provide the ability to read and write to the data source of the widget.
 * 2. provide the ability to read and write to the datasheet data.
 */
export const WidgetContext = React.createContext<IWidgetContext>(null!);

export type IWidgetProviderProps = Omit<IWidgetContext, 'locale' | 'widgetStore'> & Omit<IWidgetConfig, 'mountId'> & {
  locale?: string;
  /** Optionally, add a class to the outermost div of the components */
  className?: string;
  /** Optionally, add a style to the outermost div of the components */
  style?: React.CSSProperties;
  widgetStore?: Store<IWidgetState>;
};

/**
 * Provide the ability to get and control the outer UI state of the widget.
 */
export const WidgetConfigContext = React.createContext<IWidgetConfig>(null!);

/**
 * Within the main project, the WidgetProvider need to be wrapped before the widget be used.
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
