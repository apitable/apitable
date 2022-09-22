import { Loading, Message } from '@vikadata/components';
import { Api, Navigation, Strings, t } from '@vikadata/core';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import * as React from 'react';
import { useEffect } from 'react';
import styles from './styles.module.less';

const WecomToBind: React.FC = () => {
  const query = useQuery();
  const code = query.get('code') || '';
  const domainName = query.get('domainName') || '';
  const configSha = query.get('configSha') || '';
  const spaceId = query.get('spaceId') || '';

  const toErrorPage = (errorCode?: string) => {
    Router.push(Navigation.WECOM, {
      params: {
        wecomPath: 'error'
      }, clearQuery: true, query: { errorCode }
    });
  };

  useEffect(() => {
    if (!configSha || !code || !spaceId) {
      toErrorPage();
      return;
    }
    Api.socialWecomBindConfig(configSha, code, spaceId).then(res => {
      const { success, code } = res.data;
      if (success) {
        Message.success({ content: t(Strings.binding_success) });
        Router.push(Navigation.WECOM, {
          params: { wecomPath: 'integration/bind_success' }, query: {
            domainName
          }, clearQuery: true
        });
        return;
      }
      toErrorPage(code);
    }).catch(() => {
      toErrorPage();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.loadingWrap}>
      <Loading />
      <div className={styles.loadingText}>{t(Strings.integration_app_wecom_bind_loading_text)}</div>
    </div>
  );
};

export default WecomToBind;
