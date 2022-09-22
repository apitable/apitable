import { Api, Navigation, Strings, t } from '@vikadata/core';
import { Spin } from 'antd';
import { Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import { FC, useEffect } from 'react';
import styles from './style.module.less';

const WechatCallback: FC = props => {
  const query = useQuery();
  const code = query.get('code') || '';
  const state = query.get('state') || '';
  const reference = localStorage.getItem('reference');

  useEffect(() => {
    Api.wechatLoginCallback(code, state).then(res => {
      const { success, data } = res.data;
      if (success) {
        if (data) {
          Router.push(Navigation.IMPROVING_INFO, { query: { token: data }});
        } else {
          if (reference) {
            localStorage.removeItem('reference');
            window.location.href = reference;
            return;
          }
          Router.redirect(Navigation.HOME,);
        }
      } else {
        Message.error({ content: t(Strings.login_failed) });
        Router.push(Navigation.LOGIN);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Spin />
    </div>
  );
};

export default WechatCallback;
