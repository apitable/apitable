package com.vikadata.boot.autoconfigure.amqp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
 * rabbitmq starter 自动配置,如果start没有开启，不会注册bean
 * </p>
 * @author zoe zheng
 * @date 2021/12/7 7:05 PM
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(RabbitSenderService.class)
@ConditionalOnProperty(prefix = "spring.rabbitmq", name = "addresses")
public class RabbitTemplateAutoConfiguration extends RabbitAutoConfiguration {
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitTemplateAutoConfiguration.class);

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
        LOGGER.info("启动自定义rabbitmq配置");
        RabbitSendConfirmCallback callback = new RabbitSendConfirmCallback();
        rabbitTemplate.setReturnsCallback(callback);
        rabbitTemplate.setConfirmCallback(callback);
        return new RabbitSender(rabbitTemplate);
    }
}
