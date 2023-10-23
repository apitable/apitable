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

package com.apitable.starter.socketio.core;

import cn.hutool.json.JSON;
import io.socket.client.Ack;
import io.socket.client.Socket;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Socket Client Auto Configuration.
 * </p>
 */
public class SocketClientTemplate implements SocketClientOperations {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocketClientTemplate.class);

    private final Socket socket;

    public SocketClientTemplate(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void emit(String event, JSON message) {
        // When js receives a long, it will be converted to a string, losing precision
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Socket Event: {}, Message: {}", event, message);
        }
        Socket socketInstance = getSocket();
        if (socketInstance == null) {
            LOGGER.error("Socket not initialized");
            return;
        }
        socketInstance.emit(event, message, (Ack) args -> {
            if (Objects.nonNull(args)) {
                if (!Boolean.parseBoolean(args[0].toString())) {
                    LOGGER.error("Socket Emit Fail: {}", message);
                }
            }
        });
    }

    private Socket getSocket() {
        if (socket == null) {
            return null;
        }
        if (!socket.connected()) {
            socket.connect();
        }
        return socket;
    }
}
