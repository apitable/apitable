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

package com.apitable.shared.sysconfig.wizard;

import com.apitable.shared.sysconfig.Converter;
import java.io.IOException;
import java.io.InputStream;

/**
 * <p>
 * System Config Manager.
 * </p>
 */
public class PlayerConfigLoader {

    public static PlayerConfig getConfig() {
        return Singleton.INSTANCE.getSingleton();
    }

    private enum Singleton {
        INSTANCE;

        private final PlayerConfig singleton;

        Singleton() {
            try {
                InputStream resourceAsStream =
                    PlayerConfigLoader.class.getResourceAsStream("/sysconfig/player_wizard.json");
                if (resourceAsStream == null) {
                    throw new IOException("System config file not found!");
                }
                singleton =
                    Converter.getObjectMapper().readValue(resourceAsStream, PlayerConfig.class);
            } catch (IOException e) {
                throw new RuntimeException("Failed to load system configuration!", e);
            }
        }

        public PlayerConfig getSingleton() {
            return singleton;
        }
    }
}
