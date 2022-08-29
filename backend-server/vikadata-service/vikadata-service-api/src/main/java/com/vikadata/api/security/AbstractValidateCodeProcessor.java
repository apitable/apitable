package com.vikadata.api.security;

import java.util.Date;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;

import com.vikadata.api.config.properties.SecurityProperties;
import com.vikadata.api.enums.exception.ActionException;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.constants.RedisConstants;

import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.RedisTemplate;

import static com.vikadata.api.enums.exception.ActionException.CODE_ERROR;
import static com.vikadata.api.enums.exception.ActionException.CODE_ERROR_OFTEN;
import static com.vikadata.api.enums.exception.ActionException.CODE_EXPIRE;
import static com.vikadata.api.enums.exception.ActionException.SEND_CAPTCHA_TOO_MUSH;

/**
 * <p>
 * 验证码校验处理器
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 14:36
 */
@Slf4j
public abstract class AbstractValidateCodeProcessor implements ValidateCodeProcessor {

    private final ValidateCodeRepository validateCodeRepository;

    private final RedisTemplate<String, Object> redisTemplate;

    private final SecurityProperties properties;

    public AbstractValidateCodeProcessor(ValidateCodeRepository validateCodeRepository, RedisTemplate<String, Object> redisTemplate, SecurityProperties properties) {
        this.validateCodeRepository = validateCodeRepository;
        this.redisTemplate = redisTemplate;
        this.properties = properties;
    }

    @Override
    public String createAndSend(ValidateTarget target, CodeValidateScope scope) {
        return createAndSend(target, scope, true);
    }

    @Override
    public String createAndSend(ValidateTarget validateTarget, CodeValidateScope scope, boolean actual) {
        log.info("创建验证码并发送验证码");
        String target = validateTarget.getRealTarget();
        //检查安全验证码锁，校验错误超过5次锁住20分钟
        this.checkIfSend(target);
        ValidateCodeType codeType = getValidateCodeType();
        int length, effectiveTime, maxErrorNum, lockTime;
        //根据验证码类型创建验证码
        if (codeType.equals(ValidateCodeType.SMS)) {
            length = properties.getSms().getDigit();
            effectiveTime = properties.getSms().getEffectiveTime();
            maxErrorNum = properties.getSms().getMaxErrorNum();
            lockTime = properties.getSms().getLockTime();
        }
        else {
            length = properties.getEmail().getDigit();
            effectiveTime = properties.getEmail().getEffectiveTime();
            maxErrorNum = properties.getEmail().getMaxErrorNum();
            lockTime = properties.getEmail().getLockTime();
        }
        String randomCode = RandomUtil.randomNumbers(length);
        //保存15分钟
        ValidateCode validateCode = new ValidateCode(randomCode, scope.name().toLowerCase(), effectiveTime * 60);
        //发送
        if (actual) {
            this.send(validateCode, validateTarget);
        }
        //存储验证码
        validateCodeRepository.save(codeType.toString().toLowerCase(), validateCode, target, effectiveTime);
        //存储验证码业务类型
        String scopeKey = getScopeKey(codeType.toString().toLowerCase(), target);
        redisTemplate.opsForValue().set(scopeKey, scope.name().toLowerCase(), effectiveTime, TimeUnit.MINUTES);
        //删除校验错误次数
        String validateErrorNumKey = RedisConstants.getCaptchaValidateErrorNumKey(target);
        redisTemplate.delete(validateErrorNumKey);

        //队列记录发送时间，判断在过去的20分钟内是否连续获取5次，达到则锁定20分钟
        String repeatKey = RedisConstants.getSendCaptchaRecordKey(scope.name().toLowerCase(), target);
        BoundSetOperations<String, Object> ops = redisTemplate.boundSetOps(repeatKey);
        Set<Object> set = ops.members();
        int repeatNum = 0;
        if (CollectionUtils.isNotEmpty(set)) {
            for (Object val : set) {
                if (DateUtil.between(DateUtil.date(), (Date) val, DateUnit.MINUTE) < lockTime) {
                    repeatNum++;
                }
            }
        }
        if (repeatNum >= maxErrorNum - 1) {
            String lockedKey = RedisConstants.getLockedKey(target);
            redisTemplate.opsForValue().set(lockedKey, "", lockTime, TimeUnit.MINUTES);
            redisTemplate.delete(repeatKey);
        }
        else {
            ops.add(DateUtil.date());
            ops.expire(lockTime, TimeUnit.MINUTES);
        }
        return validateCode.getCode();
    }

    /**
     * 发送验证码模版方法，由子类实现
     * 1.短信发送
     * 2.邮箱发送
     *
     * @param validateCode 验证码信息
     * @param target       手机号码或邮箱地址
     * @author Shawn Deng
     * @date 2019/12/25 15:52
     */
    protected abstract void send(ValidateCode validateCode, ValidateTarget target);

