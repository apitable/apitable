import { Api, Navigation, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading, Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';

const DingTalkBindSpace = () => {
  const query = useQuery();
  const suiteId = query.get('suiteId') || '';
  const corpId = query.get('corpId') || '';
  const bizAppId = query.get('bizAppId') || '';

  const { run } = useRequest(() => Api.dingTalkBindSpace(suiteId, corpId), {
    onSuccess: res => {
      const { data, success } = res.data;

      if (!success || !data?.bindSpaceId) {
        return Router.push(Navigation.DINGTALK, {
          params: { dingtalkPath: 'social_login' },
          query: { suiteId, corpId, bizAppId },
          clearQuery: true
        });
      }
      // return window.location.href = `/workbench/${bizAppId}?spaceId=${data.bindSpaceId}`;
      return Router.push(Navigation.WORKBENCH, {
        params: { spaceId: data.bindSpaceId, nodeId: bizAppId },
        query: { spaceId: data.bindSpaceId },
        clearQuery: true
      });
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    manual: true
  });

  useMount(() => {
    if (suiteId) {
      run();
    }
  });

  return <Loading />;
};
export default DingTalkBindSpace;
