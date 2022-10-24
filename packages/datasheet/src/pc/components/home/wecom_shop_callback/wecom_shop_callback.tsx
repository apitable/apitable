import { Api, ConfigConstant, Navigation } from '@apitable/core';
import { useMount } from 'ahooks';
import { Spin } from 'antd';
import { Message } from 'pc/components/common';
import ContactSyncing from 'pc/components/home/social_platform/dingtalk/contact_syncing/contact_syncing';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import { getWecomShopConfig } from 'pc/utils/get_config';
import { FC, useEffect, useState } from 'react';
import { wecomQuickLogin } from '../other_login';
import styles from './style.module.less';

/**
 * 企微应用商店授权回调页
 */
const WecomShopCallback: FC = () => {
  const query = useQuery();
  // 获取进入回调页面的入口来源
  const loginType = localStorage.getItem('wecomShopLoginType');
  const reference = localStorage.getItem('wecomShopLoginToReference');
  const config = getWecomShopConfig();
  const isCamera = loginType === ConfigConstant.AuthReference.CAMERA;
  // auth_code - 扫码回调参数，code - 网页授权回调参数
  const authCode = query.get('auth_code') || query.get('code') || '';
  const suiteId = isCamera ? config.suiteId : (query.get('suiteid') || query.get('state'))!;
  const [isSyncing, setSyncing] = useState(false);

  useEffect(() => {
    // 区分跳转来源
    const method = isCamera ? Api.postWecomScanLogin : Api.postWecomAutoLogin;
    method(authCode, suiteId).then(res => {
      const { success, data, message, code } = res.data;
      if (success) {
        const { authCorpId, contactSyncing, logined, spaceId, suiteId } = data;

        localStorage.setItem('wecomShopLoginCache', JSON.stringify({
          authCorpId,
          spaceId,
          suiteId
        }));

        // 正在同步通讯录
        if (contactSyncing) {
          setSyncing(true);
          return;
        }

        // 同步完通讯录查询用户是否在应用内，0 - 不在，1 - 在
        if (!logined) {
          Message.error({ content: message });
          return;
        }

        const { shouldRename, defaultName, shouldReAuth } = data;

        if (shouldReAuth) {
          wecomQuickLogin('snsapi_privateinfo', reference);
          return;
        }

        if (shouldRename) {
          Router.replace(Navigation.SETTING_NICKNAME, {
            query: { defaultName, sourceType: 'wecomShop' },
            clearQuery: true
          });
          return;
        }

        // 存在回调
        if (reference) {
          window.location.href = reference;
          return;
        }

        if (spaceId) {
          window.location.href = `/workbench?spaceId=${spaceId}`;
          return;
        }

        window.location.href = `${location.origin}?spaceId=${spaceId}`;
      } else {
        Router.replace(Navigation.WECOM, {
          params: {
            wecomPath: 'error'
          },
          clearQuery: true,
          query: { errorCode: code }
        });
      }
    });
  }, [authCode, loginType, suiteId, reference, isCamera]);

  useMount(() => {
    localStorage.removeItem('wecomShopLoginToReference');
  });

  return (
    <div className={styles.container}>
      {
        isSyncing ?
          <ContactSyncing /> :
          <Spin />
      }
    </div>
  );
};

export default WecomShopCallback;
