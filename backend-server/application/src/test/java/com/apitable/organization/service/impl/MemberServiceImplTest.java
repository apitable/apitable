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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.util.Lists.list;

import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.enums.UserSpaceStatus;
import com.apitable.user.entity.UserEntity;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;

/**
 * member service test
 * @author Shawn Deng
 */
public class MemberServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testInvitationWithoutExistUser() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();

        List<String> emails = list("test@apitable.com");
        iMemberService.emailInvitation(mockUserSpace.getUserId(), mockUserSpace.getSpaceId(), emails);

        // check this member should join this space again
        MemberEntity member = iMemberService.getBySpaceIdAndEmail(mockUserSpace.getSpaceId(), "test@apitable.com");
        assertThat(member).isNotNull();
        assertThat(member.getIsActive()).isNotNull().isFalse();
        assertThat(member.getIsPoint()).isNotNull().isTrue();
        assertThat(member.getStatus()).isEqualTo(UserSpaceStatus.INACTIVE.getStatus());
    }

    @Test
    public void testInvitationWithExistUser() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();

        UserEntity user = createUserWithEmail("shawndgh@163.com");

        List<String> emails = list("shawndgh@163.com");
        iMemberService.emailInvitation(mockUserSpace.getUserId(), mockUserSpace.getSpaceId(), emails);

        // check this member should join this space again
        MemberEntity member = iMemberService.getByUserIdAndSpaceId(user.getId(), mockUserSpace.getSpaceId());
        assertThat(member).isNotNull();
        assertThat(member.getIsActive()).isNotNull().isTrue();
        assertThat(member.getIsPoint()).isNotNull().isTrue();
        assertThat(member.getStatus()).isEqualTo(UserSpaceStatus.INACTIVE.getStatus());
    }

    @Test
    public void testInvitationWithRestore() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();

        UserEntity user = createUserWithEmail("shawndgh@163.com");

        Long toDeletedMemberId = createMember(user.getId(), mockUserSpace.getSpaceId());
        iMemberService.removeByMemberIds(Collections.singletonList(toDeletedMemberId));

        List<String> emails = list("shawndgh@163.com");
        iMemberService.emailInvitation(mockUserSpace.getUserId(), mockUserSpace.getSpaceId(), emails);

        // check this member should join this space again
        MemberEntity member = iMemberService.getById(toDeletedMemberId);
        assertThat(member).isNotNull();
        assertThat(member.getIsActive()).isNotNull().isTrue();
        assertThat(member.getIsPoint()).isNotNull().isTrue();
        assertThat(member.getStatus()).isEqualTo(UserSpaceStatus.INACTIVE.getStatus());

        // check member should join in root team
        List<Long> teamIds = iTeamMemberRelService.getTeamByMemberId(toDeletedMemberId);
        Long rootTeamId = iTeamService.getRootTeamId(mockUserSpace.getSpaceId());
        assertThat(teamIds).isNotEmpty().containsOnly(rootTeamId);
    }

    @Test
    public void testInvitationWithHavingActive() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();

        UserEntity user = createUserWithEmail("shawndgh@163.com");

        Long existMemberId = createMember(user.getId(), mockUserSpace.getSpaceId());

        List<String> emails = list("shawndgh@163.com");
        iMemberService.emailInvitation(mockUserSpace.getUserId(), mockUserSpace.getSpaceId(), emails);

        // check this member should join this space again
        MemberEntity member = iMemberService.getById(existMemberId);
        assertThat(member).isNotNull();
        assertThat(member.getIsActive()).isNotNull().isTrue();
        assertThat(member.getIsPoint()).isNotNull().isTrue();
        assertThat(member.getStatus()).isEqualTo(UserSpaceStatus.ACTIVE.getStatus());
    }

    @Test
    void testGetTotalActiveMemberCountBySpaceId() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        long memberCount = iMemberService.getTotalActiveMemberCountBySpaceId(mockUserSpace.getSpaceId());
        assertThat(memberCount).isEqualTo(1L);
    }
}
