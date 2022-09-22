import { Api, Navigation, Strings, t } from '@vikadata/core';
import { useMount } from 'ahooks';
import { Spin } from 'antd';
import { Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import styles from './style.module.less';

const IdassCallback: React.FC = () => {
  const query = useQuery();
  const code = query.get('code') || '';
  const state = query.get('state') || '';
  const clientId = query.get('client_id') || '';
  const reference = query.get('reference') || localStorage.getItem('reference');

  useMount(() => {
    Api.idaasLoginCallback(clientId, code, state).then(res => {
      const { success, message } = res.data;
      if (success) {
        if (reference) {
          localStorage.removeItem('reference');
          window.location.href = reference;
          return;
        }
        Router.push(Navigation.HOME);
      } else {
        Message.error({ content: message || t(Strings.login_failed) });
        Router.push(Navigation.LOGIN, { query: { client_id: clientId }});
      }

    });
  });

  return (
    <div className={styles.idaasCallback}>
      <Spin />
    </div>
  );
};
export default IdassCallback;
