package com.vikadata.social.dingtalk;

import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.lang.TypeReference;
import cn.hutool.core.map.MapUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * DingTalk Event Listener Manager
 * The manager calls the register() method to register,
 * when you need to handle callback events, use {@code fireEventCallback(event)},
 * to handle message card interaction events, use {@code fireCardEvent(event)}
 */
@Slf4j
public class DingTalkEventListenerManager {

    /**
     * The processing memory corresponding to the callback event
     * Event -> callbackHandler implementation
     */
    private final Map<Class<? extends BaseEvent>, DingTalkEventCallbackHandler<?>> eventHandlerMap = new HashMap<>();

    /**
     * Handling callback events
     * @param event callback event
     * @param <T>   Callback event infrastructure
     * @return event specified response result
     */
    public <T extends BaseEvent> Object fireEventCallback(String agentId, T event) {
        Class<?> clazz = event.getClass();
        DingTalkEventCallbackHandler<T> callbackHandler = null;
        // Find the corresponding event handler
        while (callbackHandler == null && BaseEvent.class.isAssignableFrom(clazz)) {
            callbackHandler = MapUtil.get(eventHandlerMap, clazz, new TypeReference<DingTalkEventCallbackHandler<T>>() {
            });
            clazz = clazz.getSuperclass();
        }

        if (callbackHandler == null) {
            throw new IllegalStateException("Can't find a solution for the app" + event.getClass().getName());
        }
        return callbackHandler.doHandle(agentId, event);
    }

    /**
     * register event handler
     * @param clazz   callback event
     * @param handler The handler corresponding to the callback event
     * @param <T>     Events that inherit Base Event
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
