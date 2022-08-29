package com.vikadata.api.modular.space.service.impl;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.SpaceEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.TimeUnit;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     工作空间-公开邀请链接测试
 * </p>
 *
 * @author liuzijing
 * @date 2022/8/26
 */
public class SpaceInviteLinkServiceImplTest extends AbstractIntegrationTest {

    @Autowired
    private SpaceMapper spaceMapper;

    @Autowired
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Test
    public void testCheckIsNewUserRewardCapacity(){
        Long userId = 123L;
        String spaceId = "spa123";
        String userName = "测试用户";
        SpaceEntity space = SpaceEntity.builder()
            .id(IdWorker.getId())
            .spaceId(spaceId)
            .name("测试空间站")
            .build();
        spaceMapper.insert(space);
        // 添加缓存
        String key = RedisConstants.getUserInvitedJoinSpaceKey(userId, spaceId);
        redisTemplate.opsForValue().set(key, userId, 5, TimeUnit.MINUTES);
        // 判断是否是新用户加入空加入空间站，并发放附件容量奖励
        iSpaceInviteLinkService.checkIsNewUserRewardCapacity(userId, userName, spaceId);
        // 查询奖励附件容量
        Long number = iSpaceSubscriptionService.getSpaceUnExpireGiftCapacity(spaceId);
        assertThat(number).isEqualTo(314572800);
    }
}
