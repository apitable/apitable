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

import { Typography, useThemeColors, Button, TextInput, Box } from '@apitable/components';
import { Strings, t, isEmail, ConfigConstant, StatusCode } from '@apitable/core';
import { ISignIn } from '@apitable/core/dist/modules/shared/api/api.interface';
import { EmailSigninFilled, EyeCloseOutlined, EyeNormalOutlined, LockFilled } from '@apitable/icons';
import { useBoolean, useMount } from 'ahooks';
import { Form } from 'antd';
import { WithTipWrapper } from 'pc/components/common';
import { Modal } from 'pc/components/common/modal';
import { useRequest, useUserRequest } from 'pc/hooks';
import { execNoTraceVerification, initNoTraceVerification } from 'pc/utils';
import { clearStorage } from 'pc/utils/storage';
import { useEffect, useState } from 'react';

import styles from './style.module.less';

interface ILoginErrorMsg {
  username?: string;
  password?: string;
}
export const Login: React.FC = () => {
  const colors = useThemeColors();
  const { loginOrRegisterReq } = useUserRequest();
  const { run: loginReq, loading } = useRequest(loginOrRegisterReq, { manual: true });
  const [noTraceVerification, setNoTraceVerification] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<ILoginErrorMsg>({});
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [isVisible, { toggle }] = useBoolean(false);

  useMount(() => {
    initNoTraceVerification(setNoTraceVerification, ConfigConstant.CaptchaIds.LOGIN);
  });

  useEffect(() => {
    if (noTraceVerification) {
      signIn(noTraceVerification);
    }
    // eslint-disable-next-line
  }, [noTraceVerification]);

  useEffect(() => {
    setErrorMsg({});
  }, [username, password]);

  const handleSubmit = () => {
    if (!preCheckOnSubmit({ username, password })) {
      return;
    }
    execNoTraceVerification(signIn);
  };

  const preCheckOnSubmit = (data) => {
    const errorMsg: ILoginErrorMsg = {};
    const checkPassword = (): boolean => {
      if (!data.password) {
        errorMsg.password = t(Strings.placeholder_input_password);
        return false;
      }
  
      return true;
    };
    const checkUsername = () => {
      if (!data.username) {
        errorMsg.username = t(Strings.email_placeholder);
        return false;
      }
  
      if (!isEmail(data.username)) {
        errorMsg.username = t(Strings.email_err);
        return false;
      }
      return true;
    };
    const verifyUsername = checkUsername();
    const verifyPassword = checkPassword();
    setErrorMsg(errorMsg);
    return verifyUsername && verifyPassword;
  };

  const signIn = async(data?: string) => {
    clearStorage();
    const loginData: ISignIn = {
      username: username!,
      credential: password!,
      data,
      type: ConfigConstant.LoginTypes.PASSWORD,
      mode: ConfigConstant.LoginMode.PASSWORD
    };
    const result = await loginReq(loginData);
    if (!result) {
      return;
    }
    const { code, message, success } = result;
    if (success) {
      return;
    }

    switch (code) {
      case StatusCode.NAME_AND_PWD_ERR:
        setErrorMsg({ username: message, password: message });
        break;
      case StatusCode.PASSWORD_ERR:
        setErrorMsg({ password: message });
        break;
      case StatusCode.SECONDARY_VALIDATION:
      case StatusCode.NVC_FAIL:
        break;
      default:
        setErrorMsg({ username: message });
    }
  };

  const forgetPassword = () => {
    Modal.info({
      title: 'Tips',
      content: 'Please contact the administrator to change your password for you',
      okText: 'OK',
    });
  };
  return (
    <div className={styles.loginWrap}>
      <Form onFinish={handleSubmit}>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant='body2' color={colors.textCommonPrimary}>Email</Typography>
          <WithTipWrapper tip={errorMsg.username || ''}>
            <TextInput
              className={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              prefix={<EmailSigninFilled color={colors.textCommonPrimary}/>}
              placeholder='Please enter your email address'
              error={Boolean(errorMsg.username)}
              block/>
          </WithTipWrapper>
        </div>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant='body2' color={colors.textCommonPrimary}>Password</Typography>
          <WithTipWrapper tip={errorMsg.password || ''}>
            <TextInput
              type={isVisible ? 'text' : 'password'}
              value={password}
              className={styles.input}
              onChange={e => setPassword(e.target.value)}
              prefix={<LockFilled color={colors.textCommonPrimary}/>}
              suffix={<div
                className={styles.suffixIcon}
                onClick={() => toggle()}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                {isVisible ? <EyeNormalOutlined color={colors.textCommonTertiary}/> : <EyeCloseOutlined color={colors.textCommonTertiary}/>}
              </div>}
              placeholder='Please enter your password'
              error={Boolean(errorMsg.password)}
              block/>
          </WithTipWrapper>
        </div>
      </Form>
      <Button
        className={styles.loginBtn}
        color='primary'
        size='large'
        block
        loading={loading}
        onClick={handleSubmit}
      >Sign in</Button>
      <Box textAlign={'center'}>
        <Typography
          className={styles.forgetPassword}
          variant='body2'
          color={colors.textCommonPrimary}
          onClick={forgetPassword}>Forgot your password?</Typography>
      </Box>
    </div>
  );
};