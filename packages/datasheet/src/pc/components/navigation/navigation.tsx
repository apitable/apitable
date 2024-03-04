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

import { useToggle } from 'ahooks';
import { Badge } from 'antd';
import classNames from 'classnames';
import { AnimationItem } from 'lottie-web/index';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { Events, IReduxState, NAV_ID, Player, Settings, StoreActions, Strings, t } from '@apitable/core';
import {
  ChevronDownOutlined,
  NotificationOutlined,
  PlanetOutlined,
  SearchOutlined,
  Setting2Outlined,
  UserGroupOutlined,
  WorkbenchOutlined,
  LivechatFilled,
} from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
// eslint-disable-next-line no-restricted-imports
import { Avatar, AvatarSize, AvatarType, Message, Tooltip } from 'pc/components/common';
import {
  IDingTalkModalType,
  showModalInDingTalk,
  showModalInFeiShu,
  showModalInWecom,
  UpgradeInDDContent,
  UpgradeInFeiShuContent,
  UpgradeInWecomContent,
} from 'pc/components/economy/upgrade_modal';
import { Notification } from 'pc/components/notification';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useNotificationRequest, useRequest, useResponsive } from 'pc/hooks';
import { useContactUs } from 'pc/hooks/use_contact_us';
import { useAppSelector } from 'pc/store/react-redux';
import { isMobileApp, getEnvVariables, isHiddenLivechat } from 'pc/utils/env';
import AnimationJson from 'static/json/notification_new.json';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { Popup } from '../common/mobile/popup';
import { openEruda } from '../development/dev_tools_panel';
import { expandSearch } from '../quick_search';
import { CreateSpaceModal } from './create_space_modal';
import { Help } from './help';
import { NavigationContext } from './navigation_context';
import { SpaceListDrawer } from './space_list_drawer';
import { UpgradeBtn } from './upgrade_btn';
import { User } from './user';
// @ts-ignore
import { inSocialApp, isSocialDingTalk, isSocialFeiShu, isSocialWecom } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

enum NavKey {
  SpaceManagement = 'management',
  Org = 'org',
  Workbench = 'workbench',
  Template = 'template',
}

