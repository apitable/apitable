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

package com.apitable.organization.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.organization.entity.UnitEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class UnitMapperTest extends AbstractMyBatisMapperTest {
    @Autowired
    UnitMapper unitMapper;

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectCountBySpaceIdAndIds() {
        Integer count = unitMapper.selectCountBySpaceIdAndIds("spc41", CollUtil.newArrayList(41L));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectUnitIdByRefId() {
        Long id = unitMapper.selectUnitIdByRefId(41L);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectRefIdById() {
        Long id = unitMapper.selectRefIdById(41L);
        assertThat(41L).isEqualTo(id);
    }

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectByRefId() {
        UnitEntity entity = unitMapper.selectByRefId(41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectIdBySpaceId() {
        List<Long> ids = unitMapper.selectIdBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectIdsByRefIds() {
        List<Long> ids = unitMapper.selectIdsByRefIds(CollUtil.newArrayList(41L));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectByRefIds() {
        List<UnitEntity> entities = unitMapper.selectByRefIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-data.sql")
    void testSelectByUnitIds() {
        List<UnitEntity> entities = unitMapper.selectByUnitIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }
}
