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

package com.apitable.starter.amqp.autoconfigure;

import com.apitable.starter.amqp.core.RabbitSendConfirmCallback;
import com.apitable.starter.amqp.core.RabbitSenderService;
import com.apitable.starter.amqp.core.RabbitSenderServiceImpl;
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
 * </p>
 * This configuration class extend RabbitAutoConfiguration using spring rabbitmq properties
 * when the RabbitMQ and Spring AMQP client libraries are on the classpath.
 * </p>
 * Registers the following beans:
 *
 * <ul>
 * <li>{@link org.springframework.amqp.support.converter.MessageConverter MessageConverter} if there
 * is no other bean of the same type in the context.</li>
 * <li>{@link org.springframework.messaging.converter.MappingJackson2MessageConverter
 * MappingJackson2MessageConverter} instance if there is no other bean of the same type in the
 * context.</li>
 * <li>{@link RabbitSenderService
 * RabbitSenderService} instance if there is no other bean of the same type in the
 * context.</li>
 * </ul>
 *
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

    /**
     * rabbitmq sender service bean.
     *
     * @param rabbitTemplate rabbitTemplate
     * @return rabbitmq sender service
     */
    @Bean
    @ConditionalOnBean(RabbitTemplate.class)
    public RabbitSenderService rabbitSender(RabbitTemplate rabbitTemplate) {
        RabbitSendConfirmCallback callback = new RabbitSendConfirmCallback();
        rabbitTemplate.setReturnsCallback(callback);
        rabbitTemplate.setConfirmCallback(callback);
        return new RabbitSenderServiceImpl(rabbitTemplate);
    }
}
