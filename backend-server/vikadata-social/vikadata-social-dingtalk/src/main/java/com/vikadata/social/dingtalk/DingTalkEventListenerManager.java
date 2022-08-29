package com.vikadata.social.dingtalk;

import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.lang.TypeReference;
import cn.hutool.core.map.MapUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * <p>
 * 钉钉事件监听器管理器
 * 管理器调用register()方法注册
 * 当需要处理回调事件时，使用 {@code fireEventCallback(event)}
 * 需要处理消息卡片交互事件时，使用 {@code fireCardEvent(event)}
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 2:49 下午
 */
@Slf4j
public class DingTalkEventListenerManager {

    /**
     * 回调事件对应的处理存储器
     * Event -> callbackHandler implementation
     */
    private final Map<Class<? extends BaseEvent>, DingTalkEventCallbackHandler<?>> eventHandlerMap = new HashMap<>();

    /**
     * 处理回调事件
     *
     * @param event 回调事件
     * @param <T>   回调事件基础结构
     * @return 事件指定响应结果
     */
    public <T extends BaseEvent> Object fireEventCallback(String agentId, T event) {
        Class<?> clazz = event.getClass();
        DingTalkEventCallbackHandler<T> callbackHandler = null;
        // 找到对应的事件处理方法
        while (callbackHandler == null && BaseEvent.class.isAssignableFrom(clazz)) {
            callbackHandler = MapUtil.get(eventHandlerMap, clazz, new TypeReference<DingTalkEventCallbackHandler<T>>() {
            });
            clazz = clazz.getSuperclass();
        }

        if (callbackHandler == null) {
            throw new IllegalStateException("找不到应用的处理方法" + event.getClass().getName());
        }
        return callbackHandler.doHandle(agentId, event);
    }

    /**
     * 注册事件处理器
     *
     * @param clazz   回调事件
     * @param handler 回调事件对应的处理器
     * @param <T>     继承BaseEvent的事件
     */
    public <T extends BaseEvent> void registerEventCallbackHandler(Class<T> clazz, DingTalkEventCallbackHandler<T> handler) {
        if (clazz != null && handler != null) {
            eventHandlerMap.put(clazz, handler);
        }
    }

    public Map<Class<? extends BaseEvent>, DingTalkEventCallbackHandler<?>> getEventHandlerMap() {
        return eventHandlerMap;
    }
}
