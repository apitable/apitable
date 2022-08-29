package com.vikadata.api.support.serializer;

import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * <p>
 * 空 JSONObject 序列化
 * </p>
 *
 * @author Chambers
 * @date 2020/6/22
 */
public class NullJsonObjectSerializer extends JsonSerializer<Object> {

    @Override
    public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeObject(JSONUtil.createObj());
    }
}
