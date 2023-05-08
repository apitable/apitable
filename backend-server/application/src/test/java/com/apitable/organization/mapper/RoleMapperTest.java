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

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.RoleInfoDTO;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class RoleMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    RoleMapper roleMapper;

    @Test
    @Sql("/sql/unit-role-data.sql")
    void givenRowWhenSelectCountBySpaceIdAndRoleNameThenGetOne() {
        Integer count = roleMapper.selectCountBySpaceIdAndRoleName("spc20220824", "apitable boy");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-role-data.sql")
    void givenRowWhenSelectMaxSequenceBySpaceIdThenGetOne() {
        Integer maxSequence = roleMapper.selectMaxSequenceBySpaceId("spc20220824");
        assertThat(maxSequence).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-role-data.sql")
    void givenRowWhenSelectCountByIdAndSpaceIdThenGetOne() {
        Integer count = roleMapper.selectCountByIdAndSpaceId(20220824L, "spc20220824");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/unit-role-data.sql", "/sql/unit-data.sql"})
    void givenRowWhenSelectBySpaceIdThenGetOne() {
        List<RoleInfoDTO> roles = roleMapper.selectBySpaceId("spc20220824");
        assertThat(roles.size()).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-role-data.sql")
    void givenRoleWhenSelectRoleNameByIdThenGetRoleName() {
        String roleName = roleMapper.selectRoleNameById(20220824L);
        assertThat(roleName).isEqualTo("apitable boy");
    }

    @Test
    @Sql({"/sql/unit-role-data.sql", "/sql/unit-data.sql"})
    void givenWhenSelectRoleInfoDTOByIdsThen() {
        List<RoleInfoDTO> roles =
            roleMapper.selectRoleInfoDtoByIds(CollUtil.newArrayList(20220824L));
        assertThat(roles.size()).isEqualTo(1);
        assertThat(roles.get(0).getUnitId()).isEqualTo(20220824L);
    }

    @Test
    @Sql("/sql/unit-role-data.sql")
    void givenWhenSelectIdsLikeRoleNameThen() {
        List<Long> ids = roleMapper.selectIdsBySpaceIdAndLikeRoleName("spc20220824", "a");
        assertThat(ids.size()).isEqualTo(1);
        assertThat(ids.get(0)).isEqualTo(20220824L);
    }

    @Test
    @Sql("/sql/unit-role-data.sql")
    void givenWhenSelectRoleBaseInfoDtoByIdThen() {
        List<RoleBaseInfoDto> roleBaseInfoDtoList =
            roleMapper.selectRoleBaseInfoDtoByIds(CollUtil.newArrayList(20220824L));
        assertThat(roleBaseInfoDtoList.size()).isEqualTo(1);
        assertThat(roleBaseInfoDtoList.get(0).getRoleName()).isEqualTo("apitable boy");
    }

    @Test
    @Sql({"/sql/unit-role-data.sql", "/sql/unit-data.sql"})
    void givenWhenSelectRoleInfoDtoByIdsAndSpaceIdThen() {
        List<RoleInfoDTO> roleInfos =
            roleMapper.selectRoleInfoDtoByIdsAndSpaceId(CollUtil.newArrayList(20220824L),
                "spc20220824");
        assertThat(roleInfos.size()).isEqualTo(1);
    }

}
