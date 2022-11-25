package com.vikadata.core.support.serializer;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.NumberUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.util.Collection;

/**
 * <p>
 * Number List to String List
 * </p>
 */
public class NumberListToStringListSerializer extends JsonSerializer<Collection<Number>> {

    @Override
    public void serialize(Collection<Number> value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartArray();
        if (CollUtil.isNotEmpty(value)) {
            for (Number val : value) {
                gen.writeString(NumberUtil.toStr(val));
            }
        }
        gen.writeEndArray();
    }
}
