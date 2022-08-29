import { Api, Navigation, Strings, t } from '@vikadata/core';
import { useMount } from 'ahooks';
import { Loading, Message } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { useQuery, useRequest } from 'pc/hooks';

const DingTalkH5 = () => {
  const query = useQuery();
  const navigationTo = useNavigation();
  const agentId = query.get('agentId');
  const reference = query.get('reference') || '';

  const { run } = useRequest(agentId => Api.getDingtalkH5BindSpaceId(agentId), {
    manual: true,
    onSuccess: res => {
      const { data, success } = res.data;
      if (!success) {
        // 需要登录
        navigationTo({
          path: Navigation.DINGTALK,
          params: { dingtalkPath: 'login' },
          query: { reference }
        });
        return;
      }
      // 后端说明：success为true时bindSpaceId不为空
      if (!data.bindSpaceId) {
        Message.error({ content: t(Strings.error) });
        return;
      }
      // 应用已经绑定了空间
      // window.location.href = `/workbench?reference=${reference}&spaceId=${data.bindSpaceId}`;
      navigationTo({
        path: Navigation.WORKBENCH,
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
