import { Url } from '@vikadata/core';
import { getEnvVariables } from './env';

enum ThirdParty {
  Dingding = 'dingding',
  Qq = 'qq',
  Feishu = 'feishu',
  Wechat = 'wechat',
  Wecom = 'wecom',
  WecomShop = 'wecomShop',
}

const getThirdPartyAuthConfigs = (thirdParty: ThirdParty): any => {
  if (!process.env.SSR) {
    const envVariables = getEnvVariables();
    switch(thirdParty) {
      case ThirdParty.Dingding:
        return {
          appId: envVariables.DINGTALK_LOGIN_APPID,
          callbackUrl: window.location.origin + '/user/dingtalk/callback',
        };
      case ThirdParty.Qq:
        return {
          appId: envVariables.QQ_CONNECT_WEB_APPID,
          callbackUrl: window.location.origin + '/user/qq_connect/callback',
        };
      case ThirdParty.Feishu:
        return {
          appId: envVariables.FEISHU_LOGIN_APPID,
          pathname: Url.BASE_URL + Url.FEISHU_LOGIN_CALLBACK,
        };
      case ThirdParty.Wechat:
        return {
          appId: envVariables.WECHAT_MP_APPID,
          callbackUrl: window.location.origin + '/user/wechat/callback',
        };
      case ThirdParty.Wecom:
        return {
          callbackUrl: window.location.origin + '/user/wecom/callback',
        };
      case ThirdParty.WecomShop:
        return {
          suiteId: envVariables.WECOM_SHOP_SUITEID,
          corpId: envVariables.WECOM_SHOP_CORPID,
          callbackUrl: window.location.origin + '/user/wecom_shop/callback',
        };
      default:
        return null;
    }
  }
  return null;
};

export const getDingdingConfig = () => {
  return getThirdPartyAuthConfigs(ThirdParty.Dingding);
};

export const getQQConfig = () => {
  return getThirdPartyAuthConfigs(ThirdParty.Qq);
};

export const getFeishuConfig = () => {
  return getThirdPartyAuthConfigs(ThirdParty.Feishu);
};

export const getWechatConfig = () => {
  return getThirdPartyAuthConfigs(ThirdParty.Wechat);
};

export const getWecomConfig = () => {
  return getThirdPartyAuthConfigs(ThirdParty.Wecom);
};

export const getWecomShopConfig = () => {
  return getThirdPartyAuthConfigs(ThirdParty.WecomShop);
};
