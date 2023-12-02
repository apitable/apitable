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
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.function.Function;

/**
 * <p>
 * DB Util.
 * </p>
 *
 * @author Chambers
 */
public class DBUtil {

    public static <T, R> List<R> batchSelectByFieldIn(Collection<T> fieldValues,
                                                      Function<List<T>, List<R>> queryFunction) {
        return DBUtil.batchSelectByFieldIn(fieldValues, queryFunction, 1000);
    }

    /**
     * batch select by field in.
     *
     * @param fieldValues   field values
     * @param queryFunction query function
     * @param batchSize     batch size
     * @param <T>           T
     * @param <R>           R
     * @return result list
     */
    public static <T, R> List<R> batchSelectByFieldIn(Collection<T> fieldValues,
                                                      Function<List<T>, List<R>> queryFunction,
                                                      int batchSize) {
        List<R> resultList = new ArrayList<>();
        int totalItems = fieldValues.size();
        int startIndex = 0;

        Iterator<T> iterator = fieldValues.iterator();

        while (startIndex < totalItems) {
            int endIndex = startIndex + batchSize;
            List<T> batchFieldValues = new ArrayList<>();

            for (int i = startIndex; i < endIndex && iterator.hasNext(); i++) {
                batchFieldValues.add(iterator.next());
            }

            List<R> batchResult = queryFunction.apply(batchFieldValues);
            resultList.addAll(batchResult);

            startIndex += batchSize;
        }

        return resultList;
    }
}
