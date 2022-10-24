import { Api, integrateCdnHost, IReduxState, Selectors, Settings, Strings, t } from '@apitable/core';
import { isObject } from 'lodash';
import { browser } from 'pc/common/browser';
import { sanitized } from 'pc/components/tab_bar/description_modal';
import { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

interface IInfo {
  nodeName: string;
  nodeDesc: string;
}

export const useWeixinShare = (info?: IInfo) => {
  const { datasheetId, templateId, folderId } = useSelector((state: IReduxState) => {
    const { datasheetId, templateId, folderId } = state.pageParams;
    return { datasheetId, templateId, folderId };
  }, shallowEqual);
  const urlRef = useRef('');
  const [wx, setWx] = useState<any>();

  const nodeName = useSelector((state) => {
    if (info && info.nodeName) {
      return info.nodeName;
    }
    const datasheet = Selectors.getDatasheet(state);
    if (datasheet && datasheet.name) {
      return datasheet.name;
    }
    return t(Strings.vikadata);
  });

  const nodeDesc = useSelector((state) => {
    if (info && info.nodeDesc) {
      return sanitized(info.nodeDesc);
    }
    const desc = Selectors.getNodeDesc(state);
    if (desc) {
      return sanitized(desc.render);
    }
    return folderId ? t(Strings.receive_new_folder) : t(Strings.received_a_new_doc);
  });

  const setJsSdkConfig = async(url: string) => {
    if (urlRef.current === url) {
      return;
    }

    urlRef.current = url;

    const res = await Api.getWechatSignature(url);
    const { success, data } = res.data;
    if (success) {
      const { appId, nonceStr, timestamp, signature } = data;

      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
      });
    }
  };

  const initWeixinShareApi = async() => {
    const url = window.location.href;
    await setJsSdkConfig(url);

    let title = '';

    if (folderId) {
      title = `${nodeName} - ${templateId ? t(Strings.template_type) : t(Strings.folder)}`;
    }

    if (datasheetId) {
      title = `${nodeName} - ${templateId ? t(Strings.template_type) : t(Strings.datasheet)}`;
    }

    wx.ready(function() { // 需在用户可能点击分享按钮前就先调用
      wx.updateAppMessageShareData({
        title, // 分享标题
        desc: nodeDesc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: integrateCdnHost(Settings.vika_logo.value), // 分享图标
        success() {
          // 设置成功
          console.log(t(Strings.share_succeed));
        }
      });

      wx.updateTimelineShareData({
        title, // 分享标题
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: integrateCdnHost(Settings.vika_logo.value), // 分享图标
        success() {
          // 设置成功
          console.log(t(Strings.share_succeed));
        }
      });
    });

  };

  useEffect(() => {
    if (!wx) {
      const wx = require('weixin-js-sdk');
      setWx(wx);
      return;
    }
    // 不在微信中打开，不需要设置分享参数
    if (!browser.satisfies({ wechat: '>1.0' }) || !isObject(wx)) return;

    initWeixinShareApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wx]);
};
