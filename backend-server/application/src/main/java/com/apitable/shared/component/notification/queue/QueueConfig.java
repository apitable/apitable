package com.apitable.shared.component.notification.queue;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class QueueConfig {

    /**
     * notification queue
     */
    public static final String NOTIFICATION_QUEUE = "apitable.notification.queue";

    /**
     * notification route key
     */
    public final static String NOTIFICATION_ROUTING_KEY = "notification.#";

    /**
     *
     * notification exchange
     */
    private static final String NOTIFICATION_EXCHANGE = "apitable.notification.exchange";

    /**
     * notification queue
     */
    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE);
    }

    /**
     * define notification exchange
     */
    @Bean
    TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
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
}
