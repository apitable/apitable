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

import java.io.IOException;

import cn.hutool.core.util.BooleanUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import com.apitable.shared.holder.SpaceHolder;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.shared.util.information.InformationUtil;

/**
 * <p>
 * Mobile phone number encryption serialization
 * </p>
 *
 * @author Chambers
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
