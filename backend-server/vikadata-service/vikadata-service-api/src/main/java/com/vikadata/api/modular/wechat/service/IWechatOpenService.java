package com.vikadata.api.modular.wechat.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.WechatAuthorizationEntity;

import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.result.WxMpUser;

/**
 * <p>
 * 微信开放平台 服务类
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-02-20
 */
public interface IWechatOpenService extends IService<WechatAuthorizationEntity> {

    /**
     * 授权成功后，使用授权码获取授权信息
     *
     * @param authorizationCode 授权码
     * @return AuthorizationEntity 授权方信息，包含权限列表
     */
    WechatAuthorizationEntity addAuthInfo(String authorizationCode);

    /**
     * 授权成功后，获取授权账户信息
     *
     * @param authorizeAppId 授权方Id
     * @return AuthorizationEntity 授权方账户信息
     */
    WechatAuthorizationEntity addAuthorizeInfo(String authorizeAppId);

    /**
     * 公众号 文本消息处理
     *
     * @param appId     appId
     * @param openId    openId
     * @param inMessage 微信推送消息
     * @return result
     * @throws WxErrorException
     * @author Chambers
     * @date 2020/8/19
     */
    String mpTextMessageProcess(String appId, String openId, WxMpXmlMessage inMessage) throws WxErrorException;

    /**
     * 公众号 事件处理
     *
     * @param appId     appId
     * @param openId    openId
     * @param inMessage 微信推送消息
     * @return result
     * @throws WxErrorException
     * @author Chambers
     * @date 2020/8/19
     */
    String mpEventProcess(String appId,  String openId, WxMpXmlMessage inMessage) throws WxErrorException;

}
