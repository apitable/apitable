package com.apitable.starter.socketio.core;

import cn.hutool.json.JSON;

/**
 * <p>
 * client
 * </p>
 *
 */
public interface SocketClientOperations {

    /**
     * send message
     *
     * @param event   event
     * @param message message body
     */
    void emit(String event, JSON message);
}
