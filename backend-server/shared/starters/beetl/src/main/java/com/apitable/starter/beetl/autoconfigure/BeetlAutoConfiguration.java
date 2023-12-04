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

package com.apitable.starter.beetl.autoconfigure;

import org.beetl.core.GroupTemplate;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * beetl render template autoconfiguration.
 *
 * @author Shawn Deng
 */
@AutoConfiguration
@ConditionalOnClass(GroupTemplate.class)
@EnableConfigurationProperties(BeetlProperties.class)
public class BeetlAutoConfiguration {

    private final BeetlProperties properties;

    public BeetlAutoConfiguration(BeetlProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean
    public BeetlTemplate beetlTemplate() {
        return new BeetlTemplate(properties.getClassPath(), properties.getCharset(),
            properties.getPlaceholderStart(), properties.getPlaceholderEnd());
    }
}
