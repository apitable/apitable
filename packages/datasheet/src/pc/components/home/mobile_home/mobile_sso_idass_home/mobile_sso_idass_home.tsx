import React, { FC, useState } from 'react';
import { SsoNav, LoginContent, LoginButton } from '../../pc_sso_idaas_home';
import styles from './style.module.less';
import { PasswordLogin } from '../../login/password_login';
import { ISubmitRequestParam } from '../../login/identifying_code_login';
import { useUserRequest, useResponsive } from 'pc/hooks';
import { ApiInterface } from '@vikadata/core';
import { ScreenSize } from 'pc/components/common/component_display';
export const MobileSsoIdassHome: FC = () => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const [isPasswordLogin, setIsPasswordLogin] = useState<Boolean>(false);
  const { loginOrRegisterReq } = useUserRequest();

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

  return (
    <>
      {!isMobile ? (
        <div className={styles.middleContent}>
          <div className={styles.middleheader}>
            <div className={styles.solgan}>
              <img src={`${process.env.PUBLIC_URL}/common_img_logo.png`} alt="vika_logo" />
              <p>更简单，却更强大</p>
            </div>
            <SsoNav />
          </div>
          <LoginContent />
        </div>
      ) : (
        <div className={styles.mobileContent}>
          {isPasswordLogin ? (
            <div className={styles.passwordContent}>
              <div className={styles.header}>
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="vika_logo" />
                <p>维格专有云版</p>
              </div>
              <PasswordLogin submitRequest={submitRequest} />
            </div>
          ) : (
            <>
              <div className={styles.topContent}>
                <div className={styles.mobileSolgan}>
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="vika_logo" />
                  <p>维格专有云版</p>
                </div>
              </div>
              <div className={styles.loginButton}>
                <LoginButton />
              </div>
            </>
          )}
          <p className={styles.swtichLogin} onClick={() => setIsPasswordLogin(!isPasswordLogin)}>
            {isPasswordLogin ? '切换快速登录' : '切换账号登录'}
          </p>
          <div className={styles.mobileNav}>
            <SsoNav />
          </div>
        </div>
      )}
    </>
  );
};
