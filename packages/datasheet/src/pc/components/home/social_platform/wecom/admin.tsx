import { Api, Navigation, Settings, StatusCode, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading, Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { useState } from 'react';
import { AdminLayout, IAdminData } from '../dingtalk/admin_layout';

const config = {
  adminTitle: t(Strings.wecom_admin_title),
  adminDesc: t(Strings.wecom_admin_desc),
  helpLink: Settings.link_to_wecom_shop_cms.value,
};

const WecomAdmin = () => {
  const query = useQuery();
  const code = query.get('code') || query.get('auth_code') || '';
  const suiteId = query.get('suiteid') || '';
  const [data, setData] = useState<IAdminData | null>(null);
  const [corpId, setCorpId] = useState<string>(() => getStorage(StorageName.SocialPlatformMap)?.socialWecom?.corpId || '');
  const [cpUserId, setCpUserId] = useState<string>(() => getStorage(StorageName.SocialPlatformMap)?.socialWecom?.cpUserId || '');
  const { run: changeAdmin } = useRequest((spaceId, memberId) => Api.postWecomChangeAdmin(
    corpId,
    memberId,
    spaceId,
    suiteId,
    cpUserId,
  ), {
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    onSuccess: res => {
      const { success, code } = res.data;
      if (!success) {
        if (code === StatusCode.WECOM_NOT_ADMIN) {
          Router.push(Navigation.WECOM, {
            params: { wecomPath: 'error' },
            clearQuery: true,
            query: { errorCode: String(code) }
          });
        }
        return;
      }
      Message.success({ content: t(Strings.success) });
      return getAdminDetail();
    },
    manual: true,
  });

  // Get information about the space to which the user is bound
  const { run: getAdminDetail } = useRequest(() => Api.getWecomBindSpacesInfo(corpId, suiteId, cpUserId), {
    onSuccess: res => {
      const { data, success, code } = res.data;

      if (!success) {
        if (code === StatusCode.WECOM_NOT_ADMIN) {
          Router.push(Navigation.WECOM, {
            params: { wecomPath: 'error' },
            clearQuery: true,
            query: { errorCode: String(code) }
          });
        }
        return;
      }
      return setData(data);
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    manual: true
  });

  const { run: adminLogin } = useRequest(() => Api.postWecomLoginAdmin(code, suiteId), {
    onSuccess: (res) => {
      const { data, success, code } = res.data;

      if (!success || !data.spaceId) {
        if (code === StatusCode.WECOM_NOT_ADMIN) {
          Router.push(Navigation.WECOM, {
            params: { wecomPath: 'error' },
            clearQuery: true,
            query: { errorCode: String(code) }
          });
        }
        return;
      }
      
      const { authCorpId: corpId, cpUserId } = data;
      const socialPlatformMap = getStorage(StorageName.SocialPlatformMap) || {};
      socialPlatformMap.socialWecom = { corpId, cpUserId };
      setStorage(StorageName.SocialPlatformMap, socialPlatformMap);
      setCorpId(corpId);
      setCpUserId(cpUserId);

      const url = new URL(window.location.href);
      const params = url.searchParams;
      params.delete('code');
      params.delete('auth_code');
      window.location.href = url.href;
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    manual: true
  });

  useMount(() => {
    if (code) {
      adminLogin();
    } else {
      getAdminDetail();
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
export default WecomAdmin;
