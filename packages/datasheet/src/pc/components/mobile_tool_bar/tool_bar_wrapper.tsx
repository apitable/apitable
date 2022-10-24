import { useState } from 'react';
import * as React from 'react';
import { useResponsive, useSideBarVisible } from 'pc/hooks';
import { useThemeColors } from '@vikadata/components';
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

export interface IToolBarWrapperProps {
  hideToolBar?: boolean;
}

export const ToolBarWrapper: React.FC<IToolBarWrapperProps> = ({ hideToolBar }) => {
  const { setSideBarVisible } = useSideBarVisible();
  const [viewMenuVisible, setViewMenuVisible] = useState(false);
  const { datasheetId, mirrorId } = useSelector(state => state.pageParams);
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
      <div className={styles.mobileToolBar}>
        <div onClick={() => setSideBarVisible(true)} className={styles.side}>
          <IconSide width={20} height={20} fill={colors.black[50]} />
        </div>
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
