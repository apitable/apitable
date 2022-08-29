package com.vikadata.api.support.serializer;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * BigDecimal formatter serializer
 * @author Shawn Deng
 * @date 2022-05-20 02:17:24
 */
public class BigDecimalSerializer extends JsonSerializer<BigDecimal> {
    @Override
    public void serialize(BigDecimal value, JsonGenerator gen, SerializerProvider serializerProvider) throws IOException {
        if (value != null) {
            gen.writeString(value.setScale(2, RoundingMode.HALF_EVEN) + "");
        }
        else {
            gen.writeNumber(0.00);
        }
    }
}
