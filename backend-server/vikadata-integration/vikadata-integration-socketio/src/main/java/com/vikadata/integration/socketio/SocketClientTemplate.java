package com.vikadata.integration.socketio;

import cn.hutool.json.JSON;
import io.socket.client.Ack;
import io.socket.client.Socket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;

/**
 * <p>
 * Socket 客户端自动配置
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/8 4:27 下午
 */
public class SocketClientTemplate implements SocketClientOperations {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocketClientTemplate.class);

    private final Socket socket;

    public SocketClientTemplate(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void emit(String event, JSON message) {
        // js在接收long的时候会转换成字符串，失去精度
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Socket Event: {}, Message: {}", event, message);
        }
        getSocket().emit(event, message, (Ack) args -> {
            if (Objects.nonNull(args)) {
                if (!Boolean.parseBoolean(args[0].toString())) {
                    LOGGER.error("Socket Emit Fail: {}", message);
                }
            }
        });
    }

    private Socket getSocket() {
        if (!socket.connected()) {
            socket.connect();
        }
        return socket;
    }
}
