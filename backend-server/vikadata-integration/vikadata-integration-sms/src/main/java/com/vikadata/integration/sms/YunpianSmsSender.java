package com.vikadata.integration.sms;

import java.util.Map;

import cn.hutool.core.util.StrUtil;
import com.yunpian.sdk.YunpianClient;
import com.yunpian.sdk.model.Result;
import com.yunpian.sdk.model.SmsSingleSend;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * 云片短信实现类
 * </p>
 *
 * @author Chambers
 * @date 2021/5/10
 */
public class YunpianSmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(YunpianSmsSender.class);

    private String apikey;

    public YunpianSmsSender(String apikey) {
        this.apikey = apikey;
    }

    @Override
    public void send(SmsMessage smsMessage) {
        log.info("发送短信消息，mobile: {} - {}", smsMessage.getAreaCode(), smsMessage.getMobile());
        // 初始化 client 单例方式
        YunpianClient client = new YunpianClient(apikey).init();

        // 发送短信API
        Map<String, String> param = client.newParam(2);
        param.put(YunpianClient.MOBILE, smsMessage.getAreaCode() + smsMessage.getMobile());
        param.put(YunpianClient.TEXT, smsMessage.getText());
        Result<SmsSingleSend> result = client.sms().single_send(param);
        if (result.getCode() != 0) {
            log.error("国际短信发送失败，号码:{}，代码:{}，错误信息:{}", smsMessage.getMobile(), result.getCode(), result.getMsg());
            throw new RuntimeException(StrUtil.format("云片短信发送失败，代码:{}，错误信息:{}「{}」", result.getCode(), result.getMsg(), result.getThrowable()));
        }
    }
}
