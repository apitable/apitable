package com.vikadata.api.modular.social.service;

import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application message notification information processing
 * </p>
 */
public interface ISocialCpIsvEntityHandler {

    /**
     * Message Type
     *
     * @return {@link WeComIsvMessageType}
     */
    WeComIsvMessageType type();

    /**
     * Process messages that have not yet been processed
     *
     * @param unprocessed Information to be processed
     * @return Whether data processing is successful
     * @throws WxErrorException WeCom interface exception
     */
    boolean process(SocialCpIsvMessageEntity unprocessed) throws WxErrorException;

}
