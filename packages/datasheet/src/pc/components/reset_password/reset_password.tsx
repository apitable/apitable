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

import { Form } from 'antd';
import * as React from 'react';
import { FC } from 'react';
import { Button, ThemeName, ThemeProvider, Typography } from '@apitable/components';
import { ConfigConstant, Navigation, StatusCode, Strings, t } from '@apitable/core';
import { Router } from 'pc/components/route_manager/router';
import { useRequest, useSetState, useUserRequest } from 'pc/hooks';
import { execNoTraceVerification } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { PasswordInput, WithTipWrapper, Wrapper } from '../common';
// @ts-ignore
import { initMode } from 'enterprise/home/login/identifying_code_login/identifying_code_login';
// @ts-ignore
import { IdentifyingCodeModes } from 'enterprise/home/login/identifying_code_login/identifying_code_modes/identifying_code_modes';
import styles from './style.module.less';

interface IState {
  areaCode: string;
  account: string;
  identifyingCode: string;
  password: string;
  secondPassword: string;
}

const defaultErrMsg = {
  accountErrMsg: '',
  identifyingCodeErrMsg: '',
  passwordErrMsg: '',
};

const ResetPassword: FC<React.PropsWithChildren<unknown>> = () => {
  const [state, setState] = useSetState<IState>({
    areaCode: '',
    account: '',
    identifyingCode: '',
    password: '',
    secondPassword: '',
  });
  const { LOGIN_DEFAULT_ACCOUNT_TYPE } = getEnvVariables();
  const [mode, setMode] = React.useState(
    LOGIN_DEFAULT_ACCOUNT_TYPE?.includes(ConfigConstant.LoginMode.PHONE)
      ? initMode?.() || ConfigConstant.LoginMode.PHONE
      : LOGIN_DEFAULT_ACCOUNT_TYPE,
  );
  const [errMsg, setErrMsg] = useSetState<{ accountErrMsg: string; identifyingCodeErrMsg: string; passwordErrMsg: string }>(defaultErrMsg);
  const { retrievePwdReq, loginOrRegisterReq } = useUserRequest();
  const { run: retrievePwd, loading } = useRequest(retrievePwdReq, { manual: true });

  const resetErrMsg = () => {
    const { accountErrMsg, identifyingCodeErrMsg, passwordErrMsg } = errMsg;
    if (accountErrMsg || identifyingCodeErrMsg || passwordErrMsg) {
      setErrMsg(defaultErrMsg);
    }
  };

  const handleIdentifyingCodeChange = (data: any) => {
    resetErrMsg();
    const { areaCode, account, credential } = data;
    setState({ areaCode, account, identifyingCode: credential });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = e.target.value.trim();
    resetErrMsg();
    setState({ [key]: value });
  };

  const handleSubmit = async () => {
    const { areaCode, account, identifyingCode, password, secondPassword } = state;
    if (password !== secondPassword) {
      setErrMsg({ passwordErrMsg: t(Strings.password_not_identical_err) });
      return;
    }
    const type = mode === ConfigConstant.LoginMode.PHONE ? ConfigConstant.CodeTypes.SMS_CODE : ConfigConstant.CodeTypes.EMAIL_CODE;

    const result = await retrievePwd(areaCode, account, identifyingCode, password, type);
    const { code, success, message } = result;
    if (!success) {
      switch (code) {
        case StatusCode.ACCOUNT_ERROR:
          setErrMsg({ accountErrMsg: message });
          break;
        case StatusCode.PASSWORD_ERR:
          setErrMsg({ passwordErrMsg: message });
          break;
        default:
          setErrMsg({ identifyingCodeErrMsg: message });
      }
      return;
    }

    // Automatic login after success
    setTimeout(() => {
      execNoTraceVerification((data?: string) => {
        loginOrRegisterReq({
          username: account,
          credential: password,
          type: ConfigConstant.LoginTypes.PASSWORD,
          areaCode,
          data,
        });
      });
    }, 1000);
  };

  const handleBackLogin = () => {
    Router.push(Navigation.LOGIN);
  };

  const onModeChange = (mode: string) => {
    setMode(mode);
  };
  const btnDisable = !(state.account && state.identifyingCode && state.password && state.secondPassword);

  return (
    <ThemeProvider theme={ThemeName.Light}>
      <Wrapper>
        <div className={styles.resetPwdWrapper}>
          <div className={styles.resetPwdBox}>
            <Typography variant="h5" className={styles.title}>
              {t(Strings.reset_password)}
            </Typography>
            <Form onFinish={handleSubmit}>
              {IdentifyingCodeModes && (
                <IdentifyingCodeModes
                  smsType={ConfigConstant.SmsTypes.MODIFY_PASSWORD}
                  emailType={ConfigConstant.EmailCodeType.COMMON}
                  onModeChange={onModeChange}
                  error={{ accountErrMsg: errMsg.accountErrMsg, identifyingCodeErrMsg: errMsg.identifyingCodeErrMsg }}
                  onChange={handleIdentifyingCodeChange}
                  mode={mode}
                />
              )}
              <Typography variant="body2" className={styles.gap}>
                {t(Strings.input_new_password)}
              </Typography>
              <WithTipWrapper tip={errMsg.passwordErrMsg}>
                <PasswordInput
                  placeholder={t(Strings.password_rules)}
                  onChange={(e) => handlePasswordChange(e, 'password')}
                  autoComplete="new-password"
                  block
                />
              </WithTipWrapper>
              <Typography variant="body2" className={styles.gap}>
                {t(Strings.input_confirmation_password)}
              </Typography>
              <WithTipWrapper tip="">
                <PasswordInput
                  error={Boolean(errMsg.passwordErrMsg)}
                  placeholder={t(Strings.placeholder_input_new_password_again)}
                  onChange={(e) => handlePasswordChange(e, 'secondPassword')}
                  autoComplete="new-password"
                  block
                />
              </WithTipWrapper>
              <Button className={styles.confirmBtn} type="submit" color="primary" size="large" disabled={btnDisable} loading={loading} block>
                {t(Strings.confirm)}
              </Button>
              <div className={styles.backBtn}>
                <span onClick={handleBackLogin}>{t(Strings.back_login)}</span>
              </div>
            </Form>
          </div>
        </div>
      </Wrapper>
    </ThemeProvider>
  );
};

export default ResetPassword;
