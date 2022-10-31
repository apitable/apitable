package com.vikadata.social.feishu.api.impl;

import cn.hutool.core.map.MapUtil;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.MessageReceiver;
import com.vikadata.social.feishu.MessageReceiverBuilder;
import com.vikadata.social.feishu.api.MessageOperations;
import com.vikadata.social.feishu.card.CardMessage;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.exception.FeishuApiException;
import com.vikadata.social.feishu.model.BatchMessageRequest;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;
import com.vikadata.social.feishu.model.FeishuSendMessageBatchRequest;
import com.vikadata.social.feishu.model.FeishuSendMessageBatchResponse;
import com.vikadata.social.feishu.model.FeishuSendMessageRequest;
import com.vikadata.social.feishu.model.FeishuSendMessageResponse;

/**
 * message interface
 */
public class MessageTemplate extends AbstractFeishuOperations implements MessageOperations {

    private static final String SEND_MESSAGE_URL = "/message/v4/send/";

    private static final String SEND_MESSAGE_BATCH_URL = "/message/v4/batch_send/";

    public MessageTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }

    @Override
    public String sendIsvChatMessage(String tenantKey, MessageReceiver receiver, Message message) {
        if (receiver == null || message == null) {
            throw new IllegalArgumentException("Message can not null");
        }

        return getFeishuTemplate().retryIfInvalidTenantAccessToken(() -> {
            final String value = receiver.value();
            FeishuSendMessageRequest request = new FeishuSendMessageRequest();
            if (receiver instanceof MessageReceiverBuilder.OpenId) {
                request.setOpenId(value);
            }
            else if (receiver instanceof MessageReceiverBuilder.ChatId) {
                request.setChatId(value);
            }
            else if (receiver instanceof MessageReceiverBuilder.UserId) {
                request.setUserId(value);
            }
            else if (receiver instanceof MessageReceiverBuilder.Email) {
                request.setEmail(value);
            }
            request.setRootId(message.getRootId());
            request.setMsgType(message.getMsgType());

            if (message instanceof CardMessage) {
                request.setUpdateMulti(((CardMessage) message).getUpdateMulti());
                request.setCard(message.getContent());
            }
            else {
                request.setContent(MapUtil.of(message.getContentKey(), message.getContent()));
            }
            FeishuSendMessageResponse response = this.sendMessage(tenantKey, request);
            return response.getData().getMessageId();
        }, tenantKey);
    }

    @Override
    public BatchSendChatMessageResult batchSendIsvChatMessage(String tenantKey, BatchMessageRequest request, Message message) {
        return getFeishuTemplate().retryIfInvalidTenantAccessToken(() -> {
            FeishuSendMessageBatchRequest req = new FeishuSendMessageBatchRequest();

            req.setMsgType(message.getMsgType());

            req.setDepartmentIds(request.getDepartmentIds());
            req.setOpenIds(request.getOpenIds());
            req.setUserIds(request.getUserIds());

            if (message instanceof CardMessage) {
                req.setUpdateMulti(((CardMessage) message).getUpdateMulti());
                req.setCard(message.getContent());
            }
            else {
                req.setContent(MapUtil.of(message.getContentKey(), message.getContent()));
            }

            FeishuSendMessageBatchResponse resp = this.sendMessageBatch(tenantKey, req);
            BatchSendChatMessageResult result = new BatchSendChatMessageResult();
            result.setMessageId(resp.getData().getMessageId());
            result.setInvalidDepartmentIds(resp.getData().getInvalidDepartmentIds());
            result.setInvalidOpenIds(resp.getData().getInvalidOpenIds());
            result.setInvalidUserIds(resp.getData().getInvalidUserIds());
            return result;
        }, tenantKey);
    }

    @Override
    public FeishuSendMessageResponse sendMessage(String tenantKey, FeishuSendMessageRequest request) throws FeishuApiException {
        return getFeishuTemplate().doPost(buildUri(SEND_MESSAGE_URL), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), request, FeishuSendMessageResponse.class);
    }

    @Override
    public FeishuSendMessageBatchResponse sendMessageBatch(String tenantKey, FeishuSendMessageBatchRequest request) throws FeishuApiException {
        return getFeishuTemplate().doPost(buildUri(SEND_MESSAGE_BATCH_URL), createAuthHeaders(getFeishuTemplate().getTenantAccessToken(tenantKey, false)), request, FeishuSendMessageBatchResponse.class);
    }
}
