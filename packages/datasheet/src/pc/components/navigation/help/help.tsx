/* eslint-disable no-script-url */
import { Tooltip, Typography, useThemeColors } from '@apitable/components';
import { ConfigConstant, isPrivateDeployment, NAV_ID, Navigation, StoreActions, Strings, t } from '@apitable/core';
import {
  AdviseOutlined, BookOutlined, ClassroomOutlined, CodeFilled, CommunityOutlined, CourseOutlined, DemoOutlined, DownloadOutlined,
  EditDescribeOutlined, GuideOutlined, InformationLargeOutlined, InformationSmallOutlined, JoinOutlined, KeyboardShortcutsOutlined, RoadmapOutlined,
  SolutionOutlined, ViewContactOutlined, VikabyOutlined, WebsiteOutlined,
} from '@apitable/icons';
import classnames from 'classnames';
// @ts-ignore
import { openVikaby, VIKABY_POSITION_SESSION_KEY } from 'enterprise';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { ContextmenuItem, MobileContextMenu } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { inSocialApp } from 'pc/components/home/social_platform';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive } from 'pc/hooks';
import { getEnvVariables, isHiddenQRCode, isMobileApp } from 'pc/utils/env';
import RcTrigger from 'rc-trigger';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntercom } from 'react-use-intercom';
import styles from './style.module.less';

export interface IHelpProps {
  className?: string;
  templateActived: boolean;
}

