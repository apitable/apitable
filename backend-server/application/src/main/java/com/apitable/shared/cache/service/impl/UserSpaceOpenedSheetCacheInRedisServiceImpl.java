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

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.core.constants.RedisConstants;
import com.apitable.shared.cache.bean.OpenedSheet;
import com.apitable.shared.cache.service.UserSpaceOpenedSheetCacheService;
import jakarta.annotation.Resource;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * user space opened sheet cache in redis service implementation.
 */
@Slf4j
@Service
public class UserSpaceOpenedSheetCacheInRedisServiceImpl
    implements UserSpaceOpenedSheetCacheService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    private static final int TIMEOUT = 30;

    @Override
    public OpenedSheet getOpenedSheet(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts =
            redisTemplate.boundValueOps(RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId));
        String str = opts.get();
        if (str != null) {
            return JSONUtil.toBean(str, OpenedSheet.class);
        }
        return null;
    }

    @Override
    public void refresh(Long userId, String spaceId, OpenedSheet openedSheet) {
        String key = RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId);
        if (ObjectUtil.isNotNull(openedSheet) && StrUtil.isNotBlank(openedSheet.getNodeId())) {
            BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(key);
            opts.set(JSONUtil.toJsonStr(openedSheet), TIMEOUT, TimeUnit.DAYS);
        } else {
            redisTemplate.delete(key);
        }
    }

    @Override
    public void delete(Long userId, String spaceId) {
        redisTemplate.delete(RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId));
    }
}
