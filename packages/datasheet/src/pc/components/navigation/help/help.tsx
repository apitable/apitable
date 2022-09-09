/* eslint-disable no-script-url */
import { FC, useState } from 'react';
import { t, Strings, StoreActions, Navigation, NAV_ID, ConfigConstant, Settings, isPrivateDeployment } from '@vikadata/core';
import { useDispatch, useSelector } from 'react-redux';
import { navigationToUrl, useNavigation } from 'pc/components/route_manager/use_navigation';
import { ContextmenuItem, MobileContextMenu } from 'pc/components/common';
import { useResponsive } from 'pc/hooks';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import RcTrigger from 'rc-trigger';
import styles from './style.module.less';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';
import { openVikaby, VIKABY_POSITION_SESSION_KEY } from 'pc/common/guide/vikaby';
import classnames from 'classnames';
import {
  CourseOutlined,
  VikabyOutlined,
  RoadmapOutlined,
  ClassroomOutlined,
  JoinOutlined,
  InformationLargeOutlined,
  AdviseOutlined,
  BookOutlined,
  InformationSmallOutlined,
  WebsiteOutlined,
  DownloadOutlined,
  CommunityOutlined,
  KeyboardShortcutsOutlined,
  GuideOutlined,
  EditDescribeOutlined,
  SolutionOutlined,
  DemoOutlined,
  CodeFilled,
  ViewContactOutlined,
} from '@vikadata/icons';
import { inSocialApp } from 'pc/components/home/social_platform';
import { Tooltip, Typography, useThemeColors } from '@vikadata/components';
import { isMobileApp } from 'pc/utils/env';

export interface IHelpProps {
  className?: string;
  templateActived: boolean;
}

export const Help: FC<IHelpProps> = ({ className, templateActived }) => {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigationTo = useNavigation();
  const spaceId = useSelector(state => state.space.activeId);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const isFeishu = inSocialApp(ConfigConstant.SocialType.FEISHU);

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
      navigationTo({ path: Navigation.WORKBENCH, params: { spaceId }});
    }
  };

  const startGuideClick = () => {
    dispatch(StoreActions.clearWizardsData());
    TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.FUNCTION_GUIDANCE);
  };

  const linkToCommunity = () => {
    navigationToUrl(Settings.vika_community_url_prod.value);
  };
  const menuData = [
    [
      {
        icon: <SolutionOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.solution),
        onClick: () => navigationToUrl(Settings['solution'].value),
        hidden: isMobile || isPrivateDeployment(),
      },
      {
        icon: <ClassroomOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.vika_small_classroom),
        onClick: () => navigationToUrl(Settings.vika_classroom_url.value),
        hidden: isMobile || isPrivateDeployment(),
      },
      {
        icon: <RoadmapOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.product_roadmap),
        onClick: () => navigationToUrl(Settings['product_roadmap'].value),
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
        onClick: () => navigationToUrl(`${window.location.origin}/help/tutorial-1-quick-start/`),
      },
      {
        icon: <AdviseOutlined />,
        text: t(Strings.vomit_a_slot),
        onClick: () => navigationToUrl(Settings['user_feedback_url'].value),
        hidden: isPrivateDeployment(),
      },
      {
        icon: <DemoOutlined color={colors.thirdLevelText} size={16} />,
        text: t(Strings.subscribe_demonstrate),
        onClick: () => navigationToUrl(Settings['subscribe_demonstrate'].value),
        hidden: isMobile || isPrivateDeployment(),
      },
      {
        icon: <VikabyOutlined color={colors.thirdLevelText} />,
        text: t(Strings.vikaby_helper),
        id: NAV_ID.HELP_MENU_BEGINNER_GUIDE,
        onClick: vikabyHelperClick,
        hidden: isMobile || isPrivateDeployment() || isMobileApp(),
      },
    ],
    [
      {
        icon: <CommunityOutlined />,
        text: t(Strings.vika_community),
        onClick: linkToCommunity,
        hidden: isPrivateDeployment(),
      },
      {
        icon: <InformationSmallOutlined />,
        text: t(Strings.help_center),
        onClick: () => navigationToUrl(`${window.location.origin}/help`),
      },
      {
        icon: <BookOutlined />,
        text: t(Strings.handbook),
        onClick: () => navigationToUrl(`${window.location.origin}/help/manual-1-what-is-vikadata/`),
      },
      {
        icon: <EditDescribeOutlined />,
        text: t(Strings.faq),
        onClick: () => navigationToUrl(`${window.location.origin}/help/questions/`),
      },
      {
        icon: <WebsiteOutlined />,
        text: t(Strings.official_website_without_abbr),
        onClick: () => navigationToUrl(`${window.location.origin}/?home=1`),
      },
      {
        icon: <CodeFilled />,
        text: t(Strings.api_sdk),
        onClick: () => navigationToUrl(isPrivateDeployment() ? `${window.location.origin}/help/developers` : Settings.developers_center_url.value),
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
          dispatch(StoreActions.clearWizardsData());
          localStorage.setItem('vika_guide_start', 'vikaby');
          TriggerCommands.open_guide_wizard(ConfigConstant.WizardIdConstant.CONTACT_US_GUIDE);
        },
        hidden: isMobile || isPrivateDeployment(),
      },
    ],
  ];

  // 返回移动端的菜单数据
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
        <Typography className={styles.title} variant="h8" color={colors.fc1}>
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
          action="click"
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
        <MobileContextMenu title={t(Strings.help)} data={getMobileMenuData()} height="auto" visible={visible} onClose={() => setVisible(false)} />
      </ComponentDisplay>
    </>
  );
};
