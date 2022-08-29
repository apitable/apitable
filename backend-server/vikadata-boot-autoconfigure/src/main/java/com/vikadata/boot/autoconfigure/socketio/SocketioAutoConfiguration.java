package com.vikadata.boot.autoconfigure.socketio;

import java.net.InetAddress;
import java.net.URISyntaxException;
import java.net.UnknownHostException;

import io.socket.client.IO;
import io.socket.client.Socket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.integration.socketio.SocketClientTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * SocketIO自动配置
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/8 4:10 下午
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(Socket.class)
@EnableConfigurationProperties(SocketioProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.socketio", havingValue = "client", matchIfMissing = true)
public class SocketioAutoConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocketioAutoConfiguration.class);

    private final SocketioProperties socketioProperties;

    public SocketioAutoConfiguration(SocketioProperties socketioProperties) {
        this.socketioProperties = socketioProperties;
    }

    @Bean
    @ConditionalOnMissingBean
    public SocketClientTemplate socketClient() {
        SocketioProperties.Client client = socketioProperties.getClient();
        Socket socket = createInstance(client);
        return new SocketClientTemplate(socket);
    }

    private Socket createInstance(SocketioProperties.Client client) {
        Socket socket = null;
        try {
            // 连接配置
            IO.Options options = new IO.Options();
            // 失败重试次数
            options.reconnectionAttempts = client.getReconnectionAttempts();
            // 失败重连的时间间隔
            options.reconnectionDelay = client.getReconnectionDelay();
            // 连接超时时间(ms)
            options.timeout = client.getTimeout();
            options.path = client.getPath();
            // 连接鉴权统一 连接参数
            options.query = "userId=java_" + InetAddress.getLocalHost();
            socket = IO.socket(client.getUrl(), options);
            socket.on(Socket.EVENT_CONNECTING, objects -> LOGGER.info("socket连接中:host:{}", client.getUrl()));
            socket.on(Socket.EVENT_CONNECT_TIMEOUT, objects -> LOGGER.info("socket连接超时:host:{}", client.getUrl()));
            socket.on(Socket.EVENT_CONNECT_ERROR, objects -> LOGGER.info("socket连接失败:host:{}", client.getUrl()));
            socket.on(Socket.EVENT_CONNECT, objects -> LOGGER.info("socket连接成功:host:{}", client.getUrl()));
            socket.connect();
        }
        catch (UnknownHostException | URISyntaxException e) {
            LOGGER.error("Socket Server Connecting Failure, SocketClient Can not Execute", e);
        }
        return socket;
    }

}
