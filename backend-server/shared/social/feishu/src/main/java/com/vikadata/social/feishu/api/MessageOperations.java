package com.vikadata.social.feishu.api;

import com.vikadata.social.feishu.MessageReceiver;
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
public interface MessageOperations {

    /**
     * Independent service providers send messages
     *
     * @param tenantKey tenant key
     * @param receiver  message recipient
     * @param message   message content
     * @return Message ID after successful sending
     */
    String sendIsvChatMessage(String tenantKey, MessageReceiver receiver, Message message);

    /**
     * Independent service providers send messages in batches
     *
     * @param tenantKey tenant key
     * @param request   request param
     * @param message   message content
     * @return Message ID after successful sending
     */
    BatchSendChatMessageResult batchSendIsvChatMessage(String tenantKey, BatchMessageRequest request, Message message);

    /**
     * Send message card (single)
     *
     * @param tenantKey tenant key
     * @param request   request param
     * @return FeishuSendMessageResponse
     * @throws FeishuApiException Feishu customize exception
     */
    FeishuSendMessageResponse sendMessage(String tenantKey, FeishuSendMessageRequest request) throws FeishuApiException;

    /**
     *Send message cards (bulk)
     *
     * @param tenantKey tenant key
     * @param request   request param
     * @return FeishuSendMessageBatchResponse
     * @throws FeishuApiException Feishu customize exception
     */
    FeishuSendMessageBatchResponse sendMessageBatch(String tenantKey, FeishuSendMessageBatchRequest request) throws FeishuApiException;
}
