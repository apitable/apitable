package com.vikadata.api.support.serializer;

import java.io.IOException;

import cn.hutool.core.util.BooleanUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.util.InformationUtil;

/**
 * <p>
 * 手机号加密序列化
 * </p>
 *
 * @author Chambers
 * @date 2021/6/4
 */
public class MobilePhoneHideSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        SpaceGlobalFeature feature = SpaceHolder.getGlobalFeature();
        if (feature == null || BooleanUtil.isTrue(feature.getMobileShowable())) {
            gen.writeString(value);
            return;
        }
        gen.writeString(InformationUtil.hideMiddle(value));
    }
}
