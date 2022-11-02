package com.vikadata.api.security.email;

import java.time.LocalDate;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.lang.Dict;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.action.EmailCodeType;
import com.vikadata.api.component.notification.NotifyMailFactory;
import com.vikadata.api.security.AbstractValidateCodeProcessor;
import com.vikadata.api.security.ValidateCode;
import com.vikadata.api.security.ValidateCodeRepository;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.api.util.DateHelper;
import com.vikadata.api.config.properties.SecurityProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.core.constants.RedisConstants;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import static com.vikadata.api.enums.exception.ActionException.EMAIL_SEND_MAX_COUNT_LIMIT;
import static com.vikadata.api.enums.exception.ActionException.SMS_SEND_ONLY_ONE_MINUTE;

/**
 * <p>
 * email verification code processor
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

    public EmailValidateCodeProcessor(ValidateCodeRepository validateCodeRepository, RedisTemplate<String, Object> redisTemplate, SecurityProperties properties) {
        super(validateCodeRepository, redisTemplate, properties);
    }

    @Override
    protected void send(ValidateCode validateCode, ValidateTarget validateTarget) {
        String target = validateTarget.getTarget();
        log.info("send email verification code");
        HttpServletRequest request = HttpContextUtil.getRequest();
        String ipAddr = HttpContextUtil.getRemoteAddr(request);
        this.checkBeforeSend(target, ipAddr);
        try {
            String subject = EmailCodeType.ofName(validateCode.getScope()).getSubject();
            Dict dict = Dict.create();
            dict.set("VERIFICATION_CODE", validateCode.getCode());
            dict.set("YEARS", LocalDate.now().getYear());
            final String lang = validateTarget.getLang();
            NotifyMailFactory.me().sendMail(lang, subject, dict, Collections.singletonList(target));
            // save the total number of sending after sending
            this.saveSendCount(target, ipAddr);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("send email error email:{}, reason：{}", target, e.getMessage());
            throw new BusinessException("failed to send email");
        }
    }

    private void checkBeforeSend(String email, String ipAddr) {
        // email sending frequency
        String sendMailRateKey = RedisConstants.getSendCaptchaRateKey(email);
        // The one-minute limit cannot be obtained again, unless the verification code expires and is automatically deleted
        Integer sendSmsRateCount = (Integer) redisTemplate.opsForValue().get(sendMailRateKey);
        if (sendSmsRateCount != null) {
            log.info("Repeated acquisitions are not allowed within 60 seconds，mail={}，ip address={}", email, ipAddr);
            throw new BusinessException(SMS_SEND_ONLY_ONE_MINUTE);
        } else {
            redisTemplate.opsForValue().set(sendMailRateKey, 1, 1, TimeUnit.MINUTES);
        }

        // number of emails sent on the day
        String emailCountKey = RedisConstants.getSendCaptchaCountKey(email, "email");
        // maximum number of emails sent
        Integer mailCount = (Integer) redisTemplate.opsForValue().get(emailCountKey);
        if (mailCount != null && mailCount >= properties.getEmail().getMaxSendCount()) {
            log.error("The maximum number of emails sent by this mailbox today has been reached，email={}", email);
            throw new BusinessException(EMAIL_SEND_MAX_COUNT_LIMIT);
        }

        // number of ips sent on the day
        String ipSmsCountKey = RedisConstants.getSendCaptchaCountKey(ipAddr, "ip:email");
        Integer ipSmsCount = (Integer) redisTemplate.opsForValue().get(ipSmsCountKey);
        if (ipSmsCount != null && ipSmsCount >= properties.getEmail().getMaxIpSendCount()) {
            log.error("The maximum number of emails sent by an IP address in one day, email={}，ip address={}", email, ipAddr);
            throw new BusinessException("The maximum number of emails sent by an IP address in one day");
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
