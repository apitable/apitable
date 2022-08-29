import { Message } from '@vikadata/components';
import { Api, Navigation, Strings, t } from '@vikadata/core';
import { Spin } from 'antd';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useQuery } from 'pc/hooks';
import * as React from 'react';
import { useEffect } from 'react';
import styles from './styles.module.less';

const WecomCallback: React.FC = () => {
  const query = useQuery();
  const code = query.get('code') || '';
  const agentId = query.get('agentId') || '';
  const corpId = query.get('corpId') || '';
  const reference = query.get('reference') || '';
  const navigationTo = useNavigation();

  useEffect(() => {
    Api.wecomLoginCallback(code, agentId, corpId).then(res => {
      const { success, data, code } = res.data;
      if (success) {
        if (reference) {
          window.location.href = reference;
        } else if (data && data.bindSpaceId) {
          navigationTo({ path: Navigation.WORKBENCH, params: { spaceId: data.bindSpaceId }, clearQuery: true });
        } else {
          navigationTo({ path: Navigation.HOME });
        }
      } else if (code === 1109){
        switch(code) {
          case 1109: Message.error({ content: t(Strings.wecom_logo_unauthorized_error) }); break;
          default: Message.error({ content: t(Strings.login_failed) });
        }
        navigationTo({ path: Navigation.LOGIN });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.wecomCallback}>
      <Spin />
    </div>
  );
};

export default WecomCallback;
