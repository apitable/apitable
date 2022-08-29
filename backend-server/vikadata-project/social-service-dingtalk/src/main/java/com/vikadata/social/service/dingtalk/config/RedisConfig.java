package com.vikadata.social.service.dingtalk.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.integration.redis.util.RedisLockRegistry;

/**
 * <p>
 * redis 键值序列化配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/16 19:59
 */
@Configuration(proxyBeanMethods = false)
@Slf4j
public class RedisConfig {

    private static Jackson2JsonRedisSerializer<Object> json() {
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        //默认是：OBJECT_AND_NON_CONCRETE -- 类里有 Interface 、 AbstractClass 时，对其进行序列化和反序列化
        //NON_FINAL ：包括上文提到的所有特征，而且包含即将被序列化的类里的全部、非final的属性，也就是相当于整个类、除final外的的属性信息都需要被序列化和反序列化
        om.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.WRAPPER_ARRAY);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        return jackson2JsonRedisSerializer;
    }

    /**
     * 设置redis键值序列化，值可视化
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        log.info("Redis默认配置");
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 将刚才的redis连接工厂设置到模板类中
        template.setConnectionFactory(factory);
        // 设置key序列化
        template.setKeySerializer(RedisSerializer.string());
        // 设置value序列化
        template.setValueSerializer(json());
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisLockRegistry redisLockRegistry(RedisConnectionFactory redisConnectionFactory) {
        // 注意这里的时间单位是毫秒
        return new RedisLockRegistry(redisConnectionFactory, "vikadata:concurrent");
    }
}
