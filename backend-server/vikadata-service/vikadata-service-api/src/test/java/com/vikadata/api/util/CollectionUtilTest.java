package com.vikadata.api.util;

import java.util.Comparator;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.list;


/**
 * <p>
 * 集合工具类单元测试
 * </p>
 *
 * @author Pengap
 */
public class CollectionUtilTest {

    /**
     * 指定前两位数顺序
     */
    private static List<Integer> customSequenceInts;

    @BeforeAll
    static void setUp() {
        customSequenceInts = list(40, 6);
    }

    @Test
    public void testCustomSequenceSort_remainTakeOrderNoChange() {
        // 测试数据
        List<Integer> testList = list(19, 2, 4, 6, 20, 1, 40);
        // 指定前两位数顺序，剩下的按原顺序
        List<Integer> expectResult1 = list(40, 6, 19, 2, 4, 20, 1);
        assertThat(CollectionUtil.customSequenceSort(testList, Integer::intValue, customSequenceInts))
                .containsSequence(expectResult1);
    }

    @Test
    public void testCustomSequenceSort_remainTakeOrderKeepAsc() {
        // 测试数据
        List<Integer> testList = list(19, 2, 4, 6, 20, 1, 40);
        // 指定前两位数顺序，剩下的从小到大排序
        List<Integer> expectResult2 = list(40, 6, 1, 2, 4, 19, 20);
        assertThat(CollectionUtil.customSequenceSort(testList, Integer::intValue, customSequenceInts, Comparator.comparing(Integer::intValue)))
                .containsSequence(expectResult2);
    }

    @Test
    public void testCustomSequenceSort_remainTakeOrderKeepDesc() {
        // 测试数据
        List<Integer> testList = list(19, 2, 4, 6, 20, 1, 40);
        // 指定前两位数顺序，剩下的从大到小排序
        List<Integer> expectResult3 = list(40, 6, 20, 19, 4, 2, 1);
        assertThat(CollectionUtil.customSequenceSort(testList, Integer::intValue, customSequenceInts, Comparator.comparing(Integer::intValue).reversed()))
                .containsSequence(expectResult3);
    }
}
