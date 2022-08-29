package com.vikadata.api.cache.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.vikadata.api.cache.service.UserSpaceRemindRecordService;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.define.constants.RedisConstants;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 用户在空间内最近提及的成员记录缓存 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/27
 */
@Slf4j
@Service
public class UserSpaceRemindRecordRedisServiceImpl implements UserSpaceRemindRecordService {

    @Resource
    private RedisTemplate<String, Long> redisTemplate;

    @Resource
    private LimitProperties limitProperties;

    /**
     * 存储时间，单位：天
     */
    private static final int TIMEOUT = 7;

    @Override
    public List<Long> getRemindUnitIds(Long userId, String spaceId) {
        log.info("获取用户指定空间最近提及的组织单元ID列表");
        String key = RedisConstants.getUserSpaceRemindRecordKey(userId, spaceId);
        BoundListOperations<String, Long> opts = redisTemplate.boundListOps(key);
        List<Long> unitIds = opts.range(0, Optional.ofNullable(opts.size()).orElse(1L));
        return CollUtil.sub(CollUtil.distinct(unitIds), 0, limitProperties.getMemberFieldMaxLoadCount());
    }

    @Override
    public void refresh(Long userId, String spaceId, List<Long> unitIds) {
        log.info("刷新提及的成员记录缓存，顺延7天保存");
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
