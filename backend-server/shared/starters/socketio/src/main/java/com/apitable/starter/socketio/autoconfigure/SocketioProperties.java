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

package com.apitable.starter.socketio.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * socketio properties.
 * </p>
 *
 * @author zoe zheng
 */
@ConfigurationProperties(prefix = "starter.socketio")
public class SocketioProperties {

    /**
     * client config.
     */
    private Client client;

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    /**
     * client config.
     */
    public static class Client {

        /**
         * server url.
         */
        private String url;

        /**
         * path.
         */
        private String path;

        /**
         * Times of reconnection.
         */
        private int reconnectionAttempts = 2;

        /**
         * Reconnect interval (ms).
         */
        private int reconnectionDelay = 1000;

        /**
         * Connection timeout (ms).
         */
        private int timeout = 1000;

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public int getReconnectionAttempts() {
            return reconnectionAttempts;
        }

        public void setReconnectionAttempts(int reconnectionAttempts) {
            this.reconnectionAttempts = reconnectionAttempts;
        }

        public int getReconnectionDelay() {
            return reconnectionDelay;
        }

        public void setReconnectionDelay(int reconnectionDelay) {
            this.reconnectionDelay = reconnectionDelay;
        }

        public int getTimeout() {
            return timeout;
        }

        public void setTimeout(int timeout) {
            this.timeout = timeout;
        }
    }
}
