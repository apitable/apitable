package com.vikadata.integration.rabbitmq;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

/**
 * rabbitmq transmitter
 */
public class RabbitSender implements RabbitSenderService {

    private RabbitTemplate rabbitTemplate;

    public RabbitSender() {
    }

    public RabbitSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void topicSend(String exchangeName, String topic, Object object) {
        this.rabbitTemplate.convertAndSend(exchangeName, topic, object);
    }

    @Override
    public void topicSend(String exchangeName, String topic, Object object, String expiration) {
        this.rabbitTemplate.convertAndSend(exchangeName, topic, object, m -> {
            m.getMessageProperties().setExpiration(expiration);
            return m;
        });
    }

    @Override
    public void topicSend(String exchangeName, String routingKey, String messageId, Object object) {
        this.rabbitTemplate.convertAndSend(exchangeName, routingKey, object, processor -> {
            processor.getMessageProperties().setMessageId(messageId);
            return processor;
        });
    }
}
