package com.vikadata.api.component.rabbitmq;

import java.io.IOException;

import javax.annotation.Resource;

import cn.hutool.core.util.IdUtil;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.NotificationFactory;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.model.ro.player.NotificationCreateRo;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static com.vikadata.api.component.notification.NotificationTemplateId.SINGLE_RECORD_MEMBER_MENTION;
import static com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig.NOTIFICATION_QUEUE;


@Slf4j
@Component
public class NotificationConsumer {
    @Resource
    private NotificationFactory notifyFactory;

    /**
     * 直连交换机，同一个队列中得消息，只会被消费一遍
     */
    @RabbitListener(queues = NOTIFICATION_QUEUE)
    public void onMessageReceived(NotificationCreateRo event, Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();

        log.info("notification received message:{}; deliveryTag:{}", event.getTemplateId(), deliveryTag);
        if (SINGLE_RECORD_MEMBER_MENTION.equals(NotificationTemplateId.getValue(event.getTemplateId()))) {
            event.setNotifyId(IdUtil.simpleUUID());
        }
        try {
            // 通知中心消息
            NotificationManager.me().centerNotify(event);
            // 第三方通知
            NotificationManager.me().socialNotify(event, notifyFactory.buildSocialNotifyContext(event.getSpaceId()));
        }
        catch (Exception e) {
            log.warn("发送通知失败:{}:{}", event.getSpaceId(), event.getTemplateId(), e);
        }
        // 采用手动ack，multiple = false 确认本次消息，否则确认本次tag之前所有得消息
        // 配置中开启ack确认后，消费者未确认时消息阻塞，不会收到后续消息，断开连接后，未确认消息回到正常消息队列，被重复消费
        channel.basicAck(deliveryTag, false);
    }
}
