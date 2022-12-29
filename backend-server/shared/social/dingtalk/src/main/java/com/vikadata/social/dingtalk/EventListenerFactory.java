package com.vikadata.social.dingtalk;

import java.util.HashMap;
import java.util.Map;

import com.vikadata.social.dingtalk.event.BaseEvent;

/**
 * callback event listener factory
 */
public class EventListenerFactory {

    /**
     * The processing memory corresponding to the callback event
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
