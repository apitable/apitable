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
  helpLink: Settings.integration_dingtalk_help_url.value,
};

const DingTalkAdmin = () => {
  const query = useQuery();
  const code = query.get('code') || '';
  const suiteId = query.get('suiteId') || '';
  const [data, setData] = useState<IAdminData | null>(null);
  const [corpId, setCorpId] = useState<string>(() => getStorage(StorageName.SocialPlatformMap)?.socialDingTalk?.[code] || '');

  //  Change Manager
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

  // Get the bound space information
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

  // Administrator Login
  const { run: adminLogin } = useRequest(() => Api.dingTalkAdminLogin(suiteId, code, corpId), {
    onSuccess: res => {
      const { data, success } = res.data;

      if (!success || !data.bindSpaceId) {
        return Message.error({ content: t(Strings.error) });
      }

      /**
       * The corpId needs to be stored in localStorage.
       * After a browser refresh, the login interface needs to be called again and the corpId
       * needs to be passed back to the backend with the current corporate ID
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
