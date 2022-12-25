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

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;
import com.apitable.control.entity.ControlRoleEntity;
import com.apitable.control.service.IControlRoleService;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.mock.bean.MockInvitation;
import com.apitable.organization.service.IUnitService;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.user.entity.UserEntity;
import com.apitable.core.constants.RedisConstants;

import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

public class SpaceInviteLinkServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Autowired
    private IControlRoleService iControlRoleService;

    @Autowired
    private IUnitService iUnitService;

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

    @Test
    @Disabled
    public void testJoinSpaceByNodeInvitationTokenWithRewardCapacity() {
        MockInvitation invitation = prepareInvitationToken();
        UserEntity user = createUserWithEmail(IdWorker.getIdStr() + "@test.com");
        String key = RedisConstants.getUserInvitedJoinSpaceKey(user.getId(), invitation.getSpaceId());
        redisTemplate.opsForValue().set(key, user.getId(), 5, TimeUnit.MINUTES);
        iSpaceInviteLinkService.join(user.getId(), invitation.getToken(), invitation.getNodeId());
        SubscriptionInfo subscriptionInfo = entitlementServiceFacade.getSpaceSubscription(invitation.getSpaceId());
        assertThat(subscriptionInfo.getAddOnPlans()).contains("capacity_300_MB");
    }
}
