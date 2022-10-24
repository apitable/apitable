import { Api, IReduxState } from '@apitable/core';
import { isObject } from 'lodash';
import { isSocialWecom } from 'pc/components/home/social_platform';
import { useRequest } from 'pc/hooks';
import { getWecomAgentConfig } from 'pc/utils';
import { useEffect, useRef } from 'react';
// import { useScript } from './use_script_load';
import { useSelector } from 'react-redux';

export const useWecomContact = () => {
  const spaceInfo = useSelector((state: IReduxState) => state.space.curSpaceInfo);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const _isSocialWecom = isSocialWecom(spaceInfo);
  const urlRef = useRef<string | null>(null);

  // 企业微信第三方空间站，需要进行相关 sdk 的加载
  // const { loaded: jweixinLoaded } = useScript({
  //   src: _isSocialWecom ? 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js' : null,
  //   referrerpolicy: 'origin'
  // });
  // const { loaded: jwxworkLoaded } = useScript({
  //   src: _isSocialWecom ? 'https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js' : null,
  //   referrerpolicy: 'origin'
  // });
  // const isScriptLoaded = jweixinLoaded && jwxworkLoaded;

  const { run: getWecomCommonConfig } = useRequest(() => Api.getWecomCommonConfig(spaceId!, window.location.href), {
    onSuccess: res => {
      const { data } = res.data;
      const { authCorpId, random, signature, timestamp } = data;
      const wx = (window as any).wx;
      try {
        wx.config?.({
          beta: true, // 必须这么写，否则 wx.invoke 调用形式的 jsapi 会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: authCorpId, // 必填，企业微信的corpID
          timestamp, // 必填，生成签名的时间戳
          nonceStr: random, // 必填，生成签名的随机串
          signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: ['agentConfig'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });
        wx.ready?.(() => {
          getWecomAgentConfig(spaceId);
        });
      } catch (e) {
        console.warn('wecom config error: ', e);
      }
    },
    onError: () => {
      // Message.error({ content: 'wx.config 初始化错误' });
    },
    manual: true
  });

  useEffect(() => {
    const url = window.location.href;
    const wx = (window as any).wx;
    if (!spaceId || !_isSocialWecom || urlRef.current === url || !wx || !isObject(wx)) return;
    urlRef.current = url;
    getWecomCommonConfig();
  });
};
