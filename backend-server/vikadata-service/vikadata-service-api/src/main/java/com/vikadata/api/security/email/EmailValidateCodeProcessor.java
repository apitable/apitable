package com.vikadata.api.security.email;

import java.time.LocalDate;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.lang.Dict;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.action.EmailCodeType;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.security.AbstractValidateCodeProcessor;
import com.vikadata.api.security.ValidateCode;
import com.vikadata.api.security.ValidateCodeRepository;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.api.util.DateTool;
import com.vikadata.api.config.properties.SecurityProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.define.constants.RedisConstants;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import static com.vikadata.api.enums.exception.ActionException.EMAIL_SEND_MAX_COUNT_LIMIT;
import static com.vikadata.api.enums.exception.ActionException.SMS_SEND_ONLY_ONE_MINUTE;

/**
 * <p>
 * 邮箱验证码处理器
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/26 15:17
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
        log.info("发送邮箱验证码");
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
            //发送完成后保存发送总数
            this.saveSendCount(target, ipAddr);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("发送邮箱错误,邮箱:{}, 原因：{}", target, e.getMessage());
            throw new BusinessException("发送邮箱失败");
        }
    }

    /**
     * 校验处理
     */
    private void checkBeforeSend(String email, String ipAddr) {
        log.info("发送邮件校验处理");
        //邮件发送频率
        String sendMailRateKey = RedisConstants.getSendCaptchaRateKey(email);
        //一分钟限制不能再次获取，除非验证码过期自动删除
        Integer sendSmsRateCount = (Integer) redisTemplate.opsForValue().get(sendMailRateKey);
        if (sendSmsRateCount != null) {
            log.info("60秒内不允许重复获取，邮箱={}，IP地址={}", email, ipAddr);
            throw new BusinessException(SMS_SEND_ONLY_ONE_MINUTE);
        } else {
            redisTemplate.opsForValue().set(sendMailRateKey, 1, 1, TimeUnit.MINUTES);
        }

        //邮箱当天发送数量
        String emailCountKey = RedisConstants.getSendCaptchaCountKey(email, "email");
        //邮件发送数上限
        Integer mailCount = (Integer) redisTemplate.opsForValue().get(emailCountKey);
        if (mailCount != null && mailCount >= properties.getEmail().getMaxSendCount()) {
            log.error("该邮箱今天邮件发送数已到达上限，邮箱={}", email);
            throw new BusinessException(EMAIL_SEND_MAX_COUNT_LIMIT);
        }

        //IP当天发送数量
        String ipSmsCountKey = RedisConstants.getSendCaptchaCountKey(ipAddr, "ip:email");
        Integer ipSmsCount = (Integer) redisTemplate.opsForValue().get(ipSmsCountKey);
        if (ipSmsCount != null && ipSmsCount >= properties.getEmail().getMaxIpSendCount()) {
            log.error("IP地址当天邮件发送数上限 邮箱={}，IP地址={}", email, ipAddr);
            throw new BusinessException("IP地址当天邮件发送数上限");
        }
    }

    /**
     * 发送成功后累加总数
     */
    private void saveSendCount(String email, String ipAddr) {
        log.info("邮件发送成功后累加发送次数");
        long second = DateTool.todayTimeLeft();
        //邮箱当天发送数量
        super.accumulate(email, "email", second);
        //IP当天发送数量
        super.accumulate(ipAddr, "ip:email", second);
    }
}
