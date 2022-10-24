import { FC, useEffect, useRef } from 'react';
import { Strings, t, isPrivateDeployment, getCustomConfig } from '@apitable/core';
import { Login } from '../../../login';
import { OtherLogin } from '../../../other_login';
import styles from './style.module.less';
import { isMobileApp } from 'pc/utils/env';

export const MobileAndAccountLogin: FC = () => {
  const secondPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initHeight = () => {
      const mobileHomeTarget = document.querySelector(`.${styles.mobileHome}`) as HTMLDivElement;
      if (!mobileHomeTarget) { return; }
      return mobileHomeTarget.clientHeight;
    };
    // 解决 登录/注册 页第二屏被输入法挤压的问题
    const onResize = () => {
      const secondPageTarget = (secondPageRef.current as HTMLDivElement);
      const mobileHomeTarget = document.querySelector(`.${styles.mobileHome}`) as HTMLDivElement;
      if (!secondPageTarget || !mobileHomeTarget) { return; }
      mobileHomeTarget.style.height = `${initHeight}px`;
      if (secondPageTarget.style.display === 'none') {
        secondPageTarget.style.display = 'block';
        return;
      }
      secondPageTarget.style.display = 'none';
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  const { slogan } = getCustomConfig();

  return (
    <div className={styles.mobileAndAccountLogin}>
      <div>
        <div className={styles.slogan}>{slogan || t(Strings.login_slogan)}</div>
        <Login />
      </div>
      {!isPrivateDeployment() && !isMobileApp() && <OtherLogin />}
    </div>
  );
};

