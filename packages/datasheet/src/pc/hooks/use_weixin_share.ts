import { Api, integrateCdnHost, IReduxState, Selectors, Settings, Strings, t } from '@apitable/core';
import { isObject } from 'lodash';
import { browser } from 'modules/shared/browser';
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
        debug: false,
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
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

    wx.ready(function() { // Needs to be called before the user may click the share button
      wx.updateAppMessageShareData({
        title, // Share title
        desc: nodeDesc, // Share Description
        link: url, // Share the link, the link domain or path must be the same as the corresponding public JS secure domain on the current page
        imgUrl: integrateCdnHost(Settings.system_configuration_official_logo.value), // Share icon
        success() {
          console.log(t(Strings.share_succeed));
        }
      });

      wx.updateTimelineShareData({
        title,
        link: url,
        imgUrl: integrateCdnHost(Settings.system_configuration_official_logo.value),
        success() {
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
    // Does not open in WeChat, no need to set sharing parameters
    if (!browser.satisfies({ wechat: '>1.0' }) || !isObject(wx)) return;

    initWeixinShareApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wx]);
};
