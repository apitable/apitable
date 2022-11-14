package com.vikadata.api.enterprise.wechat.service;

import com.baomidou.mybatisplus.extension.service.IService;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;

import com.vikadata.entity.WechatAuthorizationEntity;

/**
 * <p>
 * WeChat Open Service
 * </p>
 */
public interface IWechatOpenService extends IService<WechatAuthorizationEntity> {

    /**
     * Add auth info
     */
    WechatAuthorizationEntity addAuthInfo(String authorizationCode);

    /**
     * Add authorize info
     */
    WechatAuthorizationEntity addAuthorizeInfo(String authorizeAppId);

    /**
     * Mp text message handling
     */
    String mpTextMessageProcess(String appId, String openId, WxMpXmlMessage inMessage) throws WxErrorException;

    /**
     * Mp event handling
     */
    String mpEventProcess(String appId, String openId, WxMpXmlMessage inMessage) throws WxErrorException;

}
