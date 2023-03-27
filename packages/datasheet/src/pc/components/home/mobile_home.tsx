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
import { Space } from '@apitable/components';
import { integrateCdnHost, IReduxState, t, Strings } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import { GithubButton } from './components/github_button';
import { Login } from './components/login';
import { NavBar } from './components/nav_bar';
import styles from './style.module.less';
import { SignUp } from './components/sign_up';
import { ForgetPassword } from './components/forget_password';
import { useMount } from 'ahooks';
import { ActionType } from './pc_home';
import { useSelector } from 'react-redux';

export const MobileHome: React.FC<React.PropsWithChildren<unknown>> = () => {
  const inviteLinkInfo = useSelector((state: IReduxState) => state.invite.inviteLinkInfo);
  const inviteEmailInfo = useSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  const [action, setAction] = useState<ActionType>(ActionType.SignUp);
  const [email, setEmail] = useState<string>('');

  const switchActionType = (actionType: ActionType) => {
    setAction(actionType);
  };
  const loginAction = localStorage.getItem('loginAction');
  useMount(() => {
    if(loginAction === ActionType.SignIn) {
      setAction(ActionType.SignIn);
      localStorage.removeItem('loginAction');
    }
  });
  
  const homeModal = (action: ActionType) => {
    switch(action) {
      case ActionType.SignIn:
        return <Login switchClick={switchActionType} email={email} setEmail={setEmail} />;
        break;
      case ActionType.SignUp:
        return <SignUp switchClick={switchActionType} email={email} setEmail={setEmail} />;
        break;
      case ActionType.ForgetPassword:
        return <ForgetPassword switchClick={switchActionType} email={email} setEmail={setEmail} />;
        break;
    }
    
  };

  const getTitle = (action: ActionType) => {
    switch(action) {
      case ActionType.SignIn:
        return 'Sign In';
        break;
      case ActionType.SignUp:
        return 'Sign Up';
        break;
      case ActionType.ForgetPassword:
        return 'Reset Password';
        break;
    }
  };

  return (
    <div className={styles.mobileHome}>
      <div className={styles.header}>
        <img src={integrateCdnHost(getEnvVariables().LOGIN_LOGO!)} alt="logo" />
      </div>
      { inviteLinkInfo || inviteEmailInfo ? 
        <div className={styles.invite}>
          <h4>{inviteLinkInfo?.data.memberName || inviteEmailInfo?.data.inviter}  {t(Strings.invite_your_join)}</h4>
          <p>{`"${inviteLinkInfo?.data.spaceName || inviteEmailInfo?.data.spaceName}"`}</p>
        </div>:
        <h3 className={styles.title}>
          {getTitle(action)}
        </h3>
      }
      <div className={styles.content}>
        {homeModal(action)}
      </div>
      <Space size={41} vertical>
        <GithubButton />
        <NavBar />
      </Space>
    </div>
  );
};