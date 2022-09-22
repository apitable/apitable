import { Api, ConfigConstant, Navigation } from '@vikadata/core';
import { Spin } from 'antd';
import { ScreenSize } from 'pc/components/common/component_display';
import { Router } from 'pc/components/route_manager/router';
import { useQuery, useResponsive } from 'pc/hooks';
import { isLocalSite } from 'pc/utils';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import { FC, useEffect } from 'react';
import styles from './style.module.less';

const QqCallback: FC = props => {
  const query = useQuery();
  const accessToken = query.get('access_token') || '';
  const expiresIn = query.get('expires_in') || '';
  const code = query.get('code') || '';
  // 0:表示扫码登录，1:表示账号绑定
  const type = Number(localStorage.getItem('vika_account_manager_operation_type')) || ConfigConstant.ScanQrType.Login;
  // ! 是否是从分享页面登录的（保存的是分享页面的地址）
  const shareReference = localStorage.getItem('share_login_reference');
  const reference = localStorage.getItem('reference');
  // 从链接邀请过来的
  const inviteLinkData = localStorage.getItem('invite_link_data');
  const inviteCode = localStorage.getItem('invite_code');
  localStorage.removeItem('vika_account_manager_operation_type');
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const bindOrSignup = (token: string) => {
    const parsedUrl = new URL('/user/improving_info', window.location.origin);
    const searchParams = new URLSearchParams('');
    searchParams.append('token', token);
    if (inviteLinkData) {
      const { linkToken, inviteCode } = JSON.parse(inviteLinkData);
      searchParams.append('inviteLinkToken', linkToken);
      searchParams.append('inviteCode', inviteCode);
    }
    if (inviteCode) {
      searchParams.append('inviteCode', inviteCode);
    }
    parsedUrl.search = searchParams.toString();

    if (isMobile) {
      window.opener && window.opener.close();
      window.location.href = parsedUrl.href;
    } else {
      window.opener.location.href = parsedUrl.href;
      window.close();
    }
  };
  const loginSuccess = () => {
    // 手机端的链接邀请，qq登录成功并且不需要注册，再次进入链接邀请页面，需要用户重新点击确定按钮
    if (inviteLinkData && isMobile) {
      window.opener && window.opener.close();
      const { linkToken } = JSON.parse(inviteLinkData);
      const url = new URL('/invite/link', window.location.origin);
      const searchParams = new URLSearchParams('');
      searchParams.append('inviteLinkToken', linkToken);
      url.search = searchParams.toString();
      window.opener.location.href = url.href;
      return;
    }
    if (isMobile) {
      window.opener && window.opener.close();
      Router.push(Navigation.HOME);
      return;
    }
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
    window.opener.location.reload();
    setTimeout(() => {
      window.close();
    }, 300);
  };
  useEffect(() => {
    Api.qqLoginCallback(code, accessToken, expiresIn, type).then(res => {
      const { data, success, code } = res.data;
      if (success) {
        if (type === ConfigConstant.ScanQrType.Login) {
          if (data) {
            bindOrSignup(data);
          } else {
            loginSuccess();
          }
        } else {
          localStorage.setItem('binding_qq_status', code);
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
          localStorage.setItem('qq_login_failed', 'true');
          window.close();
        } else {
          localStorage.setItem('binding_qq_status', code);
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

export default QqCallback;
