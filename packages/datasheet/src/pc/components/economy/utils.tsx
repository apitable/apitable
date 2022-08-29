import { store } from 'pc/store';
import { isInDingtalkFunc } from 'pc/components/home/social_platform';
import { IDingTalkModalType, showModalInDingTalk } from './upgrade_modal';
import { Message } from 'pc/components/common';
import { Api, Strings, t, ScreenWidth } from '@vikadata/core';
import * as dd from 'dingtalk-jsapi';

export const upgradeInDingtalk = () => {
  const state = store.getState(); 
  const spaceId = state.space.activeId;
  const inDingTalk = isInDingtalkFunc();
  const callbackPage = window.location.href;
  const isMobile = document.body.clientWidth < ScreenWidth.md;
  if (inDingTalk && spaceId) {
    return Api.getDingtalkSKU(spaceId, callbackPage).then(res => {
      const { success, data } = res.data;
      if (!success || !inDingTalk) {
        Message.error({ content: t(Strings.error) });
        return res.data;
      }
      if (isMobile) {
        dd.biz.util.openLink({ url:data });
      } else {
        dd.biz.util.openSlidePanel({ url:data });
      }
      return res.data;
    });
  } 
  return new Promise((resolve, reject) => {
    showModalInDingTalk(IDingTalkModalType.Upgrade);
    resolve(true);
  });
  
};