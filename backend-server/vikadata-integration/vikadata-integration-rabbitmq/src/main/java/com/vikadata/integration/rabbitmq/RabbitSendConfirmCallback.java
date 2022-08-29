package com.vikadata.integration.rabbitmq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate.ConfirmCallback;
import org.springframework.amqp.rabbit.core.RabbitTemplate.ReturnsCallback;

/**
 * <p>
 * rabbitmq 消息发送方确认机制
 * </p>
 * @author zoe zheng
 * @date 2021/12/7 4:31 PM
 */
public class RabbitSendConfirmCallback implements ConfirmCallback, ReturnsCallback {
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitSendConfirmCallback.class);

    /**
     *  ConfirmCallback只确认消息是否到达exchange，以实现方法confirm中ack属性为标准，true到达
     *  config : 需要开启rabbitmq得ack    publisher-confirm-type
     */
    @Override
    public void confirm(CorrelationData correlationData, boolean ack, String cause) {
        if (!ack) {
            LOGGER.error("发送消息到exchange失败：" + cause);
        }
    }

    /**
     *  ReturnCallback消息没有正确到达队列时触发回调，如果正确到达队列不执行
     *  config : 需要开启rabbitmq发送失败回退    publisher-returns    或rabbitTemplate.setMandatory(true);设置为true
     */
    @Override
    public void returnedMessage(ReturnedMessage returned) {
        LOGGER.error("匹配queue失败:{}", returned.toString());
    }
}
