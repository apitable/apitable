package com.apitable.starter.vika.core.jackson;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class OrderChannelSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        switch (value) {
            case "vika":
                gen.writeString("自营");
                break;
            case "offline":
                gen.writeString("线下");
                break;
            case "lark":
                gen.writeString("飞书");
                break;
            case "dingtalk":
                gen.writeString("钉钉");
                break;
            case "wecom":
                gen.writeString("企微");
                break;
            default:
                throw new IllegalArgumentException("无法识别");
        }
    }
}
