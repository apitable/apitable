package com.apitable.starter.amqp.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate.ConfirmCallback;
import org.springframework.amqp.rabbit.core.RabbitTemplate.ReturnsCallback;

/**
 * <p>
 * rabbitmq Message sender confirmation mechanism
 * </p>
 *
 */
public class RabbitSendConfirmCallback implements ConfirmCallback, ReturnsCallback {
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitSendConfirmCallback.class);

    /**
     *  ConfirmCallback Only confirm whether the message arrives at the exchange.
     *  Take the ack attribute in the confirmation method as the standard, and the true message arrives
     *  config : need to enable the ack of rabbitmq    publisher-confirm-type
     */
    @Override
    public void confirm(CorrelationData correlationData, boolean ack, String cause) {
        if (!ack) {
            LOGGER.error("Failed to send message to exchange: " + cause);
        }
    }

    /**
     *  ReturnCallback  The callback is triggered when the message does not arrive at the queue correctly.
     *  If the message arrives at the queue correctly, the callback is not executed
     *  config : need to enable rabbitmq send failure rollback    publisher-returns    Or rabbitTemplate. setMandatory (true); Set to true
     */
    @Override
    public void returnedMessage(ReturnedMessage returned) {
        LOGGER.error("Failed to match queue:{}", returned.toString());
    }
}
