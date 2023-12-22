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

import static com.apitable.core.constants.RedisConstants.USER_AUTH_INFO_TOKEN;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.shared.cache.bean.SocialAuthInfo;
import com.apitable.shared.cache.service.SocialAuthInfoCacheService;
import com.apitable.shared.util.RandomExtendUtil;
import jakarta.annotation.Resource;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * social authorization information cache service implementation.
 */
@Service
public class SocialAuthInfoCacheInRedisServiceImpl implements SocialAuthInfoCacheService {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public String saveAuthInfoToCache(SocialAuthInfo authInfo) {
        String token = RandomExtendUtil.randomString(12);
        BoundValueOperations<String, Object> ops =
            redisTemplate.boundValueOps(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
        ops.set(JSONUtil.parseObj(authInfo).toString(), 15, TimeUnit.MINUTES);
        return token;
    }

    @Override
    public SocialAuthInfo getAuthInfoFromCache(String token) {
        if (StrUtil.isBlank(token)) {
            return null;
        }
        // get user authorization information from cache
        BoundValueOperations<String, ?> authCache =
            redisTemplate.boundValueOps(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
        return JSONUtil.parseObj(authCache.get()).toBean(SocialAuthInfo.class);
    }
}
