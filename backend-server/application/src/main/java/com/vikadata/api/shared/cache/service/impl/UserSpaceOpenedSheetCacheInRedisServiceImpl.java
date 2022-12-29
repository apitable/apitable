package com.vikadata.api.shared.cache.service.impl;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.cache.bean.OpenedSheet;
import com.vikadata.api.shared.cache.service.UserSpaceOpenedSheetCacheService;
import com.vikadata.core.constants.RedisConstants;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserSpaceOpenedSheetCacheInRedisServiceImpl implements UserSpaceOpenedSheetCacheService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    private static final int TIMEOUT = 30;

    @Override
    public OpenedSheet getOpenedSheet(Long userId, String spaceId) {
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId));
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
