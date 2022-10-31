package com.vikadata.api.support.serializer;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * <p>
 * wechat-mp
 * QR code image prefix serialization processing
 * </p>
 *
 * @author Chambers
 */
public class QrcodePreSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        String pre = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";
        gen.writeString(pre + value);
    }
}
