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
        corpid: authCorpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
        agentid: agentId, // 必填，企业微信的应用id （e.g. 1000247）
        timestamp, // 必填，生成签名的时间戳
        nonceStr: random, // 必填，生成签名的随机串
        signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
        jsApiList: ['selectExternalContact', 'selectPrivilegedContact'], // 必填，传入需要使用的接口名称
        success: function(res) {
          console.log('success', res);
          if (cb) {
            cb();
          }
          // 回调
          if (isObject(WWOpenData)) {
            (WWOpenData as any).bindAll(document.querySelectorAll('ww-open-data'));
          }
        },
        fail: function(res) {
          console.log('fail', res);
          if(res.errMsg.indexOf('function not exist') > -1) {
            console.warn('版本过低请升级');
          }
        }
      });
    } catch (e) {
      console.warn('wecom agentConfig error: ', e);
    }
  }
};