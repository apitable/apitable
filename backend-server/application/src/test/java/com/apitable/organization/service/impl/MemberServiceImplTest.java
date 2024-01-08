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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.starter.mail.autoconfigure.EmailMessage;
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
        doNothing().when(mailTemplate).send(any(EmailMessage.class));
        List<String> emails = list("test@apitable.com");
        iMemberService.emailInvitation(mockUserSpace.getUserId(), mockUserSpace.getSpaceId(), emails);
    }

    @Test
    void testGetTotalActiveMemberCountBySpaceId() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        long memberCount = iMemberService.getTotalActiveMemberCountBySpaceId(mockUserSpace.getSpaceId());
        assertThat(memberCount).isEqualTo(1L);
    }


    @Test
    void testGetMemberIdIsNull() {
        MockUserSpace mockUserSpace = createSingleUserAndSpace();
        Long memberId =
            iMemberService.getMemberIdByUserIdAndSpaceId(mockUserSpace.getUserId(), "");
        assertThat(memberId).isEqualTo(null);
    }
}
