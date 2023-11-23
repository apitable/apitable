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

package com.apitable.shared.constants;

import org.springframework.core.Ordered;

/**
 * <p>
 * filter order constants.
 * </p>
 *
 * @author Shawn Deng
 */
public class FilterConstants {

    private static final int INTERVAL = 2;

    public static final int FIRST_ORDERED = Ordered.LOWEST_PRECEDENCE - 99;

    public static final int MDC_INSERTING_SERVLET_FILTER = FIRST_ORDERED + INTERVAL;

    public static final int REQUEST_THREAD_HOLDER_FILTER = FIRST_ORDERED + INTERVAL * 2;

    public static final int TRACE_REQUEST_FILTER = FIRST_ORDERED + INTERVAL * 3;
}
