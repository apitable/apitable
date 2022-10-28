import { Api, Navigation, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading, Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useRequest } from 'pc/hooks';
import { useEffect, useState } from 'react';
import { FeishuErrType } from './feishu_err';

const FeiShuConfigure = () => {
  const query = useQuery();
  const [err, setErr] = useState('');
  const appId = query.get('app_id') || query.get('appId') || undefined;
  const accessToken = query.get('access_token') || query.get('accessToken') || undefined;
  const { run: check } = useRequest(token => Api.socialFeiShuUserAuth(token), {
    onSuccess: async(res) => {
      const { success, data } = res.data;
      if (!success) {
        Router.push(Navigation.FEISHU, {
          params: { feiShuPath: 'err' },
          query: {
            key: FeishuErrType.SELECT_VALID,
          },
        });
        return;
      }
      const { openId, tenantKey } = data;
      const adminCheckRes = await Api.socialFeiShuCheckAdmin(openId, tenantKey);
      const { success: checkAdminSuccess, data: checkAdminInfo, message: checkAdminMsg } = adminCheckRes.data;
      if (!checkAdminSuccess) {
        setErr(checkAdminMsg);
        return;
      }
      if (!checkAdminInfo.isAdmin) {
        Router.push(Navigation.FEISHU, {
          params: { feiShuPath: 'err' },
          query: {
            key: FeishuErrType.IDENTITY,
          },
        });
        return;
      }

      const tenantBindRes = await Api.socialFeiShuCheckTenantBind(tenantKey);
      const { success: tenantBindSuccess, data: tenantBindData, message: tenantBindMsg } = tenantBindRes.data;
      if (tenantBindSuccess && tenantBindData.hasBind) {
        Router.push(Navigation.FEISHU, {
          clearQuery: true,
          params: { feiShuPath: 'err' },
          query: {
            key: FeishuErrType.BOUND,
            appId,
          },
        });
        return;
      }
      if (tenantBindSuccess && !tenantBindData.hasBind) {
        Router.push(Navigation.FEISHU, {
          params: { feiShuPath: 'admin_login' },
          query: { openId, tenantKey },
        });
        return;
      }
      if (!tenantBindSuccess) {
        setErr(tenantBindMsg);
        return;
      }
    },
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    manual: true,
  });
  useMount(() => {
    if (!accessToken) return;
    check(accessToken);
  });

  useEffect(() => {
    if (err) {
      Router.push(Navigation.FEISHU, {
        params: { feiShuPath: 'err' },
        query: {
          msg: err,
        },
      });
    }
  }, [err]);

  return <Loading />;
};

export default FeiShuConfigure;
