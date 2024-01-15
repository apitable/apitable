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

import cn.hutool.core.util.StrUtil;
import com.apitable.starter.socketio.core.SocketClientTemplate;
import io.socket.client.IO;
import io.socket.client.Socket;
import java.net.InetAddress;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * <p>
 * autoconfiguration of socketio.
 * </p>
 *
 * @author zoe zheng
 */
@AutoConfiguration
@ConditionalOnClass(Socket.class)
@EnableConfigurationProperties(SocketioProperties.class)
@ConditionalOnProperty(value = "starter.socketio", havingValue = "client", matchIfMissing = true)
public class SocketioAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocketioAutoConfiguration.class);

    private final SocketioProperties socketioProperties;

    public SocketioAutoConfiguration(SocketioProperties socketioProperties) {
        this.socketioProperties = socketioProperties;
    }

    /**
     * socket client.
     *
     * @return socket client
     */
    @Bean
    @ConditionalOnMissingBean
    public SocketClientTemplate socketClient() {
        SocketioProperties.Client client = socketioProperties.getClient();
        Socket socket = createInstance(client);
        return new SocketClientTemplate(socket);
    }

    private Socket createInstance(SocketioProperties.Client client) {
        if (StrUtil.isBlank(client.getUrl())) {
            LOGGER.info("socket server url is null, socket client can not initialize");
            return null;
        }
        Socket socket = null;
        try {
            IO.Options options = new IO.Options();
            // Number of failed retries
            options.reconnectionAttempts = client.getReconnectionAttempts();
            // Time interval of failed reconnection
            options.reconnectionDelay = client.getReconnectionDelay();
            // Connection timeout(ms)
            options.timeout = client.getTimeout();
            options.path = client.getPath();
            // Unified connection parameters for connection authentication
            options.query = "userId=java_" + InetAddress.getLocalHost();
            socket = IO.socket(client.getUrl(), options);
            socket.on(Socket.EVENT_CONNECT_ERROR,
                objects -> LOGGER.info("connect fail: {}", client.getUrl()));
            socket.on(Socket.EVENT_CONNECT,
                objects -> LOGGER.info("connect success: {}", client.getUrl()));
            socket.connect();
        } catch (UnknownHostException | URISyntaxException e) {
            LOGGER.error("Socket Server Connecting Failure, SocketClient Can not Execute", e);
        }
        return socket;
    }

}
