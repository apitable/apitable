package com.vikadata.api.config;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.hibernate.validator.HibernateValidator;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * 默认校验器配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/26 17:59
 */
@Configuration(proxyBeanMethods = false)
public class ValidatorConfig {

    @Bean
    public Validator validator() {
        try (ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
                .configure()
                .failFast(true)
                .buildValidatorFactory()) {
            return validatorFactory.getValidator();
        }
    }
}
