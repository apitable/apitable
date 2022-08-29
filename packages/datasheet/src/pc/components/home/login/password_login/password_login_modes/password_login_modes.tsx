import { TextInput, Typography } from '@vikadata/components';
import { AutoTestID, ConfigConstant, Strings, t } from '@vikadata/core';
import { EmailSigninFilled } from '@vikadata/icons';
import { useSetState, useUpdateEffect } from 'ahooks';
import { Tabs } from 'antd';
import { IPhoneInputRefProps, PasswordInput, PhoneInput, WithTipWrapper } from 'pc/components/common';
import { useFocusEffect } from 'pc/components/editors/hooks/use_focus_effect';
import * as React from 'react';
import { FC, useRef, useState } from 'react';
import { IdentifyingCodeModes, IIdentifyingCodeConfig } from '../../identifying_code_login/identifying_code_modes';
import styles from './style.module.less';

const { TabPane } = Tabs;

export interface IPasswordData {
  areaCode: string;
  account: string;
  credential: string;
}

export type IPasswordModes = ConfigConstant.LoginMode.PHONE | ConfigConstant.LoginMode.MAIL;
export type IPasswordLoginConfig = IIdentifyingCodeConfig;

export interface IPasswordLoginModesProps {
  // 默认的验证码方式（默认为手机验证码登录）
  defaultPasswordMode?: IPasswordModes;
  // 仅显示某一模式
  mode?: IdentifyingCodeModes;
  // 外面接口的报错（与账号或者密码有关的）
  error?: { accountErrMsg: string, passwordErrMsg: string };
  // 模式改变时触发
  onModeChange?: (mode: IPasswordModes) => void;
  // 输入框数据改变时触发
  onChange?: (data: IPasswordData) => void;
  config?: IPasswordLoginConfig;
}

const defaultState = {
  areaCode: '',
  account: '',
  credential: '',
};

export const PasswordLoginModes: FC<IPasswordLoginModesProps> = ({
  defaultPasswordMode = ConfigConstant.LoginMode.PHONE,
  onModeChange,
  onChange,
  error,
  config,
  mode,
}) => {
  // 当前获取验证码的方式
  const [defaultMode, setDefaultMode] = useState(defaultPasswordMode);
  // 主要数据（账号、验证码、密码、二次确认密码）
  const [state, setState] = useSetState<IPasswordData>(defaultState);
  const phoneInputRef = useRef<IPhoneInputRefProps>(null);
  const mailInputRef = useRef<any>(null);

  useUpdateEffect(() => {
    onChange && onChange(state);
  }, [state]);
  useFocusEffect(() => {
    if (defaultMode === ConfigConstant.LoginMode.PHONE) {
      phoneInputRef.current?.focus();
      return;
    }
    mailInputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultMode]);

  // 切换是邮箱登录还是手机登录
  const handleModeChange = key => {
    const defaultV = (config && config[key] && (config[key]?.defaultValue) || '');
    setState({ ...state, account: defaultV });
    setDefaultMode(key);
    localStorage.setItem('vika-preference-login-mode', key);
    onModeChange && onModeChange(key);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setState({ account: value });
  };

  // 手机号或区号改变
  const handlePhoneChange = (areaCode: string, phone: string) => {
    setState({ areaCode, account: phone });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setState({ credential: value });
  };

  // 账号错误提示
  const accountErrTip = error?.accountErrMsg || '';
  // 密码错误提示
  const passwordErrTip = error?.passwordErrMsg || '';

  const LoginWithPhone = (
    <WithTipWrapper tip={accountErrTip}>
      <PhoneInput
        id={AutoTestID.LOGIN_PHONE_INPUT}
        ref={phoneInputRef}
        value={state.account}
        disabled={config?.phone?.disabled}
        placeholder={t(Strings.placeholder_input_mobile)}
        onChange={handlePhoneChange}
        error={Boolean(error?.accountErrMsg)}
        block
      />
    </WithTipWrapper>
  );

  const LoginWithEmail = (
    <WithTipWrapper tip={accountErrTip}>
      <TextInput
        id={AutoTestID.LOGIN_MAIL_INPUT}
        ref={mailInputRef}
        value={state.account}
        disabled={config?.mail?.disabled}
        prefix={<EmailSigninFilled />}
        placeholder={t(Strings.email_placeholder)}
        onChange={handleEmailChange}
        error={Boolean(accountErrTip)}
        block
      />
    </WithTipWrapper>
  );

  const TabsContent = (
    <Tabs id={AutoTestID.LOGIN_CHANGE_MODE_TAB} className={styles.tabs} activeKey={defaultMode} onChange={handleModeChange}>
      <TabPane tab={t(Strings.phone_number)} key={ConfigConstant.LoginMode.PHONE}>
        {LoginWithPhone}
      </TabPane>
      <TabPane tab={t(Strings.mail)} key={ConfigConstant.LoginMode.MAIL}>
        {LoginWithEmail}
      </TabPane>
    </Tabs>
  );

  return (
    <div className={styles.passwordLoginModes}>
      {mode ? (mode === ConfigConstant.LoginMode.PHONE ? (
        LoginWithPhone
      ) : (
        LoginWithEmail
      )) : (
        TabsContent
      )}
      <Typography variant="body2" className={styles.label}>{t(Strings.password)}</Typography>
      <WithTipWrapper tip={passwordErrTip}>
        <PasswordInput
          id={AutoTestID.LOGIN_PASSWORD_INPUT}
          placeholder={t(Strings.placeholder_input_password)}
          onChange={handlePasswordChange}
          error={Boolean(passwordErrTip)}
          block
        />
      </WithTipWrapper>
    </div>
  );
};
