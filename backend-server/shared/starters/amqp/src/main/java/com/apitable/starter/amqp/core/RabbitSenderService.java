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

/**
 * <p>
 * rabbitmq transmitter abstract class.
 * </p>
 */
public interface RabbitSenderService {

    /**
     * Send messages to the switch.
     *
     * @param exchangeName switch name
     * @param topic        bind Theme
     * @param object       data
     */
    void topicSend(String exchangeName, String topic, Object object);

    /**
     * Send a message with expiration time to the switch.
     * After the message expires, it will be automatically forwarded to the dead letter switch and distributed to the dead letter queue for consumption
     *
     * @param exchangeName switch name
     * @param topic        bind Theme
     * @param object       data
     * @param expiration   expiration time ms
     */
    void topicSend(String exchangeName, String topic, Object object, String expiration);

    /**
     * send message to queue.
     *
     * @param exchangeName exchange name
     * @param routingKey   route key
     * @param messageId    message id
     * @param object       message content
     */
    void topicSend(String exchangeName, String routingKey, String messageId, Object object);
}
