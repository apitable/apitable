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
import java.time.ZoneOffset;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class TestDefaultClock {

    private DefaultClock clock;

    @BeforeEach
    public void setUp() {
        clock = new DefaultClock();
    }

    @Test
    public void testGetUTCToday() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        LocalDate today = clock.getUTCToday();
        assertThat(today).isEqualTo(now);
    }

    @Test
    public void testGetTodayWithTimeZone() {
        LocalDate now = LocalDate.now(ZoneOffset.ofHours(8));
        LocalDate today = clock.getToday(ZoneOffset.ofHours(8));
        assertThat(today).isEqualTo(now);
    }
}
