import { LinkButton, useThemeColors } from '@vikadata/components';
import { ApiInterface, AutoTestID, ConfigConstant, getCustomConfig, isPrivateDeployment, Navigation, Strings, t } from '@vikadata/core';
import { DingdingFilled, FeishuFilled, QqFilled, WechatFilled } from '@vikadata/icons';
import { configResponsive, useResponsive, useToggle } from 'ahooks';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useResponsive as useCustomResponsive, useUserRequest } from 'pc/hooks';
import { isMobileApp } from 'pc/utils/env';
import Trigger from 'rc-trigger';
import * as React from 'react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { dingdingLogin, feishuLogin, OtherLogin, qqLogin, wechatLogin } from '../other_login';
import { isWecomFunc } from '../social_platform';
import { IdentifyingCodeLogin, ISubmitRequestParam } from './identifying_code_login';
import { PasswordLogin } from './password_login';
import { SSOLogin } from './sso_login';
import styles from './style.module.less';
import { WecomLoginBtn } from './wecom_login_btn';

export interface ILoginProps {
  afterLogin?(data: string, loginMode: ConfigConstant.LoginMode): void;
}

export const polyfillMode = (mode: string | null) => {
  if (mode == null || !isNaN(Number(mode))) {
    return null;
  }

  return mode;
};

