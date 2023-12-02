/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.starter.amqp.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate.ConfirmCallback;
import org.springframework.amqp.rabbit.core.RabbitTemplate.ReturnsCallback;

/**
 * <p>
 * rabbitmq Message sender confirmation mechanism.
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
