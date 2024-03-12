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
import cn.hutool.json.JSONUtil;
import com.apitable.shared.cache.bean.SpaceAssetDTO;
import com.apitable.shared.cache.service.AssetCacheService;
import jakarta.annotation.Resource;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * asset cache in redis service implement.
 */
@Service
public class AssetCacheInRedisServiceImpl implements AssetCacheService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    private static final String ASSET_CACHE = "asset:{}";

    @Override
    public SpaceAssetDTO getSpaceAssetDTO(String key) {
        String str = redisTemplate.opsForValue().get(StrUtil.format(ASSET_CACHE, key));
        if (str != null) {
            return JSONUtil.toBean(str, SpaceAssetDTO.class);
        }
        return null;
    }

    @Override
    public void save(String key, SpaceAssetDTO spaceAssetDTO, int expireSecond) {
        redisTemplate.opsForValue()
            .set(StrUtil.format(ASSET_CACHE, key), JSONUtil.toJsonStr(spaceAssetDTO), expireSecond,
                TimeUnit.SECONDS);
    }
}
