import { Api, ConfigConstant, Navigation, Strings, t } from '@vikadata/core';
import { Spin } from 'antd';
import { Message } from 'pc/components/common';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
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
  // 0:表示扫码登录，1:表示账号绑定
  const type = Number(localStorage.getItem('vika_account_manager_operation_type')) || ConfigConstant.ScanQrType.Login;
  // ! 是否是从分享页面登录的（保存的是分享页面的地址）
  const shareReference = localStorage.getItem('share_login_reference');
  const reference = localStorage.getItem('reference') || '';
  localStorage.removeItem('vika_account_manager_operation_type');
  const navigationTo = useNavigation();
  const inviteLinkData = localStorage.getItem('invite_link_data');
  const inviteCode = localStorage.getItem('invite_code') || undefined;

  useEffect(() => {
    Api.dingtalkLoginCallback(state, code, type).then(res => {
      const { success, data, code } = res.data;
      if (success) {
        // 扫码登录
        if (type === ConfigConstant.ScanQrType.Login) {
          // 链接邀请
          if (inviteLinkData && data) {
            const { inviteLinkInfo, linkToken } = JSON.parse(inviteLinkData);
            navigationTo({
              path: Navigation.IMPROVING_INFO,
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
          // 是否需要去完善信息
          if (data) {
            navigationTo({ path: Navigation.IMPROVING_INFO, query: { token: data, inviteCode, reference }});
            return;
          }
          // ! 待删除
          // 是否从分享页面登录的
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
          navigationTo({ path: Navigation.HOME, method: Method.Redirect });
        } else {
          // 账号绑定
          localStorage.setItem('binding_dingding_status', code);
          window.close();
        }
      } else {
        if (type === ConfigConstant.ScanQrType.Login) {
          // 是否从分享页面登录的
          if (shareReference) {
            setStorage(StorageName.ShareLoginFailed, true);
            window.location.href = shareReference;
            return;
          }
          Message.error({ content: t(Strings.login_failed) });
          navigationTo({ path: Navigation.LOGIN });
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
