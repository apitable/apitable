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

package com.apitable.shared.captcha.sms;

import static com.apitable.base.enums.ActionException.MOBILE_SEND_MAX_COUNT_LIMIT;
import static com.apitable.base.enums.ActionException.SMS_SEND_ONLY_ONE_MINUTE;

import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.SmsCodeType;
import com.apitable.core.constants.RedisConstants;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.shared.captcha.AbstractValidateCodeProcessor;
import com.apitable.shared.captcha.CodeValidateScope;
import com.apitable.shared.captcha.ValidateCode;
import com.apitable.shared.captcha.ValidateCodeRepository;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.component.notification.NotifyMailFactory;
import com.apitable.shared.config.properties.SecurityProperties;
import com.apitable.shared.util.DateHelper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Mobile phone SMS verification code processor.
 * </p>
 *
 * @author Shawn Deng
 */
@Component
@Slf4j
public class SmsValidateCodeProcessor extends AbstractValidateCodeProcessor {

    @Resource
    private ISmsService iSmsService;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private SecurityProperties properties;

    public SmsValidateCodeProcessor(ValidateCodeRepository validateCodeRepository,
                                    RedisTemplate<String, Object> redisTemplate,
                                    SecurityProperties properties) {
        super(validateCodeRepository, redisTemplate, properties);
    }

    @Override
    protected void send(ValidateCode validateCode, ValidateTarget validateTarget) {
        String target = validateTarget.getRealTarget();
        // Send verification code SMS can only be sent by user request
        HttpServletRequest request = HttpContextUtil.getRequest();
        String ipAddr = HttpContextUtil.getRemoteAddr(request);
        // Unified processing of SMS traffic to prevent swiping SMS messages
        this.checkBeforeSend(target, ipAddr);
        CodeValidateScope scope = CodeValidateScope.fromName(validateCode.getScope());
        SmsCodeType type = SmsCodeType.ofName(scope.name());
        try {
            iSmsService.sendValidateCode(validateTarget, validateCode.getCode(), type);
        } catch (Exception e) {
            NotifyMailFactory.me().notify("Fail to send sms",
                StrUtil.format("phone number：{}，error message：{}", target, e.getMessage()));
            throw new BusinessException("fail to send sms");
        }
        this.saveSendCount(target, ipAddr);
    }

    /**
     * Handling SMS traffic.
     *
     * @param mobile phone number
     * @param ipAddr IP address
     */
    private void checkBeforeSend(String mobile, String ipAddr) {
        // The number of mobile phones sent on the day
        String mobileSmsCountKey = RedisConstants.getSendCaptchaCountKey(mobile, "mobile");
        // Number of IPs sent on the day
        String ipSmsCountKey = RedisConstants.getSendCaptchaCountKey(ipAddr, "ip:mobile");
        // mobile phone frequency
        String sendSmsRateKey = RedisConstants.getSendCaptchaRateKey(mobile);

        // The one-minute limit cannot be obtained again, unless the verification code expires and is automatically deleted
        Integer sendSmsRateCount = (Integer) redisTemplate.opsForValue().get(sendSmsRateKey);
        if (sendSmsRateCount != null) {
            log.info(
                "Repeated acquisitions are not allowed within 60 seconds，IP address={}, phone number={}",
                ipAddr, mobile);
            throw new BusinessException(SMS_SEND_ONLY_ONE_MINUTE);
        } else {
            // Lock for 1 minute not to send
            redisTemplate.opsForValue().set(sendSmsRateKey, 1, 1, TimeUnit.MINUTES);
        }

        // The maximum number of SMS messages sent by the mobile phone in one day
        Integer mobileSmsCount = (Integer) redisTemplate.opsForValue().get(mobileSmsCountKey);
        if (mobileSmsCount != null && mobileSmsCount >= properties.getSms().getMaxSendCount()) {
            log.error(
                "The maximum number of SMS messages sent by the mobile phone in one day，IP address={}, phone number={}",
                ipAddr, mobile);
            throw new BusinessException(MOBILE_SEND_MAX_COUNT_LIMIT);
        }

        Integer ipSmsCount = (Integer) redisTemplate.opsForValue().get(ipSmsCountKey);
        if (ipSmsCount != null && ipSmsCount >= properties.getSms().getMaxIpSendCount()) {
            log.error(
                "The maximum number of SMS messages sent by an IP address in one day, ip={}, phone={}",
                ipAddr, mobile);
            throw new BusinessException(
                "The maximum number of SMS messages sent by an IP address in one day");
        }

        // The number of all mobile phones sent on the day
        String totalSmsCountKey = RedisConstants.getSendCaptchaCountKey("total", "mobile");
        Integer totalSmsCount = (Integer) redisTemplate.opsForValue().get(totalSmsCountKey);
        if (totalSmsCount != null) {
            if (totalSmsCount >= properties.getSms().getMaxDaySendCount()) {
                log.error(
                    "The maximum number of text messages sent in one day, ip address={}, phone={}",
                    ipAddr, mobile);
                throw new BusinessException("The maximum number of text messages sent in one day");
            }
            int count = properties.getSms().getMaxDaySendCount() * 9 / 10;
            if (totalSmsCount == count) {
                NotifyMailFactory.me()
                    .notify("Alarm on the upper limit of the number of SMS sent in the day",
                        "The number of sending has reached 90% of the upper limit, please note！");
            }
        }
    }

    /**
     * After the transmission is completed, save the number of transmissions and establish a threshold.
     *
     * @param mobile mobile phone
     * @param ipAddr IP address
     */
    private void saveSendCount(String mobile, String ipAddr) {
        long second = DateHelper.todayTimeLeft();
        // the number of mobile phones sent on the day
        super.accumulate(mobile, "mobile", second);
        // number of ips sent on the day
        super.accumulate(ipAddr, "ip:mobile", second);
        // the number of all mobile phones sent on the day
        super.accumulate("total", "mobile", second);
    }
}
