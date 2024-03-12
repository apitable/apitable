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

package com.apitable.client.task;

import static net.javacrumbs.shedlock.core.LockAssert.assertLocked;

import cn.hutool.core.util.StrUtil;
import com.apitable.shared.config.properties.ConstProperties;
import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestClient;

/**
 * Client task class.
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "system.test-enabled", havingValue = "false", matchIfMissing = true)
@Slf4j
public class ClientTasks {

    @Resource
    private RestClient restClient;

    @Resource
    private ConstProperties constProperties;

    @Value("${HEARTBEAT_URL:https://beat.apitable.com}")
    private String heartbeatUrl;

    /**
     * Heartbeat cron.
     * cron: 0 0 0 * * ?
     * preview execute desc: ****-03-07 00:00:00, ****-03-08 00:00:00, ****-03-09 00:00:00
     */
    @Scheduled(cron = "${HEARTBEAT_CRON:0 0 0 * * ?}")
    @SchedulerLock(name = "heartbeat", lockAtMostFor = "1h", lockAtLeastFor = "30m")
    public void heartbeat() {
        assertLocked();
        log.info("Execute Heartbeat Cron");
        HttpHeaders headers = new HttpHeaders();
        Map<String, Object> message = new HashMap<>();
        if (StrUtil.isNotBlank(constProperties.getServerDomain())) {
            message.put("serverDomain", constProperties.getServerDomain());
        }
        message.put("locale", constProperties.getLanguageTag());
        restClient.post()
            .uri(heartbeatUrl)
            .headers(header -> header.addAll(headers))
            .body(message)
            .retrieve()
            .body(String.class);
    }
}

