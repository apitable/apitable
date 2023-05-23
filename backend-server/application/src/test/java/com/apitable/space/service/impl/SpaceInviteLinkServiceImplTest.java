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

import com.apitable.AbstractIntegrationTest;
import com.apitable.control.entity.ControlRoleEntity;
import com.apitable.mock.bean.MockInvitation;
import com.apitable.user.entity.UserEntity;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

public class SpaceInviteLinkServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testJoinSpaceByNodeInvitationToken() {
        MockInvitation invitation = prepareInvitationToken();
        UserEntity user = createUserWithEmail(IdWorker.getIdStr() + "@test.com");
        iSpaceInviteLinkService.join(user.getId(), invitation.getToken(), invitation.getNodeId());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), invitation.getSpaceId());
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        List<ControlRoleEntity> controls = iControlRoleService.getByControlId(invitation.getNodeId());
        List<Long> unitIds = controls.stream().map(ControlRoleEntity::getUnitId).collect(Collectors.toList());
        assertThat(unitIds).contains(unitId);
    }
}
