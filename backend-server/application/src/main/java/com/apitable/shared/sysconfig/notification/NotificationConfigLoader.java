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

package com.apitable.shared.sysconfig.notification;

import com.apitable.shared.sysconfig.Converter;
import java.io.IOException;
import java.io.InputStream;

/**
 * <p>
 * System Config Manager.
 * </p>
 */
public class NotificationConfigLoader {

    public static NotificationConfig getConfig() {
        return Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final NotificationConfig singleton;

        Singleton() {
            try {
                InputStream resourceAsStream = NotificationConfigLoader.class.getResourceAsStream(
                    "/sysconfig/notification.json");
                if (resourceAsStream == null) {
                    throw new IOException("System config file not found!");
                }
                singleton = Converter.getObjectMapper()
                    .readValue(resourceAsStream, NotificationConfig.class);
            } catch (IOException e) {
                throw new RuntimeException("Failed to load system configuration!", e);
            }
        }

        public NotificationConfig getSingleton() {
            return singleton;
        }
    }
}
