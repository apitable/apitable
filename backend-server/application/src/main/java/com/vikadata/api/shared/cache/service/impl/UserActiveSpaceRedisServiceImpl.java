package com.vikadata.api.shared.cache.service.impl;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.cache.service.UserActiveSpaceService;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.core.constants.RedisConstants;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserActiveSpaceRedisServiceImpl implements UserActiveSpaceService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private MemberMapper memberMapper;

    private static final int TIMEOUT = 7;

    @Override
    public void save(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserActiveSpaceKey(userId));
        opts.set(spaceId, TIMEOUT, TimeUnit.DAYS);
    }

    @Override
    public String getLastActiveSpace(Long userId) {
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserActiveSpaceKey(userId));
        String spaceId = opts.get();
        if (StrUtil.isBlank(spaceId)) {
            spaceId = memberMapper.selectActiveSpaceByUserId(userId);
            if (StrUtil.isBlank(spaceId)) {
                spaceId = memberMapper.getFirstSpaceIdByUserId(userId);
            }
        }
        return spaceId;
    }

    @Override
    public void delete(Long userId) {
        redisTemplate.delete(RedisConstants.getUserActiveSpaceKey(userId));
    }
}
