package com.vikadata.social.dingtalk;

import java.util.HashMap;
import java.util.Map;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * <p>
 * 回调事件监听器factory
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 2:30 下午
 */
public class EventListenerFactory {

    /**
     * 回调事件对应的处理存储器
     * Event -> callbackHandler implementation
     */
    private final Map<Class<? extends BaseEvent>, DingTalkEventCallbackHandler> eventHandlerMap = new HashMap<>(16);


    public void addEventCallbackHandler(Map<Class<? extends BaseEvent>, DingTalkEventCallbackHandler> eventHandlerMap) {
        this.eventHandlerMap.putAll(eventHandlerMap);
    }

    public Map<Class<? extends BaseEvent>, DingTalkEventCallbackHandler> getEventHandlerMap() {
        return eventHandlerMap;
    }
}
