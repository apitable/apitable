package com.vikadata.boot.autoconfigure.social;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.social.wecom.WeComAutoConfiguration;
import com.vikadata.social.core.RedisTemplateSocialRedisOperations;
import com.vikadata.social.core.SocialRedisOperations;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * autoconfiguration of social integration
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(SocialRedisOperations.class)
@Import({ FeishuAutoConfiguration.class, DingTalkAutoConfiguration.class, WeComAutoConfiguration.class })
public class SocialAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocialAutoConfiguration.class);

    @Bean
    @ConditionalOnMissingBean(SocialRedisOperations.class)
    public SocialRedisOperations socialRedisOperations(StringRedisTemplate stringRedisTemplate) {
        LOGGER.info("Register Social Redis Operation Bean");
        return new RedisTemplateSocialRedisOperations(stringRedisTemplate);
    }
}
