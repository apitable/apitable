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

import org.springframework.cloud.sleuth.http.HttpRequestParser;
import org.springframework.cloud.sleuth.instrument.web.HttpClientRequestParser;
import org.springframework.cloud.sleuth.instrument.web.HttpServerRequestParser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * spring cloud sleuth config.
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
public class SleuthConfig {

    @Bean(name = {HttpClientRequestParser.NAME, HttpServerRequestParser.NAME})
    HttpRequestParser sleuthHttpServerRequestParser() {
        return (request, context, span) -> {
            String url = request.url();
            if (url != null) {
                span.tag("http.url", url);
            }
        };
    }
}
