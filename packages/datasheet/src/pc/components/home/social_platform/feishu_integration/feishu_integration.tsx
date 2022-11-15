import { Loading } from '@apitable/components';
import { Api, IUserInfo } from '@apitable/core';
import FeishuSyncConcat from 'pc/components/home/social_platform/feishu_integration/feishu_sync_concat';
import { useRequest } from 'pc/hooks';
import * as React from 'react';
import { useState } from 'react';
import { Copyright } from '../ui';
import styles from '../wecom_integration/styles.module.less';
import { FeishuIntegrationHeader } from './feishu_integration_header';

const FeishuIntegration: React.FC = ({ children }) => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const { loading: isLoginStatusGetting } = useRequest(() => Api.getUserMe().then(res => {
    const { data, success } = res.data;
    if (success) {
      setUserInfo(data);
    }
  }));

  if (isLoginStatusGetting || !userInfo) {
    return <Loading />;
  }

  return (
    <div className={styles.wecomIntegrationWrap}>
      <div className={styles.wecomIntegration}>
        <FeishuIntegrationHeader userInfo={userInfo} />
        <div className={styles.container}>
          {children ? children : <FeishuSyncConcat spaceId={userInfo.spaceId} />}
          {/*<Routes>*/}
          {/*  <Route*/}
          {/*    path="sync/:appInstanceId"*/}
          {/*    element={<FeishuSyncConcat spaceId={userInfo.spaceId} />}*/}
          {/*  />*/}
          {/*  <Route path="config/:appInstanceId" element={<FeishuConfig />} />*/}
          {/*  <Route path="bind/:appInstanceId" element={<FeishuIntegrationBind />} />*/}
          {/*</Routes>*/}
        </div>
        <Copyright />
      </div>
    </div>
  );
};

export default FeishuIntegration;
