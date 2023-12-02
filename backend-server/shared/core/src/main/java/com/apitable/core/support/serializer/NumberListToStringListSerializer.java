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

package com.apitable.core.support.serializer;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.NumberUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.util.Collection;

/**
 * <p>
 * Number List to String List.
 * </p>
 */
public class NumberListToStringListSerializer extends JsonSerializer<Collection<Number>> {

    @Override
    public void serialize(Collection<Number> value, JsonGenerator gen, SerializerProvider serializers) throws
        IOException {
        gen.writeStartArray();
        if (CollUtil.isNotEmpty(value)) {
            for (Number val : value) {
                gen.writeString(NumberUtil.toStr(val));
            }
        }
        gen.writeEndArray();
    }
}
