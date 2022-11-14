package com.vikadata.api.shared.support.serializer;

import java.io.IOException;

import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * <p>
 * Null jsonObject serialization
 * </p>
 *
 * @author Chambers
 */
public class NullJsonObjectSerializer extends JsonSerializer<Object> {

    @Override
    public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeObject(JSONUtil.createObj());
    }
}
