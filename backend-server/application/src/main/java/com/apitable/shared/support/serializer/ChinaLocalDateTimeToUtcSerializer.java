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

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * <p>
 * China date to UTC date formatter.
 * </p>
 *
 * @author Shawn Deng
 */
public class ChinaLocalDateTimeToUtcSerializer extends StdSerializer<LocalDateTime> {

    protected ChinaLocalDateTimeToUtcSerializer() {
        this(null);
    }

    protected ChinaLocalDateTimeToUtcSerializer(Class<LocalDateTime> t) {
        super(t);
    }

    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider provider)
        throws IOException {
        ZonedDateTime dateAndTime = ZonedDateTime.of(value, ZoneId.of("Asia/Shanghai"));
        ZonedDateTime utcDate = dateAndTime.withZoneSameInstant(ZoneOffset.UTC);
        gen.writeString(utcDate.format(DateTimeFormatter.ofPattern(DatePattern.UTC_MS_PATTERN)));
    }
}
