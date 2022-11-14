package com.vikadata.api.modular.user.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.shared.constants.IntegralActionCodeConstants;
import com.vikadata.api.user.entity.UserEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;

/**
 * User service test
 */
public class UserServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testUseInviteReward() {
        // Prepare Users
        UserEntity user = iUserService.createUserByEmail("test@vikadata.com");
        // Users with invitation codes
        UserEntity useInviteCodeUser = iUserService.createUserByEmail("test1@vikadata.com");
        String readyUsedInviteCode = ivCodeService.getUserInviteCode(useInviteCodeUser.getId());
        assertThatNoException().isThrownBy(() -> iUserService.useInviteCodeReward(user.getId(), readyUsedInviteCode));

        // Check whether both parties have received bonus integral
        boolean usedInviteReward = iIntegralService.checkByUserIdAndActionCodes(user.getId(),
                CollectionUtil.newArrayList(IntegralActionCodeConstants.BE_INVITED_TO_REWARD, IntegralActionCodeConstants.OFFICIAL_INVITATION_REWARD));
        assertThat(usedInviteReward).isTrue();

        boolean inviteReward = iIntegralService.checkByUserIdAndActionCodes(useInviteCodeUser.getId(),
                CollectionUtil.newArrayList(IntegralActionCodeConstants.INVITATION_REWARD));
        assertThat(inviteReward).isTrue();


    }
}
