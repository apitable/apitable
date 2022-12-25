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

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.dto.NodeAssetDTO;
import com.apitable.space.dto.SpaceAssetDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class SpaceAssetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceAssetMapper spaceAssetMapper;

    @Test
    @Sql("/sql/space-asset-data.sql")
    void testSelectDistinctAssetIdByNodeIdIn() {
        List<Long> assetIds = spaceAssetMapper.selectDistinctAssetIdByNodeIdIn(Collections.singleton("ni41"));
        assertThat(assetIds).isNotNull();
    }

    @Test
    @Sql("/sql/space-asset-data.sql")
    void testSelectDto() {
        SpaceAssetDTO entity = spaceAssetMapper.selectDto("spc41", "ni41", 41L);
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/space-asset-data.sql")
    void testSelectDtoByAssetIdsAndType() {
        List<SpaceAssetDTO> entities = spaceAssetMapper.selectDtoByAssetIdsAndType("spc41", "ni41", 2, CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/space-asset-data.sql")
    void testSelectNodeAssetDto() {
        List<NodeAssetDTO> entities = spaceAssetMapper.selectNodeAssetDto(CollUtil.newArrayList("ni41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/space-asset-data.sql")
    void testCountBySpaceIdAndAssetChecksum() {
        Integer count = spaceAssetMapper.countBySpaceIdAndAssetChecksum("spc41", "checksum");
        assertThat(count).isEqualTo(1);
    }


    @Test
    @Sql({ "/sql/space-asset-data.sql", "/sql/asset-data.sql" })
    void testSelectFileSizeBySpaceId() {
        List<Integer> entities = spaceAssetMapper.selectFileSizeBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

}
