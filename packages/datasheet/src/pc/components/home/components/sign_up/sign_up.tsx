import { useBoolean } from 'ahooks';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { Typography, useThemeColors, Button, TextInput, LinkButton } from '@apitable/components';
import { Strings, t, isEmail, IReduxState, Api } from '@apitable/core';
import { EmailFilled, EyeCloseOutlined, EyeOpenOutlined, LockFilled } from '@apitable/icons';
import { WithTipWrapper, Message } from 'pc/components/common';
import { SignUpBase } from 'pc/components/home/components/sign_up/sign_up_base';
import { useRequest, useUserRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { ActionType } from '../../pc_home';
import styles from './style.module.less';

interface ILoginErrorMsg {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

interface ISignUpProps {
  switchClick?: (actionType: ActionType) => void;
}

export const SignUp: React.FC<ISignUpProps> = (props) => {
  const { registerReq } = useUserRequest();
  const { run: signUpReq, loading } = useRequest(registerReq, { manual: true });

  const inviteEmailInfo = useAppSelector((state: IReduxState) => state.invite.inviteEmailInfo);

  const signUp = async (username: string, password: string) => {
    const result = await signUpReq(username!, password!);
    if (!result) {
      return;
    }
    const { message, success } = result;
    if (success) {
      Api.submitQuestionnaire({
        nickName: username,
        env: 'apitable-ce',
      });
      return;
    }
    Message.error({ content: message });
  };

  return <SignUpBase {...props} signUp={signUp} email={inviteEmailInfo?.data.inviteEmail || ''} loading={loading} />;
};
