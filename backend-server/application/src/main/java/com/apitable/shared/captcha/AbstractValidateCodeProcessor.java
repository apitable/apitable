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

package com.apitable.shared.captcha;

import static com.apitable.base.enums.ActionException.CODE_ERROR;
import static com.apitable.base.enums.ActionException.CODE_ERROR_OFTEN;
import static com.apitable.base.enums.ActionException.CODE_EXPIRE;
import static com.apitable.base.enums.ActionException.SEND_CAPTCHA_TOO_MUSH;

import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.ActionException;
import com.apitable.core.constants.RedisConstants;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.config.properties.SecurityProperties;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.RedisTemplate;


/**
 * <p>
 * verification code validation processor.
 * </p>
 *
 * @author Shawn Deng
 */
@Slf4j
public abstract class AbstractValidateCodeProcessor implements ValidateCodeProcessor {

    private final ValidateCodeRepository validateCodeRepository;

    private final RedisTemplate<String, Object> redisTemplate;

    private final SecurityProperties properties;

    /**
     * constructor.
     *
     * @param validateCodeRepository validateCodeRepository
     * @param redisTemplate          redisTemplate
     * @param properties             properties
     */
    public AbstractValidateCodeProcessor(ValidateCodeRepository validateCodeRepository,
                                         RedisTemplate<String, Object> redisTemplate,
                                         SecurityProperties properties) {
        this.validateCodeRepository = validateCodeRepository;
        this.redisTemplate = redisTemplate;
        this.properties = properties;
    }

    @Override
    public String createAndSend(ValidateTarget target, CodeValidateScope scope) {
        return createAndSend(target, scope, true);
    }

