import { LinkButton } from '@vikadata/components';
import { ApiInterface, AutoTestID, ConfigConstant, Navigation, Strings, t } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive, useUserRequest } from 'pc/hooks';
import { FC, useState } from 'react';
import { IdentifyingCodeLogin, ISubmitRequestParam } from './identifying_code_login';
import { polyfillMode } from './login';
import { PasswordLogin } from './password_login';
import styles from './style.module.less';

export interface ILoginWithoutOtherProps {
  defaultEmail?: string;
  submitText?: string;
  showTitle?: boolean;
}

export const LoginWithoutOther: FC<ILoginWithoutOtherProps> = ({ defaultEmail, submitText, showTitle = true }) => {
  const defaultMod = polyfillMode(localStorage.getItem('vika_login_mod')) || ConfigConstant.IDENTIFY_CODE_LOGIN;
  const [mod, setMod] = useState(defaultMod);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { loginOrRegisterReq } = useUserRequest();

  const changeLoginMod = () => {
    const currentMod = mod === ConfigConstant.IDENTIFY_CODE_LOGIN ? ConfigConstant.PASSWORD_LOGIN : ConfigConstant.IDENTIFY_CODE_LOGIN;
    setMod(currentMod);
    localStorage.setItem('vika_login_mod', currentMod.toString());
  };

  const goResetPwd = () => {
    Router.push(Navigation.RESET_PWD);
  };

  const submitRequest = (data: ISubmitRequestParam) => {
    const loginData: ApiInterface.ISignIn = {
      areaCode: data.areaCode,
      username: data.account,
      type: data.type,
      credential: data.credential,
      data: data.nvcVal,
    };
    return loginOrRegisterReq(loginData);
  };

  const modTitleText = mod === ConfigConstant.IDENTIFY_CODE_LOGIN ? t(Strings.verification_code_login) : t(Strings.password_login);
  const changeModText = mod === ConfigConstant.IDENTIFY_CODE_LOGIN ? t(Strings.password_login) : t(Strings.verification_code_login);

  return (
    <>
      {/* Not shown on mobile or when showTitle is false */}
      {!isMobile && showTitle && (
        <div className={styles.divider}>
          <div className={styles.text}>{modTitleText}</div>
        </div>
      )}
      {mod === ConfigConstant.IDENTIFY_CODE_LOGIN ? (
        <IdentifyingCodeLogin
          submitRequest={submitRequest}
          submitText={submitText}
          config={{ mail: { defaultValue: defaultEmail, disabled: true }}}
        />
      ) : (
        <PasswordLogin submitRequest={submitRequest} config={{ mail: { defaultValue: defaultEmail, disabled: true }}} />
      )}
      <div className={styles.buttonGroup}>
        <LinkButton underline={false} component='button' id={AutoTestID.CHANGE_MODE_BTN} onClick={changeLoginMod} style={{ paddingLeft: 0 }}>
          {changeModText}
        </LinkButton>
        <LinkButton underline={false} component='button' onClick={goResetPwd} style={{ paddingRight: 0 }}>
          {t(Strings.retrieve_password)}
        </LinkButton>
      </div>
    </>
  );
};
