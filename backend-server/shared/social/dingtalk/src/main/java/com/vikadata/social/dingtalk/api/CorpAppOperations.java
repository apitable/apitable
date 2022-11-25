package com.vikadata.social.dingtalk.api;


import com.vikadata.social.dingtalk.MessageReceiver;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * Enterprise internal application interface
 */
public interface CorpAppOperations {
    /**
     * Obtain the access token of the internal application of the enterprise
     *
     * @param forceRefresh Force refresh
     * @return String
     */
    String getAccessToken(boolean forceRefresh);

    /**
     * Obtaining user information through a free code (v 2)
     *
     * @param code No-login authorization code
     * @return UserInfoV2
     */
    UserInfoV2 getUserInfoByCode(String code);

    /**
     * Get user details based on userid
     *
     * @param userId The employee uniquely identifies the userid.
     * @return DingTalkUserDetailResponse
     */
    DingTalkUserDetail getUserInfoByUserId(String userId);

    /**
     * Intra-enterprise applications send group messages
     *
     * @param receiver message recipient
     * @param message  message content
     * @return message task id
     */
    String sendChatMessage(MessageReceiver receiver, Message message);

}
