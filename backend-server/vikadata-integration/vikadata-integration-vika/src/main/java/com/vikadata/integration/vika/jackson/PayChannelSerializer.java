package com.vikadata.integration.vika.jackson;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class PayChannelSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        switch (value) {
            case "alipay_pc_direct":
                gen.writeString("支付宝");
                break;
            case "wx_pub_qr":
                gen.writeString("微信");
                break;
            default:
                throw new IllegalArgumentException("无法识别");
        }
    }
}
