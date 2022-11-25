package com.vikadata.social.feishu.event.v3;

import java.util.Map;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * Convert event content to event object {@link BaseV3ContactEvent},
 * Support underscore to hump
 */
public class Jackson2ClassV3EventParser implements V3ContactEventParser {

    Class<? extends BaseV3ContactEvent> clazz;

    ObjectMapper objectMapper = new ObjectMapper();

    Jackson2ClassV3EventParser(Class<? extends BaseV3ContactEvent> clazz) {
        this.clazz = clazz;
        // set underscore to convert camel case
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public BaseV3ContactEvent parse(Map<String, Object> data) {
        return objectMapper.convertValue(data, clazz);
    }
}
