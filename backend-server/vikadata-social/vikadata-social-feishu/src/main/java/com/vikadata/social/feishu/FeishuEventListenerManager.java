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
 * 飞书事件监听器管理器
 * 管理器调用register()方法注册
 * 当需要处理回调事件时，使用 {@code fireEventCallback(event)}
 * 需要处理消息卡片交互事件时，使用 {@code fireCardEvent(event)}
 *
 * @author Shawn Deng
 * @date 2020-11-24 16:49:12
 */
@Slf4j
public class FeishuEventListenerManager {

    /**
     * 回调事件对应的处理存储器
     * Event -> callbackHandler implementation
     */
    private final Map<Class<? extends BaseEvent>, FeishuEventCallbackHandler<?>> eventHandlerMap = new HashMap<>(16);

    /**
     * 新版通讯录事件对应处理器
     */
    private final Map<Class<? extends BaseV3ContactEvent>, FeishuV3ContactEventCallbackHandler<?>> v3ContactEventHandlerMap = new HashMap<>(16);

    /**
     * 消息交互接口
     */
    private FeishuCardActionHandler cardEventHandler;

    /**
     * 处理回调事件
     *
     * @param event 回调事件
     * @param <T>   回调事件基础结构
     * @return 事件指定响应结果
     */
    public <T extends BaseEvent> Object fireEventCallback(T event) {
        Class<?> clazz = event.getClass();
        FeishuEventCallbackHandler<T> callbackHandler = null;
        // 找到对应的事件处理方法
        while (callbackHandler == null && BaseEvent.class.isAssignableFrom(clazz)) {
            callbackHandler = MapUtil.get(eventHandlerMap, clazz, new TypeReference<FeishuEventCallbackHandler<T>>() {});
            clazz = clazz.getSuperclass();
        }

        if (callbackHandler == null) {
            throw new IllegalStateException("找不到应用的处理方法" + event.getClass().getName());
        }
        return callbackHandler.doHandle(event);
    }

    /**
     * 处理新版通讯录事件
     *
     * @param event 回调事件
     * @param <T>   回调事件基础结构
     * @return 事件指定响应结果
     */
    public <T extends BaseV3ContactEvent> Object fireV3ContactEventCallback(T event) {
        Class<?> clazz = event.getClass();
        FeishuV3ContactEventCallbackHandler<T> callbackHandler = null;
        // 找到对应的事件处理方法
        while (callbackHandler == null && BaseV3ContactEvent.class.isAssignableFrom(clazz)) {
            callbackHandler = MapUtil.get(v3ContactEventHandlerMap, clazz, new TypeReference<FeishuV3ContactEventCallbackHandler<T>>() {
            });
            clazz = clazz.getSuperclass();
        }

        if (callbackHandler == null) {
            throw new IllegalStateException("找不到应用的处理方法" + event.getClass().getName());
        }
        return callbackHandler.doHandle(event);
    }

    /**
     * 处理卡片交互事件
     *
     * @param event 消息卡片交互事件
     * @return 卡片消息
     */
    public Card fireCardEvent(CardEvent event) {
        return cardEventHandler != null ? cardEventHandler.doHandle(event) : null;
    }

    /**
     * 注册事件处理器
     *
     * @param clazz   回调事件
     * @param handler 回调事件对应的处理器
     * @param <T>     继承BaseEvent的事件
     */
    public <T extends BaseEvent> void registerEventCallbackHandler(Class<T> clazz, FeishuEventCallbackHandler<T> handler) {
        if (clazz != null && handler != null) {
            eventHandlerMap.put(clazz, handler);
        }
    }

    /**
     * 注册V3通讯录事件处理器
     *
     * @param clazz   回调事件
     * @param handler 回调事件对应的处理器
     * @param <T>     继承BaseEvent的事件
     */
    public <T extends BaseV3ContactEvent> void registerV3ContactEventCallbackHandler(Class<T> clazz, FeishuV3ContactEventCallbackHandler<T> handler) {
        if (clazz != null && handler != null) {
            v3ContactEventHandlerMap.put(clazz, handler);
        }
    }

    /**
     * 注册消息交互处理器
     *
     * @param handler 消息交互处理器
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
