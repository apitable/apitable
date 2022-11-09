package com.apitable.starter.sms.core;

import java.util.Map;

import cn.hutool.core.util.StrUtil;
import com.yunpian.sdk.YunpianClient;
import com.yunpian.sdk.model.Result;
import com.yunpian.sdk.model.SmsSingleSend;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Cloud chip SMS implementation class
 * </p>
 *
 */
public class YunpianSmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(YunpianSmsSender.class);

    private String apikey;

    public YunpianSmsSender(String apikey) {
        this.apikey = apikey;
    }

    @Override
    public void send(SmsMessage smsMessage) {
        log.info("Send SMS, mobile: {} - {}", smsMessage.getAreaCode(), smsMessage.getMobile());
        // Initialize client singleton mode
        YunpianClient client = new YunpianClient(apikey).init();

        // send message API
        Map<String, String> param = client.newParam(2);
        param.put(YunpianClient.MOBILE, smsMessage.getAreaCode() + smsMessage.getMobile());
        param.put(YunpianClient.TEXT, smsMessage.getText());
        Result<SmsSingleSend> result = client.sms().single_send(param);
        if (result.getCode() != 0) {
            log.error("Failed to send international SMS, number:{}, code:{}，error message:{}", smsMessage.getMobile(), result.getCode(), result.getMsg());
            throw new RuntimeException(StrUtil.format("Failed to send cloud chip SMS, code:{}, error message:{}「{}」", result.getCode(), result.getMsg(), result.getThrowable()));
        }
    }
}
