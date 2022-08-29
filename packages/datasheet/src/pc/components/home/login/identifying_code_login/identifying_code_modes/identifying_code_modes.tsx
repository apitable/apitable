import { FC, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { Tabs } from 'antd';
import { AutoTestID, ConfigConstant, Strings, t } from '@vikadata/core';
import { TextInput, Typography } from '@vikadata/components';
import { EmailSigninFilled } from '@vikadata/icons';
import {
  IdentifyingCodeInput,
  IPhoneInputRefProps,
  PhoneInput,
  WithTipWrapper,
} from 'pc/components/common/input';
import { useUpdateEffect } from 'ahooks';
import { useSetState } from 'pc/hooks';
import styles from './style.module.less';
import { useFocusEffect } from 'pc/components/editors/hooks/use_focus_effect';

const { TabPane } = Tabs;

export type IdentifyingCodeModes = ConfigConstant.LoginMode.PHONE
  | ConfigConstant.LoginMode.MAIL;

export interface IIdentifyingCodeData {
  areaCode: string;
  account: string;
  credential: string;
}
export type IIdentifyingCodeConfig = {
  [key in IdentifyingCodeModes ]?: {
    defaultValue?: string,
    disabled?: boolean,
  }
};
export interface IIdentifyingCodeModesProps {
  config?: IIdentifyingCodeConfig;
  // 仅显示某一模式
  mode?: IdentifyingCodeModes;
  // 短信类型
  smsType: ConfigConstant.SmsTypes;
  // 发送邮件类型
  emailType?: ConfigConstant.EmailCodeType;
  // 默认的验证码方式（默认为手机验证码登录）
  defaultIdentifyingCodeMode?: IdentifyingCodeModes;
  // 外面接口的报错（与账号或者验证有关的）
  error?: { accountErrMsg: string; identifyingCodeErrMsg: string };
  // 验证码模式改变时触发
  onModeChange?: (mode: IdentifyingCodeModes) => void;
  // 校验手机或邮箱
  checkAccount?: () => boolean;
  // 输入框数据改变时触发
  onChange?: (data: IIdentifyingCodeData) => void;
}

export const IdentifyingCodeModes: FC<IIdentifyingCodeModesProps> = ({
  config,
  mode,
  smsType,
  emailType = ConfigConstant.EmailCodeType.REGISTER,
  onModeChange,
  defaultIdentifyingCodeMode = ConfigConstant.LoginMode.PHONE,
  error,
  onChange,
  checkAccount,
}) => {
  // 当前获取验证码的方式
  const [identifyingCodeMode, setIdentifyingCodeMode] = useState(mode || defaultIdentifyingCodeMode);

  const defaultPhone = config?.phone?.defaultValue;
  const defaultMail = config?.mail?.defaultValue;
  // 主要数据（账号、验证码、密码、二次确认密码）
  const [state, setState] = useSetState<IIdentifyingCodeData>({
    areaCode: '',
    account: (mode === ConfigConstant.LoginMode.PHONE ? defaultPhone : defaultMail) || '',
    credential: ''
  });

  useEffect(() => {
    setState({ 
      account: (mode === ConfigConstant.LoginMode.PHONE ? defaultPhone : defaultMail) || '',
    });
  }, [defaultPhone, defaultMail, setState, mode]);

  const [errMsg, setErrMsg] = useSetState<{
    accountErrMsg: string;
    identifyingCodeErrMsg: string;
  }>({
    accountErrMsg: '',
    identifyingCodeErrMsg: '',
  });
  const phoneInputRef = useRef<IPhoneInputRefProps>(null);
  const mailInputRef = useRef<any>(null);

  useFocusEffect(() => {
    if (identifyingCodeMode === ConfigConstant.LoginMode.PHONE) {
      phoneInputRef.current?.focus();
      return;
    }
    mailInputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifyingCodeMode]);

  useUpdateEffect(() => {
    onChange && onChange(state);
  }, [state]);

  useUpdateEffect(() => {
    if (error) {
      setErrMsg(error);
    }
  }, [error]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setState({ account: value });
  };

  // 手机号或区号改变
  const handlePhoneChange = (areaCode: string, phone: string) => {
    if (errMsg.accountErrMsg) {
      setErrMsg({ accountErrMsg: '' });
    }
    setState({ areaCode, account: phone });
  };

  // 切换是邮箱验证码登录还是手机验证码登录
  const handleModeChange = key => {
    const defaultV = (config && config[key] && (config[key]?.defaultValue) || '');
    setState({ ...state, account: defaultV });
    setIdentifyingCodeMode(key);
    localStorage.setItem('vika-preference-login-mode', key);
    onModeChange && onModeChange(key);
  };

  const handleIdentifyingCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (errMsg.identifyingCodeErrMsg) {
      setErrMsg({ identifyingCodeErrMsg: '' });
    }

    const value = e.target.value.trim();
    setState({ credential: value });
  };
  return (
    <div className={styles.identifyingCodeModes}>
      {mode ? (
        mode === ConfigConstant.LoginMode.PHONE ? (
          <>
            <Typography variant="body2" className={styles.label}>
              {t(Strings.phone_number)}
            </Typography>
            <WithTipWrapper tip={errMsg.accountErrMsg}>
              <PhoneInput
                id={AutoTestID.LOGIN_PHONE_INPUT}
                value={state.account}
                disabled={config?.phone?.disabled}
                ref={phoneInputRef}
                onChange={handlePhoneChange}
                error={Boolean(errMsg.accountErrMsg)}
                block
              />
            </WithTipWrapper>
          </>
        ) : (
          <>
            <Typography variant="body2" className={styles.label}>
              {t(Strings.mail)}
            </Typography>
            <WithTipWrapper tip={errMsg.accountErrMsg}>
              <TextInput
                value={state.account}
                disabled={config?.mail?.disabled}
                ref={mailInputRef}
                placeholder={t(Strings.email_placeholder)}
                prefix={<EmailSigninFilled />}
                onChange={handleEmailChange}
                error={Boolean(errMsg.accountErrMsg)}
                block
              />
            </WithTipWrapper>
          </>
        )
      ) :
        <Tabs id={AutoTestID.LOGIN_CHANGE_MODE_TAB} className={styles.tabs} activeKey={identifyingCodeMode} onChange={handleModeChange}>
          <TabPane tab={t(Strings.phone_number)} key={ConfigConstant.LoginMode.PHONE}>
            <WithTipWrapper tip={errMsg.accountErrMsg}>
              <PhoneInput
                id={AutoTestID.LOGIN_PHONE_INPUT}
                value={state.account}
                disabled={config?.phone?.disabled}
                ref={phoneInputRef}
                onChange={handlePhoneChange}
                error={Boolean(errMsg.accountErrMsg)}
                block
              />
            </WithTipWrapper>
          </TabPane>
          <TabPane tab={t(Strings.mail)} key={ConfigConstant.LoginMode.MAIL}>
            <WithTipWrapper tip={errMsg.accountErrMsg}>
              <TextInput
                id={AutoTestID.LOGIN_MAIL_INPUT}
                value={state.account}
                disabled={config?.mail?.disabled}
                ref={mailInputRef}
                placeholder={t(Strings.email_placeholder)}
                prefix={<EmailSigninFilled />}
                onChange={handleEmailChange}
                error={Boolean(errMsg.accountErrMsg)}
                block
              />
            </WithTipWrapper>
          </TabPane>
        </Tabs>
      }
      <Typography variant="body2" className={styles.label}>
        {t(Strings.verification_code)}
      </Typography>
      <WithTipWrapper tip={errMsg.identifyingCodeErrMsg} captchaVisible>
        <IdentifyingCodeInput
          id={AutoTestID.IDENTIFYING_CODE_INPUT}
          mode={identifyingCodeMode}
          data={{ areaCode: state.areaCode, account: state.account }}
          smsType={smsType}
          emailType={emailType}
          onChange={handleIdentifyingCodeChange}
          setErrMsg={setErrMsg}
          error={Boolean(errMsg.identifyingCodeErrMsg)}
          checkAccount={checkAccount}
        />
      </WithTipWrapper>
    </div>
  );
};
