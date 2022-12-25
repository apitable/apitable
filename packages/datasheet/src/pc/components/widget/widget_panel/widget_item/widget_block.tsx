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

import * as React from 'react';
import { useSelector } from 'react-redux';
import { store } from 'pc/store';
import { Selectors } from '@apitable/core';
import { Loading, useThemeMode } from '@apitable/components';
import { resourceService } from 'pc/resource_service';
import { IWidgetLoaderRefs, WidgetLoader } from '../../widget_loader';
import { IExpandRecordProps, RuntimeEnv, WidgetProvider } from '@apitable/widget-sdk';
// @ts-ignore
import { isSocialWecom } from 'enterprise';

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

  window['_isSocialWecom'] = isSocialWecom?.(spaceInfo);

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