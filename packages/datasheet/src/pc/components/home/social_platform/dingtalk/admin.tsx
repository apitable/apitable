import { Api, Navigation, Settings, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading, Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { useState } from 'react';
import { AdminLayout, IAdminData } from './admin_layout';

const config = {
  adminTitle: t(Strings.dingtalk_admin_panel_title),
  adminDesc: t(Strings.dingtalk_admin_panel_message),
  helpLink: Settings.link_to_dingtalk_cms.value,
};

const DingTalkAdmin = () => {
  const query = useQuery();
  const code = query.get('code') || '';
  const suiteId = query.get('suiteId') || '';
  const [data, setData] = useState<IAdminData | null>(null);
  const [corpId, setCorpId] = useState<string>(() => getStorage(StorageName.SocialPlatformMap)?.socialDingTalk?.[code] || '');

  // 变更管理员
  const { run: changeAdmin } = useRequest((spaceId, memberId) => Api.dingTalkChangeAdmin(suiteId, corpId, spaceId, memberId), {
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    onSuccess: res => {
      const { success, message } = res.data;
      if (!success) {
        return Message.error({ content: message });
      }
      Message.success({ content: t(Strings.success) });
      return getAdminDetail();
    },
    manual: true,
  });

  // 获取绑定的空间信息
  const { run: getAdminDetail } = useRequest(() => Api.dingTalkAdminDetail(suiteId, corpId), {
    onSuccess: res => {
      const { data, success } = res.data;

      if (!success) {
        return Router.push(Navigation.LOGIN);
      }
      return setData(data);
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    manual: true
  });

  // 管理员登陆
  const { run: adminLogin } = useRequest(() => Api.dingTalkAdminLogin(suiteId, code, corpId), {
    onSuccess: res => {
      const { data, success } = res.data;

      if (!success || !data.bindSpaceId) {
        return Message.error({ content: t(Strings.error) });
      }

      /**
       * corpId 需要存到 localStorage 中，
       * 在浏览器刷新后，需要再次调用登陆接口，并将 corpId 回传给后端，告知当前的企业 ID
       */
      const corpId = data.corpId;
      const socialPlatformMap = getStorage(StorageName.SocialPlatformMap) || {};
      socialPlatformMap.socialDingTalk = { [code]: corpId };
      setStorage(StorageName.SocialPlatformMap, socialPlatformMap);
      setCorpId(corpId);
      return getAdminDetail();
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    manual: true
  });

  useMount(() => {
    if (suiteId) {
      adminLogin();
    }
  });

  return (
    <>
      {
        data ?
          <AdminLayout
            data={data}
            config={config}
            onChange={changeAdmin}
          /> :
          <Loading />
      }
    </>
  );
};
export default DingTalkAdmin;
