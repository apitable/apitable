package com.vikadata.api.cache.service.impl;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.cache.bean.SpaceAssetDTO;
import com.vikadata.api.cache.service.AssetCacheService;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class AssetCacheServiceImpl implements AssetCacheService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    private static final String ASSET_CACHE = "vikadata:asset:{}";

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
        redisTemplate.opsForValue().set(StrUtil.format(ASSET_CACHE, key), JSONUtil.toJsonStr(spaceAssetDTO), expireSecond, TimeUnit.SECONDS);
    }
}
