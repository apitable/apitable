import { FC, useState } from 'react';
import { PasswordLogin } from './password_login';
import { IdentifyingCodeLogin, ISubmitRequestParam } from './identifying_code_login';
import { ConfigConstant, Navigation, t, Strings, ApiInterface, AutoTestID } from '@vikadata/core';
import { LinkButton } from '@vikadata/components';
import styles from './style.module.less';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useResponsive, useUserRequest } from 'pc/hooks';
import { ScreenSize } from 'pc/components/common/component_display/component_display';
import { polyfillMode } from './login';

export interface ILoginWithoutOtherProps {
  defaultEmail?: string;
  submitText?: string;
  showTitle?: boolean;
}

export const LoginWithoutOther: FC<ILoginWithoutOtherProps> = ({
  defaultEmail,
  submitText,
  showTitle = true,
}) => {
  const defaultMod = polyfillMode(localStorage.getItem('vika_login_mod')) || ConfigConstant.IDENTIFY_CODE_LOGIN;
  const [mod, setMod] = useState(defaultMod);
  const navigationTo = useNavigation();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { loginOrRegisterReq } = useUserRequest();

  const changeLoginMod = () => {
    const currentMod = mod === ConfigConstant.IDENTIFY_CODE_LOGIN ?
      ConfigConstant.PASSWORD_LOGIN : ConfigConstant.IDENTIFY_CODE_LOGIN;
    setMod(currentMod);
    localStorage.setItem('vika_login_mod', currentMod.toString());
  };

  const goResetPwd = () => {
    navigationTo({ path: Navigation.RESET_PWD });
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
      {/* 移动端或showTitle为false时不展示 */}
      {!isMobile && showTitle && <div className={styles.divider}><div className={styles.text}>{modTitleText}</div></div>}
      {
        mod === ConfigConstant.IDENTIFY_CODE_LOGIN ?
          <IdentifyingCodeLogin
            submitRequest={submitRequest}
            submitText={submitText}
            config={{ mail: { defaultValue: defaultEmail, disabled: true }}}
          /> :
          <PasswordLogin
            submitRequest={submitRequest}
            config={{ mail: { defaultValue: defaultEmail, disabled: true }}}
          />
      }
      <div className={styles.buttonGroup}>
        <LinkButton
          underline={false}
          component="button"
          id={AutoTestID.CHANGE_MODE_BTN}
          onClick={changeLoginMod}
          style={{ paddingLeft: 0 }}
        >
          {changeModText}
        </LinkButton>
        <LinkButton
          underline={false}
          component="button"
          onClick={goResetPwd}
          style={{ paddingRight: 0 }}
        >
          {t(Strings.retrieve_password)}
        </LinkButton>
      </div>
    </>
  );
};
