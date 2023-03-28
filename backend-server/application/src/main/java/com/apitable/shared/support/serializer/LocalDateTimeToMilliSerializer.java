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

import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.config.ServerConfig;
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
import javax.annotation.Resource;

/**
 * LocalDateTime to timestamp（mills）.
 *
 * @author Shawn Deng
 */
public class LocalDateTimeToMilliSerializer extends JsonSerializer<LocalDateTime> {

    @Resource
    private ServerConfig serverConfig;

    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider provider)
        throws IOException {
        // Get user timeZone
        Long userId = SessionContext.getUserIdWithoutException();
        String userTimeZone;
        if (userId != null) {
            LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
            userTimeZone = loginUserDto != null && loginUserDto.getTimeZone() != null
                ? loginUserDto.getTimeZone() : serverConfig.getTimeZoneId().toString();
        } else {
            userTimeZone = serverConfig.getTimeZoneId().toString();
        }
        // get Available ZoneIds
        Set<String> zoneIds = getAvailableZoneIds();
        userTimeZone = zoneIds.contains(userTimeZone) ? userTimeZone : serverConfig.getTimeZone().toString();
        // server config timeZone time
        ZonedDateTime originalZonedDateTime = ZonedDateTime.of(value, serverConfig.getTimeZoneId());
        // target timeZone time
        ZonedDateTime targetZonedDateTime =
            originalZonedDateTime.withZoneSameInstant(ZoneId.of(userTimeZone));
        gen.writeNumber(targetZonedDateTime.toInstant().toEpochMilli());
    }
}
