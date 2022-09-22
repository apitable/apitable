import { lightColors, LinkButton } from '@vikadata/components';
import { ApiInterface, AutoTestID, ConfigConstant, getCustomConfig, Navigation, Strings, t } from '@vikadata/core';
import { DingdingFilled, FeishuFilled, QqFilled, WechatFilled } from '@vikadata/icons';
import { useToggle } from 'ahooks';

import { polyfillMode } from 'pc/components/home/login';

import { IdentifyingCodeLogin, ISubmitRequestParam } from 'pc/components/home/login/identifying_code_login';
import { PasswordLogin } from 'pc/components/home/login/password_login';
import { SSOLogin } from 'pc/components/home/login/sso_login';

import commonLoginStyles from 'pc/components/home/login/style.module.less';
import { dingdingLogin, feishuLogin, qqLogin, wechatLogin } from 'pc/components/home/other_login';
import { Router } from 'pc/components/route_manager/router';

import { useUserRequest } from 'pc/hooks';
import Trigger from 'rc-trigger';
import * as React from 'react';
import { useSelector } from 'react-redux';

export const PhoneAndEmailLogin = (): JSX.Element => {
  const {
    loginMode,
    resetPasswordDisable,
    ssoLogin,
    supportAccountType,
  } = getCustomConfig();

  const toggleLoginModBtnVisible = !supportAccountType;
  const isWecom = useSelector(state => state.space.envs?.weComEnv?.enabled);
  const { loginOrRegisterReq } = useUserRequest();
  const [isPopupVisible, { toggle: popupVisibleToggle }] = useToggle(false);
  const commonDefaultMod = polyfillMode(localStorage.getItem('vika_login_mod')) || loginMode;
  const defaultMod = ssoLogin ? ConfigConstant.SSO_LOGIN : commonDefaultMod;
  // commonPrev 只是保存了密码或验证码登录两种方式
  const [mod, setMod] = React.useState(defaultMod);

  const changeLoginMod = () => {
    let currentMod = 'identifying_code';
    if (ssoLogin) {
      currentMod = mod === ConfigConstant.PASSWORD_LOGIN ? ConfigConstant.SSO_LOGIN : ConfigConstant.PASSWORD_LOGIN;
    } else {
      currentMod = mod === ConfigConstant.IDENTIFY_CODE_LOGIN ?
        ConfigConstant.PASSWORD_LOGIN : ConfigConstant.IDENTIFY_CODE_LOGIN;
    }
    setMod(currentMod);
    localStorage.setItem('vika_login_mod', currentMod.toString());
  };

  const submitRequest = React.useCallback((data: ISubmitRequestParam) => {
    const loginData: ApiInterface.ISignIn = {
      areaCode: data.areaCode,
      username: data.account,
      type: data.type,
      credential: data.credential,
      data: data.nvcVal,
      mode: data.mode,
    };
    return loginOrRegisterReq(loginData, data.type);
  }, [loginOrRegisterReq]);

  const goResetPwd = () => {
    Router.push(Navigation.RESET_PWD);
  };

  const modConfig = React.useMemo(() => {
    let changeModText = '';
    let loginComponent: null | React.ReactNode = null;
    switch (mod) {
      case ConfigConstant.IDENTIFY_CODE_LOGIN:
        loginComponent = <IdentifyingCodeLogin submitRequest={submitRequest} />;
        changeModText = t(Strings.password_login);
        break;
      case ConfigConstant.PASSWORD_LOGIN:
        loginComponent = <PasswordLogin submitRequest={submitRequest} />;
        changeModText = ssoLogin ? t(Strings.sso_login) : t(Strings.verification_code_login);
        break;
      case ConfigConstant.SSO_LOGIN:
        loginComponent = <SSOLogin submitRequest={submitRequest} />;
        changeModText = t(Strings.password_login);
        break;
      default:
        break;
    }
    return { loginComponent, changeModText };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitRequest, mod]);

  const { loginComponent, changeModText } = modConfig;

  const loginOtherPopup = (
    <div className={commonLoginStyles.loginOtherPopup} onClick={() => popupVisibleToggle()}>
      <div className={commonLoginStyles.loginOtherItem} onClick={() => wechatLogin()}>
        <WechatFilled size={16} color={lightColors.rc04} />
        <span>{t(Strings.wechat)}</span>
      </div>
      <div className={commonLoginStyles.loginOtherItem} onClick={() => dingdingLogin()}>
        <DingdingFilled size={16} color={lightColors.rc02} />
        <span>{t(Strings.dingtalk)}</span>
      </div>
      <div className={commonLoginStyles.loginOtherItem} onClick={() => feishuLogin()}>
        <FeishuFilled size={16} />
        <span>{t(Strings.lark)}</span>
      </div>
      <div className={commonLoginStyles.loginOtherItem} onClick={() => qqLogin()}>
        <QqFilled size={16} color={lightColors.rc03} />
        <span>{t(Strings.qq)}</span>
      </div>
    </div>
  );

  return (
    <div>
      {loginComponent}
      <div className={commonLoginStyles.buttonGroup}>
        {isWecom ? (
          <div className={commonLoginStyles.buttonGroupDesktop}>
            {toggleLoginModBtnVisible &&
              <LinkButton
                underline={false}
                component='button'
                id={AutoTestID.CHANGE_MODE_BTN}
                className='toggleLoginModeBtn'
                onClick={changeLoginMod}
              >
                {changeModText}
              </LinkButton>
            }
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
              <LinkButton
                underline={false}
                component='button'
              >
                {t(Strings.other_login)}
              </LinkButton>
            </Trigger>
            {!resetPasswordDisable &&
              <LinkButton
                underline={false}
                component='button'
                onClick={goResetPwd}
              >
                {t(Strings.retrieve_password)}
              </LinkButton>
            }
          </div>
        ) : (
          <>
            <div>
              {toggleLoginModBtnVisible &&
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
              }
            </div>
            {!resetPasswordDisable &&
              <LinkButton
                underline={false}
                component='button'
                onClick={goResetPwd}
                style={{ paddingRight: 0 }}
              >
                {t(Strings.retrieve_password)}
              </LinkButton>
            }
          </>
        )}
      </div>
    </div>
  );
};
