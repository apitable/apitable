package com.vikadata.social.dingtalk;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

public class Jackson4DingTalkConverter {

    private static final ObjectMapper DING_TALK_OBJECT_MAPPER = new ObjectMapper();

    static {
        DING_TALK_OBJECT_MAPPER.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        DING_TALK_OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        DING_TALK_OBJECT_MAPPER.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
        DING_TALK_OBJECT_MAPPER.configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
    }

    public static <T> T toObject(String s, TypeReference<T> r) throws IOException {
        return DING_TALK_OBJECT_MAPPER.readValue(s, r);
    }
}
