package com.vikadata.api.modular.user.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.constants.IntegralActionCodeConstants;
import com.vikadata.entity.UserEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;

/**
 * 用户服务测试
 * @author Shawn Deng
 * @date 2022-04-11 19:08:32
 */
public class UserServiceImplTest extends AbstractIntegrationTest {

    @Test
    public void testUseInviteReward() {
        // 准备用户
        UserEntity user = iUserService.createUserByEmail("test@vikadata.com");
        // 被使用邀请码的用户
        UserEntity useInviteCodeUser = iUserService.createUserByEmail("test1@vikadata.com");
        String readyUsedInviteCode = ivCodeService.getUserInviteCode(useInviteCodeUser.getId());
        assertThatNoException().isThrownBy(() -> iUserService.useInviteCodeReward(user.getId(), readyUsedInviteCode));

        // 检查是否两方都收到积分奖励
        boolean usedInviteReward = iIntegralService.checkByUserIdAndActionCodes(user.getId(),
                CollectionUtil.newArrayList(IntegralActionCodeConstants.BE_INVITED_TO_REWARD, IntegralActionCodeConstants.OFFICIAL_INVITATION_REWARD));
        assertThat(usedInviteReward).isTrue();

        boolean inviteReward = iIntegralService.checkByUserIdAndActionCodes(useInviteCodeUser.getId(),
                CollectionUtil.newArrayList(IntegralActionCodeConstants.INVITATION_REWARD));
        assertThat(inviteReward).isTrue();


    }
}
