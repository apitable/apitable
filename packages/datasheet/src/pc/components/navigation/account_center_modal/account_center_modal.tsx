import { IconButton, useThemeColors } from '@apitable/components';
import { getCustomConfig, IReduxState, Strings, t, isPrivateDeployment } from '@apitable/core';
import { CloseLargeOutlined } from '@apitable/icons';
import { Drawer } from 'antd';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { isSocialWecom } from 'pc/components/home/social_platform';
import { usePlatform } from 'pc/hooks/use_platform';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import * as React from 'react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import IconSide from 'static/icon/miniprogram/nav/nav_icon_drawer.svg';
import { AccountManager } from './account_manager';
import { BasicSetting } from './basic_setting';
import { DeveloperConfiguration } from './developer_configuration';
import { ModifyPassword } from './modify_password';
import { Nav } from './nav';
import { PersonalizedSetting } from './personalized_setting';
import styles from './style.module.less';
import { TestFunction } from './test_function';
import { useResponsive } from 'pc/hooks';
// @ts-ignore
import { AccountWallet } from 'enterprise';

export enum AccountCenterModules {
  BasicSetting = 'BasicSetting',
  ModifyPassword = 'ModifyPassword',
  AccountWallet = 'AccountWallet',
  AccountManager = 'AccountManager',
  DeveloperConfiguration = 'DeveloperConfiguration',
  PersonalizedSetting = 'PersonalizedSetting',
  TestFunction = 'TestFunction',
}

export interface IAccountCenterModalProps {
  defaultActiveItem?: number;
  setShowAccountCenter: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccountCenterModal: FC<IAccountCenterModalProps> = props => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const colors = useThemeColors();
  const [activeItem, setActiveItem] = useState(props.defaultActiveItem || ((isPrivateDeployment() && isMobile) ? 1 : 0));
  const [showNav, setShowNav] = useState(false);
  const userInfo = useSelector((state: IReduxState) => state.user.info);
  const { socialLinkDisable, accountWalletDisable } = getCustomConfig();
  const env = getEnvVariables();

  const { mobile } = usePlatform();

  const closeModal = () => {
    props.setShowAccountCenter(false);
  };

  const listData = [
    {
      key: AccountCenterModules.BasicSetting,
      name: t(Strings.user_profile_setting),
      component: <BasicSetting />,
      hidden: isPrivateDeployment() && isMobile,
    },
    {
      key: AccountCenterModules.ModifyPassword,
      name: userInfo!.needPwd ? t(Strings.set_password) : t(Strings.change_password),
      component: <ModifyPassword setActiveItem={setActiveItem} />,
      // For accounts that are not bound to a cell phone or email address, the "Change Password" section of the user center is directly blocked
      hidden: !(userInfo?.email || userInfo?.mobile) || env.HIDDEN_USER_CHANGE_PASSWORD,
    },
    {
      key: AccountCenterModules.AccountWallet,
      name: t(Strings.account_wallet),
      component: <AccountWallet />,
      hidden: accountWalletDisable || isMobileApp(),
    },
    {
      key: AccountCenterModules.AccountManager,
      name: t(Strings.account_ass_manage),
      component: <AccountManager />,
      hidden: socialLinkDisable || mobile || isMobileApp() || isSocialWecom() || env.HIDDEN_ACCOUNT_LINK_MANAGER,
    },
    {
      key: AccountCenterModules.DeveloperConfiguration,
      name: t(Strings.developer_configuration),
      component: <DeveloperConfiguration setActiveItem={setActiveItem} />,
    },
    {
      key: AccountCenterModules.PersonalizedSetting,
      name: t(Strings.personalized_setting),
      component: <PersonalizedSetting />,
    },
    {
      key: AccountCenterModules.TestFunction,
      name: t(Strings.test_function),
      component: <TestFunction isUser />,
    },
  ];

  const CustomTitle = ({ title, onClose, onClickNav }) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div onClick={onClickNav} className={styles.side}>
          <IconSide width={20} height={20} fill={onClickNav ? colors.fc1 : colors.white} />
        </div>
        <span>{title}</span>
        <IconButton icon={CloseLargeOutlined} onClick={onClose} size="large" />
      </div>
    );
  };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Modal
          className={styles.accountCenter}
          title={t(Strings.user_setting)}
          footer={null}
          onCancel={closeModal}
          maskClosable
          width={'90%'}
          style={{ maxWidth: '1170px', minWidth: '800px' }}
          centered
          visible
        >
          <div className={styles.wrapper}>
            <div className={styles.accountCenterWrapper}>
              <div className={styles.left}>
                <Nav activeItem={activeItem} setActiveItem={setActiveItem} navlist={listData} />
              </div>
              <div className={styles.right}>{listData[activeItem].component}</div>
            </div>
          </div>
        </Modal>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Drawer
          title={
            <CustomTitle
              title={`${t(Strings.user_setting)} - ${listData[activeItem].name}`}
              onClose={closeModal}
              onClickNav={() => setShowNav(true)}
            />
          }
          height={'100%'}
          push={{
            distance: 0,
          }}
          visible
          maskClosable
          closable={false}
          placement="bottom"
          bodyStyle={{
            padding: 16,
          }}
        >
          {listData[activeItem].component}
          <Drawer
            visible={showNav}
            placement="left"
            closable={false}
            title={<CustomTitle title={listData[activeItem].name} onClose={() => setShowNav(false)} onClickNav={null} />}
            onClose={() => setShowNav(false)}
            bodyStyle={{
              padding: 16,
            }}
          >
            <Nav
              activeItem={activeItem}
              setActiveItem={index => {
                setActiveItem(index);
                setShowNav(false);
              }}
              navlist={listData}
            />
          </Drawer>
        </Drawer>
      </ComponentDisplay>
    </>
  );
};
