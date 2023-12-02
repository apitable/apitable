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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * <p>
 * multi value map util.
 * </p>
 *
 * @author Chambers
 */
public class MultiValueMapUtils {

    /**
     * accumulated value if absent.
     *
     * @param map   multi value map
     * @param key   key
     * @param value value
     */
    public static void accumulatedValueIfAbsent(Map<String, List<String>> map, String key,
                                                String value) {
        if (!map.containsKey(key)) {
            List<String> values = new ArrayList<>();
            values.add(value);
            map.put(key, values);
            return;
        }
        List<String> values = map.get(key);
        if (!values.contains(value)) {
            values.add(value);
        }
    }
}
