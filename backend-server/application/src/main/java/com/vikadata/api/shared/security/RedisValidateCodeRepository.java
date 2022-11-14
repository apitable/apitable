package com.vikadata.api.shared.security;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.core.constants.RedisConstants;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * <p>
 * The verification code accessor based on Redis storage avoids the problem that the verification code cannot be accessed due to no session
 * </p>
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class RedisValidateCodeRepository implements ValidateCodeRepository {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Override
    public void save(String type, ValidateCode code, String target, int effectiveTime) {
        String key = getSaveKey(type, code.getScope(), target);
        redisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(code), effectiveTime, TimeUnit.MINUTES);
    }

    @Override
    public ValidateCode get(String target, ValidateCodeType type, String scope) {
        String key = getSaveKey(type.toString().toLowerCase(), scope, target);
        String str = redisTemplate.opsForValue().get(key);
        if (str == null) {
            return null;
        }
        return JSONUtil.toBean(str, ValidateCode.class);
    }

    @Override
    public void remove(String target, ValidateCodeType type, String scope) {
        String key = getSaveKey(type.toString().toLowerCase(), scope, target);
        redisTemplate.delete(key);
    }

    private String getSaveKey(String type, String scope, String identify) {
        return RedisConstants.getCaptchaKey(type, scope, identify);
    }
}
