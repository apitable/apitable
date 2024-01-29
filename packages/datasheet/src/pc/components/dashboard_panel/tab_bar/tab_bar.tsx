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

import { useFullscreen, useSize } from 'ahooks';
import RcTrigger from 'rc-trigger';
import { default as React, useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { TextButton, useThemeColors } from '@apitable/components';
import { ConfigConstant, PermissionType, ResourceType, Selectors, Strings, t } from '@apitable/core';
import { AddFilled, AddOutlined, ExpandOutlined, ImportOutlined, ListOutlined, NarrowOutlined } from '@apitable/icons';
import { InlineNodeName } from 'pc/components/common/inline_node_name';
import { NodeInfoBar } from 'pc/components/common/node_info_bar';
import { NetworkStatus } from 'pc/components/network_status';
import { CollaboratorStatus } from 'pc/components/tab_bar/collaboration_status';
import { expandWidgetCenter, InstallPosition } from 'pc/components/widget/widget_center';
import { WrapperTooltip } from 'pc/components/widget/widget_panel/widget_panel_header';
import { usePrevious, useQuery, useSideBarVisible } from 'pc/hooks';
import { useNetwork } from 'pc/hooks/use_network';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { isDingtalkSkuPage } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

interface ITabBarProps {
  dashboardId: string;
  containerRef: React.RefObject<HTMLDivElement>;
  setVisibleRecommend: React.Dispatch<React.SetStateAction<boolean>>;
  visibleRecommend: boolean;
  canImportWidget: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;

  installedWidgetHandle(widgetId: string): void;

  reachInstalledLimit: boolean;
  readonly?: boolean;
  isMobile?: boolean;
}

const Menu: React.FC<
  React.PropsWithChildren<
    Pick<ITabBarProps, 'setVisibleRecommend'> & {
      triggerRef: React.MutableRefObject<any>;
      openWidgetCenter: () => void;
    }
  >
> = ({ setVisibleRecommend, triggerRef, openWidgetCenter }) => {
  const { embedId } = useAppSelector((state) => state.pageParams);
  const colors = useThemeColors();
  return (
    <div className={styles.addWidgetMenu}>
      <div className={styles.menuItem} onClick={openWidgetCenter}>
        <AddOutlined size={16} color={colors.thirdLevelText} />
        {t(Strings.add_widget)}
      </div>
      {!embedId && (
        <div
          className={styles.menuItem}
          onClick={(e) => {
            setVisibleRecommend((status) => !status);
            triggerRef.current!.close(e);
          }}
        >
          <ImportOutlined size={15} color={colors.thirdLevelText} />
          {t(Strings.import_widget)}
        </div>
      )}
    </div>
  );
};

const SHOW_OPERATE_BUTTON = 700;

export const TabBar: React.FC<React.PropsWithChildren<ITabBarProps>> = (props) => {
  const {
    dashboardId,
    containerRef,
    setVisibleRecommend,
    readonly,
    isMobile,
    canImportWidget,
    visibleRecommend,
    installedWidgetHandle,
    setIsFullScreen,
    reachInstalledLimit,
  } = props;
  const colors = useThemeColors();
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(containerRef);
  const [openTrigger, setOpenTrigger] = useState(false);
  const triggerRef = useRef<any>();
  const { status } = useNetwork(true, dashboardId, ResourceType.Dashboard);
  const { templateId, shareId, embedId } = useAppSelector((state) => state.pageParams);
  const { dashboardName, role, dashboardIcon, nodeFavorite, nodePermissions } = useAppSelector((state) => {
    const dashboard = Selectors.getDashboard(state);
    return {
      dashboardName: dashboard?.name,
      role: dashboard?.role,
      dashboardIcon: dashboard?.icon,
      nodeFavorite: dashboard?.nodeFavorite,
      nodePermissions: dashboard?.permissions,
    };
  }, shallowEqual);
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const previousDashboardName = usePrevious(dashboardName);

  useEffect(() => {
    if (!previousDashboardName || !dashboardName) return;
    if (previousDashboardName === dashboardName) return;

    window.parent.postMessage(
      {
        message: 'changeNodeName',
        data: {
          roomId: dashboardId,
          nodeName: dashboardName,
        },
      },
      '*',
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardName, previousDashboardName]);

  const hideReadonlyEmbedItem = !!(embedInfo && embedInfo.permissionType === PermissionType.READONLY);
  const { setSideBarVisible } = useSideBarVisible();
  const toolbarRef = useRef(null);
  const size = useSize(toolbarRef);
  const linkId = templateId || shareId;
  const query = useQuery();
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage?.(purchaseToken);

  useEffect(() => {
    setIsFullScreen(isFullscreen);
  }, [isFullscreen, setIsFullScreen]);

  const triggerOnChange = (status: boolean) => {
    setOpenTrigger(status);
  };

  const openWidgetCenter = () => {
    if (visibleRecommend) {
      setVisibleRecommend(false);
    }
    expandWidgetCenter(InstallPosition.Dashboard, {
      closeModalCb: visibleRecommend
        ? () => {
          setVisibleRecommend(true);
        }
        : undefined,
      installedWidgetHandle,
    });
  };

  if (isMobile) {
    return (
      <div className={styles.mobileBar}>
        {!embedId ? (
          <div
            onClick={() => setSideBarVisible(true)}
            className={styles.side}
            style={{
              backgroundColor: isSkuPage ? colors.defaultBg : colors.primaryColor,
            }}
          >
            <ListOutlined size={20} color={colors.defaultBg} />
          </div>
        ) : (
          <span className={styles.ghost} />
        )}

        <InlineNodeName className={styles.nodeName} nodeId={dashboardId} nodeIcon={dashboardIcon} nodeName={dashboardName} />
        <span className={styles.ghost} />
      </div>
    );
  }

  const isEnoughToShowButton = size?.width && size?.width > SHOW_OPERATE_BUTTON;

  return (
    <div className={styles.tabBar} ref={toolbarRef}>
      <div className={styles.tabLeft}>
        {(!embedId || embedInfo.viewControl?.nodeInfoBar) && (
          <NodeInfoBar
            data={{
              nodeId: dashboardId,
              icon: dashboardIcon,
              name: dashboardName,
              type: ConfigConstant.NodeType.DASHBOARD,
              role: role === ConfigConstant.Role.Foreigner && !readonly ? ConfigConstant.Role.Editor : role,
              favoriteEnabled: nodeFavorite && !hideReadonlyEmbedItem,
              nameEditable: nodePermissions?.renamable && !hideReadonlyEmbedItem,
              iconEditable: nodePermissions?.iconEditable && !hideReadonlyEmbedItem,
            }}
            hiddenModule={{ favorite: Boolean(shareId || templateId) }}
            style={{ fontSize: '20px', fontWeight: 'bold', maxWidth: '256px' }}
          />
        )}
      </div>
      <div className={styles.tabRight}>
        {!isFullscreen && !isMobile && canImportWidget && isEnoughToShowButton && !hideReadonlyEmbedItem && (
          <RcTrigger
            action={'click'}
            popup={<Menu setVisibleRecommend={setVisibleRecommend} triggerRef={triggerRef} openWidgetCenter={openWidgetCenter} />}
            destroyPopupOnHide
            popupAlign={{
              points: ['tl', 'bl'],
              offset: [0, 8],
              overflow: { adjustX: true, adjustY: true },
            }}
            popupStyle={{ width: 200 }}
            popupVisible={reachInstalledLimit ? false : openTrigger}
            onPopupVisibleChange={triggerOnChange}
            ref={triggerRef}
          >
            <WrapperTooltip wrapper={Boolean(reachInstalledLimit)} tip={t(Strings.reach_limit_installed_widget)}>
              <TextButton
                className={styles.atcButton}
                prefixIcon={<AddFilled size={16} color={openTrigger ? colors.primaryColor : colors.secondLevelText} />}
                onClick={() => {
                  setOpenTrigger(true);
                }}
                style={{
                  color: openTrigger ? colors.primaryColor : colors.secondLevelText,
                }}
                // size='small'
                disabled={reachInstalledLimit}
              >
                {t(Strings.add_widget)}
              </TextButton>
            </WrapperTooltip>
          </RcTrigger>
        )}
        {!isFullscreen &&
          !isMobile &&
          !canImportWidget &&
          isEnoughToShowButton &&
          !hideReadonlyEmbedItem &&
          (!embedId || embedInfo.viewControl?.toolBar.addWidgetBtn) && (
          <TextButton
            prefixIcon={<AddFilled size={16} className={styles.toolIcon} color={[colors.primaryColor, 'white']} />}
            onClick={() => {
              expandWidgetCenter(InstallPosition.Dashboard);
            }}
            disabled={Boolean(linkId)}
          >
            {t(Strings.add_widget)}
          </TextButton>
        )}
        {isEnoughToShowButton && (!embedId || embedInfo.viewControl?.toolBar.fullScreenBtn) && (
          <TextButton prefixIcon={isFullscreen ? <NarrowOutlined /> : <ExpandOutlined />} onClick={toggleFullscreen} className={styles.atcButton}>
            {isFullscreen ? t(Strings.collapse_full_screen) : t(Strings.full_screen)}
          </TextButton>
        )}
        {!isFullscreen && !readonly && isEnoughToShowButton && !embedId && (
          <a href={t(Strings.intro_dashboard)} target="_blank" className={styles.shareDoc} rel="noreferrer">
            {t(Strings.form_tour_desc)}
          </a>
        )}
        {!isFullscreen && !templateId && (!embedId || embedInfo.viewControl?.collaboratorStatusBar) && (
          <div className={styles.status}>
            {!hideReadonlyEmbedItem && (
              <CollaboratorStatus resourceId={dashboardId!} resourceType={ResourceType.Dashboard} style={{ width: '110px' }} />
            )}

            <NetworkStatus currentStatus={status} />
          </div>
        )}
      </div>
    </div>
  );
};
