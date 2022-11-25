package com.vikadata.social.feishu.event;

import java.util.Map;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * Convert event content to event object {@link BaseEvent}
 * support underscore to hump
 */
public class Jackson2ClassEventParser implements EventParser {

    Class<? extends BaseEvent> clazz;

    ObjectMapper objectMapper = new ObjectMapper();

    Jackson2ClassEventParser(Class<? extends BaseEvent> clazz) {
        this.clazz = clazz;
        // set underscore to convert camel case
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public BaseEvent parse(Map<String, Object> data) {
        return objectMapper.convertValue(data, clazz);
    }
}
