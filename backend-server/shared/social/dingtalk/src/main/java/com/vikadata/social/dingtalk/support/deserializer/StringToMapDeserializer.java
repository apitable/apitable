package com.vikadata.social.dingtalk.support.deserializer;

import java.io.IOException;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import com.vikadata.social.dingtalk.Jackson4DingTalkConverter;

/**
 * Date format to LocalDateTime
 */
public class StringToMapDeserializer extends JsonDeserializer<Map<Object, Object>> {

    @Override
    public Map<Object, Object> deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        return Jackson4DingTalkConverter.toObject(parser.getText().trim(), new TypeReference<Map<Object, Object>>() {});
    }
}