    /**
     * 校验验证码
     */
    @Override
    public void validate(ValidateTarget validateTarget, String code, boolean immediatelyDelete, CodeValidateScope scope) {
        log.info("安全验证码验证");
        ValidateCodeType codeType = getValidateCodeType();
        String target = validateTarget.getRealTarget();
        //未指定验证码作用域类型时，在缓存中取对象的验证码作用域
        if (scope == null) {
            scope = getScope(codeType, target);
        }

        //获取校验码
        ValidateCode codeInRedis = validateCodeRepository.get(target, codeType, scope.name().toLowerCase());
        if (codeInRedis == null || codeInRedis.isExpired()) {
            if (scope == CodeValidateScope.REGISTER) {
                //登录不成功情况下，可与注册公用验证码
                scope = CodeValidateScope.LOGIN;
                codeInRedis = validateCodeRepository.get(target, codeType, scope.name().toLowerCase());
                if (codeInRedis == null || codeInRedis.isExpired()) {
                    validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
                    throw new BusinessException(CODE_EXPIRE);
                }
            }
            //验证码过期或不存在
            validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
            throw new BusinessException(CODE_EXPIRE);
        }

        if (!StrUtil.equals(codeInRedis.getCode(), code)) {
            int maxErrorNum, lockTime;
            if (codeType.equals(ValidateCodeType.SMS)) {
                maxErrorNum = properties.getSms().getMaxErrorNum();
                lockTime = properties.getSms().getLockTime();
            }
            else {
                maxErrorNum = properties.getEmail().getMaxErrorNum();
                lockTime = properties.getEmail().getLockTime();
            }
            String smsCodeValidateErrorNumKey = RedisConstants.getCaptchaValidateErrorNumKey(target);
            Integer errorNum = (Integer) redisTemplate.opsForValue().get(smsCodeValidateErrorNumKey);
            if (errorNum != null && errorNum >= maxErrorNum) {
                log.info("请求安全校验[{}]校验错误超过5次", target);
                //验证码校验错误超过5次，重新获取
                redisTemplate.delete(smsCodeValidateErrorNumKey);
                validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
                throw new BusinessException(CODE_ERROR_OFTEN);
            }
            else {
                redisTemplate.opsForValue().set(smsCodeValidateErrorNumKey, errorNum == null ? 1 : errorNum + 1, lockTime, TimeUnit.MINUTES);
                //验证码错误
                throw new BusinessException(CODE_ERROR);
            }
        }

        if (immediatelyDelete) {
            validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
            redisTemplate.delete(getScopeKey(codeType.toString().toLowerCase(), target));
        }
        //验证身份成功后，删除目标1分钟不能获取限制
        redisTemplate.delete(RedisConstants.getSendCaptchaRateKey(target));
        redisTemplate.delete(RedisConstants.getSendCaptchaRecordKey(scope.name().toLowerCase(), target));
    }

    @Override
    public void delCode(String target, CodeValidateScope scope) {
        log.info("删除验证码");
        ValidateCodeType codeType = getValidateCodeType();
        //未指定验证码作用域类型时，在缓存中取对象的验证码作用域
        if (scope == null) {
            scope = getScope(codeType, target);
        }
        validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
        redisTemplate.delete(getScopeKey(codeType.toString().toLowerCase(), target));
    }

    @Override
    public void savePassRecord(String target) {
        log.info("保存验证通过记录");
        String successKey = RedisConstants.getCaptchaValidateSuccessKey(target);
        redisTemplate.opsForValue().set(successKey, "", properties.getSms().getSuccessTime(), TimeUnit.MINUTES);
    }

    @Override
    public void verifyIsPass(String target) {
        log.info("验证是否已通过验证码校验");
        String successKey = RedisConstants.getCaptchaValidateSuccessKey(target);
        Object pass = redisTemplate.opsForValue().get(successKey);
        ExceptionUtil.isNotNull(pass, ActionException.NOT_PASS);
    }


    /**
     * 获取当前验证码类型
     */
    private ValidateCodeType getValidateCodeType() {
        String type = StrUtil.subBefore(getClass().getSimpleName(), "ValidateCodeProcessor", true);
        return ValidateCodeType.valueOf(type.toUpperCase());
    }

    private CodeValidateScope getScope(ValidateCodeType type, String target) {
        String scopeKey = getScopeKey(type.toString().toLowerCase(), target);
        Object value = redisTemplate.opsForValue().get(scopeKey);
        ExceptionUtil.isNotNull(value, CODE_EXPIRE);
        return CodeValidateScope.fromName(StrUtil.toString(value));
    }

    private String getScopeKey(String type, String identify) {
        //存储结构：vikadata:captcha:验证码类型:scope:发送对象（手机或者邮箱）
        return RedisConstants.getCaptchaScopeKey(type, identify);
    }

    /**
     * 检查是否被锁
     *
     * @param target 手机号码或邮箱
     */
    private void checkIfSend(String target) {
        log.info("检查是否被锁");
        //存储结构：vikadata:captcha:lock:发送对象（手机或者邮箱）
        String lockedKey = RedisConstants.getLockedKey(target);
        Object value = redisTemplate.opsForValue().get(lockedKey);
        if (ObjectUtil.isNotNull(value)) {
            throw new BusinessException(SEND_CAPTCHA_TOO_MUSH);
        }
    }

    /**
     * 累加发送次数
     */
    protected void accumulate(String target, String type, long second) {
        String countKey = RedisConstants.getSendCaptchaCountKey(target, type);
        //已发送数
        Integer count = (Integer) redisTemplate.opsForValue().get(countKey);
        //叠加计算发送次数
        redisTemplate.opsForValue().set(countKey, count == null ? 1 : count + 1, second, TimeUnit.SECONDS);
    }
}
