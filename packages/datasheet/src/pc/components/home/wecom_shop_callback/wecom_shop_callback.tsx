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
 * Enterprise App Store Authorization Callback Page
 */
const WecomShopCallback: FC = () => {
  const query = useQuery();
  // Get the source of the entry point to the callback page
  const loginType = localStorage.getItem('wecomShopLoginType');
  const reference = localStorage.getItem('wecomShopLoginToReference');
  const config = getWecomShopConfig();
  const isCamera = loginType === ConfigConstant.AuthReference.CAMERA;
  // auth_code - Sweep callback parameters, code - web authorisation callback parameters
  const authCode = query.get('auth_code') || query.get('code') || '';
  const suiteId = isCamera ? config.suiteId : (query.get('suiteid') || query.get('state'))!;
  const [isSyncing, setSyncing] = useState(false);

  useEffect(() => {
    // Distinguish the source of the jump
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

        // Contacts being synced
        if (contactSyncing) {
          setSyncing(true);
          return;
        }

        // Check if the user is in the app after syncing the address book, 0 - not in, 1 - in
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

        // Retracement exists
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
