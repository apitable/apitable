package com.vikadata.boot.autoconfigure.socketio;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * socketio properties
 * </p>
 *
 * @author zoe zheng
 */
@ConfigurationProperties(prefix = "vikadata-starter.socketio")
public class SocketioProperties {

    /**
     * client config
     */
    private Client client;

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public static class Client {
        /**
         * url
         */
        private String url;

        /**
         * path
         */
        private String path;

        /**
         * Times of reconnection
         */
        private int reconnectionAttempts = 2;

        /**
         * Reconnect interval (ms)
         */
        private int reconnectionDelay = 1000;

        /**
         * Connection timeout (ms)
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
