import { Api, Navigation, StatusCode, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import dd from 'dingtalk-jsapi';
import { IRuntimePermissionRequestAuthCodeParams } from 'dingtalk-jsapi/api/runtime/permission/requestAuthCode';
import { Loading, Message } from 'pc/components/common';
import ContactSyncing from 'pc/components/home/social_platform/dingtalk/contact_syncing/contact_syncing';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { useState } from 'react';

const DingTalkLogin = () => {
  const query = useQuery();
  const corpId = query.get('corpId') || '';
  const suiteId = query.get('suiteId') || '';
  const bizAppId = query.get('bizAppId') || '';
  const [count, setCount] = useState(0);
  const [isSyncing, setSyncing] = useState(false);

  const { run: login } = useRequest(code => Api.dingTalkUserLogin(suiteId, corpId, code, bizAppId), {
    onSuccess: res => {
      const { data, success, code } = res.data;

      // 当内部服务不稳定时，进行重试
      if (code === StatusCode.COMMON_ERR && count < 3) {
        setCount(count + 1);
        return dd.runtime.permission.requestAuthCode({
          corpId,
          onSuccess: res => login(res.code),
          onFail: (err) => Message.error({ content: err.errorMessage }),
        } as IRuntimePermissionRequestAuthCodeParams);
      }

      // 需要联系管理员的情况
      if ([StatusCode.DINGTALK_NOT_BIND_SPACE, StatusCode.DINGTALK_USER_NOT_EXIST].includes(code)) {
        Message.error({ content: t(Strings.dingtalk_tenant_not_exist_tips) });
        return Router.push(Navigation.LOGIN, {
          clearQuery: true
        });
      }

      if (code === StatusCode.DINGTALK_USER_CONTACT_SYNCING) {
        return setSyncing(true);
      }

      // 其余情况，联系客服
      if (!success || !data.bindSpaceId) {
        Message.error({ content: t(Strings.dingtalk_login_fail_tips) });
        return Router.push(Navigation.LOGIN, {
          clearQuery: true
        });
      }

      const { shouldRename, defaultName } = data;
      if (shouldRename) {
        return Router.push(Navigation.SETTING_NICKNAME, {
          query: { defaultName },
          clearQuery: true
        });
      }

      return Router.push(Navigation.WORKBENCH, {
        params: { spaceId: data.bindSpaceId, nodeId: bizAppId },
        clearQuery: true
      });
    },
    onError: () => {
      Message.error({ content: t(Strings.dingtalk_login_fail_tips) });
    },
    manual: true
  });

  useMount(() => {
    if (suiteId && corpId) {
      dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: res => login(res.code),
        onFail: (err) => Message.error({ content: err.errorMessage }),
      } as IRuntimePermissionRequestAuthCodeParams);
    }
  });

  return (
    <>
      {
        isSyncing ?
          <ContactSyncing /> :
          <Loading />
      }
    </>
  );
};
export default DingTalkLogin;
