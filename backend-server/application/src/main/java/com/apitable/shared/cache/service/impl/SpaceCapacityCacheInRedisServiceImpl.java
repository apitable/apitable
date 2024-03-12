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

import static com.apitable.core.constants.RedisConstants.GENERAL_STATICS;

import cn.hutool.core.util.StrUtil;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.space.mapper.SpaceAssetMapper;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * space capacity cache in redis.
 */
@Slf4j
@Service
public class SpaceCapacityCacheInRedisServiceImpl implements SpaceCapacityCacheService {

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private RedisTemplate<String, Number> redisTemplate;

    private static final int TIMEOUT = 30;

    @Override
    public long getSpaceCapacity(String spaceId) {
        String key = StrUtil.format(GENERAL_STATICS, "space:capacity", spaceId);
        Number number = redisTemplate.opsForValue().get(key);
        if (number != null) {
            return number.longValue();
        }
        List<Integer> fileSizes = spaceAssetMapper.selectFileSizeBySpaceId(spaceId);
        long statics =
            fileSizes.stream().filter(Objects::nonNull).mapToLong(Integer::intValue).sum();
        redisTemplate.opsForValue().set(key, statics, TIMEOUT, TimeUnit.MINUTES);
        return statics;
    }

    @Override
    public void del(String spaceId) {
        String key = StrUtil.format(GENERAL_STATICS, "space:capacity", spaceId);
        redisTemplate.delete(key);
    }

}
