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

    /**
     * 直连交换机，同一个队列中得消息，只会被消费一遍
     */
    @RabbitListener(queues = DING_TALK_ISV_TOPIC_QUEUE_NAME_DEAD)
    public void orgAuthChange(OrgSuiteChangeEvent event, Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        log.info("orgAuthChangeQueue received message:{}; deliveryTag:{}", event.getCorpId(), deliveryTag);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(event.getCorpId(), event.getSuiteId());
        try {
            if (iSpaceService.isContactSyncing(spaceId)) {
                log.info("空间同步未完成:{}:{}", event.getCorpId(), spaceId);
                // 再次放入延迟缓冲队列
                rabbitSenderService.topicSend(DING_TALK_TOPIC_EXCHANGE_BUFFER, DING_TALK_ISV_HIGH_TOPIC, event,
                        Long.toString(120 * 1000));
            }
            else {
                // 标记空间正在同步空间站通讯录，避免members表重复数据
                iSpaceService.setContactSyncing(spaceId, event.getCorpId());
                iDingTalkIsvEventService.handleOrgSuiteChangeEvent(event.getSuiteId(), event);
            }
        }
        catch (Exception e) {
            // 消息处理失败，把这条消息放弃，因为数据库里面有存，所以不需要放在队列里面
            log.error("处理消息失败:{}", event.getCorpId(), e);
            iSpaceService.contactFinished(spaceId);
        }
        // 采用手动ack，multiple = false 确认本次消息，否则确认本次tag之前所有得消息
        // 配置中开启ack确认后，消费者未确认时消息阻塞，不会收到后续消息，断开连接后，未确认消息回到正常消息队列，被重复消费
        channel.basicAck(deliveryTag, false);
    }
}
