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

import cn.hutool.core.util.StrUtil;
import com.apitable.core.constants.RedisConstants;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import jakarta.annotation.Resource;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * user active space cache in redis.
 */
@Service
@Slf4j
public class UserActiveSpaceCacheInRedisServiceImpl implements UserActiveSpaceCacheService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private MemberMapper memberMapper;

    private static final int TIMEOUT = 7;

    @Override
    public void save(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts =
            redisTemplate.boundValueOps(RedisConstants.getUserActiveSpaceKey(userId));
        opts.set(spaceId, TIMEOUT, TimeUnit.DAYS);
    }

    @Override
    public String getLastActiveSpace(Long userId) {
        BoundValueOperations<String, String> opts =
            redisTemplate.boundValueOps(RedisConstants.getUserActiveSpaceKey(userId));
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
