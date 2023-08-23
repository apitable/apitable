package com.apitable.shared.support.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Credit BigDecimal formatter serializer.
 *
 * @author Shawn Deng
 */
public class CreditUnitSerializer extends JsonSerializer<BigDecimal> {

    @Override
    public void serialize(BigDecimal value, JsonGenerator gen,
                          SerializerProvider serializerProvider) throws IOException {
        if (value != null) {
            gen.writeString(value.setScale(4, RoundingMode.HALF_UP) + "");
        } else {
            gen.writeNumber(0.00);
        }
    }
}
