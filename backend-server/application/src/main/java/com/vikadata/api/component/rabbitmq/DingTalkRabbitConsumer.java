package com.vikadata.api.component.rabbitmq;

import java.io.IOException;

import javax.annotation.Resource;

import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.service.IDingTalkIsvEventService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.integration.rabbitmq.RabbitSenderService;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteChangeEvent;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import static com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig.DING_TALK_ISV_HIGH_TOPIC;
import static com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig.DING_TALK_ISV_TOPIC_QUEUE_NAME_DEAD;
import static com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig.DING_TALK_TOPIC_EXCHANGE_BUFFER;

@Slf4j
@Component
public class DingTalkRabbitConsumer {
    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IDingTalkIsvEventService iDingTalkIsvEventService;

    @Autowired(required = false)
    private RabbitSenderService rabbitSenderService;

    @RabbitListener(queues = DING_TALK_ISV_TOPIC_QUEUE_NAME_DEAD)
    public void orgAuthChange(OrgSuiteChangeEvent event, Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        log.info("orgAuthChangeQueue received message:{}; deliveryTag:{}", event.getCorpId(), deliveryTag);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(event.getCorpId(), event.getSuiteId());
        try {
            if (iSpaceService.isContactSyncing(spaceId)) {
                log.info("Space synchronization not completed:{}:{}", event.getCorpId(), spaceId);
                rabbitSenderService.topicSend(DING_TALK_TOPIC_EXCHANGE_BUFFER, DING_TALK_ISV_HIGH_TOPIC, event,
                        Long.toString(120 * 1000));
            }
            else {
                // Space is synchronizing to avoid duplicate data in the member table
                iSpaceService.setContactSyncing(spaceId, event.getCorpId());
                iDingTalkIsvEventService.handleOrgSuiteChangeEvent(event.getSuiteId(), event);
            }
        }
        catch (Exception e) {
            log.error("Failed to process message: {}", event.getCorpId(), e);
            iSpaceService.contactFinished(spaceId);
        }
        // Manual ack, multiple = false, Confirm this message, otherwise confirm all messages before this tag
        // After ack confirmation is enabled in the configuration, when the consumer does not confirm, the message is blocked and will not receive subsequent messages. After disconnection, the unconfirmed message returns to the normal message queue and is consumed repeatedly
        channel.basicAck(deliveryTag, false);
    }
}
