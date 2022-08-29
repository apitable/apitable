import { Button, ThemeName, ThemeProvider, Typography } from '@vikadata/components';
import { ConfigConstant, getCustomConfig, Navigation, StatusCode, Strings, t } from '@vikadata/core';
import { Form } from 'antd';
import { useRequest, useSetState, useUserRequest } from 'pc/hooks';
import { execNoTraceVerification } from 'pc/utils';
import * as React from 'react';
import { FC } from 'react';
import { PasswordInput, WithTipWrapper, Wrapper } from '../common';
import { IdentifyingCodeModes, IIdentifyingCodeData } from '../home/login/identifying_code_login/identifying_code_modes';
import { useNavigation } from '../route_manager/use_navigation';
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

const ResetPassword: FC = () => {
  // 主要数据（账号、验证码、密码、二次确认密码）
  const [state, setState] = useSetState<IState>({
    areaCode: '',
    account: '',
    identifyingCode: '',
    password: '',
    secondPassword: ''
  });
  const {
    supportAccountType
  } = getCustomConfig();
  const [mode, setMode] = React.useState(supportAccountType || ConfigConstant.LoginMode.PHONE);
  // 错误信息
  const [errMsg, setErrMsg] = useSetState<{ accountErrMsg: string, identifyingCodeErrMsg: string, passwordErrMsg: string }>(defaultErrMsg);
  const { retrievePwdReq, loginOrRegisterReq } = useUserRequest();
  const { run: retrievePwd, loading } = useRequest(retrievePwdReq, { manual: true });
  const navigationTo = useNavigation();

  const resetErrMsg = () => {
    const { accountErrMsg, identifyingCodeErrMsg, passwordErrMsg } = errMsg;
    if (accountErrMsg || identifyingCodeErrMsg || passwordErrMsg) {
      setErrMsg(defaultErrMsg);
    }
  };

  const handleIdentifyingCodeChange = (data: IIdentifyingCodeData) => {
    resetErrMsg();
    const { areaCode, account, credential } = data;
    setState({ areaCode, account, identifyingCode: credential });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = e.target.value.trim();
    resetErrMsg();
    setState({ [key]: value });
  };

  // 提交密码修改
  const handleSubmit = async() => {
    const { areaCode, account, identifyingCode, password, secondPassword } = state;
    if (password !== secondPassword) {
      setErrMsg({ passwordErrMsg: t(Strings.password_not_identical_err) });
      return;
    }
    const type = mode === ConfigConstant.LoginMode.PHONE ? ConfigConstant.CodeTypes.SMS_CODE :
      ConfigConstant.CodeTypes.EMAIL_CODE;

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

    // 成功后自动登录
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
    navigationTo({ path: Navigation.LOGIN });
  };

  const onModeChange = mode => {
    setMode(mode);
  };
  const btnDisable = !(state.account && state.identifyingCode && state.password && state.secondPassword);

  return (
    <ThemeProvider theme={ThemeName.Light}>
      <Wrapper>
        <div className={styles.resetPwdWrapper}>
          <div className={styles.resetPwdBox}>
            <Typography variant="h5" className={styles.title}>{t(Strings.reset_password)}</Typography>
            <Form onFinish={handleSubmit}>
              <IdentifyingCodeModes
                smsType={ConfigConstant.SmsTypes.MODIFY_PASSWORD}
                emailType={ConfigConstant.EmailCodeType.COMMON}
                onModeChange={onModeChange}
                defaultIdentifyingCodeMode={ConfigConstant.LoginMode.PHONE}
                error={{ accountErrMsg: errMsg.accountErrMsg, identifyingCodeErrMsg: errMsg.identifyingCodeErrMsg }}
                onChange={handleIdentifyingCodeChange}
                mode={supportAccountType as IdentifyingCodeModes}
              />
              <Typography variant="body2" className={styles.gap}>{t(Strings.input_new_password)}</Typography>
              <WithTipWrapper tip={errMsg.passwordErrMsg}>
                <PasswordInput
                  placeholder={t(Strings.password_rules)}
                  onChange={e => handlePasswordChange(e, 'password')}
                  autoComplete="new-password"
                  block
                />
              </WithTipWrapper>
              <Typography variant="body2" className={styles.gap}>{t(Strings.input_confirmation_password)}</Typography>
              <WithTipWrapper tip="">
                <PasswordInput
                  error={Boolean(errMsg.passwordErrMsg)}
                  placeholder={t(Strings.placeholder_input_new_password_again)}
                  onChange={e => handlePasswordChange(e, 'secondPassword')}
                  autoComplete="new-password"
                  block
                />
              </WithTipWrapper>
              <Button
                className={styles.confirmBtn}
                type="submit"
                color="primary"
                size="large"
                disabled={btnDisable}
                loading={loading}
                block
              >
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
