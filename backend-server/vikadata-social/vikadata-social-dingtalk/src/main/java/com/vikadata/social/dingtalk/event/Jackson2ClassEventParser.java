package com.vikadata.social.dingtalk.event;

import java.util.Map;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;

/**
 * Convert event content to event object {@link BaseEvent}
 * Support underscore to hump
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

    Jackson2ClassEventParser(Class<? extends BaseEvent> clazz, PropertyNamingStrategy strategy) {
        this.clazz = clazz;
        // Set up conversion rules
        objectMapper.setPropertyNamingStrategy(strategy);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public BaseEvent parse(Map<String, Object> data) {
        return objectMapper.convertValue(data, clazz);
    }
}
