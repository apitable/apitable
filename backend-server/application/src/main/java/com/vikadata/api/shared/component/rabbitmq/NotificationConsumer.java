package com.vikadata.api.shared.component.rabbitmq;

import java.io.IOException;

import javax.annotation.Resource;

import cn.hutool.core.util.IdUtil;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.interfaces.social.event.NotificationEvent;
import com.vikadata.api.interfaces.social.facade.SocialServiceFacade;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.shared.component.notification.NotificationManager;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static com.vikadata.api.shared.component.notification.NotificationTemplateId.SINGLE_RECORD_MEMBER_MENTION;
import static com.vikadata.api.shared.config.rabbitmq.TopicRabbitMqConfig.NOTIFICATION_QUEUE;

@Slf4j
@Component
public class NotificationConsumer {

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @RabbitListener(queues = NOTIFICATION_QUEUE)
    public void onMessageReceived(NotificationCreateRo event, Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();

        log.info("notification received message:{}; deliveryTag:{}", event.getTemplateId(), deliveryTag);
        if (SINGLE_RECORD_MEMBER_MENTION.equals(NotificationTemplateId.getValue(event.getTemplateId()))) {
            event.setNotifyId(IdUtil.simpleUUID());
        }
        try {
            NotificationManager.me().centerNotify(event);
            socialServiceFacade.eventCall(new NotificationEvent(event));
        }
        catch (Exception e) {
            log.warn("Failed to send notification: {}:{}", event.getSpaceId(), event.getTemplateId(), e);
        }
        channel.basicAck(deliveryTag, false);
    }
}
