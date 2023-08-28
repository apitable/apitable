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

package com.apitable.shared.clock;

import static java.time.temporal.ChronoUnit.MILLIS;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

/**
 * Default clock implements.
 *
 * @author Shawn Deng
 */
public class DefaultClock implements Clock {
    @Override
    public OffsetDateTime getNow(final ZoneOffset tz) {
        final OffsetDateTime result = OffsetDateTime.now(tz);
        return truncateMs(result);
    }

    @Override
    public OffsetDateTime getUTCNow() {
        return getNow(ZoneOffset.UTC);
    }

    @Override
    public LocalDate getUTCToday() {
        return getToday(ZoneOffset.UTC);
    }

    @Override
    public LocalDate getToday(final ZoneOffset timeZone) {
        return getUTCNow().withOffsetSameInstant(timeZone).toLocalDate();
    }

    /**
     * Convert a UTC date time to a local date time.
     *
     * @param input offset date time
     * @return offset date time
     */
    public static OffsetDateTime toUtcDateTime(final OffsetDateTime input) {
        if (input == null) {
            return null;
        }
        final OffsetDateTime result = input.with(ZoneOffset.UTC);
        return truncateMs(result);
    }

    /**
     * Convert a local date time to a UTC date time.
     *
     * @param input offset date time
     * @return offset date time
     */
    public static OffsetDateTime truncateMs(final OffsetDateTime input) {
        return input.truncatedTo(MILLIS);
    }
}
