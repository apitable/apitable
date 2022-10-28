import React, { useContext, useEffect } from 'react';
import useToggleOrSet from './private/use_toggle_or_set';
import { noop } from 'lodash';
import { StoreActions, ResourceType } from 'core';
import { WidgetProvider } from './widget_context';
import { GlobalContext } from './global_context';
import { ThemeName } from '@vikadata/components';

export interface IWidgetStandAloneProps {
  id: string;
  datasheetId: string;
  locale?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WidgetProvider for standalone widget, 
 * with its own data loading capabilities and resourceService.
 * Multiple widgets can be loaded in a page, just wrap WidgetProvider on the outer layer of each widget.
 */
export const WidgetStandAloneProvider: React.FC<IWidgetStandAloneProps> = props => {
  const { resourceService, globalStore } = useContext(GlobalContext);
  const [isSettingOpened, { toggle: toggleSetting }] = useToggleOrSet(true);
  const [isExpanded, { toggle: toggleExpand }] = useToggleOrSet(false);
  const { id, datasheetId, locale = 'zh-CN', className, style, children } = props;

  useEffect(() => {
    // get datasheet data under datasheetId, listen under connectWidgetStore
    resourceService.switchResource({ to: datasheetId, resourceType: ResourceType.Datasheet });
    // get globalStore of the widget need
    globalStore.dispatch(StoreActions.fetchWidgetsByWidgetIds([id]) as any);
  }, [id, datasheetId, resourceService, globalStore]);

  return (
    <WidgetProvider
      id={id}
      theme={ThemeName.Light}
      locale={locale}
      isFullscreen={isExpanded}
      isShowingSettings={isSettingOpened}
      toggleSettings={toggleSetting}
      toggleFullscreen={toggleExpand}
      expandRecord={noop}
      resourceService={resourceService}
      globalStore={globalStore}
      className={className}
      style={style}
    >
      {children}
    </WidgetProvider>
  );
};
