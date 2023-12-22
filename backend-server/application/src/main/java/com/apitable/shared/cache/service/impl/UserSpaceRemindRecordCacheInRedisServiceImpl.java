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

package com.apitable.shared.cache.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.constants.RedisConstants;
import com.apitable.shared.cache.service.UserSpaceRemindRecordCacheService;
import com.apitable.shared.config.properties.LimitProperties;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * user space remind record cache in redis service implementation.
 */
@Slf4j
@Service
public class UserSpaceRemindRecordCacheInRedisServiceImpl
    implements UserSpaceRemindRecordCacheService {

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
        return CollUtil.sub(CollUtil.distinct(unitIds), 0,
            limitProperties.getMemberFieldMaxLoadCount());
    }

    @Override
    public void refresh(Long userId, String spaceId, List<Long> unitIds) {
        if (userId == null || StrUtil.isBlank(spaceId) || CollUtil.isEmpty(unitIds)) {
            return;
        }
        String key = RedisConstants.getUserSpaceRemindRecordKey(userId, spaceId);
        BoundListOperations<String, Long> opts = redisTemplate.boundListOps(key);
        for (int i = 0; i < limitProperties.getMemberFieldMaxLoadCount() && i < unitIds.size();
             i++) {
            opts.leftPush(unitIds.get(i));
        }
        opts.expire(TIMEOUT, TimeUnit.DAYS);
    }
}
