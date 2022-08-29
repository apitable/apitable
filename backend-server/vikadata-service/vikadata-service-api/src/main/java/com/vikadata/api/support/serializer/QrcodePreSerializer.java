package com.vikadata.api.support.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * <p>
 * 微信公众号 二维码图片前缀序列化处理
 * </p>
 *
 * @author Chambers
 * @date 2020/8/14
 */
public class QrcodePreSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        String pre = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";
        gen.writeString(pre + value);
    }
}
