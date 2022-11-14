package com.vikadata.api.enterprise.wechat.service;

import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;

/**
 * <p>
 * WeChat Mp Log Service
 * </p>
 */
public interface IWechatMpLogService {

    /**
     * Create log
     */
    void create(String appId, String openid, String unionId, WxMpXmlMessage inMessage);
}
