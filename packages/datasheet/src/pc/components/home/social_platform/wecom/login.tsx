import { ConfigConstant } from '@apitable/core';
import { useMount } from 'ahooks';
import { Loading } from 'pc/components/common';
import ContactSyncing from 'pc/components/home/social_platform/dingtalk/contact_syncing/contact_syncing';
// import { Navigation } from '@apitable/core';
import { useQuery } from 'pc/hooks';
import { getWecomShopConfig } from 'pc/utils/get_config';
import { useState } from 'react';
// import { useNavigation } from 'pc/components/route_manager/use_navigation';

const navigationToAuth = (env, suiteId, wecomShopLoginType) => {
  localStorage.removeItem('wecomShopLoginCache');
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  const redirectUrl = env.callbackUrl;
  localStorage.setItem('wecomShopLoginType', wecomShopLoginType);
  window.location.href =
    `${url}?appid=${suiteId}&redirect_uri=${redirectUrl}&state=${suiteId}&response_type=code&scope=snsapi_base#wechat_redirect`;
};

const WecomLogin = () => {
  const query = useQuery();
  // const navigationTo = useNavigation();
  const env = getWecomShopConfig();
  // const cache = localStorage.getItem('wecomShopLoginCache');
  // const cacheInfo = cache ? JSON.parse(cache) : {};
  // const corpId = cacheInfo?.authCorpId || '';
  const suiteId = query.get('suiteid') || '';
  const reference = query.get('reference') || '';
  const [isSyncing/* , setSyncing */] = useState(false);

  useMount(() => {
  
    localStorage.setItem('wecomShopLoginToReference', reference);
    navigationToAuth(env, suiteId, ConfigConstant.AuthReference.APPLICATION);
  });

  return (
    <>
      {
        isSyncing ?
          <ContactSyncing /> :
          <Loading />
      }
    </>
  );
};

export default WecomLogin;
