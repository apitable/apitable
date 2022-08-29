package com.vikadata.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.BeanClassLoaderAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.security.jackson2.SecurityJackson2Modules;
import org.springframework.session.data.redis.config.ConfigureRedisAction;

/**
 * <p>
 * Http Session Config
 * 设置30天内有效，主动续租
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/26 14:39
 */
@Configuration(proxyBeanMethods = false)
public class SessionSerializerConfig implements BeanClassLoaderAware {

    private ClassLoader classLoader;

    @Bean("springSessionDefaultRedisSerializer")
    public RedisSerializer<Object> springSessionDefaultRedisSerializer() {
        return new GenericJackson2JsonRedisSerializer(
            new ObjectMapper().registerModules(SecurityJackson2Modules.getModules(this.classLoader))
        );
    }

    /**
     * 关闭Spring-session中对CONFIG的操作，防止上线后报错，notify-keyspace-events
     */
    @Bean
    public ConfigureRedisAction configureRedisAction() {
        return ConfigureRedisAction.NO_OP;
    }

    @Override
    public void setBeanClassLoader(ClassLoader classLoader) {
        this.classLoader = classLoader;
    }
}
