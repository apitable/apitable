import { Api, ConfigConstant, Navigation, Strings, t } from '@apitable/core';
import { Spin } from 'antd';
import { Message } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useLinkInvite, useQuery } from 'pc/hooks';
import { isLocalSite } from 'pc/utils';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import { FC, useEffect } from 'react';
import styles from './style.module.less';

const DingdingCallback: FC = props => {
  const { join } = useLinkInvite();
  const query = useQuery();
  const code = query.get('code') || '';
  const state = query.get('state') || '';
  // 0:for swipe code login, 1:for account binding
  const type = Number(localStorage.getItem('vika_account_manager_operation_type')) || ConfigConstant.ScanQrType.Login;
  // ! whether you are logged in from the share page (the address of the share page is saved)
  const shareReference = localStorage.getItem('share_login_reference');
  const reference = localStorage.getItem('reference') || '';
  localStorage.removeItem('vika_account_manager_operation_type');
  const inviteLinkData = localStorage.getItem('invite_link_data');
  const inviteCode = localStorage.getItem('invite_code') || undefined;

  useEffect(() => {
    Api.dingtalkLoginCallback(state, code, type).then(res => {
      const { success, data, code } = res.data;
      if (success) {
        // Scan code to login
        if (type === ConfigConstant.ScanQrType.Login) {
          // Link invitation
          if (inviteLinkData && data) {
            const { inviteLinkInfo, linkToken } = JSON.parse(inviteLinkData);
            Router.push(Navigation.IMPROVING_INFO, {
              query: {
                token: data,
                inviteLinkToken: linkToken,
                inviteCode: inviteLinkInfo?.data.inviteCode
              }
            });
            return;
          }
          if (inviteLinkData && !data) {
            join({ fromLocalStorage: true });
            return;
          }
          // Do you need to go and improve the information
          if (data) {
            Router.push(Navigation.IMPROVING_INFO, { query: { token: data, inviteCode, reference }});
            return;
          }
          // Is logged in from the share page
          if (shareReference) {
            setStorage(StorageName.ShareLoginFailed, false);
            window.location.href = shareReference;
            return;
          }
          if (reference && isLocalSite(window.location.href, reference)) {
            localStorage.removeItem('reference');
            window.location.href = reference;
            return;
          }
          Router.redirect(Navigation.HOME);
        } else {
          // Account Binding
          localStorage.setItem('binding_dingding_status', code);
          window.close();
        }
      } else {
        if (type === ConfigConstant.ScanQrType.Login) {
          // Is logged in from the share page
          if (shareReference) {
            setStorage(StorageName.ShareLoginFailed, true);
            window.location.href = shareReference;
            return;
          }
          Message.error({ content: t(Strings.login_failed) });
          Router.push(Navigation.LOGIN);
        } else {
          localStorage.setItem('binding_dingding_status', code);
          window.close();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Spin />
    </div>
  );
};

export default DingdingCallback;
