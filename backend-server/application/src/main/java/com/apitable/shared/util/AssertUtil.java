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

package com.apitable.shared.util;

import com.google.common.base.Preconditions;
import com.google.common.base.Strings;
import java.util.Arrays;

/**
 * assert util.
 *
 * @author Shawn Deng
 */
public class AssertUtil {

    /**
     * verify object not null or empty.
     *
     * @param elements objects to assert
     */
    public static void verifyNonNullOrEmpty(final Object... elements) {
        Preconditions.checkArgument(elements.length % 2 == 0,
            "%s should have an even number of elements", Arrays.toString(elements));
        for (int i = 0; i < elements.length; i += 2) {
            final Object argument = elements[i];
            final Object errorMessage = elements[i + 1];
            final boolean expression =
                argument instanceof String ? Strings.emptyToNull((String) argument) != null :
                    argument != null;
            Preconditions.checkArgument(expression, errorMessage);
        }
    }
}
