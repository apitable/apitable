package com.vikadata.api.helper;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * <p>
 * RedisLockHelper
 * </p>
 *
 * @author Chambers
 * @date 2021/7/16
 */
@Component
public class RedisLockHelper {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    public static RedisLockHelper me() {
        return SpringContextHolder.getBean(RedisLockHelper.class);
    }

    public void preventDuplicateRequests(String key) {
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(key);
        if (ObjectUtil.isNotNull(ops.get())) {
            throw new BusinessException("重复请求");
        }
        ops.set("", 1, TimeUnit.HOURS);
    }
}
