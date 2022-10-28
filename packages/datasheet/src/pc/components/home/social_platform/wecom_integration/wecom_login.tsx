import { Api, Navigation, StatusCode, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading, Message, Modal } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import * as React from 'react';
import { wecomLogin } from '../../other_login';
import { isWecomFunc } from '../utils';

const WecomLogin: React.FC = () => {
  const query = useQuery();
  const agentId = query.get('agentId') || '';
  const corpId = query.get('corpId') || '';
  const reference = query.get('reference') || undefined;
  const { run } = useRequest((corpId, agentId) => Api.wecomAgentBindSpace(corpId, agentId), {
    manual: true,
    onSuccess: res => {
      const { data, success, code } = res.data;
      if (!success) {
        switch (code) {
          case StatusCode.WECOM_NOT_BIND_SPACE:
            Router.push(Navigation.LOGIN);
            break;
          case StatusCode.WECOM_NOT_BIND_DOMAIN: {
            Modal.warning({
              title: t(Strings.wecom_not_complete_bind_title),
              content: t(Strings.wecom_not_complete_bind_content),
              onOk: () => {
                Router.push(Navigation.LOGIN);
              },
            });
          }
            break;
          default: {
            if (isWecomFunc()) {
              wecomLogin(reference);
            } else {
              Router.push(Navigation.LOGIN);
            }
          }
        }
        return;
      }
      if (!data?.bindSpaceId) {
        Message.error({ content: t(Strings.error) });
        return;
      }
      if (reference) {
        window.location.href = reference;
        return;
      }
      Router.push(Navigation.WORKBENCH, {
        params: { spaceId: data.bindSpaceId },
      });
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    }
  });
  useMount(() => {
    if (corpId && agentId) {
      run(corpId, agentId);
    }
  });
  return <Loading />;
};

export default WecomLogin;
