package com.vikadata.social.dingtalk.support.deserializer;

import java.io.IOException;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import com.vikadata.social.dingtalk.Jackson4DingTalkConverter;

/**
 * <p>
 * 日期格式 转 LocalDateTime
 * </p>
 *
 * @author Chambers
 * @date 2020/6/1
 */
public class StringToMapDeserializer extends JsonDeserializer<Map<Object, Object>> {

    @Override
    public Map<Object, Object> deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        return Jackson4DingTalkConverter.toObject(parser.getText().trim(), new TypeReference<Map<Object, Object>>() {});
    }
}
