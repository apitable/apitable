package com.vikadata.boot.autoconfigure.socketio;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * SocketIO配置
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/8 3:52 下午
 */
@ConfigurationProperties(prefix = "vikadata-starter.socketio")
public class SocketioProperties {

    /**
     * 客户端配置
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
         * 域名
         */
        private String url;

        /**
         * 路径
         */
        private String path;

        /**
         * 重连次数
         */
        private int reconnectionAttempts = 2;

        /**
         * 重连间隔毫秒
         */
        private int reconnectionDelay = 1000;

        /**
         * 连接超时时间(ms)
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
