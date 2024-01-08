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

import static com.apitable.organization.enums.OrganizationException.INVITE_EXPIRE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import com.apitable.AbstractIntegrationTest;
import com.apitable.core.exception.BusinessException;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.enums.UserSpaceStatus;
import com.apitable.space.vo.EmailInvitationValidateVO;
import com.apitable.starter.mail.autoconfigure.EmailMessage;
import com.apitable.user.entity.UserEntity;
import java.util.Collections;
import org.junit.jupiter.api.Test;

public class SpaceInvitationServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testValidEmailInvitation() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        String email = "test@apitable.com";
        doNothing().when(mailTemplate).send(any(EmailMessage.class));
        String inviteToken = iMemberService.sendInviteEmail("en_US",
            mockUserSpace.getSpaceId(), mockUserSpace.getMemberId(), email);
        EmailInvitationValidateVO validateVO =
            iSpaceInvitationService.validEmailInvitation(inviteToken);
        assertThat(validateVO).isNotNull();
        assertThat(validateVO.getSpaceId()).isEqualTo(mockUserSpace.getSpaceId());
        assertThat(validateVO.getInviteEmail()).isEqualTo(email);
    }

    @Test
    public void testAcceptEmailInvitation() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        String email = "test@apitable.com";
        doNothing().when(mailTemplate).send(any(EmailMessage.class));
        String inviteToken = iMemberService.sendInviteEmail("en_US",
            mockUserSpace.getSpaceId(), mockUserSpace.getMemberId(), email);

        UserEntity user = createUserWithEmail(email);
        iSpaceInvitationService.acceptEmailInvitation(user.getId(), inviteToken);
        // check this member should join this space again
        MemberEntity member = iMemberService.getBySpaceIdAndEmail(mockUserSpace.getSpaceId(), email);
        assertThat(member).isNotNull();
        assertThat(member.getIsActive()).isNotNull().isTrue();
        assertThat(member.getIsPoint()).isNotNull().isTrue();
        assertThat(member.getStatus()).isEqualTo(UserSpaceStatus.ACTIVE.getStatus());
    }

    @Test
    public void testAcceptEmailInvitationWithRestore() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();

        String email = "test@apitable.com";
        UserEntity user = createUserWithEmail(email);
        Long toDeletedMemberId = createMember(user.getId(), mockUserSpace.getSpaceId());
        iMemberService.batchDeleteMemberFromSpace(mockUserSpace.getSpaceId(),
            Collections.singletonList(toDeletedMemberId), false);

        doNothing().when(mailTemplate).send(any(EmailMessage.class));
        String inviteToken = iMemberService.sendInviteEmail("en_US",
            mockUserSpace.getSpaceId(), mockUserSpace.getMemberId(), email);
        Long memberId = iSpaceInvitationService.acceptEmailInvitation(user.getId(), inviteToken);
        assertThat(memberId).isEqualTo(toDeletedMemberId);
    }

    @Test
    public void testAcceptEmailInvitationWithExpireToken() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        String email = "test@apitable.com";
        doNothing().when(mailTemplate).send(any(EmailMessage.class));
        String inviteToken = iMemberService.sendInviteEmail("en_US",
            mockUserSpace.getSpaceId(), mockUserSpace.getMemberId(), email);

        UserEntity user = createUserWithEmail(email);
        Long toDeletedMemberId = createMember(user.getId(), mockUserSpace.getSpaceId());
        iMemberService.batchDeleteMemberFromSpace(mockUserSpace.getSpaceId(),
            Collections.singletonList(toDeletedMemberId), false);

        BusinessException exception = assertThrows(BusinessException.class,
            () -> iSpaceInvitationService.acceptEmailInvitation(user.getId(), inviteToken));
        assertThat(exception.getCode()).isEqualTo(INVITE_EXPIRE.getCode());
    }
}