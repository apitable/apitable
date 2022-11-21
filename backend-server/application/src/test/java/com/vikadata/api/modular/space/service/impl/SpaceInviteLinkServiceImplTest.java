package com.vikadata.api.modular.space.service.impl;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.mock.bean.MockInvitation;
import com.vikadata.api.enterprise.control.service.IControlRoleService;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.model.vo.SpaceSubscribeVo;
import com.vikadata.api.space.service.ISpaceInviteLinkService;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.entity.ControlRoleEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

public class SpaceInviteLinkServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private SpaceMapper spaceMapper;

    @Autowired
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Autowired
    private IControlRoleService iControlRoleService;

    @Autowired
    private IUnitService iUnitService;


    @Test
    public void testCheckIsNewUserRewardCapacity() {
        Long userId = 123L;
        String spaceId = "spa123";
        String userName = "test user";
        SpaceEntity space = SpaceEntity.builder()
                .id(IdWorker.getId())
                .spaceId(spaceId)
                .name("test space")
                .build();
        spaceMapper.insert(space);
        // add cache
        String key = RedisConstants.getUserInvitedJoinSpaceKey(userId, spaceId);
        redisTemplate.opsForValue().set(key, userId, 5, TimeUnit.MINUTES);
        // Judge whether it is a new user joining the space station, and issue an accessory capacity reward.
        iSpaceInviteLinkService.checkIsNewUserRewardCapacity(userId, userName, spaceId);
        // query bonus attachment capacity
        Long number = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(spaceId);
        assertThat(number).isEqualTo(314572800);
    }

    @Test
    public void testJoinSpaceByNodeInvitationToken() {
        MockInvitation invitation = prepareInvitationToken();
        UserEntity user = createUserWithEmail(IdWorker.getIdStr() + "@test.com");
        iSpaceInviteLinkService.join(user.getId(), invitation.getToken(), invitation.getNodeId());
        Long memberId  = iMemberService.getMemberIdByUserIdAndSpaceId(user.getId(), invitation.getSpaceId());
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
        SpaceSubscribeVo subscribeVo = iSpaceSubscriptionService.getSpaceSubscription(invitation.getSpaceId());
        assertThat(subscribeVo.getAddOnPlans()).contains("capacity_300_MB");
    }
}
