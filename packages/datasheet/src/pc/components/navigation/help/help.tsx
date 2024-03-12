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

import classnames from 'classnames';
import RcTrigger from 'rc-trigger';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, useThemeColors } from '@apitable/components';
import { isPrivateDeployment, NAV_ID, StoreActions, Strings, t } from '@apitable/core';
import {
  AdviseOutlined,
  CodeFilled,
  CommentOutlined,
  DownloadOutlined,
  KeyboardOutlined,
  QuestionCircleOutlined,
  RoadmapOutlined,
  TimeOutlined,
  WebOutlined,
  UserGroupOutlined,
} from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { ContextmenuItem, MobileContextMenu, Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { useResponsive } from 'pc/hooks';
import { useContactUs } from 'pc/hooks/use_contact_us';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { inSocialApp } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export interface IHelpProps {
  className?: string;
  templateActived: boolean;
}

export const Help: FC<React.PropsWithChildren<IHelpProps>> = ({ className, templateActived }) => {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const contactUs = useContactUs();
  const openShortcutKeyPanel = () => {
    dispatch(StoreActions.setShortcutKeyPanelVisible(true));
  };

  const menuData = [
    {
      icon: <WebOutlined />,
      text: t(Strings.official_website_without_abbr),
      onClick: () => navigationToUrl(getEnvVariables().HELP_MENU_OFFICIAL_WEBSITE_URL),
      hidden: !getEnvVariables().HELP_MENU_OFFICIAL_WEBSITE_URL,
    },
    {
      icon: <QuestionCircleOutlined />,
      text: t(Strings.help_center),
      onClick: () => navigationToUrl(t(Strings.help_help_center_url)),
    },
    {
      icon: <CodeFilled />,
      text: t(Strings.api_sdk),
      onClick: () => navigationToUrl(getEnvVariables().HELP_MENU_DEVELOPERS_CENTER_URL),
      hidden: !getEnvVariables().HELP_MENU_DEVELOPERS_CENTER_URL,
    },
    {
      icon: <DownloadOutlined />,
      text: t(Strings.download_client),
      onClick: () => navigationToUrl(`${window.location.origin}/download/`),
      hidden: isMobile || inSocialApp?.() || isPrivateDeployment() || getEnvVariables().IS_SELFHOST || getEnvVariables().IS_APITABLE,
    },
    {
      icon: <RoadmapOutlined color={colors.thirdLevelText} size={16} />,
      text: t(Strings.product_roadmap),
      onClick: () => navigationToUrl(getEnvVariables().HELP_MENU_PRODUCT_ROADMAP_URL),
      hidden: isMobile || !getEnvVariables().HELP_MENU_PRODUCT_ROADMAP_URL,
    },
    {
      icon: <TimeOutlined color={colors.thirdLevelText} size={16} />,
      text: t(Strings.subscribe_demonstrate),
      onClick: () => navigationToUrl(getEnvVariables().HELP_MENU_SUBSCRIBE_DEMONSTRATE_FORM_URL),
      hidden: isMobile || !getEnvVariables().HELP_MENU_SUBSCRIBE_DEMONSTRATE_FORM_URL,
    },
    {
      icon: <CommentOutlined />,
      text: t(Strings.player_contact_us),
      onClick: () => {
        contactUs();
      },
      hidden: isMobile || isPrivateDeployment(),
    },
    {
      icon: <AdviseOutlined />,
      text: t(Strings.vomit_a_slot),
      onClick: () => {
        navigationToUrl(getEnvVariables().USER_FEEDBACK_FORM_URL);
      },
      hidden: isPrivateDeployment(),
    },
    {
      icon: <KeyboardOutlined />,
      text: t(Strings.keybinding_show_keyboard_shortcuts_panel),
      id: NAV_ID.HELP_MENU_SHORTCUT_PANEL,
      onClick: openShortcutKeyPanel,
      hidden: isMobile,
    },
    {
      icon: <UserGroupOutlined color={colors.thirdLevelText} />,
      text: t(Strings.help_partner_program),
      id: NAV_ID.USER_PARTNER_PROGRAM,
      onClick: () => navigationToUrl(`${window.location.origin}/partners/`),
      hidden: !(getEnvVariables().IS_APITABLE && getEnvVariables().IS_ENTERPRISE) || getEnvVariables().IS_SELFHOST,
    },
  ];

  // Return menu data for mobile
  const getMobileMenuData = () => {
    return [menuData.filter((v) => v)];
  };

  const HelpBtn = () => {
    const handleClick = () => {
      setVisible(!visible);
    };
    return (
      <div
        className={classnames(styles.helpBtn, className, { [styles.active]: visible, [styles.templateActived]: templateActived })}
        onClick={handleClick}
      >
        <QuestionCircleOutlined size={24} color={colors.secondLevelText} />
      </div>
    );
  };

  const ContextmenuList: FC<React.PropsWithChildren<{ menuItems: any[] }>> = ({ menuItems }) => {
    return (
      <>
        {menuItems.map((item) => (
          <ContextmenuItem
            key={item.text}
            className={styles.menuItem}
            {...item}
            name={item.text}
            onClick={(e) => {
              setVisible(false);
              item.onClick && item.onClick(e);
            }}
          />
        ))}
      </>
    );
  };

  const visibleIndexList = menuData.reduce((prev, cur, index) => {
    if (!cur.hidden) {
      prev.push(index);
    }
    return prev;
  }, [] as number[]);
  const middleIndex = visibleIndexList[Math.ceil(visibleIndexList.length / 2) - 1];

  const HelpMenu = () => {
    return (
      <div className={styles.helpMenu}>
        <Typography className={styles.title} variant="h8" color={colors.fc1}>
          {t(Strings.help)}
        </Typography>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <ContextmenuList menuItems={menuData.slice(0, middleIndex + 1)} />
          </div>
          <div className={styles.dividerWrapper}>
            <div className={styles.divider} />
          </div>
          <div className={styles.right}>
            <ContextmenuList menuItems={menuData.slice(middleIndex + 1)} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <RcTrigger
          action="click"
          popup={<HelpMenu />}
          destroyPopupOnHide
          popupAlign={{
            points: ['bl', 'br'],
            offset: [12, 0],
          }}
          popupStyle={{ width: 'fit-content' }}
          popupVisible={visible}
          onPopupVisibleChange={(visible) => setVisible(visible)}
          zIndex={1000}
        >
          <Tooltip title={t(Strings.help)} placement="right">
            <div>
              <HelpBtn />
            </div>
          </Tooltip>
        </RcTrigger>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <HelpBtn />
        <MobileContextMenu title={t(Strings.help)} data={getMobileMenuData()} height="auto" visible={visible} onClose={() => setVisible(false)} />
      </ComponentDisplay>
    </>
  );
};
