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
 * @description 给独立组件使用的 WidgetProvider, 自带依赖数据加载能力和 resourceService
 * 一个页面中可以加载多个 widget，给每个 widget 外层包上 WidgetProvider 即可
 */
export const WidgetStandAloneProvider: React.FC<IWidgetStandAloneProps> = props => {
  const { resourceService, globalStore } = useContext(GlobalContext);
  const [isSettingOpened, { toggle: toggleSetting }] = useToggleOrSet(true);
  const [isExpanded, { toggle: toggleExpand }] = useToggleOrSet(false);
  const { id, datasheetId, locale = 'zh-CN', className, style, children } = props;

  useEffect(() => {
    // 获取datasheetId下的数表数据, 在connectWidgetStore之下监听，再设置widgetState
    resourceService.switchResource({ to: datasheetId, resourceType: ResourceType.Datasheet });
    // 获取widget数据
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
