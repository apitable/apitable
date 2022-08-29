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
 * 消息 接口
 *
 * @author Shawn Deng
 * @date 2020-12-02 10:54:33
 */
public interface MessageOperations {

    /**
     * 独立服务商发送消息
     *
     * @param tenantKey 租户标识
     * @param receiver  消息接收者
     * @param message   消息体
     * @return 发送成功后的消息ID
     */
    String sendIsvChatMessage(String tenantKey, MessageReceiver receiver, Message message);

    /**
     * 独立服务商批量发送消息
     *
     * @param tenantKey 租户标识
     * @param request   请求参数
     * @param message   消息体
     * @return 发送成功后的消息ID
     */
    BatchSendChatMessageResult batchSendIsvChatMessage(String tenantKey, BatchMessageRequest request, Message message);

    /**
     * 发送消息卡片（单个）
     *
     * @param tenantKey 租户标识
     * @param request   请求参数
     * @return 响应结果
     * @throws FeishuApiException 飞书异常
     */
    FeishuSendMessageResponse sendMessage(String tenantKey, FeishuSendMessageRequest request) throws FeishuApiException;

    /**
     * 发送消息卡片（批量）
     *
     * @param tenantKey 租户标识
     * @param request   请求参数
     * @return 响应结果
     * @throws FeishuApiException 飞书异常
     */
    FeishuSendMessageBatchResponse sendMessageBatch(String tenantKey, FeishuSendMessageBatchRequest request) throws FeishuApiException;
}
