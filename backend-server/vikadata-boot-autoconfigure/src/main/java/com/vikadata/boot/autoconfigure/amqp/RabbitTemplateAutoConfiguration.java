package com.vikadata.boot.autoconfigure.amqp;

import com.vikadata.integration.rabbitmq.RabbitSendConfirmCallback;
import com.vikadata.integration.rabbitmq.RabbitSender;
import com.vikadata.integration.rabbitmq.RabbitSenderService;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;

/**
 * <p>
 * This configuration class extend RabbitAutoConfiguration using spring rabbitmq properties when the RabbitMQ and Spring AMQP client
 * libraries are on the classpath.
 * <p>
 * Registers the following beans:
 * <ul>
 * <li>{@link org.springframework.amqp.support.converter.MessageConverter MessageConverter} if there
 * is no other bean of the same type in the context.</li>
 * <li>{@link org.springframework.messaging.converter.MappingJackson2MessageConverter
 * MappingJackson2MessageConverter} instance if there is no other bean of the same type in the
 * context.</li>
 * <li>{@link com.vikadata.integration.rabbitmq.RabbitSenderService
 * RabbitSenderService} instance if there is no other bean of the same type in the
 * context.</li>
 * </ul>
 * @author zoe zheng
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(RabbitSenderService.class)
@ConditionalOnProperty(prefix = "spring.rabbitmq", name = "addresses")
public class RabbitTemplateAutoConfiguration extends RabbitAutoConfiguration {

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public MappingJackson2MessageConverter consumerJackson2MessageConverter() {
        return new MappingJackson2MessageConverter();
    }

    @Bean
    @ConditionalOnBean(RabbitTemplate.class)
    public RabbitSenderService rabbitSender(RabbitTemplate rabbitTemplate) {
        RabbitSendConfirmCallback callback = new RabbitSendConfirmCallback();
        rabbitTemplate.setReturnsCallback(callback);
        rabbitTemplate.setConfirmCallback(callback);
        return new RabbitSender(rabbitTemplate);
    }
}
