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
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatNoException;

import com.apitable.AbstractIntegrationTest;
import com.apitable.core.exception.BusinessException;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.space.vo.SpaceRoleDetailVo;
import com.apitable.user.entity.UserEntity;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

public class SpaceRoleServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testCreateRole() {
        // initial user and space
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());

        // prepare sub-admins test account
        UserEntity user = iUserService.createUserByEmail("sub_admin_test001@apitable.com");
        // create member
        Long memberId = iMemberService.createMember(user.getId(), mockUserSpace.getSpaceId(), null);
        assertThatNoException().isThrownBy(
            () -> iSpaceRoleService.createRole(mockUserSpace.getSpaceId(),
                Collections.singletonList(memberId),
                Arrays.asList("MANAGE_TEAM", "MANAGE_MEMBER")));

        // duplicate setting, must be throw error
        assertThatCode(
            () -> iSpaceRoleService.createRole(mockUserSpace.getSpaceId(),
                Collections.singletonList(memberId),
                Arrays.asList("MANAGE_TEAM", "MANAGE_MEMBER"))).isInstanceOf(
            BusinessException.class);
    }

    @Test
    void testBatchCreateRole() {
        // initial user and space
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());

        // prepare sub-admins test account
        UserEntity user1 = iUserService.createUserByEmail("sub_admin_test101@apitable.com");
        UserEntity user2 = iUserService.createUserByEmail("sub_admin_test102@apitable.com");
        // create member
        Long memberId1 =
            iMemberService.createMember(user1.getId(), mockUserSpace.getSpaceId(), null);
        Long memberId2 =
            iMemberService.createMember(user2.getId(), mockUserSpace.getSpaceId(), null);

        // set two member to sub-admins
        assertThatNoException().isThrownBy(
            () -> iSpaceRoleService.createRole(mockUserSpace.getSpaceId(),
                Arrays.asList(memberId1, memberId2),
                Arrays.asList("MANAGE_TEAM", "MANAGE_MEMBER")));

        List<String> roleCodes =
            iSpaceMemberRoleRelService.getRoleCodesBySpaceId(mockUserSpace.getSpaceId());
        assertThat(roleCodes).isNotEmpty().hasSize(2);

        // no share the same role
        assertThat(new HashSet<>(roleCodes)).isNotEmpty().hasSize(2);
    }

    @Test
    @Disabled
    void testCreateRoleWithRoleManage() {
        final MockUserSpace mockUserSpace = createSingleUserAndSpace();
        SpaceHolder.init();
        SpaceHolder.set(mockUserSpace.getSpaceId());
        // user have management roles permission
        UserEntity user = iUserService.createUserByEmail("sub_admin_test001@apitable.com");
        Long memberId = iMemberService.createMember(user.getId(), mockUserSpace.getSpaceId(), null);
        iSpaceRoleService.createRole(mockUserSpace.getSpaceId(),
            Collections.singletonList(memberId),
            Collections.singletonList("MANAGE_TEAM"));
        // assert user have management roles permission
        SpaceRoleDetailVo roleDetail =
            iSpaceRoleService.getRoleDetail(mockUserSpace.getSpaceId(), memberId);
        assertThat(roleDetail.getResources().size()).isEqualTo(0);
        String roleCode =
            iSpaceMemberRoleRelService.getRoleCodeByMemberId(mockUserSpace.getSpaceId(), memberId);
        List<String> resourceCodes =
            iSpaceRoleResourceRelService.getResourceCodesByRoleCode(roleCode);
        assertThat(resourceCodes.size()).isEqualTo(1);
    }

}