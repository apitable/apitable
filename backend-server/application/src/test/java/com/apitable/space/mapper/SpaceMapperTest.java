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

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.dto.BaseSpaceInfoDTO;
import com.apitable.space.dto.SpaceAdminInfoDTO;
import com.apitable.space.dto.SpaceDTO;
import com.apitable.space.entity.SpaceEntity;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class SpaceMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceMapper spaceMapper;

    @Test
    @Sql("/sql/space-data.sql")
    void testSelectSpaceNameBySpaceId() {
        String name = spaceMapper.selectSpaceNameBySpaceId("spc41");
        assertThat(name).isEqualTo("41 Space");
    }

    @Test
    @Sql("/sql/space-data.sql")
    void testSelectBySpaceId() {
        SpaceEntity entity = spaceMapper.selectBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/space-data.sql")
    void testSelectBySpaceIds() {
        List<SpaceEntity> entities = spaceMapper.selectBySpaceIds(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/space-data.sql", "/sql/unit-member-data.sql"})
    void testSelectListByUserId() {
        List<SpaceDTO> entities = spaceMapper.selectListByUserId(41L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/space-data.sql", "/sql/unit-member-data.sql"})
    void testGetAdminSpaceCount() {
        Integer count = spaceMapper.getAdminSpaceCount(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/space-data.sql", "/sql/unit-member-data.sql", "/sql/user-data.sql"})
    void testSelectAdminInfoDto() {
        SpaceAdminInfoDTO entity = spaceMapper.selectAdminInfoDto("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/space-data.sql")
    void testSelectSpaceMainAdmin() {
        Long id = spaceMapper.selectSpaceMainAdmin("spc41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/space-data.sql")
    void testSelectPropsBySpaceId() {
        String props = spaceMapper.selectPropsBySpaceId("spc41");
        assertThat(props).isEqualTo(
            "{\"joinable\": 1, \"invitable\": 1, \"mobileShowable\": 0, \"nodeExportable\": 0, \"watermarkEnable\": 0}");
    }

    @Test
    @Sql("/sql/space-data.sql")
    void testCountBySpaceId() {
        Integer count = spaceMapper.countBySpaceId("spc41", null);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/space-data.sql", "/sql/unit-member-data.sql"})
    void testSelectSpaceIdByUserIdAndName() {
        String id = spaceMapper.selectSpaceIdByUserIdAndName(41L, "41");
        assertThat(id).isEqualTo("spc41");
    }

    @Test
    @Sql("/sql/space-data.sql")
    void testSelectBaseSpaceInfo() {
        List<BaseSpaceInfoDTO> entities =
            spaceMapper.selectBaseSpaceInfo(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/space-data.sql", "/sql/unit-member-data.sql"})
    void testSelectByUserId() {
        List<SpaceEntity> entities = spaceMapper.selectByUserId(41L);
        assertThat(entities).isNotEmpty();
    }
}
