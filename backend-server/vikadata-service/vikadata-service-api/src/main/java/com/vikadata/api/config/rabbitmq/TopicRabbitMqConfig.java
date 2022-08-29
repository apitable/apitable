package com.vikadata.api.config.rabbitmq;

import lombok.extern.slf4j.Slf4j;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration(proxyBeanMethods = false)
public class TopicRabbitMqConfig {

    /**
     * message失效后进入的队列，也就是实际的消费队列
     */
    public final static String DING_TALK_ISV_TOPIC_QUEUE_NAME_DEAD = "vikadata.api.dingtalk.org.suite.dead";

    /**
     * 发送到该队列的message会在一段时间后过期进入到vikadata.api.dingtalk.org.suite.process
     * 每个message可以控制自己的失效时间
     */
    public final static String DING_TALK_ISV_TOPIC_QUEUE_NAME_BUFFER = "vikadata.api.dingtalk.org.suite.buffer";

    public final static String DING_TALK_ISV_HIGH_TOPIC = "org.suite.#";

    /**
     * 缓冲交换机
     */
    public final static String DING_TALK_TOPIC_EXCHANGE_BUFFER = "vikadata.api.dingtalk.buffer";

    /**
     * ding talk DLX 死信交换器
     */
    public final static String DING_TALK_TOPIC_EXCHANGE_DEAD = "vikadata.api.dingtalk.dead";

    /**
     * 企微缓冲交换机
     */
    public static final String WECOM_TOPIC_EXCHANGE_BUFFER = "vikadata.api.wecom.buffer";

    /**
     * 企微死信交换机
     */
    public static final String WECOM_TOPIC_EXCHANGE_DEAD = "vikadata.api.wecom.dead";

    /**
     * 企微服务商事件路由
     */
    public static final String WECOM_ISV_EVENT_TOPIC_ROUTING_KEY = "vikadata.api.wecom.isv.event";

    /**
     * 企微服务商事件缓冲队列
     */
    public static final String WECOM_ISV_EVENT_TOPIC_QUEUE_BUFFER = "vikadata.api.wecom.isv.event.buffer";

    /**
     * 企微服务商事件死信队列
     */
    public static final String WECOM_ISV_EVENT_TOPIC_QUEUE_DEAD = "vikadata.api.wecom.isv.event.dead";

    /**
     * 企微服务商接口许可路由
     */
    public static final String WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY = "vikadata.api.wecom.isv.permit";

    /**
     * 企微服务商接口许可缓冲队列
     */
    public static final String WECOM_ISV_PERMIT_TOPIC_QUEUE_BUFFER = "vikadata.api.wecom.isv.permit.buffer";

    /**
     * 企微服务商接口许可死信队列
     */
    public static final String WECOM_ISV_PERMIT_TOPIC_QUEUE_DEAD = "vikadata.api.wecom.isv.permit.dead";

    private static final String RABBIT_ARGUMENT_DLX = "x-dead-letter-exchange";

    private static final String RABBIT_ARGUMENT_DLK = "x-dead-letter-routing-key";

    /**
     *
     * 通知 exchange
     */
    private static final String NOTIFICATION_EXCHANGE = "vikadata.api.notification.exchange";

    /**
     * 通知队列
     */
    public static final String NOTIFICATION_QUEUE = "vikadata.api.notification.queue";

    /**
     * 通知 routing key
     */
    public final static String NOTIFICATION_ROUTING_KEY = "notification.#";

    /**
     * 创建 ding talk DLX exchange
     */
    @Bean
    TopicExchange dingTalkDeadExchange() {
        return new TopicExchange(DING_TALK_TOPIC_EXCHANGE_DEAD);
    }

    /**
     * 定义钉钉topic缓冲交换器
     */
    @Bean
    TopicExchange dingTalkBufferExchange() {
        return new TopicExchange(DING_TALK_TOPIC_EXCHANGE_BUFFER);
    }

    /**
     * 创建缓冲队列队列, 指定死信交换机
     */
    @Bean
    Queue dingTalkIsvBufferQueue() {
        return QueueBuilder.durable(DING_TALK_ISV_TOPIC_QUEUE_NAME_BUFFER)
                .withArgument("x-dead-letter-exchange", DING_TALK_TOPIC_EXCHANGE_DEAD) // DLX，dead letter发送到的exchange
                .build();
    }

    /**
     * 创建死信队列，也就是实际消费队列
     */
    @Bean
    public Queue dingTalkIsvDeadQueue() {
        return new Queue(DING_TALK_ISV_TOPIC_QUEUE_NAME_DEAD);
    }

