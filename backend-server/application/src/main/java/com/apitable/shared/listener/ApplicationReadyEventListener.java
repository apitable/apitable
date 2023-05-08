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

package com.apitable.shared.listener;

import com.apitable.shared.component.LanguageManager;
import com.apitable.shared.config.properties.SystemProperties;
import java.time.ZoneOffset;
import java.util.Locale;
import java.util.TimeZone;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <p>
 * service startup success event listener.
 * </p>
 *
 * @author Shawn Deng
 */
@Component
@Slf4j
public class ApplicationReadyEventListener implements
    ApplicationListener<ApplicationReadyEvent> {

    private final SystemProperties systemProperties;

    public ApplicationReadyEventListener(SystemProperties systemProperties) {
        this.systemProperties = systemProperties;
    }

    /**
     * Application Ready Event.
     *
     * @param event the event to respond to Application
     */
    @Override
    public void onApplicationEvent(@NotNull final ApplicationReadyEvent event) {
        TimeZone.setDefault(TimeZone.getTimeZone(ZoneOffset.UTC));
        Locale.setDefault(LanguageManager.me().getDefaultLanguage());
        log.info("========== Server Setting Info ==========");
        log.info("Locale: {}", Locale.getDefault());
        log.info("Test Mode Enabled: {}", systemProperties.isTestEnabled());
        log.info("TimeZone: {}", systemProperties.getDefaultTimeZone());
    }
}
