package com.vikadata.api.space.service.impl;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.control.service.IControlRoleService;
import com.vikadata.api.interfaces.billing.model.SubscriptionInfo;
import com.vikadata.api.mock.bean.MockInvitation;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.space.service.ISpaceInviteLinkService;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.entity.ControlRoleEntity;

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
