package com.vikadata.api.shared.cache.service.impl;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.shared.cache.service.SocialAuthInfoCacheService;
import com.vikadata.api.shared.util.RandomExtendUtil;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.core.constants.RedisConstants.USER_AUTH_INFO_TOKEN;

@Service
public class SocialAuthInfoCacheInRedisServiceImpl implements SocialAuthInfoCacheService {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public String saveAuthInfoToCache(SocialAuthInfo authInfo) {
        String token = RandomExtendUtil.randomString(12);
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
        ops.set(JSONUtil.parseObj(authInfo).toString(), 15, TimeUnit.MINUTES);
        return token;
    }

    @Override
    public SocialAuthInfo getAuthInfoFromCache(String token) {
        if (StrUtil.isBlank(token)) {
            return null;
        }
        // get user authorization information from cache
        BoundValueOperations<String, ?> authCache = redisTemplate.boundValueOps(StrUtil.format(USER_AUTH_INFO_TOKEN, token));
        return JSONUtil.parseObj(authCache.get()).toBean(SocialAuthInfo.class);
    }
}
