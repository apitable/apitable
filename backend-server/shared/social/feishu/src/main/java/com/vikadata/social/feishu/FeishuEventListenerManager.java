package com.vikadata.social.feishu;

import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.lang.TypeReference;
import cn.hutool.core.map.MapUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.social.feishu.card.Card;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * Feishu Event Listener Manager.
 * The manager calls the register() method to register,
 * When you need to handle callback events, use {@code fireEventCallback(event)},
 * To handle message card interaction events, use {@code fireCardEvent(event)}
 */
@Slf4j
public class FeishuEventListenerManager {

    /**
     * The processing memory corresponding to the callback event
     * Event -> callbackHandler implementation
     */
    private final Map<Class<? extends BaseEvent>, FeishuEventCallbackHandler<?>> eventHandlerMap = new HashMap<>(16);

    /**
     * The new version of the contact event corresponding processor
     */
    private final Map<Class<? extends BaseV3ContactEvent>, FeishuV3ContactEventCallbackHandler<?>> v3ContactEventHandlerMap = new HashMap<>(16);

    /**
     * message interaction interface
     */
    private FeishuCardActionHandler cardEventHandler;

    /**
     * Handling callback events
     *
     * @param event callback event
     * @param <T>   callback event infrastructure
     * @return event specified response result
     */
    public <T extends BaseEvent> Object fireEventCallback(T event) {
        Class<?> clazz = event.getClass();
        FeishuEventCallbackHandler<T> callbackHandler = null;
        // Find the corresponding event handler
        while (callbackHandler == null && BaseEvent.class.isAssignableFrom(clazz)) {
            callbackHandler = MapUtil.get(eventHandlerMap, clazz, new TypeReference<FeishuEventCallbackHandler<T>>() {});
            clazz = clazz.getSuperclass();
        }

        if (callbackHandler == null) {
            throw new IllegalStateException("Feishu cannot find event handler" + event.getClass().getName());
        }
        return callbackHandler.doHandle(event);
    }

    /**
     * Handling new contacts events
     *
     * @param event callback event
     * @param <T>   callback event infrastructure
     * @return event specified response result
     */
    public <T extends BaseV3ContactEvent> Object fireV3ContactEventCallback(T event) {
        Class<?> clazz = event.getClass();
        FeishuV3ContactEventCallbackHandler<T> callbackHandler = null;
        // Find the corresponding event handler
        while (callbackHandler == null && BaseV3ContactEvent.class.isAssignableFrom(clazz)) {
            callbackHandler = MapUtil.get(v3ContactEventHandlerMap, clazz, new TypeReference<FeishuV3ContactEventCallbackHandler<T>>() {
            });
            clazz = clazz.getSuperclass();
        }

        if (callbackHandler == null) {
            throw new IllegalStateException("Feishu cannot find event handler" + event.getClass().getName());
        }
        return callbackHandler.doHandle(event);
    }

    /**
     * Handling card interaction events
     * @param event message card interaction events
     * @return Card message
     */
    public Card fireCardEvent(CardEvent event) {
        return cardEventHandler != null ? cardEventHandler.doHandle(event) : null;
    }

    /**
     * register event handler
     *
     * @param clazz   callback event
     * @param handler The handler corresponding to the callback event
     * @param <T>     Events that inherit BaseEvent
     */
    public <T extends BaseEvent> void registerEventCallbackHandler(Class<T> clazz, FeishuEventCallbackHandler<T> handler) {
        if (clazz != null && handler != null) {
            eventHandlerMap.put(clazz, handler);
        }
    }

    /**
     * Register V3 Contacts Event Handler
     *
     * @param clazz   callback event
     * @param handler The handler corresponding to the callback event
     * @param <T>     Events that inherit BaseEvent
     */
    public <T extends BaseV3ContactEvent> void registerV3ContactEventCallbackHandler(Class<T> clazz, FeishuV3ContactEventCallbackHandler<T> handler) {
        if (clazz != null && handler != null) {
            v3ContactEventHandlerMap.put(clazz, handler);
        }
    }

    /**
     * Register message interaction handler
     *ram handler message interaction handler
     */
    public void registerCardActionHandler(FeishuCardActionHandler handler) {
        if (handler != null) {
            cardEventHandler = handler;
        }
    }

    public Map<Class<? extends BaseEvent>, FeishuEventCallbackHandler<?>> getEventHandlerMap() {
        return eventHandlerMap;
    }

    public Map<Class<? extends BaseV3ContactEvent>, FeishuV3ContactEventCallbackHandler<?>> getV3ContactEventHandlerMap() {
        return v3ContactEventHandlerMap;
    }

    public FeishuCardActionHandler getCardEventHandler() {
        return cardEventHandler;
    }
}
