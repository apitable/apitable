package com.vikadata.social.feishu;

import java.io.IOException;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * @author Shawn Deng
 * @date 2020-12-02 14:20:33
 */
public class Jackson4FeishuConverter {

    private static final ObjectMapper FEISHU_OBJECT_MAPPER = new ObjectMapper();

    static {
        FEISHU_OBJECT_MAPPER.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        FEISHU_OBJECT_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static <T> T toObject(String s, TypeReference<T> r) throws IOException {
        return FEISHU_OBJECT_MAPPER.readValue(s, r);
    }
}
