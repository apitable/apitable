package com.vikadata.api.support.serializer;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * <p>
 * 空字符串序列化返回
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/11/9 10:51:52
 */
public class EmptyBooleanSerializer extends JsonSerializer<Boolean> {

    @Override
    public void serialize(Boolean value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeBoolean(true);
    }
}
