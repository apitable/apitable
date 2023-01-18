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

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static java.time.ZoneOffset.UTC;
import static org.assertj.core.api.Assertions.assertThat;

public class TestClockUtil {

    @Test
    public void testWithInputInThePast() {
        // should offset 1 hour
        final ZoneOffset inputTimeZone = ZoneOffset.ofHours(1);
        // target time date
        final LocalDate inputDateInTargetTimeZone = LocalDate.of(2014, 10, 23);
        // input time
        final LocalTime inputTimeInUTC = LocalTime.of(10, 23, 5);

        final OffsetDateTime result = ClockUtil.toUTCDateTime(inputDateInTargetTimeZone, inputTimeInUTC, inputTimeZone);
        assertThat(result.compareTo(OffsetDateTime.of(2014, 10, 23, 9, 23, 5, 0, UTC)))
                .isEqualTo(0);

        // ClockUtil should have returned a DateTime which when converted back into a LocalDate in the inputTimeZone matches the input
        assertThat(result.with(inputTimeZone).toLocalDate().compareTo(inputDateInTargetTimeZone))
                .isEqualTo(0);
    }

    @Test
    public void testWithInputInTheFuture() {
        final ZoneOffset inputTimeZone = ZoneOffset.ofHours(-1);
        final LocalDate inputDateInTargetTimeZone = LocalDate.of(2014, 10, 23);
        final LocalTime inputTimeInUTC = LocalTime.of(10, 23, 5);

        final OffsetDateTime result = ClockUtil.toUTCDateTime(inputDateInTargetTimeZone, inputTimeInUTC, inputTimeZone);
        assertThat(result.compareTo(OffsetDateTime.of(2014, 10, 23, 11, 23, 5, 0, UTC)))
                .isEqualTo(0);

        // ClockUtil should have returned a DateTime which when converted back into a LocalDate in the inputTimeZone matches the input
        assertThat(result.with(inputTimeZone).toLocalDate().compareTo(inputDateInTargetTimeZone))
                .isEqualTo(0);
    }

    @Test
    public void testFormatTimeZone() {
        final String utcFormat = ClockUtil.formatTimeZone(ZoneOffset.UTC);
        assertThat(utcFormat).isEqualTo("+00:00");

        final String maxFormat = ClockUtil.formatTimeZone(ZoneOffset.MAX);
        assertThat(maxFormat).isEqualTo("+18:00");

        final String minFormat = ClockUtil.formatTimeZone(ZoneOffset.MIN);
        assertThat(minFormat).isEqualTo("-18:00");

        final String randomFormat = ClockUtil.formatTimeZone(ZoneOffset.ofHours(2));
        assertThat(randomFormat).isEqualTo("+02:00");
    }
}
