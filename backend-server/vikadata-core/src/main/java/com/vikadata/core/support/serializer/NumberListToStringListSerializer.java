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
 * Number列表转字符串列表
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/13 14:57
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
