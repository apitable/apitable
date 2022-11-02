package com.vikadata.api.cache.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.UserSpaceRemindRecordService;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.core.constants.RedisConstants;

import org.springframework.data.redis.core.BoundListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserSpaceRemindRecordRedisServiceImpl implements UserSpaceRemindRecordService {

    @Resource
    private RedisTemplate<String, Long> redisTemplate;

    @Resource
    private LimitProperties limitProperties;

    private static final int TIMEOUT = 7;

    @Override
    public List<Long> getRemindUnitIds(Long userId, String spaceId) {
        String key = RedisConstants.getUserSpaceRemindRecordKey(userId, spaceId);
        BoundListOperations<String, Long> opts = redisTemplate.boundListOps(key);
        List<Long> unitIds = opts.range(0, Optional.ofNullable(opts.size()).orElse(1L));
        return CollUtil.sub(CollUtil.distinct(unitIds), 0, limitProperties.getMemberFieldMaxLoadCount());
    }

    @Override
    public void refresh(Long userId, String spaceId, List<Long> unitIds) {
        if (userId == null || StrUtil.isBlank(spaceId) || CollUtil.isEmpty(unitIds)) {
            return;
        }
        String key = RedisConstants.getUserSpaceRemindRecordKey(userId, spaceId);
        BoundListOperations<String, Long> opts = redisTemplate.boundListOps(key);
        for (int i = 0; i < limitProperties.getMemberFieldMaxLoadCount() && i < unitIds.size(); i++) {
            opts.leftPush(unitIds.get(i));
        }
        opts.expire(TIMEOUT, TimeUnit.DAYS);
    }
}
