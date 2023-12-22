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
import com.apitable.shared.cache.service.CommonCacheService;
import com.apitable.shared.clock.spring.ClockManager;
import jakarta.annotation.Resource;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Common cache service implement.
 * </p>
 *
 * @author Chambers
 */
@Service
public class CommonCacheServiceImpl implements CommonCacheService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    private static final String KEY = "cache:chatbot:{}";

    @Override
    public boolean checkIfSpaceEnabledChatbot(String spaceId) {
        String str = redisTemplate.opsForValue().get(StrUtil.format(KEY, spaceId));
        return str != null;
    }

    @Override
    public void saveSpaceChatbotCache(String spaceId, Integer days) {
        BoundValueOperations<String, String> opts =
            redisTemplate.boundValueOps(StrUtil.format(KEY, spaceId));
        if (days != null) {
            opts.set(ClockManager.me().getLocalDateTimeNow().toString(), days, TimeUnit.DAYS);
            return;
        }
        opts.set(ClockManager.me().getLocalDateTimeNow().toString());
    }

    @Override
    public void delSpaceChatbotCache(String spaceId) {
        redisTemplate.delete(StrUtil.format(KEY, spaceId));
    }
}
