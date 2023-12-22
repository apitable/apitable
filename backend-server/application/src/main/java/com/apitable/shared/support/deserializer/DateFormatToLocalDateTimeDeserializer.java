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

package com.apitable.shared.support.deserializer;

import static cn.hutool.core.date.DatePattern.NORM_DATETIME_MINUTE_PATTERN;
import static cn.hutool.core.date.DatePattern.NORM_DATETIME_MS_PATTERN;
import static cn.hutool.core.date.DatePattern.NORM_DATETIME_PATTERN;
import static cn.hutool.core.date.DatePattern.NORM_DATE_PATTERN;

import cn.hutool.core.date.DateUtil;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonTokenId;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDateTime;

/**
 * <p>
 * String to LocalDateTime formatter.
 * </p>
 *
 * @author Chambers
 */
public class DateFormatToLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    @Override
    public LocalDateTime deserialize(JsonParser parser, DeserializationContext context)
        throws IOException {
        String value = parser.getText().trim();
        if (parser.hasTokenId(JsonTokenId.ID_STRING)) {
            int length = value.length();
            switch (length) {
                case 10:
                case 11:
                    return DateUtil.parseLocalDateTime(value, NORM_DATE_PATTERN);
                case 16:
                    return DateUtil.parseLocalDateTime(value, NORM_DATETIME_MINUTE_PATTERN);
                case 19:
                    return DateUtil.parseLocalDateTime(value, NORM_DATETIME_PATTERN);
                case 23:
                    return DateUtil.parseLocalDateTime(value, NORM_DATETIME_MS_PATTERN);
                default:
                    break;
            }
        }
        return null;
    }
}
