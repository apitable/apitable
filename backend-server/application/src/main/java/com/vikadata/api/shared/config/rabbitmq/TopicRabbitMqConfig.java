package com.vikadata.api.shared.config.rabbitmq;

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
     * The queue entered after the message expires, that is the actual consumption queue
     */
    public final static String DING_TALK_ISV_TOPIC_QUEUE_NAME_DEAD = "vikadata.api.dingtalk.org.suite.dead";

    /**
     * Messages sent to the queue will expire after a period of time and enter the {@code vikadata.api.dingtalk.org.suite.process}
     * Each message can control its own failure time
     */
    public final static String DING_TALK_ISV_TOPIC_QUEUE_NAME_BUFFER = "vikadata.api.dingtalk.org.suite.buffer";

    public final static String DING_TALK_ISV_HIGH_TOPIC = "org.suite.#";

    /**
     * buffer exchange
     */
    public final static String DING_TALK_TOPIC_EXCHANGE_BUFFER = "vikadata.api.dingtalk.buffer";

    /**
     * dingtalk DLX exchange
     */
    public final static String DING_TALK_TOPIC_EXCHANGE_DEAD = "vikadata.api.dingtalk.dead";

    /**
     * wecom buffer exchange
     */
    public static final String WECOM_TOPIC_EXCHANGE_BUFFER = "vikadata.api.wecom.buffer";

    /**
     * wecom dead exchange
     */
    public static final String WECOM_TOPIC_EXCHANGE_DEAD = "vikadata.api.wecom.dead";

    /**
     * wecom isv event router
     */
    public static final String WECOM_ISV_EVENT_TOPIC_ROUTING_KEY = "vikadata.api.wecom.isv.event";

    /**
     * wecom isv event buffer queue
     */
    public static final String WECOM_ISV_EVENT_TOPIC_QUEUE_BUFFER = "vikadata.api.wecom.isv.event.buffer";

    /**
     * wecom isv event dead queue
     */
    public static final String WECOM_ISV_EVENT_TOPIC_QUEUE_DEAD = "vikadata.api.wecom.isv.event.dead";

    /**
     * wecom isv license permit router
     */
    public static final String WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY = "vikadata.api.wecom.isv.permit";

    /**
     * wecom isv api permit buffer queue
     */
    public static final String WECOM_ISV_PERMIT_TOPIC_QUEUE_BUFFER = "vikadata.api.wecom.isv.permit.buffer";

    /**
     * wecom isv permit dead queue
     */
    public static final String WECOM_ISV_PERMIT_TOPIC_QUEUE_DEAD = "vikadata.api.wecom.isv.permit.dead";

    /**
     * notification queue
     */
    public static final String NOTIFICATION_QUEUE = "vikadata.api.notification.queue";

    /**
     * notification route key
     */
    public final static String NOTIFICATION_ROUTING_KEY = "notification.#";

    /**
     * social isv event exchange
     */
    public static final String SOCIAL_ISV_EVENT_EXCHANGE = "vikadata.api.social.isv.event.exchange";

    /**
     * wecom isv event queue
     */
    public static final String WECOM_ISV_EVENT_QUEUE = "vikadata.api.wecom.isv.event";

    /**
     * dingtalk isv event queue
     */
    public static final String DINGTALK_ISV_EVENT_QUEUE = "vikadata.api.dingtalk.isv.event";


    /**
     * dingtalk isv event routing key
     */
    public static final String SOCIAL_ISV_DINGTALK_ROUTING_KEY = "isv.dingtalk.#";


    /**
     * dingtalk isv event routing key
     */
    public static final String SOCIAL_ISV_WECOM_ROUTING_KEY = "isv.wecom.#";

    private static final String RABBIT_ARGUMENT_DLX = "x-dead-letter-exchange";

    private static final String RABBIT_ARGUMENT_DLK = "x-dead-letter-routing-key";

    /**
     *
     * notification exchange
     */
    private static final String NOTIFICATION_EXCHANGE = "vikadata.api.notification.exchange";

    /**
     * create dingtalk DLX exchange
     */
    @Bean
    TopicExchange dingTalkDeadExchange() {
        return new TopicExchange(DING_TALK_TOPIC_EXCHANGE_DEAD);
    }

    /**
     * define dingtalk topic buffer exchange
     */
    @Bean
    TopicExchange dingTalkBufferExchange() {
        return new TopicExchange(DING_TALK_TOPIC_EXCHANGE_BUFFER);
    }

    /**
     * create buffer queue
     */
    @Bean
    Queue dingTalkIsvBufferQueue() {
        return QueueBuilder.durable(DING_TALK_ISV_TOPIC_QUEUE_NAME_BUFFER)
                .withArgument("x-dead-letter-exchange", DING_TALK_TOPIC_EXCHANGE_DEAD)
                .build();
    }

    /**
     * create dingtalk isv dead queue
     */
    @Bean
    public Queue dingTalkIsvDeadQueue() {
        return new Queue(DING_TALK_ISV_TOPIC_QUEUE_NAME_DEAD);
    }

    /**
     * bind dlx dingtalk dead queue
     */
    @Bean
    Binding bindDingTalkDlxExchangeWithOrgSuiteQueue(Queue dingTalkIsvDeadQueue, TopicExchange dingTalkDeadExchange) {
        return BindingBuilder.bind(dingTalkIsvDeadQueue)
                .to(dingTalkDeadExchange)
                .with(DING_TALK_ISV_HIGH_TOPIC);
    }

    /**
     * bind dingtalk exchange
     */
    @Bean
    public Binding bindDingTalkExchangeWithOrgSuiteQueue(Queue dingTalkIsvBufferQueue, TopicExchange dingTalkBufferExchange) {
        return BindingBuilder.bind(dingTalkIsvBufferQueue).to(dingTalkBufferExchange).with(DING_TALK_ISV_HIGH_TOPIC);
    }

    /**
     * wecom buffer exchange
     */
    @Bean
    public TopicExchange weComBufferExchange() {
        return new TopicExchange(WECOM_TOPIC_EXCHANGE_BUFFER);
    }

    /**
     * wecom dead exchange
     */
    @Bean
    public TopicExchange weComDeadExchange() {
        return new TopicExchange(WECOM_TOPIC_EXCHANGE_DEAD);
    }

    /**
     * wecom isv event buffer queue
     */
    @Bean
    public Queue weComIsvEventBufferQueue() {
        return QueueBuilder.durable(WECOM_ISV_EVENT_TOPIC_QUEUE_BUFFER)
                .withArgument(RABBIT_ARGUMENT_DLX, WECOM_TOPIC_EXCHANGE_DEAD)
                .withArgument(RABBIT_ARGUMENT_DLK, WECOM_ISV_EVENT_TOPIC_ROUTING_KEY)
                .build();
    }

    /**
     * wecom isv event dead queue
     */
    @Bean
    public Queue weComIsvEventDeadQueue() {
        return new Queue(WECOM_ISV_EVENT_TOPIC_QUEUE_DEAD);
    }

    /**
     * bind wecom isv event buffer to exchange
     */
    @Bean
    public Binding bindWeComBufferExchangeWithIsvEventQueue(Queue weComIsvEventBufferQueue, TopicExchange weComBufferExchange) {
        return BindingBuilder.bind(weComIsvEventBufferQueue)
                .to(weComBufferExchange)
                .with(WECOM_ISV_EVENT_TOPIC_ROUTING_KEY);
    }

    /**
     * bind wecom isv event dead queue to exchange
     */
    @Bean
    public Binding bindWeComDeadExchangeWithIsvEventQueue(Queue weComIsvEventDeadQueue, TopicExchange weComDeadExchange) {
        return BindingBuilder.bind(weComIsvEventDeadQueue)
                .to(weComDeadExchange)
                .with(WECOM_ISV_EVENT_TOPIC_ROUTING_KEY);
    }

    /**
     * wecom isv license permit buffer queue
     */
    @Bean
    public Queue weComIsvPermitBufferQueue() {
        return QueueBuilder.durable(WECOM_ISV_PERMIT_TOPIC_QUEUE_BUFFER)
                .withArgument(RABBIT_ARGUMENT_DLX, WECOM_TOPIC_EXCHANGE_DEAD)
                .withArgument(RABBIT_ARGUMENT_DLK, WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY)
                .build();
    }

    /**
     * wecom isv license permit dead queue
     */
    @Bean
    public Queue weComIsvPermitDeadQueue() {
        return new Queue(WECOM_ISV_PERMIT_TOPIC_QUEUE_DEAD);
    }

    /**
     * bind wecom isv license permit to exchange
     */
    @Bean
    public Binding bindWeComBufferExchangeWithIsvPermitQueue(Queue weComIsvPermitBufferQueue, TopicExchange weComBufferExchange) {
        return BindingBuilder.bind(weComIsvPermitBufferQueue)
                .to(weComBufferExchange)
                .with(WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY);
    }

    /**
     * bind wecom isv license permit dead queue to exchange
     */
    @Bean
    public Binding bindWeComDeadExchangeWithIsvPermitQueue(Queue weComIsvPermitDeadQueue, TopicExchange weComDeadExchange) {
        return BindingBuilder.bind(weComIsvPermitDeadQueue)
                .to(weComDeadExchange)
                .with(WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY);
    }

    /**
     * define notification exchange
     */
    @Bean
    TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }

    /**
     * notification queue
     */
    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE);
    }

    /**
     * bind notification exchange and queue
     */
    @Bean
    public Binding bindNotificationExchange(Queue notificationQueue, TopicExchange notificationExchange) {
        return BindingBuilder.bind(notificationQueue)
                .to(notificationExchange)
                .with(NOTIFICATION_ROUTING_KEY);

    }

    @Bean
    TopicExchange socialIsvEventExchange() {
        return new TopicExchange(SOCIAL_ISV_EVENT_EXCHANGE);
    }

    /**
     * init wecom isv event queue
     */
    @Bean
    public Queue wecomIsvEventQueue() {
        return new Queue(WECOM_ISV_EVENT_QUEUE);
    }

    @Bean
    public Binding bindWecomIsvEventExchange(Queue wecomIsvEventQueue, TopicExchange socialIsvEventExchange) {
        return BindingBuilder.bind(wecomIsvEventQueue)
                .to(socialIsvEventExchange)
                .with(SOCIAL_ISV_WECOM_ROUTING_KEY);

    }

    /**
     * dingtalk isv event queue
     */
    @Bean
    public Queue dingtalkIsvEventQueue() {
        return new Queue(DINGTALK_ISV_EVENT_QUEUE);
    }

    @Bean
    public Binding bindDingtalkIsvEventExchange(Queue dingtalkIsvEventQueue, TopicExchange socialIsvEventExchange) {
        return BindingBuilder.bind(dingtalkIsvEventQueue)
                .to(socialIsvEventExchange)
                .with(SOCIAL_ISV_DINGTALK_ROUTING_KEY);

    }
}
