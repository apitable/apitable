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

import { useBoolean, useMount } from 'ahooks';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { Typography, useThemeColors, Button, TextInput, Box, LinkButton } from '@apitable/components';
import { Strings, t, isEmail, ConfigConstant, StatusCode, api, IReduxState } from '@apitable/core';
import { EmailFilled, EyeCloseOutlined, EyeOpenOutlined, LockFilled } from '@apitable/icons';
import { WithTipWrapper } from 'pc/components/common';
import { useRequest, useUserRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { execNoTraceVerification, initNoTraceVerification } from 'pc/utils';
import { clearStorage } from 'pc/utils/storage';
import { ActionType } from '../../pc_home';
import styles from './style.module.less';

interface ILoginErrorMsg {
  username?: string;
  password?: string;
}

interface ILoginProps {
  switchClick?: (actionType: ActionType) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const Login: React.FC<React.PropsWithChildren<ILoginProps>> = (props) => {
  const { switchClick = () => {}, email = '', setEmail } = props;
  const colors = useThemeColors();
  const { loginOrRegisterReq } = useUserRequest();
  const { run: loginReq, loading } = useRequest(loginOrRegisterReq, { manual: true });
  const [noTraceVerification, setNoTraceVerification] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<ILoginErrorMsg>({});
  const [username, setUsername] = useState<string>(email);
  const [password, setPassword] = useState<string>();

  const [isVisible, { toggle }] = useBoolean(false);
  const inviteEmailInfo = useAppSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  const [emailDisable, setEmailDisable] = useState<boolean>(false);
  useEffect(() => {
    if (inviteEmailInfo) {
      setUsername(inviteEmailInfo.data.inviteEmail);
      setEmailDisable(true);
    }
  }, [inviteEmailInfo]);

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.replace(/\s/g, ''));
    setEmail(e.target.value.replace(/\s/g, ''));
  };

  const preCheckOnSubmit = (data: { username?: string; password?: string }) => {
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

  const signIn = async (data?: string) => {
    clearStorage();
    const loginData: api.ISignIn = {
      username: username!,
      credential: password!,
      data,
      type: ConfigConstant.LoginTypes.PASSWORD,
      mode: ConfigConstant.LoginMode.PASSWORD,
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

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === ' ') {
      event.preventDefault();
    }
    event.key === 'Enter' && handleSubmit();
  }
  return (
    <div className={styles.loginWrap}>
      <Form onFinish={handleSubmit}>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant="body2" color={colors.textCommonPrimary}>
            {t(Strings.field_title_email)}
          </Typography>
          <WithTipWrapper tip={errorMsg.username || ''}>
            <TextInput
              className={styles.input}
              value={username}
              onChange={handleEmailChange}
              onKeyDown={handleKeyPress}
              prefix={<EmailFilled color={colors.textCommonPrimary} />}
              placeholder={t(Strings.email_placeholder)}
              error={Boolean(errorMsg.username)}
              block
              disabled={emailDisable}
            />
          </WithTipWrapper>
        </div>
        <div className={styles.inputWrap}>
          <Typography className={styles.inputTitle} variant="body2" color={colors.textCommonPrimary}>
            {t(Strings.label_password)}
          </Typography>
          <WithTipWrapper tip={errorMsg.password || ''}>
            <TextInput
              type={isVisible ? 'text' : 'password'}
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<LockFilled color={colors.textCommonPrimary} />}
              suffix={
                <div className={styles.suffixIcon} onClick={() => toggle()} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  {isVisible ? <EyeOpenOutlined color={colors.textCommonTertiary} /> : <EyeCloseOutlined color={colors.textCommonTertiary} />}
                </div>
              }
              onKeyDown={handleKeyPress}
              placeholder={t(Strings.placeholder_input_password)}
              error={Boolean(errorMsg.password)}
              block
            />
          </WithTipWrapper>
        </div>
        <Box textAlign={'right'}>
          <Typography
            className={styles.forgetPassword}
            variant="body2"
            color={colors.textCommonPrimary}
            onClick={() => switchClick(ActionType.ForgetPassword)}
          >
            {t(Strings.apitable_forget_password_button)}
          </Typography>
        </Box>
      </Form>

      <Button className={styles.loginBtn} color="primary" size="large" block loading={loading} onClick={handleSubmit}>
        {t(Strings.apitable_sign_in)}
      </Button>
      <div className={styles.switchContent}>
        <p>{t(Strings.apitable_no_account)}</p>
        <LinkButton underline={false} component="button" onClick={() => switchClick(ActionType.SignUp)} style={{ paddingRight: 0 }}>
          {t(Strings.apitable_sign_up)}
        </LinkButton>
      </div>
    </div>
  );
};
