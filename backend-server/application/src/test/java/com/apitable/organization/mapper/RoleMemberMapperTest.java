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
import com.apitable.organization.dto.RoleMemberInfoDTO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class RoleMemberMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    RoleMemberMapper roleMemberMapper;

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTwoRoleMembersWhenSelectUnitRefIdsByRoleIdThenGetTwoMemberIds() {
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(2);
    }


    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTwoRoleMembersWhenDeleteByRoleIdAndUnitRefIdsThenGetZeroMemberIds() {
        Integer count = roleMemberMapper.deleteByRoleIdAndUnitRefIds(20220824L,
            CollUtil.newArrayList(2022082401L, 2022082402L));
        assertThat(count).isEqualTo(2);
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(0);
    }

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenRoleWithTwoRoleMembersWhenDeleteByRoleIdThenGetZeroMemberIds() {
        Integer count = roleMemberMapper.deleteByRoleId(20220824L);
        assertThat(count).isEqualTo(2);
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(0);
    }

    @Test
    @Sql({"/sql/unit-role-member-data.sql", "/sql/unit-data.sql"})
    void givenTwoRoleMembersWhenSelectRoleMembersByRoleIdsThenTwoRoleMebers() {
        List<RoleMemberInfoDTO> roleMembers =
            roleMemberMapper.selectRoleMembersByRoleIds(CollUtil.newArrayList(20220824L));
        assertThat(roleMembers.size()).isEqualTo(2);
    }

    @Test
    @Sql({"/sql/unit-role-member-data.sql", "/sql/unit-data.sql"})
    void givenTwoRoleMembersWhenSelectRoleMembersByRoleIdThenPageRecordsEqualsTwo() {
        Page<Void> page = new Page<>();
        IPage<RoleMemberInfoDTO> roleMemberPage =
            roleMemberMapper.selectRoleMembersByRoleId(20220824L, page);
        assertThat(roleMemberPage.getRecords().size()).isEqualTo(2);
    }

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTowRoleMembersWhenDeleteByUnitRefIdsThenSuccess() {
        int count =
            roleMemberMapper.deleteByUnitRefIds(CollUtil.newArrayList(2022082401L, 2022082402L));
        assertThat(count).isEqualTo(2);
        Set<Long> memberIds = roleMemberMapper.selectUnitRefIdsByRoleId(20220824L);
        assertThat(memberIds.size()).isEqualTo(0);
    }

    @Test
    @Sql("/sql/unit-role-member-data.sql")
    void givenTowRoleMembersWhenSelectRoleIdByUnitRefIdsThenGetOneRoleId() {
        List<Long> roleIds = roleMemberMapper.selectRoleIdsByUnitRefId(2022082401L);
        assertThat(roleIds.size()).isEqualTo(1);
        assertThat(roleIds.get(0)).isEqualTo(20220824L);
    }

    @Test
    @Sql({"/sql/unit-role-member-data.sql", "/sql/unit-data.sql"})
    void givenTowRoleMembersWhenSelectRoleMembersByRoleIdAndUnitRefIdsThenRoleMembers() {
        List<RoleMemberInfoDTO> roleMembers =
            roleMemberMapper.selectRoleMembersByRoleIdAndUnitRefIds(20220824L,
                CollUtil.newArrayList(2022082401L, 2022082402L));
        assertThat(roleMembers.size()).isEqualTo(2);
    }

}
