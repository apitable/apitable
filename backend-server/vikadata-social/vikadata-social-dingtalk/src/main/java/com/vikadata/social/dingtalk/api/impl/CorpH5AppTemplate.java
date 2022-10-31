package com.vikadata.social.dingtalk.api.impl;


import java.util.HashMap;

import com.vikadata.social.core.ConfigStorage;
import com.vikadata.social.dingtalk.AbstractDingTalkOperations;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.MessageReceiver;
import com.vikadata.social.dingtalk.MessageReceiverBuilder;
import com.vikadata.social.dingtalk.api.CorpAppOperations;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkSendMessageRequest;
import com.vikadata.social.dingtalk.model.DingTalkSendMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailRequest;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Request;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Response;
import com.vikadata.social.dingtalk.model.UserInfoV2;

import org.springframework.web.client.RestTemplate;

/**
 * Enterprise internal application interface api implementation class
 */
public class CorpH5AppTemplate extends AbstractDingTalkOperations implements CorpAppOperations {

    private static final String GET_USER_INFO_URL = "/topapi/v2/user/getuserinfo";

    private static final String GET_USER_DETAIL_URL = "/topapi/v2/user/get";

    private static final String CHAT_SEND_URL = "/chat/send";

    public CorpH5AppTemplate(RestTemplate restTemplate, DingtalkConfig dingtalkConfig, ConfigStorage configStorage) {
        super(restTemplate, dingtalkConfig, configStorage);
    }

    @Override
    public String getAccessToken(boolean forceRefresh) {
        DingtalkConfig.H5app h5app = getDingtalkConfig().getH5app();
        return this.getAppAccessToken(h5app.getAppKey(), h5app.getAppSecret(), forceRefresh);
    }

    @Override
    public UserInfoV2 getUserInfoByCode(String code) {
        DingTalkUserInfoV2Request request = new DingTalkUserInfoV2Request();
        request.setCode(code);
        String fullUrl = buildAccessTokenUrl(GET_USER_INFO_URL, getAccessToken(false));
        DingTalkUserInfoV2Response response = this.doPost(fullUrl, new HashMap<>(1), request,
                DingTalkUserInfoV2Response.class);
        return response.getResult();
    }

    @Override
    public DingTalkUserDetail getUserInfoByUserId(String userId) {
        DingTalkUserDetailRequest request = new DingTalkUserDetailRequest();
        request.setUserid(userId);
        String fullUrl = buildAccessTokenUrl(GET_USER_DETAIL_URL, getAccessToken(false));
        DingTalkUserDetailResponse response = this.doPost(fullUrl, new HashMap<>(1), request,
                DingTalkUserDetailResponse.class);
        return response.getResult();
    }

    @Override
    public String sendChatMessage(MessageReceiver receiver, Message message) {
        if (receiver == null || message == null) {
            throw new IllegalArgumentException("Message can not null");
        }
        DingTalkSendMessageRequest request = new DingTalkSendMessageRequest();
        String value = receiver.value();
        if (receiver instanceof MessageReceiverBuilder.ChatId) {
            request.setChatid(value);
        }
        request.setMsg(message.getMsgObj());
        String fullUrl = buildAccessTokenUrl(CHAT_SEND_URL, getAccessToken(false));
        DingTalkSendMessageResponse response = doPost(fullUrl, new HashMap<>(1), request, DingTalkSendMessageResponse.class);
        return response.getMessageId();
    }

}
