package com.vikadata.api.util;

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
 * 集合工具类
 *
 * @author Shawn Deng
 */
public class CollectionUtil {

    /**
     * 集合是否为空
     *
     * @param collection 集合
     * @return 是否为空
     */
    public static boolean isEmpty(Collection<?> collection) {
        return collection == null || collection.isEmpty();
    }

    /**
     * 集合是否为非空
     *
     * @param collection 集合
     * @return 是否为非空
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
     * 针对List自定义序列排序，排序会修改原List
     *
     * @param list 被排序的List
     * @param keyExtractor 用户提取排序Key的函数
     * @param customKeySort 自定义序列列表
     * @return 排序后的值
     */
    public static <T, U extends Comparable<? super U>> List<T> customSequenceSort(List<T> list, Function<? super T, ? extends U> keyExtractor, List<? super U> customKeySort) {
        return customSequenceSort(list, keyExtractor, customKeySort, null);
    }

    /**
     * 针对List自定义序列排序，排序会修改原List
     *
     * @param list 被排序的List
     * @param keyExtractor 用户提取排序Key的函数
     * @param customKeySort 自定义序列列表
     * @param thenComparing 自定义排序完成后再次排序函数
     * @return 排序后的值
     */
    public static <T, U extends Comparable<? super U>> List<T> customSequenceSort(List<T> list, Function<? super T, ? extends U> keyExtractor, List<? super U> customKeySort, Comparator<? super T> thenComparing) {
        if (isEmpty(list) || isEmpty(customKeySort)) {
            return list;
        }

        // 根据自定义序列排序
        Comparator<T> comparing = Comparator.comparing(o -> {
            final int index = customKeySort.indexOf(keyExtractor.apply(o));
            return index == -1 ? Integer.MAX_VALUE : index;
        });
        // 如果存在后续排序操作
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
