import * as React from 'react';
import { useSelector } from 'react-redux';
import { store } from 'pc/store';
import { Selectors } from '@apitable/core';
import { Loading, useThemeMode } from '@vikadata/components';
import { resourceService } from 'pc/resource_service';
import { IWidgetLoaderRefs, WidgetLoader } from '../../widget_loader';
import { IExpandRecordProps, RuntimeEnv, WidgetProvider } from '@vikadata/widget-sdk';
import { isSocialWecom } from 'pc/components/home/social_platform';

export const WidgetBlock = React.memo((props: {
  widgetId: string;
  nodeId: string;
  isExpandWidget: boolean;
  isSettingOpened: boolean;
  toggleSetting(state?: boolean | undefined): any;
  toggleFullscreen(state?: boolean | undefined): any;
  expandRecord(props: IExpandRecordProps): any;
  widgetLoader: React.RefObject<IWidgetLoaderRefs>;
  isDevMode?: boolean;
  setDevWidgetId?: ((widgetId: string) => void) | undefined;
  runtimeEnv: RuntimeEnv
}) => {
  const {
    widgetId, nodeId, isExpandWidget, isSettingOpened, toggleSetting, toggleFullscreen, expandRecord,
    widgetLoader, isDevMode, setDevWidgetId, runtimeEnv
  } = props;
  const theme = useThemeMode();
  
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  window['_isSocialWecom'] = isSocialWecom(spaceInfo);

  // In the datasheet widget and other datasheet socket connection on the display
  const connected = useSelector(state => {
    const { templateId } = state.pageParams;
    return templateId || nodeId !== state.pageParams.nodeId || Selectors.getDatasheetPack(state, nodeId)?.connected;
  });

  if (!connected) {
    return <Loading/>;
  }

  return (
    <WidgetProvider
      id={widgetId}
      theme={theme}
      runtimeEnv={runtimeEnv}
      resourceService={resourceService.instance!}
      globalStore={store}
      isFullscreen={isExpandWidget}
      isShowingSettings={isSettingOpened}
      toggleSettings={toggleSetting}
      toggleFullscreen={toggleFullscreen}
      expandRecord={expandRecord}
    >
      <WidgetLoader ref={widgetLoader} isDevMode={isDevMode} setDevWidgetId={setDevWidgetId} />
    </WidgetProvider>
  );
});