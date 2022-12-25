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

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.space.vo.SpaceRoleVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class SpaceRoleMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceRoleMapper spaceRoleMapper;

    @Test
    @Sql({ "/sql/space-member-role-rel-data.sql", "/sql/space-role-resource-data.sql",
            "/sql/space-resource-data.sql", "/sql/space-resource-group-data.sql",
            "/sql/unit-member-data.sql"})
    void testSelectSpaceRolePage() {
        IPage<SpaceRoleVo> page = spaceRoleMapper.selectSpaceRolePage(new Page<>(), "spa41");
        assertThat(page.getTotal()).isEqualTo(1);
    }

    @Test
    @Sql({ "/sql/space-member-role-rel-data.sql", "/sql/space-role-resource-rel-data.sql" })
    void testSelectResourceCodesById() {
        List<String> roles = spaceRoleMapper.selectResourceCodesById(41L);
        assertThat(roles).isNotEmpty();
    }

}
