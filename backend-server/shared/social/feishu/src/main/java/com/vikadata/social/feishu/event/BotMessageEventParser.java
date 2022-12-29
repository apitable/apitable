package com.vikadata.social.feishu.event;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import com.vikadata.social.feishu.annotation.FeishuMessageEvent;
import com.vikadata.social.feishu.event.bot.BaseMessageEvent;

/**
 * The bot receives the messages sent by the user to the parser
 */
public class BotMessageEventParser implements EventParser {

    private final Map<String, Class<? extends BaseMessageEvent>> messageEventTypeMap = new HashMap<>(16);

    private final ObjectMapper objectMapper;

    public BotMessageEventParser() {
        this.objectMapper = new ObjectMapper();
        // set underscore to convert camel case
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @SafeVarargs
    public final void registerTypes(Class<? extends BaseMessageEvent>... classes) {
        for (Class<? extends BaseMessageEvent> clz : classes) {
            FeishuMessageEvent annotation = clz.getAnnotation(FeishuMessageEvent.class);
            if (annotation == null) {
                return;
            }
            messageEventTypeMap.put(annotation.value(), clz);
        }
    }

    @Override
    public BaseEvent parse(Map<String, Object> data) {
        String msgType = data.get("msg_type").toString();
        if (msgType == null) {
            return null;
        }

        Class<? extends BaseMessageEvent> msgEventClz = messageEventTypeMap.get(msgType);
        if (msgEventClz == null) {
            return null;
        }

        return objectMapper.convertValue(data, msgEventClz);
    }
}
