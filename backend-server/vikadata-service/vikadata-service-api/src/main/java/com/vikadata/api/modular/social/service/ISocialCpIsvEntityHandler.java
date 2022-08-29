package com.vikadata.api.modular.social.service;

import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用消息通知信息处理
 * </p>
 * @author 刘斌华
 * @date 2022-01-11 11:14:40
 */
public interface ISocialCpIsvEntityHandler {

    /**
     * 消息类型
     *
     * @return {@link WeComIsvMessageType}
     * @author 刘斌华
     * @date 2022-01-11 11:21:11
     */
    WeComIsvMessageType type();

    /**
     * 处理还未处理的消息
     *
     * @param unprocessed 待处理的信息
     * @return 是否有数据处理成功
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-01-11 11:18:55
     */
    boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException;

}
