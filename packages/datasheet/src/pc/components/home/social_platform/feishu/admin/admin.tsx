import { Message } from '@apitable/components';
import { Api, Settings, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading } from 'pc/components/common';
import { useQuery, useRequest } from 'pc/hooks';
import { useState } from 'react';
// @ts-ignore
import { AdminLayout, IAdminData } from 'enterprise';

const config = {
  adminTitle: t(Strings.feishu_admin_panel_title),
  adminDesc: t(Strings.feishu_admin_panel_message),
  helpLink: Settings.integration_feishu_help_url.value,
};

const FeishuAdmin = () => {
  const query = useQuery();
  const tenantKey = query.get('tenant_key') || query.get('tenantKey');
  const [data, setData] = useState<IAdminData | null>();

  const { run: changeAdmin } = useRequest((spaceId, memberId) => Api.feishuChangeMainAdmin(tenantKey, spaceId, memberId), {
    manual: true,
    onError: () => {
      Message.error({ content: t(Strings.error) });
    },
    onSuccess: res => {
      const { success, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      Message.success({ content: t(Strings.success) });
      getInfo(tenantKey);
    }
  });

  const { run: getInfo } = useRequest((tenantKey) => Api.getFeiShuTenant(tenantKey), {
    manual: true,
    onSuccess: res => {
      const { success, data, message } = res.data;
      if (!success) {
        Message.error({ content: message });
        return;
      }
      setData(data);
    },
    onError: () => {
      Message.error({ content:t(Strings.error) });
    }
  });

  useMount(() => {
    tenantKey && getInfo(tenantKey);
  });

  return (
    <>
      {
        data ?
          (
            AdminLayout &&
            <AdminLayout
              data={data}
              config={config}
              onChange={changeAdmin}
            />
          ) :
          <Loading />
      }
    </>
  );
};

export default FeishuAdmin;
