import { ConfigConstant } from '@vikadata/core';
import { useMount } from 'ahooks';
import { Loading } from 'pc/components/common';
import ContactSyncing from 'pc/components/home/social_platform/dingtalk/contact_syncing/contact_syncing';
// import { Navigation } from '@vikadata/core';
import { useQuery } from 'pc/hooks';
import { getWecomShopConfig } from 'pc/utils/get_config';
import { useState } from 'react';
// import { useNavigation } from 'pc/components/route_manager/use_navigation';

const navigationToAuth = (env, suiteId, wecomShopLoginType) => {
  // 清理缓存
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
  // 获取在wecom_shop_callback存入的缓存信息
  // const cacheInfo = cache ? JSON.parse(cache) : {};
  // const corpId = cacheInfo?.authCorpId || '';
  const suiteId = query.get('suiteid') || '';
  const reference = query.get('reference') || '';
  const [isSyncing/* , setSyncing */] = useState(false);

  // const { run: login } = useRequest(() => Api.getWecomLoginInfo(corpId, suiteId), {
  //   onSuccess: res => {
  //     const { data, success, message } = res.data;

  //     // 登录失败，跳转网页授权页
  //     if (!success) {
  //       navigationToAuth();
  //       return;
  //     }

  //     const { logined, spaceId } = data;

  //     // 正在同步通讯录
  //     if (data.contactSyncing) {
  //       setSyncing(true);
  //       return;
  //     }

  //     // 同步完通讯录发现成员不在应用中提示信息, 0 - 不在应用中，1 - 在应用中
  //     if (!Boolean(logined)) {
  //       Message.error({ content: message });
  //       return;
  //     }

  //     const { shouldRename, defaultName } = data;
  //     if (shouldRename) {
  //       navigationTo({
  //         path: Navigation.SETTING_NICKNAME,
  //         query: { defaultName },
  //         clearQuery: true
  //       });
  //       return;
  //     }

  //     if (spaceId) {
  //       navigationTo({
  //         path: Navigation.WORKBENCH,
  //         params: { spaceId },
  //         clearQuery: true
  //       });
  //       return;
  //     }

  //     navigationTo({ path: Navigation.HOME });
  //   },
  //   onError: () => {
  //     Message.error({ content: t(Strings.dingtalk_login_fail_tips) });
  //   },
  //   manual: true
  // });

  useMount(() => {
    // if (suiteId && corpId) {
    //   login();
    // } else {
    //   // 找不到 suiteId 和 corpId
    //   navigationToAuth();
    // }
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