export const Navigation: FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const [spaceListDrawerVisible, { toggle: toggleSpaceListDrawerVisible, set: setSpaceListDrawerVisible }] = useToggle(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [notice, { toggle: toggleNotice, set: setNotice }] = useToggle(false);
  const [upgradePopup, { set: setUpgradePopup }] = useToggle(false);
  const dispatch = useDispatch();
  const { user, space, unReadCount, newNoticeListFromWs } = useAppSelector(
    (state: IReduxState) => ({
      user: state.user.info,
      space: state.space.curSpaceInfo,
      unReadCount: state.notification.unReadCount,
      newNoticeListFromWs: state.notification.newNoticeListFromWs,
      spaceInfo: state.space.curSpaceInfo,
    }),
    shallowEqual,
  );
  const { notificationStatistics } = useNotificationRequest();
  // const location = useLocation();
  const router = useRouter();
  const search = location.search;
  const [unReadMsgCount, setUnReadMsgCount] = useState(0);
  const [noticeIcon, { set: setNoticeIcon }] = useToggle(true);
  const lottieAnimate = useRef<AnimationItem>();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [clickCount, setClickCount] = useState(0);
  const contactUs = useContactUs();
  const env = getEnvVariables();
  const sidebarCustomButtonList = React.useMemo(() => {
    const list = env.SIDEBAR_CUSTOM_BUTTON_LIST;
    if (!list) {
      return [];
    } 
    return JSON.parse(list);
    
  }, []);
  useRequest(notificationStatistics);

  useEffect(() => {
    const eventBundle = new Map([
      [
        ShortcutActionName.SearchNode,
        () => {
          expandSearch();
        },
      ],
    ]);

    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });
  // Listen to the message pushed by ws and change the number displayed on the icon
  useEffect(() => {
    if (notice) {
      return;
    }
    if (newNoticeListFromWs.length === 0) {
      setUnReadMsgCount(unReadCount);
    } else {
      setUnReadMsgCount(unReadCount + newNoticeListFromWs.length);
      if (!window.location.pathname.includes('notify')) {
        renderLottie();
      }
    }

    // eslint-disable-next-line
  }, [newNoticeListFromWs, unReadCount]);

  useEffect(() => {
    if (notice) {
      setUnReadMsgCount(0);
    }
  }, [notice]);

  useEffect(() => {
    if (clickCount >= 5 && clickCount < 10) {
      Message.info({ content: t(Strings.dev_tools_opening_tip, { count: 10 - clickCount }) });
    }
    if (clickCount === 10) {
      openEruda();
    }
  }, [clickCount]);

  useEffect(() => {
    setClickCount(0);
  }, []);

  const destroyLottie = useCallback(() => {
    setNoticeIcon(true);
    if (lottieAnimate.current) {
      lottieAnimate.current.destroy();
    }
  }, [setNoticeIcon]);
  const renderLottie = () => {
    const noticeEle = document.querySelector('#' + NAV_ID.ICON_NOTIFICATION)!;
    if (!isMobile && noticeEle && !noticeEle.hasChildNodes()) {
      import('lottie-web/build/player/lottie_svg').then((module) => {
        const lottie = module.default;
        lottieAnimate.current = lottie.loadAnimation({
          container: noticeEle,
          renderer: 'svg',
          loop: 2,
          autoplay: true,
          animationData: AnimationJson,
        });
        lottieAnimate.current.addEventListener('DOMLoaded', () => {
          setNoticeIcon(false);
        });
        lottieAnimate.current.addEventListener('complete', destroyLottie);
      });
    }
  };

  const lastTime = useRef(Date.now());

  const throttleClickCount = () => {
    const now = Date.now();
    if (now - lastTime.current < 1000) {
      setClickCount(clickCount + 1);
    }
    lastTime.current = now;
  };

  const hiddenUserMenu = () => {
    throttleClickCount();
    showUserMenu && setShowUserMenu(false);
    notice && setNotice(false);
    showHelpCenter && setShowHelpCenter(false);
  };

  const openSpaceMenu = () => {
    hiddenUserMenu();
    toggleSpaceListDrawerVisible();
  };
  const noticeIconClick = useCallback(() => {
    isMobile && toggleNotice();
    dispatch(StoreActions.getNewMsgFromWsAndLook(false));
    destroyLottie();
  }, [destroyLottie, dispatch, isMobile, toggleNotice]);
  const navList = Player.applyFilters(Events.get_nav_list, [
    {
      routeAddress: '/workbench' + search,
      icon: WorkbenchOutlined,
      text: t(Strings.nav_workbench),
      key: NavKey.Workbench,
      domId: NAV_ID.ICON_WORKBENCH,
    },
    {
      routeAddress: '/org' + search,
      icon: UserGroupOutlined,
      text: t(Strings.nav_team),
      key: NavKey.Org,
      domId: NAV_ID.ICON_ADDRESS,
    },
    {
      routeAddress: '/template' + search,
      icon: PlanetOutlined,
      text: t(Strings.nav_templates),
      key: NavKey.Template,
      domId: NAV_ID.ICON_TEMPLATE,
    },
    {
      routeAddress: '/management' + search,
      icon: Setting2Outlined,
      text: t(Strings.nav_space_settings),
      key: NavKey.SpaceManagement,
      domId: NAV_ID.ICON_SPACE_MANAGE,
    },
  ]);

  const NotificationNav = React.useMemo((): React.ReactElement => {
    const dom = (
      <Badge
        count={unReadMsgCount}
        overflowCount={99}
        className={classNames(styles.notificationIcon, {
          [styles.navActiveItem]: notice,
        })}
      >
        <span style={{ visibility: noticeIcon ? 'visible' : 'hidden' }}>
          <NotificationOutlined className={classNames(styles.notice, styles.navIcon)} />
        </span>
      </Badge>
    );
    return (
      <>
        <ComponentDisplay minWidthCompatible={ScreenSize.md}>
          <Link href={'/notify' + search}>
            <a
              onClick={noticeIconClick}
              className={classNames(styles.notificationNavLink, {
                [styles.navActiveItem]: router.pathname.includes('notify'),
              })}
            >
              {dom}
            </a>
          </Link>
        </ComponentDisplay>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <div onClick={noticeIconClick} className={styles.notificationNavLink}>
            {dom}
          </div>
        </ComponentDisplay>
      </>
    );
  }, [notice, noticeIcon, unReadMsgCount, noticeIconClick, search, router.pathname]);

  useEffect(() => {
    if (!isHiddenLivechat() || isMobile) {
      return;
    }
    !!router.pathname.includes('workbench') && window.LiveChatWidget?.call('hide');
  }, [router.pathname, isMobile]);

  const onNoticeClose = () => {
    setNotice(false);
    setUnReadMsgCount(0);
  };

  const templateActive = window.location.pathname.includes('template');

  const isDingTalkSpace = isSocialDingTalk?.(space);
  const isFeiShuSpace = isSocialFeiShu?.(space);
  const isWecomSpace = isSocialWecom?.(space);

  const handleClickUpgradeBtn = () => {
    // Dingtalk: Click the upgrade button on the left side.
    // Upgrade pop-up window pops up (different pop-up components used for mobile and PC).
    // Click on the pop-up to jump to the app details page (let the user go to pay)
    if (isDingTalkSpace) {
      isMobile ? setUpgradePopup(true) : showModalInDingTalk(IDingTalkModalType.Upgrade);
    }
    // Feishu:
    //   mobile：Click on the upgrade button on the left, the pop-up prompt: "Go to the PC side to buy"
    //   PC：
    //     Administrator: open the application detail page directly (let users pay)
    //     Non-administrator: pop-up prompt: "Go to administrator"
    else if (isFeiShuSpace) {
      if (isMobile) {
        setUpgradePopup(true);
      } else {
        if (user?.isAdmin) {
          navigationToUrl(Settings.integration_feishu_upgrade_url.value);
        } else {
          showModalInFeiShu();
        }
      }
    } else if (isWecomSpace) {
      isMobile ? setUpgradePopup(true) : showModalInWecom();
    }
  };

  if (!user) {
    return <></>;
  }
  return (
    <NavigationContext.Provider
      value={{
        openCreateSpaceModal: () => setShowCreateModal(true),
        closeSpaceListDrawer: () => setSpaceListDrawerVisible(false),
      }}
    >
      <div className={classNames(styles.navigation, templateActive && styles.templateActived, notice && styles.noticeOpend)}>
        <div className={styles.spaceLogo} onClick={openSpaceMenu}>
          <div className={styles.spaceImg}>
            <Avatar type={AvatarType.Space} title={user!.spaceName} id={user!.spaceId} src={user!.spaceLogo} size={AvatarSize.Size32} />
          </div>
          <div className={styles.spaceDown}>
            <Tooltip title={t(Strings.workspace_list)} placement="bottom">
              <div>
                <ChevronDownOutlined className={styles.spaceIcon} />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className={styles.navWrapper} onClick={hiddenUserMenu}>
          {navList.map((item: any) => {
            if (item.component) {
              return item.component();
            }
            if (user && !user!.isAdmin && item.key === NavKey.SpaceManagement) {
              return null;
            }
            if (user && user.isDelSpace && item.key !== NavKey.SpaceManagement) {
              return null;
            }

            let NavIcon = item.icon;
            if (typeof item.icon === 'string') {
              NavIcon = WorkbenchOutlined;
            }
            const isActive = router.pathname.split('/')[1] === item.key;
            const NavItem = (): React.ReactElement => (
              <Link href={item.routeAddress}>
                <a
                  id={item.domId}
                  className={classNames(styles.navItem, {
                    [styles.navActiveItem]: isActive,
                    [styles.templateActiveItem]: router.pathname.includes('template') && item.routeAddress.includes('template'),
                  })}
                >
                  <NavIcon className={styles.navIcon} />
                </a>
                {/* {item.icon} */}
              </Link>
            );

            return (
              <div key={item.key}>
                <Tooltip title={item.text} placement="right">
                  <span>{NavItem()}</span>
                </Tooltip>
              </div>
            );
          })}
          {(isDingTalkSpace || isFeiShuSpace || isWecomSpace) && <UpgradeBtn onClick={() => handleClickUpgradeBtn()} />}
          <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
            <Popup
              title={t(Strings.upgrade_guide)}
              open={upgradePopup}
              onClose={() => setUpgradePopup(false)}
              height={'500'}
              style={{ backgroundColor: colors.defaultBg }}
            >
              {isDingTalkSpace && <UpgradeInDDContent onClick={() => setUpgradePopup(false)} />}
              {isFeiShuSpace && <UpgradeInFeiShuContent content={t(Strings.lark_can_not_upgrade)} onClick={() => setUpgradePopup(false)} />}
              {isWecomSpace && <UpgradeInWecomContent onClick={() => setUpgradePopup(false)} />}
            </Popup>
          </ComponentDisplay>
        </div>
        {env.IS_ENTERPRISE && !env.IS_SELFHOST && (
          <Tooltip title={t(Strings.contact_us)} placement="right">
            <div className={styles.iconWrap} onClick={() => contactUs()}>
              <LivechatFilled className={styles.icon} size={32} />
            </div>
          </Tooltip>
        )}
        {sidebarCustomButtonList.map((item: any, index: number) => (
          <Tooltip title={item.tooltip} placement="right" key={index}>
            <a className={styles.iconWrap} href={item.link} target="_blank" rel="noreferrer">
              <img className={styles.img} src={item.icon} alt={item.link} />
            </a>
          </Tooltip>
        ))}
        <Tooltip title={t(Strings.quick_search_title)} placement="right">
          <div className={styles.iconWrap} onClick={() => expandSearch()}>
            <SearchOutlined className={styles.icon} size={24} />
          </div>
        </Tooltip>
        <Tooltip title={t(Strings.notification_center)} placement="right" key="notification_center">
          <span className={styles.notification}>
            {NotificationNav}
            <span id={NAV_ID.ICON_NOTIFICATION} className={styles.noticeAnimate} />
          </span>
        </Tooltip>
        {!inSocialApp?.() && !isMobileApp() && (
          <div className={styles.help}>
            <Help templateActived={templateActive} />
          </div>
        )}
        <div className={styles.userIcon}>
          <User />
        </div>
        {showCreateModal && <CreateSpaceModal isMobile={isMobile} setShowCreateModal={setShowCreateModal} />}
      </div>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup
          title={t(Strings.notification_center)}
          open={notice}
          onClose={onNoticeClose}
          height={'90%'}
          className={classNames(styles.drawer, styles.notificationDrawer)}
          style={{ backgroundColor: colors.defaultBg }}
          destroyOnClose
        >
          <Notification />
        </Popup>
      </ComponentDisplay>
      <SpaceListDrawer visible={spaceListDrawerVisible} onClose={setSpaceListDrawerVisible} />
    </NavigationContext.Provider>
  );
};
