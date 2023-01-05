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

import { useState } from 'react';
import * as React from 'react';
import { useResponsive, useSideBarVisible } from 'pc/hooks';
import { useThemeColors } from '@apitable/components';
import IconSide from 'static/icon/miniprogram/nav/nav_icon_drawer.svg';
import IconViewList from 'static/icon/datasheet/viewtoolbar/datasheet_icon_viewlist.svg';
import { Toolbar } from '../tool_bar';
import styles from './style.module.less';
import { MoreTool } from './more_tool';
import { ViewSwitcherHorizontal } from './view_switcher_horizontal';
import { ViewMenu } from './view_menu/view_menu';
import { useNetwork } from 'pc/hooks/use_network';
import { ResourceType, Selectors, ViewType } from '@apitable/core';
import { useSelector } from 'react-redux';
import { Find } from './find';
import { ScreenSize } from '../common/component_display';
import { WidgetTool } from './widget_tool/widget_tool';
import classNames from 'classnames';

export interface IToolBarWrapperProps {
  hideToolBar?: boolean;
}

export const ToolBarWrapper: React.FC<IToolBarWrapperProps> = ({ hideToolBar }) => {
  const { setSideBarVisible } = useSideBarVisible();
  const [viewMenuVisible, setViewMenuVisible] = useState(false);
  const { datasheetId, mirrorId, embedId } = useSelector(state => state.pageParams);
  const networkParams: [boolean, string, ResourceType] = mirrorId
    ? [true, mirrorId!, ResourceType.Mirror]
    : [true, datasheetId!, ResourceType.Datasheet];
  useNetwork(...networkParams);
  const colors = useThemeColors();
  const hideViewList = Boolean(mirrorId);
  const activeView = useSelector(state => Selectors.getCurrentView(state))!;
  const isCalendarView = activeView && activeView.type === ViewType.Calendar;
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  return (
    <>
      <div className={classNames(styles.mobileToolBar, {
        [styles.embedPadding]: !!embedId
      })}>
        {!embedId && <div onClick={() => setSideBarVisible(true)} className={styles.side}>
          <IconSide width={20} height={20} fill={colors.black[50]} />
        </div>}
        {!hideToolBar && <Toolbar />}
        <div className={styles.toolRight}>
          {!(isCalendarView && isMobile) && <Find datasheetId={datasheetId!} />}
          <MoreTool />
          <WidgetTool />
        </div>
      </div>
      {!hideViewList && (
        <div className={styles.viewToolsWrapper}>
          <div className={styles.menuOpenContainer} onClick={() => setViewMenuVisible(true)}>
            <div className={styles.menuIconWrapper}>
              <IconViewList width={16} height={16} fill={colors.secondLevelText} />
            </div>
          </div>
          <ViewMenu visible={viewMenuVisible} onClose={() => setViewMenuVisible(false)} />
          <ViewSwitcherHorizontal />
        </div>
      )}
    </>
  );
};