    @Override
    public String createAndSend(ValidateTarget validateTarget, CodeValidateScope scope,
                                boolean actual) {
        String target = validateTarget.getRealTarget();
        // Check the security verification code lock, if the verification error exceeds 5 times, the lock will be locked for 20 minutes
        this.checkIfSend(target);
        ValidateCodeType codeType = getValidateCodeType();
        int length;
        int effectiveTime;
        int maxErrorNum;
        int lockTime;
        // create captcha based on captcha type
        if (codeType.equals(ValidateCodeType.SMS)) {
            length = properties.getSms().getDigit();
            effectiveTime = properties.getSms().getEffectiveTime();
            maxErrorNum = properties.getSms().getMaxErrorNum();
            lockTime = properties.getSms().getLockTime();
        } else {
            length = properties.getEmail().getDigit();
            effectiveTime = properties.getEmail().getEffectiveTime();
            maxErrorNum = properties.getEmail().getMaxErrorNum();
            lockTime = properties.getEmail().getLockTime();
        }
        String randomCode = RandomUtil.randomNumbers(length);
        ValidateCode validateCode =
            new ValidateCode(randomCode, scope.name().toLowerCase(), effectiveTime * 60);
        if (actual) {
            this.send(validateCode, validateTarget);
        }
        validateCodeRepository.save(codeType.toString().toLowerCase(), validateCode, target,
            effectiveTime);
        String scopeKey = getScopeKey(codeType.toString().toLowerCase(), target);
        redisTemplate.opsForValue()
            .set(scopeKey, scope.name().toLowerCase(), effectiveTime, TimeUnit.MINUTES);
        // Delete checksum errors
        String validateErrorNumKey = RedisConstants.getCaptchaValidateErrorNumKey(target);
        redisTemplate.delete(validateErrorNumKey);

        // The queue records the sending time, and determines whether it has been obtained 5 times in a row in the past 20 minutes,
        // and if it reaches it, it will be locked for 20 minutes.
        String repeatKey =
            RedisConstants.getSendCaptchaRecordKey(scope.name().toLowerCase(), target);
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
        } else {
            ops.add(DateUtil.date());
            ops.expire(lockTime, TimeUnit.MINUTES);
        }
        return validateCode.getCode();
    }

    /**
     * send verification code.
     *
     * @param validateCode verification code
     * @param target       phone or email
     */
    protected abstract void send(ValidateCode validateCode, ValidateTarget target);

    /**
     * validate.
     */
    @Override
    public void validate(ValidateTarget validateTarget, String code, boolean immediatelyDelete,
                         CodeValidateScope scope) {
        ValidateCodeType codeType = getValidateCodeType();
        String target = validateTarget.getRealTarget();
        // When the verification code scope type is not specified, the verification code scope of the object is retrieved from the cache
        if (scope == null) {
            scope = getScope(codeType, target);
        }

        ValidateCode codeInRedis =
            validateCodeRepository.get(target, codeType, scope.name().toLowerCase());
        if (codeInRedis == null || codeInRedis.isExpired()) {
            if (scope == CodeValidateScope.REGISTER) {
                // If the login is unsuccessful, you can share the verification code with the registration
                scope = CodeValidateScope.LOGIN;
                codeInRedis =
                    validateCodeRepository.get(target, codeType, scope.name().toLowerCase());
                if (codeInRedis == null || codeInRedis.isExpired()) {
                    validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
                    throw new BusinessException(CODE_EXPIRE);
                }
            }
            // Verification code expired or does not exis
            validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
            throw new BusinessException(CODE_EXPIRE);
        }

        if (!StrUtil.equals(codeInRedis.getCode(), code)) {
            int maxErrorNum;
            int lockTime;
            if (codeType.equals(ValidateCodeType.SMS)) {
                maxErrorNum = properties.getSms().getMaxErrorNum();
                lockTime = properties.getSms().getLockTime();
            } else {
                maxErrorNum = properties.getEmail().getMaxErrorNum();
                lockTime = properties.getEmail().getLockTime();
            }
            String smsCodeValidateErrorNumKey =
                RedisConstants.getCaptchaValidateErrorNumKey(target);
            Integer errorNum =
                (Integer) redisTemplate.opsForValue().get(smsCodeValidateErrorNumKey);
            if (errorNum != null && errorNum >= maxErrorNum) {
                // The verification code verification error exceeds 5 times, get it again
                redisTemplate.delete(smsCodeValidateErrorNumKey);
                validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
                throw new BusinessException(CODE_ERROR_OFTEN);
            } else {
                redisTemplate.opsForValue()
                    .set(smsCodeValidateErrorNumKey, errorNum == null ? 1 : errorNum + 1, lockTime,
                        TimeUnit.MINUTES);
                // Verification code error
                throw new BusinessException(CODE_ERROR);
            }
        }

        if (immediatelyDelete) {
            validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
            redisTemplate.delete(getScopeKey(codeType.toString().toLowerCase(), target));
        }
        // After the identity verification is successful, delete the target and cannot get the limit for 1 minute
        redisTemplate.delete(RedisConstants.getSendCaptchaRateKey(target));
        redisTemplate.delete(
            RedisConstants.getSendCaptchaRecordKey(scope.name().toLowerCase(), target));
    }

    @Override
    public void delCode(String target, CodeValidateScope scope) {
        ValidateCodeType codeType = getValidateCodeType();
        // When the verification code scope type is not specified,
        // the verification code scope of the object is retrieved from the cache
        if (scope == null) {
            scope = getScope(codeType, target);
        }
        validateCodeRepository.remove(target, codeType, scope.name().toLowerCase());
        redisTemplate.delete(getScopeKey(codeType.toString().toLowerCase(), target));
    }

    @Override
    public void savePassRecord(String target) {
        String successKey = RedisConstants.getCaptchaValidateSuccessKey(target);
        redisTemplate.opsForValue()
            .set(successKey, "", properties.getSms().getSuccessTime(), TimeUnit.MINUTES);
    }

    @Override
    public void verifyIsPass(String target) {
        String successKey = RedisConstants.getCaptchaValidateSuccessKey(target);
        Object pass = redisTemplate.opsForValue().get(successKey);
        ExceptionUtil.isNotNull(pass, ActionException.NOT_PASS);
    }

    /**
     * Get the current verification code type.
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
        return RedisConstants.getCaptchaScopeKey(type, identify);
    }

    /**
     * Check if locked.
     *
     * @param target phone or email
     */
    private void checkIfSend(String target) {
        String lockedKey = RedisConstants.getLockedKey(target);
        Object value = redisTemplate.opsForValue().get(lockedKey);
        if (ObjectUtil.isNotNull(value)) {
            throw new BusinessException(SEND_CAPTCHA_TOO_MUSH);
        }
    }

    protected void accumulate(String target, String type, long second) {
        String countKey = RedisConstants.getSendCaptchaCountKey(target, type);
        Integer count = (Integer) redisTemplate.opsForValue().get(countKey);
        redisTemplate.opsForValue()
            .set(countKey, count == null ? 1 : count + 1, second, TimeUnit.SECONDS);
    }
}
