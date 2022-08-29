import { useState, useRef, FC, memo } from 'react';
import * as React from 'react';
import { Form, Checkbox } from 'antd';
import { useRequest } from 'pc/hooks';
import { useSetState } from 'pc/hooks';
import { ConfigConstant, t, Strings, StatusCode, AutoTestID, isEmail, Settings, isPhoneNumber } from '@vikadata/core';
import { Button, Typography, ThemeProvider, ThemeName } from '@vikadata/components';
import { clearStorage } from 'pc/utils/storage';
import { IdentifyingCodeModes, IIdentifyingCodeConfig } from 'pc/components/home/login/identifying_code_login/identifying_code_modes';
import { useQuery } from 'pc/hooks';
import styles from './style.module.less';
import { Modal as AntModal } from 'pc/components/common/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { usePlatform } from 'pc/hooks/use_platform';
import { Modal } from 'pc/components/common/mobile/modal';
import { isMobileApp } from 'pc/utils/env';

export interface ISubmitRequestParam {
  areaCode: string;
  account: string;
  credential: string;
  nvcVal?: string;
  type: ConfigConstant.LoginTypes;
  mode?: ConfigConstant.LoginMode;
}

export interface IIdentifyingCodeLoginProps {
  // 仅显示某一模式
  mode?: ConfigConstant.LoginMode.PHONE | ConfigConstant.LoginMode.MAIL;
  // 点击登录按钮时的请求
  submitRequest: (data: ISubmitRequestParam) => Promise<any>;
  // 短信类型（注册、登录……）
  smsType?: ConfigConstant.SmsTypes;
  submitText?: string;
  hiddenProtocol?: boolean;
  mobileCodeType?: number;
  footer?: React.ReactNode;
  config?: IIdentifyingCodeConfig;
}

const initMode = (mode: IdentifyingCodeModes | undefined): IdentifyingCodeModes => {
  if (mode) return mode;

  const localStoredMode = localStorage.getItem('vika-preference-login-mode');
  if (localStoredMode) return localStoredMode as IdentifyingCodeModes;

  return ConfigConstant.LoginMode.PHONE;
};

