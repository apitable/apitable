import { Loading } from '@apitable/components';
import { Api, IUserInfo, Strings, t } from '@apitable/core';
import { useRouter } from 'next/router';
import { useRequest } from 'pc/hooks';
import * as React from 'react';
import { useRef, useState } from 'react';
import styles from './styles.module.less';
import { WecomIntegrationContext } from './wecom_integration_context';
import { WecomIntegrationHeader } from './wecom_integration_header';

const WecomIntegration: React.FC = ({ children }) => {
  const router = useRouter();
  const { loading: isLoginStatusGetting } = useRequest(() => Api.getUserMe().then(res => {
    const { data, success } = res.data;
    if (success) {
      setUserInfo(data);
    }
  }));
  const wecomIntegrationRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  const scrollTo = (x?: number, y?: number) => {
    const defaultScrollX = wecomIntegrationRef?.current?.scrollTop || 0;
    const defaultScrollY = wecomIntegrationRef?.current?.scrollLeft || 0;
    wecomIntegrationRef?.current?.scrollTo(x || defaultScrollX, y || defaultScrollY);
  };

  if (isLoginStatusGetting) {
    return <Loading />;
  }

  return (
    userInfo?.isAdmin ?
      <WecomIntegrationContext.Provider
        value={{
          scrollTo
        }}
      >
        <div className={styles.wecomIntegrationWrap}>
          <div className={styles.wecomIntegration} ref={wecomIntegrationRef}>
            <WecomIntegrationHeader userInfo={userInfo} />
            <div className={styles.container}>
              {children}
            </div>
            <div className={styles.statementFooter}>
              <div className={styles.statementText}>copyright © 2019-2021 深圳维格智数科技有限公司.All rights reserved.</div>
              <a href="/help/how-contact-service" target="_blank">{t(Strings.connect_us)}</a>
            </div>
          </div>
        </div>
      </WecomIntegrationContext.Provider> : <>
        {
          router.replace('/')
        }
      </>

  );
};

export default WecomIntegration;
