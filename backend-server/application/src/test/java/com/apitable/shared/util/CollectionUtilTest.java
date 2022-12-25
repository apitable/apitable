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

import java.util.Comparator;
import java.util.List;
import java.util.Set;

import org.assertj.core.util.Sets;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.list;

public class CollectionUtilTest {

    /**
     * Specify first two-digit order
     */
    private static List<Integer> customSequenceInts;

    @BeforeAll
    static void setUp() {
        customSequenceInts = list(40, 6);
    }

    @Test
    public void testCustomSequenceSort_remainTakeOrderNoChange() {
        List<Integer> testList = list(19, 2, 4, 6, 20, 1, 40);
        // Specify the order of the first two digits, the rest in the original order
        List<Integer> expectResult1 = list(40, 6, 19, 2, 4, 20, 1);
        assertThat(CollectionUtil.customSequenceSort(testList, Integer::intValue, customSequenceInts))
                .containsSequence(expectResult1);
    }

    @Test
    public void testCustomSequenceSort_remainTakeOrderKeepAsc() {
        List<Integer> testList = list(19, 2, 4, 6, 20, 1, 40);
        // Specify the order of the first two digits, and the rest are sorted from small to large
        List<Integer> expectResult2 = list(40, 6, 1, 2, 4, 19, 20);
        assertThat(CollectionUtil.customSequenceSort(testList, Integer::intValue, customSequenceInts, Comparator.comparing(Integer::intValue)))
                .containsSequence(expectResult2);
    }

    @Test
    public void testCustomSequenceSort_remainTakeOrderKeepDesc() {
        List<Integer> testList = list(19, 2, 4, 6, 20, 1, 40);
        // Specify the order of the first two digits, and the rest are sorted from largest to smallest
        List<Integer> expectResult3 = list(40, 6, 20, 19, 4, 2, 1);
        assertThat(CollectionUtil.customSequenceSort(testList, Integer::intValue, customSequenceInts, Comparator.comparing(Integer::intValue).reversed()))
                .containsSequence(expectResult3);
    }

    @Test
    public void testDistinctIgnoreCaseWithSet() {
        Set<String> collections = Sets.newTreeSet("John.Boe@APITABLE.com", "john.Boe@apitable.com");
        List<String> result = CollectionUtil.distinctIgnoreCase(collections);
        assertThat(result).isNotEmpty().containsOnly("John.Boe@APITABLE.com");
    }

    @Test
    public void testDistinctIgnoreCaseWithArrayList() {
        List<String> collections = list("John.Boe@APITABLE.com", "john.Boe@apitable.com");
        List<String> result = CollectionUtil.distinctIgnoreCase(collections);
        assertThat(result).isNotEmpty().containsOnly("John.Boe@APITABLE.com");
    }
}