const IdentifyingCodeLoginBase: FC<IIdentifyingCodeLoginProps> = ({
  submitRequest,
  smsType = ConfigConstant.SmsTypes.LOGIN_ACCOUNT,
  mode,
  submitText,
  hiddenProtocol,
  footer,
  config
}) => {
  // 账号或验证码
  const [data, setData] = useSetState({
    areaCode: '',
    account: '',
    credential: ''
  });
  // 错误信息
  const [errMsg, setErrMsg] = useSetState({ accountErrMsg: '', identifyingCodeErrMsg: '' });
  // 当前验证码登录模式
  const [identifyingCodeMode, setIdentifyingCodeMode] = useState<IdentifyingCodeModes>(initMode(mode));
  const mobileLoginRef = useRef<HTMLDivElement>(null);
  const { run: login, loading } = useRequest(submitRequest, { manual: true });
  const [checked, setChecked] = useState(false);

  const query = useQuery();

  const { mobile } = usePlatform();

  // 是否是自动化测试
  const automationTestingData = query.get('vikaTest');

  const _isMobileApp = isMobileApp();
  const linkToPrivacyPolicy = _isMobileApp ? Settings.link_to_privacy_policy_in_app.value : Settings.link_to_privacy_policy.value;
  const linkToTermsOfService = _isMobileApp ? Settings.link_to_terms_of_service_in_app.value : Settings.link_to_terms_of_service.value;

  const signIn = async(nvcVal?: string) => {
    clearStorage();
    const loginData: ISubmitRequestParam = {
      ...data,
      nvcVal: automationTestingData || nvcVal,
      // TODO: 这里还是需要区别一下 登录模式和登录类型
      type: identifyingCodeMode === ConfigConstant.LoginMode.PHONE ? ConfigConstant.LoginTypes.SMS : ConfigConstant.LoginTypes.EMAIL,
      mode: ConfigConstant.LoginMode.IDENTIFYING_CODE
    };
    const result = await login(loginData);
    // 将隐私协议标记为已读, 依赖这个标志不再弹窗
    localStorage.setItem(`${ConfigConstant.WizardIdConstant.AGREE_TERMS_OF_SERVICE}`, '1');
    if (!result) { return; }
    const { code, message, success } = result;
    if (success) { return; }
    switch (code) {
      case StatusCode.NAME_AND_PWD_ERR:
        setErrMsg({ accountErrMsg: message, identifyingCodeErrMsg: message });
        break;
      case StatusCode.ACCOUNT_ERROR:
        setErrMsg({ accountErrMsg: message });
        break;
      case StatusCode.SECONDARY_VALIDATION:
        break;
      case StatusCode.NVC_FAIL:
        break;
      default:
        setErrMsg({ identifyingCodeErrMsg: message });
    }
  };

  // 提交请求（登录/注册）
  const handleSubmit = () => {
    const accountValidity = checkAccount();
    const verificationCodeValidity = checkVerificationCode();

    if (!accountValidity || !verificationCodeValidity) return;

    if (!checked) {
      const config = {
        title: t(Strings.modal_title_privacy),
        content: (
          <div className={styles.agreement}>
            <Typography variant="body2" style={{ textAlign: 'justify' }}>
              <TComponent
                tkey={t(Strings.modal_content_policy)}
                params={{
                  content: (
                    <>
                      <a href={linkToPrivacyPolicy} target="_blank" rel="noreferrer">
                        {t(Strings.privacy_policy)}
                      </a>
                      {t(Strings.and)}
                      <a href={linkToTermsOfService} target="_blank" rel="noreferrer">
                        {t(Strings.terms_of_service)}
                      </a>
                    </>
                  )
                }}
              />
            </Typography>
          </div>
        ),
        okText: t(Strings.modal_privacy_ok_btn_text),
        onOk: () => {
          setChecked(true);
          signIn();
        },
      };
      if (mobile) {
        Modal.confirm(config);
      } else {
        AntModal.confirm(config);
      }

      return;
    }
    signIn();
  };

  // 进行账号合法性检测
  const checkAccount = (): boolean => {
    if (identifyingCodeMode === ConfigConstant.LoginMode.MAIL) {
      if (!data.account) {
        setErrMsg({ accountErrMsg: t(Strings.email_placeholder) });
        return false;
      }

      if (!isEmail(data.account)) {
        setErrMsg({ accountErrMsg: t(Strings.email_err) });
        return false;
      }
    }

    if (identifyingCodeMode === ConfigConstant.LoginMode.PHONE) {
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

  const checkVerificationCode = (): boolean => {
    if (!data.credential) {
      setErrMsg({ identifyingCodeErrMsg: t(Strings.verification_code_error_message) });
      return false;
    }

    return true;
  };

  // 输入数据改变
  const handleChange = data => {
    setData(data);
    setErrMsg({ identifyingCodeErrMsg: '', accountErrMsg: '' });
  };

  // 验证码模式切换
  const handleModeChange = mode => {
    setErrMsg({ identifyingCodeErrMsg: '', accountErrMsg: '' });
    setIdentifyingCodeMode(mode);
  };

  return (
    <ThemeProvider theme={ThemeName.Light}>
      <div className={styles.login} ref={mobileLoginRef}>
        <Form onFinish={handleSubmit} >
          <IdentifyingCodeModes
            mode={mode}
            smsType={smsType}
            defaultIdentifyingCodeMode={identifyingCodeMode}
            error={errMsg}
            onModeChange={handleModeChange}
            onChange={handleChange}
            checkAccount={checkAccount}
            config={config}
          />
          {/* 自动化测试专用 */}
          {/* {vikaTest && (
            <div className={styles.inputItem}>
              <label className={styles.label}>Code</label>
              <Input
                type="code"
                value={code}
                placeholder="Please Input the Code"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCode(e.target.value); }}
              />
            </div>
          )
          } */}
          {/* 自动化测试专用 */}

          {
            !hiddenProtocol &&
            <div className={styles.protocol}>
              <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />
              <div className={styles.protocolText}>
                <TComponent
                  tkey={t(Strings.privacy_check_box_content)}
                  params={{
                    content: (
                      <>
                        <a href={linkToPrivacyPolicy} target="_blank" rel="noreferrer">
                          {t(Strings.privacy_policy)}
                        </a>
                        {t(Strings.and)}
                        <a href={linkToTermsOfService} target="_blank" rel="noreferrer">
                          {t(Strings.terms_of_service)}
                        </a>
                      </>
                    )
                  }}
                />
              </div>
            </div>
          }

          <div className={styles.buttonWrapper}>
            <Button
              id={AutoTestID.LOGIN_BTN}
              type="submit"
              color="primary"
              size="large"
              loading={loading}
              disabled={loading}
              block
            >
              {submitText || t(Strings.login_register)}
            </Button>
          </div>
        </Form>
        {footer && <span className={styles.footer}> {footer}</span>}
      </div>
    </ThemeProvider>
  );
};
export const IdentifyingCodeLogin = memo(IdentifyingCodeLoginBase);
