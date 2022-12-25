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

package com.apitable.control.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.control.entity.ControlRoleEntity;
import com.apitable.workspace.dto.ControlRoleInfo;
import com.apitable.workspace.dto.ControlRoleUnitDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Control Role Mapper Test
 */
public class ControlRoleMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private ControlRoleMapper controlRoleMapper;

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectByControlId() {
        List<ControlRoleEntity> entities = controlRoleMapper.selectByControlId("fodLBWwj51A77");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectByControlIds() {
        List<ControlRoleEntity> entities = controlRoleMapper.selectByControlIds(CollUtil.newArrayList("fodLBWwj51A77", "fodWBwDMvfsNP"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectByControlIdAndUnitId() {
        List<ControlRoleEntity> entities = controlRoleMapper.selectByControlIdAndUnitId("fodLBWwj51A77", 11L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectUnitIdAndControlIdAndRoleCode() {
        Long unitId = controlRoleMapper.selectUnitIdAndControlIdAndRoleCode("fodLBWwj51A77", "manager");
        assertThat(unitId).isEqualTo(11L);
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectRoleCodeByControlIdAndUnitId() {
        String roleCode = controlRoleMapper.selectRoleCodeByControlIdAndUnitId("fodLBWwj51A77", 11L);
        assertThat(roleCode).isEqualTo("manager");
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectControlRoleInfoByControlIds() {
        List<ControlRoleInfo> entities = controlRoleMapper.selectControlRoleInfoByControlIds(CollUtil.newArrayList("fodLBWwj51A77", "fodWBwDMvfsNP"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({ "/sql/control-role-data.sql", "/sql/unit-data.sql" })
    void testSelectControlRoleUnitDtoByControlId() {
        List<ControlRoleUnitDTO> entities = controlRoleMapper.selectControlRoleUnitDtoByControlId("fodLBWwj51A77");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectDeletedRole() {
        List<ControlRoleEntity> entities = controlRoleMapper.selectDeletedRole("fodZlyUwAnzyH", Lists.list(11L), "manager");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectDeletedRoleByRoleCodes() {
        List<ControlRoleEntity> entities = controlRoleMapper.selectDeletedRoleByRoleCodes("fodZlyUwAnzyH", Lists.list(11L), Lists.list("manager"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectIdByControlIds() {
        List<Long> entities = controlRoleMapper.selectIdByControlIds(CollUtil.newArrayList("fodLBWwj51A77", "fodWBwDMvfsNP"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectIdByUnitIds() {
        List<Long> ids = controlRoleMapper.selectIdByUnitIds(Lists.list(11L));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectIdByControlIdAndUnitIds() {
        List<Long> entities = controlRoleMapper.selectIdByControlIdAndUnitIds("fodLBWwj51A77", Lists.list(11L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/control-role-data.sql")
    void testSelectIdByControlIdAndUnitId() {
        List<Long> entities = controlRoleMapper.selectIdByControlIdAndUnitId("fodLBWwj51A77", 11L);
        assertThat(entities).isNotEmpty();
    }

}
