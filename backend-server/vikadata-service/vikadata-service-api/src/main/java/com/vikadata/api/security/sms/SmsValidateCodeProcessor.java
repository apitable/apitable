package com.vikadata.api.security.sms;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.SecurityProperties;
import com.vikadata.api.enums.action.SmsCodeType;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.security.AbstractValidateCodeProcessor;
import com.vikadata.api.security.CodeValidateScope;
import com.vikadata.api.security.ValidateCode;
import com.vikadata.api.security.ValidateCodeRepository;
import com.vikadata.api.security.ValidateTarget;
import com.vikadata.api.util.DateTool;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.define.constants.RedisConstants;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import static com.vikadata.api.enums.exception.ActionException.MOBILE_SEND_MAX_COUNT_LIMIT;
import static com.vikadata.api.enums.exception.ActionException.SMS_SEND_ONLY_ONE_MINUTE;

/**
 * <p>
 * 手机短信验证码处理器
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 15:53
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

    public SmsValidateCodeProcessor(ValidateCodeRepository validateCodeRepository, RedisTemplate<String, Object> redisTemplate, SecurityProperties properties) {
        super(validateCodeRepository, redisTemplate, properties);
    }

    @Override
    protected void send(ValidateCode validateCode, ValidateTarget validateTarget) {
        log.info("发送短信验证码");
        String target = validateTarget.getRealTarget();
        //发送验证码短信只能通过用户请求发送
        HttpServletRequest request = HttpContextUtil.getRequest();
        String ipAddr = HttpContextUtil.getRemoteAddr(request);
        //统一处理短信流量，防止刷短信
        this.checkBeforeSend(target, ipAddr);
        //可以发送短信了
        CodeValidateScope scope = CodeValidateScope.fromName(validateCode.getScope());
        SmsCodeType type = SmsCodeType.ofName(scope.name());
        try {
            iSmsService.sendValidateCode(validateTarget, validateCode.getCode(), type);
        }
        catch (Exception e) {
            NotifyMailFactory.me().notify("短信发送失败告警", StrUtil.format("手机号：{}，错误信息：{}", target, e.getMessage()));
            throw new BusinessException("短信发送失败");
        }
        //发送完成后保存发送总数
        this.saveSendCount(target, ipAddr);
    }

    /**
     * 处理短信流量
     *
     * @param mobile 手机号码
     * @param ipAddr IP地址
     */
    private void checkBeforeSend(String mobile, String ipAddr) {
        log.info("统一处理短信流量，与运营商同步设置");
        //手机当天发送数量
        String mobileSmsCountKey = RedisConstants.getSendCaptchaCountKey(mobile, "mobile");
        //IP当天发送数量
        String ipSmsCountKey = RedisConstants.getSendCaptchaCountKey(ipAddr, "ip:mobile");
        //当天所有手机发送数量
        String totalSmsCountKey = RedisConstants.getSendCaptchaCountKey("total", "mobile");
        //手机发送频率
        String sendSmsRateKey = RedisConstants.getSendCaptchaRateKey(mobile);

        //一分钟限制不能再次获取，除非验证码过期自动删除
        Integer sendSmsRateCount = (Integer) redisTemplate.opsForValue().get(sendSmsRateKey);
        if (sendSmsRateCount != null) {
            log.info("60秒内不允许重复获取，IP地址={}, 手机号={}", ipAddr, mobile);
            throw new BusinessException(SMS_SEND_ONLY_ONE_MINUTE);
        }
        else {
            //锁住1分钟不让发送
            redisTemplate.opsForValue().set(sendSmsRateKey, 1, 1, TimeUnit.MINUTES);
        }

        //手机当天短信发送数上限
        Integer mobileSmsCount = (Integer) redisTemplate.opsForValue().get(mobileSmsCountKey);
        if (mobileSmsCount != null && mobileSmsCount >= properties.getSms().getMaxSendCount()) {
            log.error("手机当天短信发送数上限，IP地址={}, 手机号={}", ipAddr, mobile);
            throw new BusinessException(MOBILE_SEND_MAX_COUNT_LIMIT);
        }

        //IP地址当天发送短信，不分手机号码
        Integer ipSmsCount = (Integer) redisTemplate.opsForValue().get(ipSmsCountKey);
        if (ipSmsCount != null && ipSmsCount >= properties.getSms().getMaxIpSendCount()) {
            log.error("IP地址当天短信发送数上限 IP地址={}, 手机号={}", ipAddr, mobile);
            throw new BusinessException("IP地址当天短信发送数上限");
        }

        //当天所有手机发送短信上限
        Integer totalSmsCount = (Integer) redisTemplate.opsForValue().get(totalSmsCountKey);
        if (totalSmsCount != null) {
            if (totalSmsCount >= properties.getSms().getMaxDaySendCount()) {
                log.error("当天所有短信发送数上限 IP地址={}, 手机号={}", ipAddr, mobile);
                throw new BusinessException("当天短信发送数上限");
            }
            int count = properties.getSms().getMaxDaySendCount() * 9 / 10;
            if (totalSmsCount == count) {
                NotifyMailFactory.me().notify("当天短信发送数上限告警", "发送数已达到上限的90%，请注意！");
            }
        }
    }

    /**
     * 发送完成之后，保存发送数量，建立阀值
     *
     * @param mobile 手机号码
     * @param ipAddr IP地址
     */
    private void saveSendCount(String mobile, String ipAddr) {
        log.info("保存总数，在发送成功之后");
        long second = DateTool.todayTimeLeft();
        //手机当天发送数量
        super.accumulate(mobile, "mobile", second);
        //IP当天发送数量
        super.accumulate(ipAddr, "ip:mobile", second);
        //当天所有手机发送数量
        super.accumulate("total", "mobile", second);
    }
}
