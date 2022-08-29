package com.vikadata.boot.autoconfigure.social.feishu;

import java.util.HashMap;
import java.util.Map;

import com.vikadata.social.feishu.FeishuCardActionHandler;
import com.vikadata.social.feishu.FeishuEventCallbackHandler;
import com.vikadata.social.feishu.FeishuV3ContactEventCallbackHandler;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * 事件监听工厂类
 * @author Shawn Deng
 * @date 2020-11-25 17:53:39
 */
public class EventListenerFactory {

    /**
     * 回调事件对应的处理存储器
     * Event -> callbackHandler implementation
     */
    private final Map<Class<? extends BaseEvent>, FeishuEventCallbackHandler> eventHandlerMap = new HashMap<>(16);

    /**
     * 新版通讯录事件对应的处理
     */
    private final Map<Class<? extends BaseV3ContactEvent>, FeishuV3ContactEventCallbackHandler> v3ContactEventHandlerMap = new HashMap<>(16);

    /**
     * 消息交互接口
     */
    private FeishuCardActionHandler cardEventHandler;

    public void addEventCallbackHandler(Map<Class<? extends BaseEvent>, FeishuEventCallbackHandler> eventHandlerMap) {
        this.eventHandlerMap.putAll(eventHandlerMap);
    }

    public void addV3ContactEventCallbackHandler(Map<Class<? extends BaseV3ContactEvent>, FeishuV3ContactEventCallbackHandler> eventHandlerMap) {
        this.v3ContactEventHandlerMap.putAll(eventHandlerMap);
    }

    public Map<Class<? extends BaseEvent>, FeishuEventCallbackHandler> getEventHandlerMap() {
        return eventHandlerMap;
    }

    public Map<Class<? extends BaseV3ContactEvent>, FeishuV3ContactEventCallbackHandler> getV3ContactEventHandlerMap() {
        return v3ContactEventHandlerMap;
    }

    public FeishuCardActionHandler getCardEventHandler() {
        return cardEventHandler;
    }

    public void setCardEventHandler(FeishuCardActionHandler cardEventHandler) {
        this.cardEventHandler = cardEventHandler;
    }
}
