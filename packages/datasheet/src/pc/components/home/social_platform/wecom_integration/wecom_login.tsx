import { Api, Navigation, StatusCode, Strings, t } from '@vikadata/core';
import { useMount } from 'ahooks';
import { Loading, Message, Modal } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useQuery, useRequest } from 'pc/hooks';
import * as React from 'react';
import { wecomLogin } from '../../other_login';
import { isWecomFunc } from '../utils';

const WecomLogin: React.FC = () => {
  const query = useQuery();
  const navigationTo = useNavigation();
  const agentId = query.get('agentId') || '';
  const corpId = query.get('corpId') || '';
  const reference = query.get('reference') || undefined;
  const { run } = useRequest((corpId, agentId) => Api.wecomAgentBindSpace(corpId, agentId), {
    manual: true,
    onSuccess: res => {
      const { data, success, code } = res.data;
      if (!success) {
        // 需要登录
        switch(code) {
          case StatusCode.WECOM_NOT_BIND_SPACE: navigationTo({ path: Navigation.LOGIN }); break;
          case StatusCode.WECOM_NOT_BIND_DOMAIN: {
            Modal.warning({
              title: t(Strings.wecom_not_complete_bind_title),
              content: t(Strings.wecom_not_complete_bind_content),
              onOk: () => {
                navigationTo({ path: Navigation.LOGIN });
              },
            });
          } break;
          default: {
            if (isWecomFunc()) {
              wecomLogin(reference);
            } else {
              navigationTo({ path: Navigation.LOGIN });
            }
          }
        }
        return;
      }
      // 后端说明：success为true时bindSpaceId不为空
      if (!data?.bindSpaceId) {
        Message.error({ content: t(Strings.error) });
        return;
      }
      // 应用已经绑定了空间
      if (reference) {
        window.location.href = reference;
        return;
      }
      navigationTo({
        path: Navigation.WORKBENCH,
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
