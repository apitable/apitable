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

import RcTrigger from 'rc-trigger';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { IconButton, useThemeColors } from '@apitable/components';
import { PermissionType, ResourceType, Selectors, Strings, t } from '@apitable/core';
import { AddOutlined, ChevronDownOutlined, ChevronLeftOutlined, CloseOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { InstallPosition } from 'pc/components/widget/widget_center/enum';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage/storage';
import { expandWidgetCenter } from '../../widget_center/widget_center';
import { useJudgeReachInstalledCount } from '../hooks/use_judge_reach_installed_count';
import { WidgetPanelList } from './widget_panel_list';
import { WrapperTooltip } from './wrapper_tooltip';
import styles from './style.module.less';

const ReactIconAdd = () => {
  const colors = useThemeColors();
  return <AddOutlined size={16} color={colors.black[500]} />;
};

export const installedWidgetHandle = (widgetId: string, isFocus = true) => {
  const widgetDom = document.querySelector(`div[data-widget-id=${widgetId}]`);
  if (!widgetDom) {
    return;
  }
  widgetDom.scrollIntoView({ block: 'nearest' });
  isFocus && (widgetDom as HTMLDivElement).classList.add(styles.newInstalledWidget);
  isFocus && (widgetDom as HTMLDivElement).focus();
};

export const WidgetPanelHeader = (props: { onClosePanel: () => void | Promise<void> }) => {
  const colors = useThemeColors();
  const triggerRef = useRef<any>(null);
  const [openPanelList, setOpenPanelList] = useState(false);
  const { datasheetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const activeWidgetPanel = useAppSelector((state) => {
    const resourceId = mirrorId || datasheetId;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    return Selectors.getResourceActiveWidgetPanel(state, resourceId!, resourceType);
  })!;
  const spaceId = useAppSelector((state) => state.space.activeId);
  const { embedId, shareId, templateId } = useAppSelector((state) => state.pageParams);
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const embedHidden = embedId && embedInfo && embedInfo.permissionType !== PermissionType.PRIVATEEDIT;
  const hiddenAddButton = shareId || templateId || embedHidden;
  const activePanelName = activeWidgetPanel!.name;

  const reachLimitInstalledCount = useJudgeReachInstalledCount();

  useEffect(() => {
    const widgetPanelStatusMap = getStorage(StorageName.WidgetPanelStatusMap)!;
    if (!widgetPanelStatusMap) {
      return;
    }
    const storageId = mirrorId || datasheetId;
    const status = widgetPanelStatusMap[`${spaceId},${storageId}`];
    setStorage(StorageName.WidgetPanelStatusMap, {
      [`${spaceId},${storageId}`]: {
        width: status ? status.width : 200,
        opening: true,
        activePanelId: activeWidgetPanel.id,
      },
    });
  }, [activeWidgetPanel, datasheetId, spaceId, mirrorId]);

  const openWidgetCenter = () => {
    expandWidgetCenter(InstallPosition.WidgetPanel, { installedWidgetHandle });
  };

  const onMenuVisibleChange = (status: boolean) => {
    setOpenPanelList(status);
  };

  return (
    <div className={styles.panelHeader}>
      {/* Display on pc side */}
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <WrapperTooltip wrapper tip={reachLimitInstalledCount ? t(Strings.reach_limit_installed_widget) : t(Strings.add_widget)}>
          <IconButton
            component={'button'}
            onClick={openWidgetCenter}
            disabled={reachLimitInstalledCount || Boolean(hiddenAddButton)}
            icon={ReactIconAdd}
          />
        </WrapperTooltip>
        <RcTrigger
          action={'click'}
          popup={<WidgetPanelList />}
          destroyPopupOnHide
          popupAlign={{
            points: ['tc', 'bc'],
            offset: [-70, 0],
            overflow: { adjustX: true, adjustY: true },
          }}
          popupStyle={{ width: 400 }}
          ref={triggerRef}
          popupVisible={openPanelList}
          onPopupVisibleChange={onMenuVisibleChange}
          zIndex={12}
        >
          <span
            onClick={() => {
              setOpenPanelList(true);
            }}
            className={styles.triggerContainer}
          >
            {activePanelName}
            <span
              style={{
                transform: openPanelList ? 'rotate(180deg)' : '',
                verticalAlign: '-0.125em',
              }}
            >
              <ChevronDownOutlined size={16} color={colors.thirdLevelText} />
            </span>
          </span>
        </RcTrigger>
        <IconButton onClick={props.onClosePanel} icon={CloseOutlined} />
      </ComponentDisplay>
      {/** Mobile */}
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.navBar}>
          <IconButton
            className={styles.closeButton}
            onClick={props.onClosePanel}
            icon={() => <ChevronLeftOutlined color={colors.firstLevelText} />}
          />
          <span
            onClick={() => {
              setOpenPanelList(true);
            }}
            className={styles.triggerContainer}
          >
            {activePanelName}
            <span
              style={{
                transform: openPanelList ? 'rotate(180deg)' : '',
                verticalAlign: '-0.125em',
              }}
            >
              <ChevronDownOutlined size={16} color={colors.thirdLevelText} />
            </span>
          </span>
        </div>
        <Popup className={styles.mobilePanelList} visible={openPanelList} height={'90vh'} onClose={() => setOpenPanelList(false)}>
          <WidgetPanelList onClickItem={() => setOpenPanelList(false)} />
        </Popup>
      </ComponentDisplay>
    </div>
  );
};
