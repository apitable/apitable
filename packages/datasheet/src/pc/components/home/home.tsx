import { Api, getCustomConfig, IReduxState, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { configResponsive, useResponsive } from 'ahooks';
import { Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { getSearchParams } from 'pc/utils';
import { FC, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import MobileHome from './mobile_home';
import PcHome from './pc_home';
import { isSocialDomain } from './social_platform';
import styles from './style.module.less';

configResponsive({
  large: 1023.98,
});

export const Home: FC = () => {
  configResponsive({
    large: 1023.98,
  });
  const responsive = useResponsive();
  const dispatch = useDispatch();
  const urlParams = getSearchParams();
  const reference = urlParams.get('reference') || undefined;

  const { isLogin } = useSelector((state: IReduxState) => (
    { isLogin: state.user.isLogin, user: state.user }), shallowEqual);

  useEffect(() => {
    localStorage.removeItem('qq_login_failed');
    const storageChange = (e: StorageEvent) => {
      if (!e.newValue) {
        return;
      }
      if (e.key === 'qq_login_failed') {
        if (e.newValue === 'true') {
          Message.error({ content: t(Strings.login_failed) });
        }
        localStorage.removeItem('qq_login_failed');
      }
    };
    window.addEventListener('storage', storageChange);
    return () => {
      window.removeEventListener('storage', storageChange);
    };
  }, []);

  useEffect(() => {
    if (!isSocialDomain()) {
      return;
    }
    Api.socialTenantEnv().then(res => {
      const { success, data } = res?.data;
      if (success) {
        dispatch(StoreActions.setEnvs(data?.envs ?? {}));
      }
    });
  }, [dispatch]);

  const { footer } = getCustomConfig();

  if (isLogin) {
    if (reference) {
      Router.redirect(Navigation.HOME, {
        query: {
          reference,
        }
      });
    } else {
      Router.redirect(Navigation.WORKBENCH);
    }
  }

  return <>
    <div className={styles.homeWrapper}>
      {responsive?.large || process.env.SSR ? <PcHome /> : <MobileHome />}
    </div>
    {footer && (
      <footer className={styles.footer}>
        {footer}
      </footer>
    )}
  </>;
};

