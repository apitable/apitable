package com.vikadata.api.support.serializer;

import java.io.IOException;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * <p>
 * User nickname encryption serialization
 * </p>
 *
 * @author Chambers
 */
public class NicknameEncryptSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        int length = value.length();
        int percent = 3;
        if (length < percent) {
            gen.writeString(value.charAt(0) + "*");
            return;
        }
        // Calculate the number of bits to hide
        int size = length / percent;
        int remainder = length % percent > 1 ? 1 : 0;
        gen.writeString(StrUtil.hide(value, length - size - remainder, length));
    }
}