export const Help: FC<IHelpProps> = ({ className, templateActived }) => {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const spaceId = useSelector(state => state.space.activeId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isFeishu = inSocialApp(ConfigConstant.SocialType.FEISHU);
  const env = getEnvVariables();

  const { showMessages } = useIntercom();
  const openShortcutKeyPanel = () => {
    dispatch(StoreActions.setShortcutKeyPanelVisible(true));
  };

  const vikabyHelperClick = () => {
    const pathname = window.location.pathname;
    sessionStorage.removeItem(VIKABY_POSITION_SESSION_KEY);
    if (pathname.includes('workbench')) {
      openVikaby({ visible: true, defaultExpandMenu: true });
    } else {
      localStorage.removeItem('vikaby_closed');
      Router.push(Navigation.WORKBENCH, { params: { spaceId }});
    }
  };

  const startGuideClick = () => {
    dispatch(StoreActions.clearWizardsData());
    TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.FUNCTION_GUIDANCE);
  };

  const linkToCommunity = () => {
    navigationToUrl(env.HELP_USER_COMMUNITY_URL_PROD!);
  };
  const menuData = [
    [
      {
        icon: <SolutionOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.solution),
        onClick: () => navigationToUrl(getEnvVariables().HELP_MENU_SOLUTION_URL),
        hidden: isMobile || isPrivateDeployment(),
      },
      {
        icon: <ClassroomOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.help_video_tutorials),
        onClick: () => navigationToUrl(env.HELP_MENU_VIDEO_TUTORIALS_URL!),
        hidden: isMobile || !env.HELP_MENU_VIDEO_TUTORIALS_URL,
      },
      {
        icon: <RoadmapOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.product_roadmap),
        onClick: () => navigationToUrl(getEnvVariables().HELP_MENU_PRODUCT_ROADMAP_URL),
        hidden: isMobile || isPrivateDeployment(),
      },
      {
        icon: <JoinOutlined />,
        text: t(Strings.join_the_community),
        onClick: () => navigationToUrl(isFeishu ? `${window.location.origin}/feishu/` : `${window.location.origin}/chatgroup/`),
        hidden: isPrivateDeployment(),
      },
      {
        icon: <GuideOutlined />,
        text: t(Strings.function_guidance),
        onClick: startGuideClick,
        hidden: isMobile,
      },
      {
        icon: <CourseOutlined />,
        text: t(Strings.quick_tour),
        onClick: () => navigationToUrl(t(Strings.help_quick_start_url)),
      },
      {
        icon: <AdviseOutlined />,
        text: t(Strings.vomit_a_slot),
        onClick: () => navigationToUrl(getEnvVariables().USER_FEEDBACK_FORM_URL),
        hidden: isPrivateDeployment(),
      },
      {
        icon: <DemoOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.subscribe_demonstrate),
        onClick: () => navigationToUrl(getEnvVariables().HELP_MENU_SUBSCRIBE_DEMONSTRATE_FORM_URL),
        hidden: isMobile || isPrivateDeployment(),
      },
      {
        icon: <VikabyOutlined color={colors.thirdLevelText} />,
        text: t(Strings.assistant),
        id: NAV_ID.HELP_MENU_BEGINNER_GUIDE,
        onClick: vikabyHelperClick,
        hidden: isMobile || isPrivateDeployment() || isMobileApp(),
      },
    ],
    [
      {
        icon: <CommunityOutlined />,
        text: t(Strings.help_user_community),
        onClick: linkToCommunity,
        hidden: !env.HELP_USER_COMMUNITY_URL_PROD
      },
      {
        icon: <InformationSmallOutlined />,
        text: t(Strings.help_center),
        onClick: () => navigationToUrl(t(Strings.help_help_center_url)),
      },
      {
        icon: <BookOutlined />,
        text: t(Strings.handbook),
        onClick: () => navigationToUrl(t(Strings.help_product_manual_url)),
      },
      {
        icon: <EditDescribeOutlined />,
        text: t(Strings.faq),
        onClick: () => navigationToUrl(t(Strings.help_questions_url)),
      },
      {
        icon: <WebsiteOutlined />,
        text: t(Strings.official_website_without_abbr),
        onClick: () => navigationToUrl(`${window.location.origin}/?home=1`),
      },
      {
        icon: <CodeFilled />,
        text: t(Strings.api_sdk),
        onClick: () => navigationToUrl(isPrivateDeployment() ? `${window.location.origin}/help/developers` : getEnvVariables().HELP_MENU_DEVELOPERS_CENTER_URL),
      },
      {
        icon: <DownloadOutlined />,
        text: t(Strings.download_client),
        onClick: () => navigationToUrl(`${window.location.origin}/download/`),
        hidden: isMobile || inSocialApp() || isPrivateDeployment(),
      },
      {
        icon: <KeyboardShortcutsOutlined />,
        text: t(Strings.keybinding_show_keyboard_shortcuts_panel),
        id: NAV_ID.HELP_MENU_SHORTCUT_PANEL,
        onClick: openShortcutKeyPanel,
        hidden: isMobile,
      },
      {
        icon: <ViewContactOutlined />,
        text: t(Strings.player_contact_us),
        onClick: () => {
          if (isHiddenQRCode()) {
            showMessages();
          } else {
            dispatch(StoreActions.clearWizardsData());
            localStorage.setItem('vika_guide_start', 'vikaby');
            TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.CONTACT_US_GUIDE);
          }
        },
        hidden: isMobile || isPrivateDeployment(),
      },
    ],
  ];

  // Return menu data for mobile
  const getMobileMenuData = () => {
    return [
      menuData[0]
        .reduce((prev, value, index) => {
          prev.push(value, menuData[1][index]);
          return prev;
        }, [] as any[])
        .filter(v => v),
    ];
  };

  const HelpBtn = () => {
    const handleClick = e => {
      setVisible(!visible);
    };
    return (
      <div
        className={classnames(styles.helpBtn, className, { [styles.active]: visible, [styles.templateActived]: templateActived })}
        onClick={handleClick}
      >
        <InformationLargeOutlined size={24} color={colors.secondLevelText} />
      </div>
    );
  };

  const ContextmenuList: FC<{ menuItems: any[] }> = ({ menuItems }) => {
    return (
      <>
        {menuItems.map(item => (
          <ContextmenuItem
            key={item.text}
            className={styles.menuItem}
            data-sensors-click
            {...item}
            name={item.text}
            onClick={e => {
              setVisible(false);
              item.onClick && item.onClick(e);
            }}
          />
        ))}
      </>
    );
  };

  const HelpMenu = () => {
    return (
      <div className={styles.helpMenu}>
        <Typography className={styles.title} variant='h8' color={colors.fc1}>
          {t(Strings.help)}
        </Typography>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <ContextmenuList menuItems={menuData[0]} />
          </div>
          <div className={styles.dividerWrapper}>
            <div className={styles.divider} />
          </div>
          <div className={styles.right}>
            <ContextmenuList menuItems={menuData[1]} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <RcTrigger
          action='click'
          popup={<HelpMenu />}
          destroyPopupOnHide
          popupAlign={{
            points: ['bl', 'br'],
            offset: [12, 0],
          }}
          popupStyle={{ width: 'fit-content' }}
          popupVisible={visible}
          onPopupVisibleChange={visible => setVisible(visible)}
          zIndex={1000}
        >
          <Tooltip content={t(Strings.help)}>
            <div>
              <HelpBtn />
            </div>
          </Tooltip>
        </RcTrigger>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <HelpBtn />
        <MobileContextMenu title={t(Strings.help)} data={getMobileMenuData()} height='auto' visible={visible} onClose={() => setVisible(false)} />
      </ComponentDisplay>
    </>
  );
};
