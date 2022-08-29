package com.vikadata.boot.autoconfigure.mail;

import javax.activation.MimeType;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * <p>
 * 邮件组件自动配置
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-05-16 10:37
 */
@Configuration(proxyBeanMethods = false)
@AutoConfigureAfter(MailSenderAutoConfiguration.class)
@ConditionalOnExpression("T(org.springframework.util.StringUtils).hasText('${spring.mail.host}')")
@ConditionalOnClass({ MimeMessage.class, MimeType.class, MailSender.class })
@ConditionalOnBean(JavaMailSender.class)
public class MailAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(MailAutoConfiguration.class);

    private final MailProperties mailProperties;

    private final JavaMailSender mailSender;

    public MailAutoConfiguration(MailProperties mailProperties, JavaMailSender mailSender) {
        this.mailProperties = mailProperties;
        this.mailSender = mailSender;
    }

    @Bean
    @ConditionalOnMissingBean(MailTemplate.class)
    public MailTemplate mailTemplate() {
        LOGGER.info("邮件推送自动装配");
        return new MailSendService(mailProperties, mailSender);
    }
}
