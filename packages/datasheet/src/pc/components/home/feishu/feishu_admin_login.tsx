import { Api, ConfigConstant, Navigation, Settings, StatusCode, Strings, t } from '@vikadata/core';
import { Message, Modal } from 'pc/components/common';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import { ISubmitRequestParam } from '../login';
import { FeiShuLogin } from './feishu_login';

const FeiShuAdminLogin = () => {
  const query = useQuery();
  const openId = query.get('openId') || query.get('open_id');
  const tenantKey = query.get('tenantKey') || query.get('tenant_key');
  const mobileModSubmit = async(data: ISubmitRequestParam) => {
    if (!openId || !tenantKey) return;
    const { areaCode, account, credential } = data;
    const res = await Api.socialFeiShuBindUser(
      areaCode,
      account,
      credential,
      openId!,
      tenantKey!
    );
    try {
      const { success, code, message } = res.data;
      if (!success) {
        if (code === StatusCode.AccountErr.CommonErr) {
          Modal.confirm({
            type: 'warning',
            title: t(Strings.kindly_reminder),
            content: t(Strings.feishu_admin_login_err_message),
            okText: t(Strings.feishu_admin_login_err_to_register),
            onOk: () => {
              navigationToUrl(Settings.feisu_register_link_in_login.value);
            },
          });
          return;
        }
        Message.error({ content: message });
        return;
      }
      Router.push(Navigation.FEISHU, {
        params: { feiShuPath: 'bind_space' },
        query: { openId, tenantKey },
      });
    } catch (error) {
      Message.error({ content: t(Strings.error) });
    }
  };

  if (!tenantKey) {
    Router.push(Navigation.FEISHU, {
      params: { feiShuPath: 'err' },
      query: {
        msg: t(Strings.wrong_url),
      },
    });
  }

  return (
    <FeiShuLogin
      submitRequest={mobileModSubmit}
      mobileCodeType={ConfigConstant.SmsTypes.BIND_SOCIAL_USER}
    />
  );
};

export default FeiShuAdminLogin;
