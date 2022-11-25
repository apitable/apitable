package com.apitable.starter.mail.autoconfigure;

import javax.activation.MimeType;
import javax.mail.internet.MimeMessage;

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
 * autoconfiguration of mail components
 * </p>
 *
 * @author Benson Cheung
 */
@Configuration(proxyBeanMethods = false)
@AutoConfigureAfter(MailSenderAutoConfiguration.class)
@ConditionalOnExpression("T(org.springframework.util.StringUtils).hasText('${spring.mail.host}')")
@ConditionalOnClass({ MimeMessage.class, MimeType.class, MailSender.class })
@ConditionalOnBean(JavaMailSender.class)
public class MailAutoConfiguration {

    private final MailProperties mailProperties;

    private final JavaMailSender mailSender;

    public MailAutoConfiguration(MailProperties mailProperties, JavaMailSender mailSender) {
        this.mailProperties = mailProperties;
        this.mailSender = mailSender;
    }

    @Bean
    @ConditionalOnMissingBean(MailTemplate.class)
    public MailTemplate mailTemplate() {
        return new MailSendService(mailProperties, mailSender);
    }
}
