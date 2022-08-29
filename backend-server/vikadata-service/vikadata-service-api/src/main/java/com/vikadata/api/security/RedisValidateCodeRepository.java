package com.vikadata.api.security;

import cn.hutool.json.JSONUtil;
import com.vikadata.define.constants.RedisConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 基于Redis存储的验证码存取器，避免由于没有session导致无法存取验证码的问题
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 14:45
 */
@Service
@Slf4j
public class RedisValidateCodeRepository implements ValidateCodeRepository {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Override
    public void save(String type, ValidateCode code, String target, int effectiveTime) {
        log.info("存储验证码");
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
        //存储结构：vikadata:code:验证码类型:验证码作用域:发送对象（手机或者邮箱）
        return RedisConstants.getCaptchaKey(type, scope, identify);
    }
}
