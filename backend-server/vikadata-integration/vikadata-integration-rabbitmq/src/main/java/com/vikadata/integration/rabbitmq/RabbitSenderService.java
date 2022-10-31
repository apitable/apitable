package com.vikadata.integration.rabbitmq;

/**
 * <p>
 * rabbitmq transmitter abstract class
 * </p>
 *
 */
public interface RabbitSenderService {
    /**
     * Send messages to the switch
     *
     * @param exchangeName switch name
     * @param topic bind Theme
     * @param object data
     */
    void topicSend(String exchangeName, String topic, Object object);

    /**
     * Send a message with expiration time to the switch.
     * After the message expires, it will be automatically forwarded to the dead letter switch and distributed to the dead letter queue for consumption
     *
     * @param exchangeName switch name
     * @param topic bind Theme
     * @param object data
     * @param expiration expiration time ms
     */
    void topicSend(String exchangeName, String topic, Object object, String expiration);

    /**
     * send message to queue
     *
     * @param exchangeName exchange name
     * @param routingKey route key
     * @param messageId message id
     * @param object message content
     */
    void topicSend(String exchangeName, String routingKey, String messageId, Object object);
}
