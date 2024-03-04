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

package com.apitable.space.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.dto.NodeStaticsDTO;
import com.apitable.space.dto.NodeTypeStaticsDTO;
import com.apitable.workspace.mapper.DatasheetMapper;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * Data access layer: related table calculation test
 * </p>
 */
public class StaticsMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    StaticsMapper staticsMapper;

    @Autowired
    DatasheetMapper datasheetMapper;

    @Test
    @Sql({"/sql/space-member-role-rel-data.sql", "/sql/space-role-resource-rel-data.sql"})
    void testCountSubAdminBySpaceId() {
        Long count = staticsMapper.countSubAdminBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testCountMemberBySpaceId() {
        Long count = staticsMapper.countMemberBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-team-data.sql")
    void testCountTeamBySpaceId() {
        Long count = staticsMapper.countTeamBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/datasheet-meta-data.sql", "/sql/datasheet-data.sql"})
    void testCountRecordsBySpaceId() {
        Long count = staticsMapper.countRecordsBySpaceId("spc41");
        assertThat(count).isEqualTo(3);
    }

    @Test
    @Sql({"/sql/datasheet-meta-data.sql", "/sql/datasheet-data.sql"})
    void testCountRecordsByDstIds() {
        List<String> dstIds = datasheetMapper.selectDstIdBySpaceId("spc41");
        Long count = staticsMapper.countRecordsByDstIds(dstIds);
        assertThat(count).isEqualTo(3);
    }

    @Test
    @Sql("/sql/api-usage-data.sql")
    void testCountApiUsageBySpaceId() {
        Long count = staticsMapper.countApiUsageBySpaceId("spc41", 0L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/api-usage-data.sql")
    void testSelectApiUsageMinIdByCreatedAt() {
        LocalDateTime time = LocalDateTime.of(2021, 1, 1, 0, 0);
        Long id = staticsMapper.selectApiUsageMinIdByCreatedAt(0L, time);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/api-usage-data.sql")
    void testSelectMaxId() {
        Long id = staticsMapper.selectApiUsageMaxId();
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/space-asset-data.sql")
    void testSelectFileSizeBySpaceId() {
        List<Integer> entities = staticsMapper.selectFileSizeBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/node-data.sql")
    void testSelectNodeStaticsBySpaceId() {
        NodeStaticsDTO entity = staticsMapper.selectNodeStaticsBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/node-data.sql")
    void testSelectNodeTypeStaticsBySpaceId() {
        List<NodeTypeStaticsDTO> entity = staticsMapper.selectNodeTypeStaticsBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/datasheet-meta-data.sql", "/sql/datasheet-data.sql"})
    void testSelectDstViewStaticsBySpaceId() {
        List<String> entities =
            staticsMapper.selectDstViewStaticsByDstIds(Collections.singletonList("ni41"));
        assertThat(entities).isNotEmpty();
    }

}
