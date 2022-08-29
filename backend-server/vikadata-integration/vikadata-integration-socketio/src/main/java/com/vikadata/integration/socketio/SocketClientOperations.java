package com.vikadata.integration.socketio;

import cn.hutool.json.JSON;

/**
 * <p>
 * 客户端
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/8 4:36 下午
 */
public interface SocketClientOperations {

    /**
     * 发送消息
     *
     * @param event   事件
     * @param message 消息体
     */
    void emit(String event, JSON message);
}
