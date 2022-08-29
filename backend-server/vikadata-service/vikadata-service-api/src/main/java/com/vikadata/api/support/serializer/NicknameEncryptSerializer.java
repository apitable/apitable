package com.vikadata.api.support.serializer;

import java.io.IOException;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * <p>
 * 用户昵称加密序列化
 * </p>
 *
 * @author Chambers
 * @date 2021/5/31
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
        // 计算需要隐藏的位数
        int size = length / percent;
        int remainder = length % percent > 1 ? 1 : 0;
        gen.writeString(StrUtil.hide(value, length - size - remainder, length));
    }
}
