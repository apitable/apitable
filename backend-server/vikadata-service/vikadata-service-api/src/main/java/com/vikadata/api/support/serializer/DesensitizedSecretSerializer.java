package com.vikadata.api.support.serializer;

import java.io.IOException;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import com.vikadata.api.util.InformationUtil;
import com.vikadata.api.util.InformationUtil.InformationType;

/**
 * <p>
 * Desensitization Serialization
 * </p>
 *
 * @author Pengap
 */
public class DesensitizedSecretSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (StrUtil.isNotBlank(value)) {
            gen.writeString(InformationUtil.desensitized(value, InformationType.SECRET_KEY));
            return;
        }
        gen.writeString(value);
    }

}
