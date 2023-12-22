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

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

/**
 * clock interface.
 */
public interface Clock {

    /**
     * get a offsetDateTime object using the specified timezone.
     *
     * @param tz Target timezone
     * @return DateTime in the specified timezone
     */
    OffsetDateTime getNow(ZoneOffset tz);

    /**
     * get a offsetDateTime object using utc timezone.
     *
     * @return DateTime in the utc timezone
     */
    OffsetDateTime getUTCNow();

    /**
     * get a LocalDate object using utc timezone.
     *
     * @return LocalDate in the utc timezone
     */
    LocalDate getUTCToday();

    /**
     * get a LocalDate object using the specified timezone.
     *
     * @param timeZone Target timezone
     * @return LocalDate in the specified timezone
     */
    LocalDate getToday(ZoneOffset timeZone);
}
