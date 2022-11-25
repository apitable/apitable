package com.apitable.starter.vika.core.jackson;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class OrderTypeSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        switch (value) {
            case "BUY":
                gen.writeString("新购");
                break;
            case "RENEW":
                gen.writeString("续订");
                break;
            case "UPGRADE":
                gen.writeString("升级");
                break;
            default:
                throw new IllegalArgumentException("无法识别");
        }
    }
}
