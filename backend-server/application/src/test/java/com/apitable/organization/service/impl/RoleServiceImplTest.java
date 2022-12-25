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

package com.apitable.organization.service.impl;

import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.organization.ro.RoleMemberUnitRo;
import com.apitable.organization.vo.RoleInfoVo;
import com.apitable.organization.vo.RoleMemberVo;
import com.apitable.organization.vo.RoleVo;
import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.user.entity.UserEntity;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;

public class RoleServiceImplTest extends AbstractIntegrationTest {

    @Test
    void givenRoleNameWhenCreateRoleThenSuccess() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Finance");
        assertThat(roleId).isNotNull();
    }

    @Test
    void givenExistRoleNameWhenCheckDuplicationRoleNameThenTure() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Finance");
        iRoleService.checkDuplicationRoleName(userSpace.getSpaceId(), "Finance",
                status -> assertThat(status).isTrue());
    }

    @Test
    void givenNotExistRoleNameWhenCheckDuplicationRoleNameThenFalse() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iRoleService.checkDuplicationRoleName(userSpace.getSpaceId(), "Finance",
                status -> assertThat(status).isFalse());
    }

    @Test
    void givenExistRoleWhenUpdateRoleThenSuccess() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Finance");
        iRoleService.updateRole(userSpace.getUserId(), roleId, "Legal");
    }

    @Test
    void givenRoleWhenCheckRoleExistThenTrue() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Finance");
        iRoleService.checkRoleExistBySpaceIdAndRoleId(userSpace.getSpaceId(), roleId,
                status -> assertThat(status).isTrue());
    }

    @Test
    void givenNotExistRoleWhenCheckRoleExistThenFalse() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iRoleService.checkRoleExistBySpaceIdAndRoleId(userSpace.getSpaceId(), 0L,
                status -> assertThat(status).isFalse());
    }

    @Test
    void givenNoRolesWhenGetRolesThenIsOpenFalse() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        List<RoleInfoVo> rolesVo = iRoleService.getRoles(userSpace.getSpaceId());
        assertThat(rolesVo.size()).isEqualTo(0);
    }

    @Test
    void givenRoleWithEmptyRoleMembersWhenGetRolesThenGetRoleList() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Finance");
        iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Legal");
        List<RoleInfoVo> rolesVo = iRoleService.getRoles(userSpace.getSpaceId());
        assertThat(rolesVo.size()).isEqualTo(2);
    }

    @Test
    void givenRoleWithRoleMembersWhenGetRolesThenGetRoleList() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        UserEntity user = iUserService.createUserByEmail("boy@apitable.com");
        Long rootTeamId = iTeamService.getRootTeamId(userSpace.getSpaceId());
        iMemberService.createMember(user.getId(), userSpace.getSpaceId(), rootTeamId);
        RoleMemberUnitRo rootTeamUnit = new RoleMemberUnitRo();
        RoleMemberUnitRo adminUnit = new RoleMemberUnitRo();
        rootTeamUnit.setId(rootTeamId);
        rootTeamUnit.setType(1);
        Long adminMemberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        adminUnit.setId(adminMemberId);
        adminUnit.setType(3);
        Long allPart = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "apitable boys");
        iRoleMemberService.addRoleMembers(allPart, CollUtil.newArrayList(rootTeamUnit, adminUnit));
        Long financePart = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Finance");
        iRoleMemberService.addRoleMembers(financePart, CollUtil.newArrayList(rootTeamUnit));
        Long legalPart = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "Legal");
        iRoleMemberService.addRoleMembers(legalPart, CollUtil.newArrayList(adminUnit));
        iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "empty");
        List<RoleInfoVo> rolesVo = iRoleService.getRoles(userSpace.getSpaceId());
        assertThat(rolesVo.size()).isEqualTo(4);
        assertThat(rolesVo.get(0).getMemberCount()).isEqualTo(2);
        assertThat(rolesVo.get(1).getMemberCount()).isEqualTo(2);
        assertThat(rolesVo.get(2).getMemberCount()).isEqualTo(1);
        assertThat(rolesVo.get(3).getMemberCount()).isEqualTo(0);
    }

    @Test
    void givenRoleRoleMembersWhenDeleteRoleThenSuccess() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long role = addRoleMembers(userSpace);
        iRoleService.deleteRole(role);
        List<RoleInfoVo> rolesVo = iRoleService.getRoles(userSpace.getSpaceId());
        assertThat(rolesVo.size()).isEqualTo(0);
        Page<Void> page = new Page<>();
        iRoleMemberService.getRoleMembersPage(userSpace.getSpaceId(), role, page);
        IPage<RoleMemberVo> roleMembersPage = iRoleMemberService.getRoleMembersPage(userSpace.getSpaceId(), role, page);
        PageInfo<RoleMemberVo> resultMember = PageHelper.build(roleMembersPage);
        assertThat(resultMember.getPages()).isEqualTo(0);
        assertThat(resultMember.getSize()).isEqualTo(0);
    }

    @Test
    void givenMockUserSpaceAndRoleWhenGetRoleNameByRoleIdThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long role = addRoleMembers(userSpace);
        String roleName = iRoleService.getRoleNameByRoleId(role);
        assertThat(roleName).isEqualTo("apitable boys");
    }

    @Test
    void givenMockUserSpaceAndRoleWhenGetRoleVosByMemberIdThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = addRoleMembers(userSpace);
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userSpace.getUserId(), userSpace.getSpaceId());
        List<RoleVo> roles = iRoleService.getRoleVosByMemberId(memberId);
        assertThat(roles.size()).isEqualTo(1);
        assertThat(roles.get(0).getRoleId()).isEqualTo(roleId);
        assertThat(roles.get(0).getRoleName()).isEqualTo("apitable boys");
    }

    @Test
    void givenMockUserSpaceAndRoleWhenGetRoleIdsByKeyWordThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = addRoleMembers(userSpace);
        List<Long> ids = iRoleService.getRoleIdsByKeyWord(userSpace.getSpaceId(), "a");
        assertThat(ids.size()).isEqualTo(1);
        assertThat(ids.get(0)).isEqualTo(roleId);
    }

    @Test
    void givenMockUserSpaceAndRoleWhenGetBaseInfoDTOByRoleIdsThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = addRoleMembers(userSpace);
        List<RoleBaseInfoDto> roleInfos = iRoleService.getBaseInfoDtoByRoleIds(CollUtil.newArrayList(roleId));
        assertThat(roleInfos.size()).isEqualTo(1);
        assertThat(roleInfos.get(0).getId()).isEqualTo(roleId);
        assertThat(roleInfos.get(0).getRoleName()).isEqualTo("apitable boys");
    }

    @Test
    void givenWhenGetRoleVosThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = addRoleMembers(userSpace);
        List<RoleInfoVo> roleVos = iRoleService.getRoleVos(userSpace.getSpaceId(), CollUtil.newArrayList(roleId));
        assertThat(roleVos.size()).isEqualTo(1);
        assertThat(roleVos.get(0).getRoleName()).isEqualTo("apitable boys");
        assertThat(roleVos.get(0).getMemberCount()).isEqualTo(2);
    }

    @Test
    void givenWhenFlatMapToRoleMemberUnitIdsThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = addRoleMembers(userSpace);
        Map<Long, List<Long>> unitIdToUnitIds = iRoleService.flatMapToRoleMemberUnitIds(CollUtil.newArrayList(roleId));
        assertThat(unitIdToUnitIds.size()).isEqualTo(1);
        List<Long> roleMemberUnitIds = unitIdToUnitIds.values().stream().flatMap(List::stream).distinct().collect(toList());
        assertThat(roleMemberUnitIds.size()).isEqualTo(3);
    }

    @Test
    void givenWhenFlatMapToEmptyRoleMemberUnitIdsThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "role");
        Map<Long, List<Long>> unitIdToUnitIds = iRoleService.flatMapToRoleMemberUnitIds(CollUtil.newArrayList(roleId));
        assertThat(unitIdToUnitIds.size()).isEqualTo(1);
        List<Long> roleMemberUnitIds = unitIdToUnitIds.values().stream().flatMap(List::stream).distinct().collect(toList());
        assertThat(roleMemberUnitIds.size()).isEqualTo(0);
    }

    @Test
    void givenWhenInitRoleListThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iRoleService.initRoleList(userSpace.getUserId(), userSpace.getSpaceId());
        List<RoleInfoVo> roles = iRoleService.getRoles(userSpace.getSpaceId());
        assertThat(roles.size()).isGreaterThan(0);
    }

    @Test
    void givenSpaceWithEmptyRolesWhenCheckRoleExistBySpaceIdThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        iRoleService.checkRoleExistBySpaceId(userSpace.getSpaceId(),
                status -> assertThat(status).isNotNull().isFalse());
    }

    @Test
    void givenSpaceWithRolesWhenCheckRoleExistBySpaceIdThen() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long roleId = iRoleService.createRole(userSpace.getUserId(), userSpace.getSpaceId(), "empty");
        iRoleService.checkRoleExistBySpaceId(userSpace.getSpaceId(),
                status -> assertThat(status).isNotNull().isTrue());
    }
}
