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

import React, { useContext, useEffect } from 'react';
import useToggleOrSet from './private/use_toggle_or_set';
import { noop } from 'lodash';
import { StoreActions, ResourceType } from 'core';
import { WidgetProvider } from './widget_context';
import { GlobalContext } from './global_context';
import { ThemeName } from '@apitable/components';

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
export const WidgetStandAloneProvider: React.FC<React.PropsWithChildren<IWidgetStandAloneProps>> = props => {
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
      className={className}
      widgetStore={globalStore as any}
      style={style}
    >
      {children}
    </WidgetProvider>
  );
};
