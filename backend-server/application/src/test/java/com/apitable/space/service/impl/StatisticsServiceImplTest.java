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

package com.apitable.space.service.impl;


import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.space.dto.DatasheetStaticsDTO;
import com.apitable.workspace.enums.ViewType;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

public class StatisticsServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testGetDatasheetStaticsBySpaceIdFromCacheForNull() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        DatasheetStaticsDTO dto =
            iStaticsService.getDatasheetStaticsBySpaceIdFromCache(userSpace.getSpaceId());
        assertThat(dto).isNull();
    }

    @Test
    void testGetDatasheetStaticsBySpaceIdFromCache() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        DatasheetStaticsDTO dto = new DatasheetStaticsDTO();
        dto.setGanttViews(1L);
        iStaticsService.setDatasheetStaticsBySpaceIdToCache(userSpace.getSpaceId(), dto);
        DatasheetStaticsDTO result =
            iStaticsService.getDatasheetStaticsBySpaceIdFromCache(userSpace.getSpaceId());
        assertThat(result).isNotNull();
        assertThat(result.getGanttViews()).isEqualTo(1L);
    }

    @Test
    void setDatasheetStaticsBySpaceIdAndViewTypeWhileNotCacheable() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Map<Integer, Long> viewCount = new HashMap<>();
        viewCount.put(ViewType.KANBAN.getType(), 1L);
        iStaticsService.updateDatasheetViewCountStaticsBySpaceId(userSpace.getSpaceId(),
            viewCount);
        DatasheetStaticsDTO result =
            iStaticsService.getDatasheetStaticsBySpaceIdFromCache(userSpace.getSpaceId());
        assertThat(result).isNull();
    }

    @Test
    void setDatasheetStaticsBySpaceIdAndViewType() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        DatasheetStaticsDTO dto = new DatasheetStaticsDTO();
        dto.setGanttViews(1L);
        iStaticsService.setDatasheetStaticsBySpaceIdToCache(userSpace.getSpaceId(), dto);
        Map<Integer, Long> viewCount = new HashMap<>();
        viewCount.put(ViewType.GANTT.getType(), 1L);
        iStaticsService.updateDatasheetViewCountStaticsBySpaceId(userSpace.getSpaceId(),
            viewCount);
        DatasheetStaticsDTO result =
            iStaticsService.getDatasheetStaticsBySpaceIdFromCache(userSpace.getSpaceId());
        assertThat(result).isNotNull();
        assertThat(result.getGanttViews()).isEqualTo(2L);
    }
}
