import { Api, Navigation, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading, Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';

const DingTalkH5 = () => {
  const query = useQuery();
  const agentId = query.get('agentId');
  const reference = query.get('reference') || '';

  const { run } = useRequest(agentId => Api.getDingtalkH5BindSpaceId(agentId), {
    manual: true,
    onSuccess: res => {
      const { data, success } = res.data;
      if (!success) {
        Router.push(Navigation.DINGTALK, {
          params: { dingtalkPath: 'login' },
          query: { reference }
        });
        return;
      }
      if (!data.bindSpaceId) {
        Message.error({ content: t(Strings.error) });
        return;
      }
      // window.location.href = `/workbench?reference=${reference}&spaceId=${data.bindSpaceId}`;
      Router.push(Navigation.WORKBENCH, {
        params: { spaceId: data.bindSpaceId },
        query: { reference, spaceId: data.bindSpaceId }
      });
      return;
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    }
  });
  useMount(() => {
    if (agentId) {
      run(agentId);
    }
  });
  return <Loading />;
};
export default DingTalkH5;