export const Login: FC<ILoginProps> = ({ afterLogin }) => {
  const { loginMode, resetPasswordDisable, ssoLogin, supportAccountType } = getCustomConfig();
  const colors = useThemeColors();

  const toggleLoginModBtnVisible = !supportAccountType || ssoLogin;

  const commonDefaultMod = polyfillMode(localStorage.getItem('vika_login_mod')) || loginMode;
  const defaultMod = ssoLogin ? ConfigConstant.SSO_LOGIN : commonDefaultMod;
  // commonPrev 只是保存了密码或验证码登录两种方式
  const [mod, setMod] = useState(defaultMod);

  const { loginOrRegisterReq } = useUserRequest();
  configResponsive({
    large: 1023.98,
  });
  const responsive = useResponsive();
  const { screenIsAtMost } = useCustomResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const [isPopupVisible, { toggle: popupVisibleToggle }] = useToggle(false);
  const isWecom = useSelector(state => state.space.envs?.weComEnv?.enabled || isWecomFunc());
  const changeLoginMod = () => {
    let currentMod = 'identifying_code';
    if (ssoLogin) {
      currentMod = mod === ConfigConstant.PASSWORD_LOGIN ? ConfigConstant.SSO_LOGIN : ConfigConstant.PASSWORD_LOGIN;
    } else {
      currentMod = mod === ConfigConstant.IDENTIFY_CODE_LOGIN ? ConfigConstant.PASSWORD_LOGIN : ConfigConstant.IDENTIFY_CODE_LOGIN;
    }
    setMod(currentMod);
    localStorage.setItem('vika_login_mod', currentMod.toString());
  };
  const submitRequest = React.useCallback(
    (data: ISubmitRequestParam) => {
      const loginData: ApiInterface.ISignIn = {
        areaCode: data.areaCode,
        username: data.account,
        type: data.type,
        credential: data.credential,
        data: data.nvcVal,
        mode: data.mode,
      };
      return loginOrRegisterReq(loginData, data.type);
    },
    [loginOrRegisterReq],
  );

  const goResetPwd = () => {
    Router.push(Navigation.RESET_PWD);
  };

  const modConfig = React.useMemo(() => {
    let modTitleText = '';
    let changeModText = '';
    let loginComponent: null | React.ReactNode = null;
    switch (mod) {
      case ConfigConstant.IDENTIFY_CODE_LOGIN:
        modTitleText = t(Strings.verification_code_login);
        loginComponent = <IdentifyingCodeLogin submitRequest={submitRequest} />;
        changeModText = t(Strings.password_login);
        break;
      case ConfigConstant.PASSWORD_LOGIN:
        modTitleText = t(Strings.password_login);
        loginComponent = <PasswordLogin submitRequest={submitRequest} />;
        changeModText = ssoLogin ? t(Strings.sso_login) : t(Strings.verification_code_login);
        break;
      case ConfigConstant.SSO_LOGIN:
        modTitleText = t(Strings.sso_login);
        loginComponent = <SSOLogin submitRequest={submitRequest} />;
        changeModText = t(Strings.password_login);
        break;
      default:
        break;
    }
    return { modTitleText, loginComponent, changeModText };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitRequest, mod]);

  const { modTitleText, loginComponent, changeModText } = modConfig;

  // 其他登录方式的popup
  const loginOtherPopup = (
    <div className={styles.loginOtherPopup} onClick={() => popupVisibleToggle()}>
      <div className={styles.loginOtherItem} onClick={() => wechatLogin()}>
        <WechatFilled size={16} color={colors.rc04} />
        <span>{t(Strings.wechat)}</span>
      </div>
      <div className={styles.loginOtherItem} onClick={() => dingdingLogin()}>
        <DingdingFilled size={16} color={colors.rc02} />
        <span>{t(Strings.dingtalk)}</span>
      </div>
      <div className={styles.loginOtherItem} onClick={() => feishuLogin()}>
        <FeishuFilled size={16} />
        <span>{t(Strings.lark)}</span>
      </div>
      <div className={styles.loginOtherItem} onClick={() => qqLogin()}>
        <QqFilled size={16} color={colors.rc03} />
        <span>{t(Strings.qq)}</span>
      </div>
    </div>
  );

  return (
    <>
      {// 私有化和移动端不显示
        !isPrivateDeployment() && responsive.large && !isMobileApp() && (
          <>
            <div className={styles.otherLogin}>
              {isWecom ? (
                <WecomLoginBtn />
              ) : (
                <>
                  <div className={styles.otherDivider}>
                    <div className={styles.text}>{t(Strings.quick_login)}</div>
                  </div>
                  <OtherLogin afterLogin={afterLogin} />
                </>
              )}
            </div>
          </>
        )}
      {!isMobile && (
        <div className={styles.divider}>
          <div className={styles.text}>{modTitleText}</div>
        </div>
      )}

      {loginComponent}
      <div className={styles.buttonGroup}>
        {// 移动端或者企业微信专属域名
          !responsive.large || !isWecom ? (
            <>
              <div>
                {toggleLoginModBtnVisible && (
                  <LinkButton
                    underline={false}
                    component='button'
                    id={AutoTestID.CHANGE_MODE_BTN}
                    className='toggleLoginModeBtn'
                    onClick={changeLoginMod}
                    style={{ paddingLeft: 0 }}
                  >
                    {changeModText}
                  </LinkButton>
                )}
              </div>
              {!resetPasswordDisable && (
                <LinkButton underline={false} component='button' onClick={goResetPwd} style={{ paddingRight: 0 }}>
                  {t(Strings.retrieve_password)}
                </LinkButton>
              )}
            </>
          ) : (
            <div className={styles.buttonGroupDesktop}>
              {toggleLoginModBtnVisible && (
                <LinkButton
                  underline={false}
                  component='button'
                  id={AutoTestID.CHANGE_MODE_BTN}
                  className='toggleLoginModeBtn'
                  onClick={changeLoginMod}
                >
                  {changeModText}
                </LinkButton>
              )}
              <Trigger
                action={['click']}
                popup={loginOtherPopup}
                destroyPopupOnHide
                popupAlign={{ points: ['b', 'c'], offset: [0, -20], overflow: { adjustX: true, adjustY: true }}}
                popupStyle={{ width: 240 }}
                popupVisible={isPopupVisible}
                onPopupVisibleChange={() => popupVisibleToggle()}
                zIndex={10000}
              >
                <LinkButton underline={false} component='button'>
                  {t(Strings.other_login)}
                </LinkButton>
              </Trigger>
              {!resetPasswordDisable && (
                <LinkButton underline={false} component='button' onClick={goResetPwd}>
                  {t(Strings.retrieve_password)}
                </LinkButton>
              )}
            </div>
          )}
      </div>
    </>
  );
};
