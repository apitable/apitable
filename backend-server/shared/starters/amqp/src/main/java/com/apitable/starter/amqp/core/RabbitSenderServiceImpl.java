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

import org.springframework.amqp.rabbit.core.RabbitTemplate;

/**
 * rabbitmq transmitter.
 */
public class RabbitSenderServiceImpl implements RabbitSenderService {

    private final RabbitTemplate rabbitTemplate;

    public RabbitSenderServiceImpl(RabbitTemplate rabbitTemplate) {
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
