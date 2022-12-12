import { Button, ThemeName, ThemeProvider, Typography } from '@apitable/components';
import { AutoTestID, ConfigConstant, isEmail, isPhoneNumber, StatusCode, Strings, t } from '@apitable/core';
import { Checkbox, Form } from 'antd';
import { Modal } from 'pc/components/common/mobile/modal';
import { Modal as AntModal } from 'pc/components/common/modal/modal/modal';
import { TComponent } from 'pc/components/common/t_component';
import { IdentifyingCodeModes, IIdentifyingCodeConfig } from 'pc/components/home/login/identifying_code_login/identifying_code_modes';
import { useQuery, useRequest, useSetState } from 'pc/hooks';
import { usePlatform } from 'pc/hooks/use_platform';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import { clearStorage } from 'pc/utils/storage';
import * as React from 'react';
import { FC, memo, useRef, useState } from 'react';
import styles from './style.module.less';

export interface ISubmitRequestParam {
  areaCode: string;
  account: string;
  credential: string;
  nvcVal?: string;
  type: ConfigConstant.LoginTypes;
  mode?: ConfigConstant.LoginMode;
}

export interface IIdentifyingCodeLoginProps {
  mode?: ConfigConstant.LoginMode.PHONE | ConfigConstant.LoginMode.MAIL;
  submitRequest: (data: ISubmitRequestParam) => Promise<any>;
  smsType?: ConfigConstant.SmsTypes;
  submitText?: string;
  hiddenProtocol?: boolean;
  mobileCodeType?: number;
  footer?: React.ReactNode;
  config?: IIdentifyingCodeConfig;
}

export const initMode = (mode?: IdentifyingCodeModes): IdentifyingCodeModes => {
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
  // Account number or verification code
  const [data, setData] = useSetState({
    areaCode: '',
    account: '',
    credential: ''
  });
  // Error message
  const [errMsg, setErrMsg] = useSetState({ accountErrMsg: '', identifyingCodeErrMsg: '' });
  // Current Captcha login mode
  const [identifyingCodeMode, setIdentifyingCodeMode] = useState<IdentifyingCodeModes>(initMode(mode));
  const mobileLoginRef = useRef<HTMLDivElement>(null);
  const { run: login, loading } = useRequest(submitRequest, { manual: true });
  const [checked, setChecked] = useState(false);

  const query = useQuery();

  const { mobile } = usePlatform();

  // Is it an automated test
  const automationTestingData = query.get('vikaTest');

  const _isMobileApp = isMobileApp();
  const linkToPrivacyPolicy = _isMobileApp ? Strings.privacy_policy_title : getEnvVariables().PRIVACY_POLICY_URL;
  const linkToTermsOfService = _isMobileApp ? Strings.terms_of_service_title : getEnvVariables().SERVICE_AGREEMENT_URL;

  const signIn = async(nvcVal?: string) => {
    clearStorage();
    const loginData: ISubmitRequestParam = {
      ...data,
      nvcVal: automationTestingData || nvcVal,
      // TODO: There is still a distinction to be made between login mode and login type
      type: identifyingCodeMode === ConfigConstant.LoginMode.PHONE ? ConfigConstant.LoginTypes.SMS : ConfigConstant.LoginTypes.EMAIL,
      mode: ConfigConstant.LoginMode.IDENTIFYING_CODE
    };
    const result = await login(loginData);
    // Mark privacy agreement as read, rely on this flag to stop pop-ups
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

  // Submit a request (login/registration)
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

  // Perform account legitimacy checks
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

  // Input data change
  const handleChange = data => {
    setData(data);
    setErrMsg({ identifyingCodeErrMsg: '', accountErrMsg: '' });
  };

  // Captcha Mode Switching
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
          {/* For automation testing */}
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
          {/* For automation testing */}

          {
            !hiddenProtocol && getEnvVariables().PRIVACY_POLICY_URL &&
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
