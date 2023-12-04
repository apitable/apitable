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

package com.apitable.shared.captcha.email;

import static com.apitable.base.enums.ActionException.EMAIL_SEND_MAX_COUNT_LIMIT;
import static com.apitable.base.enums.ActionException.SMS_SEND_ONLY_ONE_MINUTE;

import cn.hutool.core.lang.Dict;
import com.apitable.base.enums.EmailCodeType;
import com.apitable.core.constants.RedisConstants;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.shared.captcha.AbstractValidateCodeProcessor;
import com.apitable.shared.captcha.ValidateCode;
import com.apitable.shared.captcha.ValidateCodeRepository;
import com.apitable.shared.captcha.ValidateTarget;
import com.apitable.shared.component.notification.NotifyMailFactory;
import com.apitable.shared.config.properties.SecurityProperties;
import com.apitable.shared.util.DateHelper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * <p>
 * email verification code processor.
 * </p>
 *
 * @author Shawn Deng
 */
@Slf4j
@Component
public class EmailValidateCodeProcessor extends AbstractValidateCodeProcessor {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private SecurityProperties properties;

    public EmailValidateCodeProcessor(ValidateCodeRepository validateCodeRepository,
                                      RedisTemplate<String, Object> redisTemplate,
                                      SecurityProperties properties) {
        super(validateCodeRepository, redisTemplate, properties);
    }

    @Override
    protected void send(ValidateCode validateCode, ValidateTarget validateTarget) {
        String target = validateTarget.getTarget();
        log.info("send email verification code");
        HttpServletRequest request = HttpContextUtil.getRequest();
        String ipAddr = HttpContextUtil.getRemoteAddr(request);
        this.checkBeforeSend(target, ipAddr);
        String subject = EmailCodeType.ofName(validateCode.getScope()).getSubject();
        Dict dict = Dict.create();
        dict.set("VERIFICATION_CODE", validateCode.getCode());
        final String lang = validateTarget.getLang();
        NotifyMailFactory.me().sendMail(lang, subject, dict, Collections.singletonList(target));
        // save the total number of sending after sending
        this.saveSendCount(target, ipAddr);
    }

    private void checkBeforeSend(String email, String ipAddr) {
        // email sending frequency
        String sendMailRateKey = RedisConstants.getSendCaptchaRateKey(email);
        // The one-minute limit cannot be obtained again, unless the verification code expires and is automatically deleted
        Integer sendSmsRateCount = (Integer) redisTemplate.opsForValue().get(sendMailRateKey);
        if (sendSmsRateCount != null) {
            log.info(
                "Repeated acquisitions are not allowed within 60 seconds，mail={}，ip address={}",
                email, ipAddr);
            throw new BusinessException(SMS_SEND_ONLY_ONE_MINUTE);
        } else {
            redisTemplate.opsForValue().set(sendMailRateKey, 1, 1, TimeUnit.MINUTES);
        }

        // number of emails sent on the day
        String emailCountKey = RedisConstants.getSendCaptchaCountKey(email, "email");
        // maximum number of emails sent
        Integer mailCount = (Integer) redisTemplate.opsForValue().get(emailCountKey);
        if (mailCount != null && mailCount >= properties.getEmail().getMaxSendCount()) {
            log.error(
                "The maximum number of emails sent by this mailbox today has been reached，email={}",
                email);
            throw new BusinessException(EMAIL_SEND_MAX_COUNT_LIMIT);
        }

        // number of ips sent on the day
        String ipSmsCountKey = RedisConstants.getSendCaptchaCountKey(ipAddr, "ip:email");
        Integer ipSmsCount = (Integer) redisTemplate.opsForValue().get(ipSmsCountKey);
        if (ipSmsCount != null && ipSmsCount >= properties.getEmail().getMaxIpSendCount()) {
            log.error(
                "The maximum number of emails sent by an IP address in one day, email={}，ip address={}",
                email, ipAddr);
            throw new BusinessException(
                "The maximum number of emails sent by an IP address in one day");
        }
    }

    private void saveSendCount(String email, String ipAddr) {
        long second = DateHelper.todayTimeLeft();
        // number of emails sent on the day
        super.accumulate(email, "email", second);
        // number of ips sent on the day
        super.accumulate(ipAddr, "ip:email", second);
    }
}
