import { Api } from '@apitable/core';
import { isObject } from 'lodash';

declare const WWOpenData;

export const getWecomAgentConfig = async(spaceId: string | null, cb?: () => void) => {
  const wx = (window as any).wx;
  const rlt = await Api.getWecomAgentConfig(spaceId!, window.location.href);
  if (rlt.data.message === 'SUCCESS') {
    const { authCorpId, agentId, random, signature, timestamp } = rlt.data.data;
    try {
      wx.agentConfig?.({
        corpid: authCorpId,
        agentid: agentId,
        timestamp,
        nonceStr: random,
        signature,
        jsApiList: ['selectExternalContact', 'selectPrivilegedContact'],
        success: function(res) {
          console.log('success', res);
          if (cb) {
            cb();
          }
          if (isObject(WWOpenData)) {
            (WWOpenData as any).bindAll(document.querySelectorAll('ww-open-data'));
          }
        },
        fail: function(res) {
          console.log('fail', res);
          if(res.errMsg.indexOf('function not exist') > -1) {
            console.warn('Please upgrade if the version is too low');
          }
        }
      });
    } catch (e) {
      console.warn('wecom agentConfig error: ', e);
    }
  }
};