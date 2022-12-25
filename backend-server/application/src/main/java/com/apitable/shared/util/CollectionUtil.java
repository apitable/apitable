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
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.function.Predicate;

/**
 * collection util
 *
 * @author Shawn Deng
 */
public class CollectionUtil {

    /**
     * is the collection empty
     *
     * @param collection collection
     * @return true | false
     */
    public static boolean isEmpty(Collection<?> collection) {
        return collection == null || collection.isEmpty();
    }

    /**
     * is the collection not empty
     *
     * @param collection collection
     * @return true | false
     */
    public static boolean isNotEmpty(Collection<?> collection) {
        return !isEmpty(collection);
    }

    /**
     * distinct collection ignore case
     * @param collection string collection
     * @return new string list
     */
    public static ArrayList<String> distinctIgnoreCase(Collection<String> collection) {
        if (collection == null || collection.isEmpty()) {
            return new ArrayList<>();
        }
        else {
            Set<String> sets = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
            sets.addAll(collection);
            ArrayList<String> list = new ArrayList<>();
            for (String coll : collection) {
                boolean containsSearchStr = sets.stream().anyMatch(coll::equals);
                if (containsSearchStr) {
                    list.add(coll);
                }
            }
            return list;
        }
    }

    /**
     * Sorting a custom sequence for List, the sorting will modify the original list
     *
     * @param list to be sorted list
     * @param keyExtractor The function that the user extracts the sorting key
     * @param customKeySort custom sequence list
     * @return sorted list
     */
    public static <T, U extends Comparable<? super U>> List<T> customSequenceSort(List<T> list, Function<? super T, ? extends U> keyExtractor, List<? super U> customKeySort) {
        return customSequenceSort(list, keyExtractor, customKeySort, null);
    }

    /**
     * Sort the custom sequence for the List, and the sorting will modify the original List
     *
     * @param list to be sorted list
     * @param keyExtractor The function that the user extracts the sorting key
     * @param customKeySort custom sequence list
     * @param thenComparing Sort function again after custom sorting is complete
     * @return sorted list
     */
    public static <T, U extends Comparable<? super U>> List<T> customSequenceSort(List<T> list, Function<? super T, ? extends U> keyExtractor, List<? super U> customKeySort, Comparator<? super T> thenComparing) {
        if (isEmpty(list) || isEmpty(customKeySort)) {
            return list;
        }

        // sort by custom sequence
        Comparator<T> comparing = Comparator.comparing(o -> {
            final int index = customKeySort.indexOf(keyExtractor.apply(o));
            return index == -1 ? Integer.MAX_VALUE : index;
        });
        // if there is a subsequent sort operation
        if (null != thenComparing) {
            comparing = comparing.thenComparing(thenComparing);
        }

        list.sort(comparing);
        return list;
    }

    public static <T> int[] findIndex(Collection<T> collection, Predicate<T> matcher) {
        final List<Integer> indexList = new ArrayList<>();
        if (null != collection) {
            int index = 0;
            for (T t : collection) {
                if (null == matcher || matcher.test(t)) {
                    indexList.add(index);
                }
                index++;
            }
        }
        return indexList.stream().filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .toArray();
    }
}
