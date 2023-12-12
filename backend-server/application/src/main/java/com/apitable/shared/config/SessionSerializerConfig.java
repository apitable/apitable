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

package com.apitable.shared.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.BeanClassLoaderAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.security.jackson2.SecurityJackson2Modules;
import org.springframework.session.data.redis.config.ConfigureRedisAction;

/**
 * <p>
 * Http Session Config.
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class SessionSerializerConfig implements BeanClassLoaderAware {

    private ClassLoader classLoader;

    /**
     * Long Mixin.
     */
    public abstract static class LongMixin {

        @SuppressWarnings("unused")
        @JsonProperty("long")
        Long value;
    }


    /**
     * config spring session redis serializer.
     *
     * @return redis serializer
     */
    @Bean("springSessionDefaultRedisSerializer")
    public RedisSerializer<Object> springSessionDefaultRedisSerializer() {
        var mapper = new ObjectMapper();
        mapper.addMixIn(Long.class, LongMixin.class);
        mapper.registerModules(SecurityJackson2Modules.getModules(this.classLoader));
        return new GenericJackson2JsonRedisSerializer(mapper);
    }

    @Bean
    public ConfigureRedisAction configureRedisAction() {
        return ConfigureRedisAction.NO_OP;
    }

    @Override
    public void setBeanClassLoader(@NotNull ClassLoader classLoader) {
        this.classLoader = classLoader;
    }
}
