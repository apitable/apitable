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

package com.apitable.shared.sysconfig.i18n;

import java.io.IOException;
import java.io.InputStream;

import com.apitable.shared.sysconfig.Converter;

/**
 * <p>
 * I18n Config Manager
 * </p>
 */
public class I18nConfigLoader {

    public static I18nConfig getConfig() {
        return I18nConfigLoader.Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final I18nConfig singleton;

        // JVM guarantee this method is called absolutely only once
        Singleton() {
            try {
                InputStream resourceAsStream = I18nConfigLoader.class.getResourceAsStream("/sysconfig/strings.auto.json");
                if (resourceAsStream == null) {
                    throw new IOException("I18n file not found!");
                }
                singleton = Converter.getObjectMapper().readValue(resourceAsStream, I18nConfig.class);
            }
            catch (IOException e) {
                throw new RuntimeException("Failed to load I18n!");
            }
        }

        public I18nConfig getSingleton() {
            return singleton;
        }
    }

    public static String getText(I18nStrings key, I18nTypes lang) {
        switch (lang) {
            case EN_US:
                return key.getEnUS();
            case ZH_HK:
                return key.getZhHK();
            default:
                return key.getZhCN();
        }
    }

}
