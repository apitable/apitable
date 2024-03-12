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

import { Drawer } from 'antd';
import { compact } from 'lodash';
import * as React from 'react';
import { FC, useState } from 'react';
import { IconButton, useThemeColors } from '@apitable/components';
import { getCustomConfig, IReduxState, isPrivateDeployment, Strings, t } from '@apitable/core';
import { CloseOutlined, ListOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { usePlatform } from 'pc/hooks/use_platform';
import { useResponsive } from 'pc/hooks/use_responsive';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import { AccountManager } from './account_manager';
import { BasicSetting } from './basic_setting';
import { DeveloperConfiguration } from './developer_configuration';
import { ModifyPassword } from './modify_password';
import { Nav } from './nav';
import { PersonalizedSetting } from './personalized_setting';
// @ts-ignore
import { AccountWallet } from 'enterprise/account_wallet/account_wallet';
// @ts-ignore
import { isSocialWecom } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

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

export const AccountCenterModal: FC<React.PropsWithChildren<IAccountCenterModalProps>> = (props) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const colors = useThemeColors();
  const [activeItem, setActiveItem] = useState(props.defaultActiveItem || (isPrivateDeployment() && isMobile ? 1 : 0));
  const [showNav, setShowNav] = useState(false);
  const userInfo = useAppSelector((state: IReduxState) => state.user.info);
  const { socialLinkDisable } = getCustomConfig();
  const { ACCOUNT_WALLET_VISIBLE } = getEnvVariables();
  const env = getEnvVariables();

  const { mobile } = usePlatform();

  const closeModal = () => {
    props.setShowAccountCenter(false);
  };

  const listData = compact([
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
      hidden: !(userInfo?.email || userInfo?.mobile) || !env.ACCOUNT_RESET_PASSWORD_VISIBLE,
    },
    AccountWallet && {
      key: AccountCenterModules.AccountWallet,
      name: t(Strings.account_wallet),
      component: <AccountWallet />,
      hidden: !ACCOUNT_WALLET_VISIBLE || isMobileApp(),
    },
    {
      key: AccountCenterModules.AccountManager,
      name: t(Strings.account_ass_manage),
      component: <AccountManager />,
      hidden: socialLinkDisable || mobile || isMobileApp() || isSocialWecom?.() || env.IS_SELFHOST || env.IS_APITABLE,
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
  ]);

  interface ICustomTitle {
    title: string;
    onClose: () => void;
    onClickNav?: () => void;
  }

  const CustomTitle = ({ title, onClose, onClickNav }: ICustomTitle) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div onClick={onClickNav} className={styles.side}>
          <ListOutlined size={20} color={onClickNav ? colors.fc1 : colors.white} />
        </div>
        <span>{title}</span>
        <IconButton icon={CloseOutlined} onClick={onClose} size="large" />
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
          open
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
            title={<CustomTitle title={listData[activeItem].name} onClose={() => setShowNav(false)} />}
            onClose={() => setShowNav(false)}
            bodyStyle={{
              padding: 16,
            }}
          >
            <Nav
              activeItem={activeItem}
              setActiveItem={(index) => {
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