    /**
     * 将DLX绑定到死信队列，也就是实际消费队列
     */
    @Bean
    Binding bindDingTalkDlxExchangeWithOrgSuiteQueue(Queue dingTalkIsvDeadQueue, TopicExchange dingTalkDeadExchange) {
        return BindingBuilder.bind(dingTalkIsvDeadQueue)
                .to(dingTalkDeadExchange)
                .with(DING_TALK_ISV_HIGH_TOPIC);
    }

    /**
     * 绑定缓冲队列到缓冲交换机
     */
    @Bean
    public Binding bindDingTalkExchangeWithOrgSuiteQueue(Queue dingTalkIsvBufferQueue, TopicExchange dingTalkBufferExchange) {
        return BindingBuilder.bind(dingTalkIsvBufferQueue).to(dingTalkBufferExchange).with(DING_TALK_ISV_HIGH_TOPIC);
    }

    /**
     * 企微缓冲交换机
     */
    @Bean
    public TopicExchange weComBufferExchange() {
        return new TopicExchange(WECOM_TOPIC_EXCHANGE_BUFFER);
    }

    /**
     * 企微死信交换机
     */
    @Bean
    public TopicExchange weComDeadExchange() {
        return new TopicExchange(WECOM_TOPIC_EXCHANGE_DEAD);
    }

    /**
     * 企微服务商事件缓冲队列
     */
    @Bean
    public Queue weComIsvEventBufferQueue() {
        return QueueBuilder.durable(WECOM_ISV_EVENT_TOPIC_QUEUE_BUFFER)
                .withArgument(RABBIT_ARGUMENT_DLX, WECOM_TOPIC_EXCHANGE_DEAD)
                .withArgument(RABBIT_ARGUMENT_DLK, WECOM_ISV_EVENT_TOPIC_ROUTING_KEY)
                .build();
    }

    /**
     * 企微服务商事件死信队列
     */
    @Bean
    public Queue weComIsvEventDeadQueue() {
        return new Queue(WECOM_ISV_EVENT_TOPIC_QUEUE_DEAD);
    }

    /**
     * 绑定企微服务商事件缓冲队列到交换机
     */
    @Bean
    public Binding bindWeComBufferExchangeWithIsvEventQueue(Queue weComIsvEventBufferQueue, TopicExchange weComBufferExchange) {
        return BindingBuilder.bind(weComIsvEventBufferQueue)
                .to(weComBufferExchange)
                .with(WECOM_ISV_EVENT_TOPIC_ROUTING_KEY);
    }

    /**
     * 绑定企微服务商事件死信队列到交换机
     */
    @Bean
    public Binding bindWeComDeadExchangeWithIsvEventQueue(Queue weComIsvEventDeadQueue, TopicExchange weComDeadExchange) {
        return BindingBuilder.bind(weComIsvEventDeadQueue)
                .to(weComDeadExchange)
                .with(WECOM_ISV_EVENT_TOPIC_ROUTING_KEY);
    }

    /**
     * 企微服务商接口许可缓冲队列
     */
    @Bean
    public Queue weComIsvPermitBufferQueue() {
        return QueueBuilder.durable(WECOM_ISV_PERMIT_TOPIC_QUEUE_BUFFER)
                .withArgument(RABBIT_ARGUMENT_DLX, WECOM_TOPIC_EXCHANGE_DEAD)
                .withArgument(RABBIT_ARGUMENT_DLK, WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY)
                .build();
    }

    /**
     * 企微服务商接口许可死信队列
     */
    @Bean
    public Queue weComIsvPermitDeadQueue() {
        return new Queue(WECOM_ISV_PERMIT_TOPIC_QUEUE_DEAD);
    }

    /**
     * 绑定企微服务商接口许可缓冲队列到交换机
     */
    @Bean
    public Binding bindWeComBufferExchangeWithIsvPermitQueue(Queue weComIsvPermitBufferQueue, TopicExchange weComBufferExchange) {
        return BindingBuilder.bind(weComIsvPermitBufferQueue)
                .to(weComBufferExchange)
                .with(WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY);
    }

    /**
     * 绑定企微服务商接口许可死信队列到交换机
     */
    @Bean
    public Binding bindWeComDeadExchangeWithIsvPermitQueue(Queue weComIsvPermitDeadQueue, TopicExchange weComDeadExchange) {
        return BindingBuilder.bind(weComIsvPermitDeadQueue)
                .to(weComDeadExchange)
                .with(WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY);
    }

    /**
     * 定义通知交换机
     */
    @Bean
    TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }

    /**
     * 通知队列
     */
    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE);
    }

    /**
     * 绑定通知交换机和队列
     */
    @Bean
    public Binding bindNotificationExchange(Queue notificationQueue, TopicExchange notificationExchange) {
        return BindingBuilder.bind(notificationQueue)
                .to(notificationExchange)
                .with(NOTIFICATION_ROUTING_KEY);

    }
}
