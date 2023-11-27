/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.support.serializer;

import cn.hutool.core.util.StrUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.util.StringUtil;
import com.apitable.starter.oss.core.OssSignatureTemplate;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

/**
 * <p>
 * When the avatar is empty, serialize and output the default avatar.
 * </p>
 *
 * @author Chambers
 */
public class ImageSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers)
        throws IOException {
        if (StrUtil.isBlank(value)) {
            gen.writeString("");
            return;
        }
        if (value.startsWith("http")) {
            gen.writeString(value);
            return;
        }
        try {
            OssSignatureTemplate ossSignatureTemplate =
                SpringContextHolder.getBean(OssSignatureTemplate.class);
            String signatureUrl =
                ossSignatureTemplate.getSignatureUrl(this.getResourceUrlNOTrim(), value);
            gen.writeString(signatureUrl);
        } catch (Exception e) {
            gen.writeString(this.getResourceUrl() + value);
        }
    }

    private String getResourceUrl() {
        ConstProperties properties = SpringContextHolder.getBean(ConstProperties.class);
        return StringUtil.trimSlash(properties.getOssBucketByAsset().getResourceUrl());
    }

    private String getResourceUrlNOTrim() {
        ConstProperties properties = SpringContextHolder.getBean(ConstProperties.class);
        return properties.getOssBucketByAsset().getResourceUrl();
    }
}
