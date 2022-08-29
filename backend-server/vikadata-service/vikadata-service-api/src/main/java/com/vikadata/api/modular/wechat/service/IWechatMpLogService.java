package com.vikadata.api.modular.wechat.service;

import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;

/**
 * <p>
 * 微信公众号日志 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
 */
public interface IWechatMpLogService {

    /**
     * 保存日志
     *
     * @param appId     appId
     * @param openid    openid
     * @param unionId   unionId
     * @param inMessage 微信推送消息
     * @author Chambers
     * @date 2020/8/10
     */
    void create(String appId, String openid, String unionId, WxMpXmlMessage inMessage);
}
