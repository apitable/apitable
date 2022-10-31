package com.vikadata.api.support.serializer;

import java.io.IOException;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import com.vikadata.api.util.StringUtil;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.api.config.properties.ConstProperties;

/**
 * <p>
 * When the avatar is empty, serialize and output the default avatar
 * </p>
 *
 * @author Chambers
 */
public class ImageSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (StrUtil.isNotBlank(value)) {
            if (value.startsWith("http")) {
                gen.writeString(value);
            }
            else {
                gen.writeString(this.getResourceUrl() + value);
            }
        }
        else {
            gen.writeString("");
        }
    }

    private String getResourceUrl() {
        ConstProperties properties = SpringContextHolder.getBean(ConstProperties.class);
        return StringUtil.trimSlash(properties.getOssBucketByAsset().getResourceUrl());
    }
}
