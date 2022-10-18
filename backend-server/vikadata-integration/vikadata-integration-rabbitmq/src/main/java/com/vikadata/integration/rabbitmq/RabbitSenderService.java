package com.vikadata.integration.rabbitmq;

/**
 * <p>
 * rabbitmq 发送器抽象类
 * </p>
 * @author zoe zheng
 * @date 2021/11/30 2:28 下午
 */
public interface RabbitSenderService {
    /**
     * 向交换机发送消息
     *
     * @param exchangeName 交换机名称
     * @param topic 绑定主题
     * @param object 数据
     * @author zoe zheng
     * @date 2021/12/6 5:05 PM
     */
    void topicSend(String exchangeName, String topic, Object object);

    /**
     * 向交换机发送带有过期时间的消息，消息过期之后，会自动转发到死信交换机，分发给死信队列消费
     *
     * @param exchangeName 交换机名称
     * @param topic 绑定主题
     * @param object 数据
     * @param expiration 过期时间毫秒
     * @author zoe zheng
     * @date 2021/12/6 5:06 PM
     */
    void topicSend(String exchangeName, String topic, Object object, String expiration);

    /**
     * send message to queue
     * @param exchangeName exchange name
     * @param routingKey route key
     * @param messageId message id
     * @param object message content
     */
    void topicSend(String exchangeName, String routingKey, String messageId, Object object);
}
