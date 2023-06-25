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

import static java.time.ZoneId.getAvailableZoneIds;

import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.config.properties.SystemProperties;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Set;

/**
 * LocalDateTime to timestamp（mills）.
 *
 * @author Shawn Deng
 */
public class LocalDateTimeToMilliSerializer extends JsonSerializer<LocalDateTime> {

    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider provider)
        throws IOException {
        SystemProperties systemProperties = SpringContextHolder.getBean(SystemProperties.class);
        // Get user timeZone
        Long userId = SessionContext.getUserIdWithoutException();
        String userTimeZone;
        if (userId != null) {
            LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
            userTimeZone = loginUserDto != null && loginUserDto.getTimeZone() != null
                ? loginUserDto.getTimeZone() : systemProperties.getTimeZoneId().toString();
        } else {
            userTimeZone = systemProperties.getTimeZoneId().toString();
        }
        // get Available ZoneIds
        Set<String> zoneIds = getAvailableZoneIds();
        userTimeZone = zoneIds.contains(userTimeZone) ? userTimeZone :
            systemProperties.getTimeZone().toString();
        // server config timeZone time
        ZonedDateTime originalZonedDateTime =
            ZonedDateTime.of(value, systemProperties.getTimeZoneId());
        // target timeZone time
        ZonedDateTime targetZonedDateTime =
            originalZonedDateTime.withZoneSameInstant(ZoneId.of(userTimeZone));
        gen.writeNumber(targetZonedDateTime.toInstant().toEpochMilli());
    }
}
