import { Button, ThemeName, ThemeProvider } from '@apitable/components';
import { AutoTestID, ConfigConstant, isEmail, isPhoneNumber, StatusCode, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Form } from 'antd';
import { useRequest, useSetState } from 'pc/hooks';
import { useQuery } from 'pc/hooks/use_home';
import { execNoTraceVerification, initNoTraceVerification } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { clearStorage } from 'pc/utils/storage';
import { FC, useEffect, useState } from 'react';
import { ISubmitRequestParam } from '../identifying_code_login';
import { IdentifyingCodeModes } from '../identifying_code_login/identifying_code_modes';
import { IPasswordData, IPasswordLoginConfig, PasswordLoginModes } from './password_login_modes';
import styles from './style.module.less';

const defaultErrMsg = { accountErrMsg: '', passwordErrMsg: '' };

export interface IPasswordLoginProps {
  submitRequest: (data: ISubmitRequestParam) => Promise<any>;
  config?: IPasswordLoginConfig;
}

const initMode = (supportAccountType: IdentifyingCodeModes | undefined): IdentifyingCodeModes => {
  if (supportAccountType) return supportAccountType;

  const localStoredMode = localStorage.getItem('vika-preference-login-mode');
  if (localStoredMode) return localStoredMode as IdentifyingCodeModes;

  return ConfigConstant.LoginMode.PHONE;
};

export const PasswordLogin: FC<IPasswordLoginProps> = ({ submitRequest, config }) => {
  const { LOGIN_DEFAULT_ACCOUNT_TYPE } = getEnvVariables();
  const [data, setData] = useState<IPasswordData>({
    areaCode: '',
    account: '',
    credential: ''
  });
  const [errMsg, setErrMsg] = useSetState(defaultErrMsg);
  const [mode, setMode] = useState(initMode(LOGIN_DEFAULT_ACCOUNT_TYPE as IdentifyingCodeModes));
  const [nvcSuccessData, setNvcSuccessData] = useState<string | null>(null);
  const { run: login, loading } = useRequest(submitRequest, { manual: true });
  const query = useQuery();
  const automationTestingData = query.get('vikaTest');

  useMount(() => {
    initNoTraceVerification(setNvcSuccessData, ConfigConstant.CaptchaIds.LOGIN);
  });

  useEffect(() => {
    if (nvcSuccessData) {
      signIn(nvcSuccessData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nvcSuccessData]);

  const signIn = async(nvcVal?: string) => {
    clearStorage();

    const loginData = {
      ...data,
      nvcVal: automationTestingData || nvcVal,
      type: ConfigConstant.LoginTypes.PASSWORD,
    };
    const result = await login(loginData);
    if (!result) {
      return;
    }
    const { code, message, success } = result;
    if (success) {
      return;
    }

    switch (code) {
      case StatusCode.NAME_AND_PWD_ERR:
        setErrMsg({ accountErrMsg: message, passwordErrMsg: message });
        break;
      case StatusCode.PASSWORD_ERR:
        setErrMsg({ passwordErrMsg: message });
        break;
      case StatusCode.SECONDARY_VALIDATION:
      case StatusCode.NVC_FAIL:
        break;
      default:
        setErrMsg({ accountErrMsg: message });
    }
  };

  const handleChange = (data: IPasswordData) => {
    if (errMsg.accountErrMsg || errMsg.passwordErrMsg) {
      setErrMsg(defaultErrMsg);
    }
    setData(data);
  };

  const handleModeChange = mode => {
    setErrMsg(defaultErrMsg);
    setMode(mode);
  };

  const checkAccount = (): boolean => {
    if (mode === ConfigConstant.LoginMode.MAIL) {
      if (!data.account) {
        setErrMsg({ accountErrMsg: t(Strings.email_placeholder) });
        return false;
      }

      if (!isEmail(data.account)) {
        setErrMsg({ accountErrMsg: t(Strings.email_err) });
        return false;
      }
    }

    if (mode === ConfigConstant.LoginMode.PHONE) {
      if (!data.account) {
        setErrMsg({ accountErrMsg: t(Strings.placeholder_input_mobile) });
        return false;
      }

      if (!isPhoneNumber(data.account, data.areaCode)) {
        setErrMsg({ accountErrMsg: t(Strings.phone_err) });
        return false;
      }
    }

    return true;
  };

  const checkPassword = (): boolean => {
    if (!data.credential) {
      setErrMsg({ passwordErrMsg: t(Strings.placeholder_input_password) });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    const accountValidity = checkAccount();
    const passwordValidity = checkPassword();

    if (!accountValidity || !passwordValidity) return;

    execNoTraceVerification(signIn);
  };

  return (
    <ThemeProvider theme={ThemeName.Light}>
      <div className={styles.login}>
        <Form onFinish={handleSubmit}>
          <PasswordLoginModes
            error={errMsg}
            defaultPasswordMode={mode as IdentifyingCodeModes}
            mode={LOGIN_DEFAULT_ACCOUNT_TYPE as IdentifyingCodeModes}
            onChange={handleChange}
            onModeChange={handleModeChange}
            config={config}
          />
          <Button
            id={AutoTestID.LOGIN_BTN}
            type="submit"
            className={styles.loginButton}
            color="primary"
            size="large"
            loading={loading}
            disabled={loading}
            block
          >
            {t(Strings.login)}
          </Button>
          <div id={ConfigConstant.CaptchaIds.LOGIN} />
        </Form>
      </div>
    </ThemeProvider>
  );
};
