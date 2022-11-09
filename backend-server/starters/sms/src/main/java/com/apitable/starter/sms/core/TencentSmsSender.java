package com.apitable.starter.sms.core;

import java.io.IOException;

import cn.hutool.core.util.StrUtil;
import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import com.github.qcloudsms.httpclient.HTTPException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * Tencent Cloud SMS Sender
 * </p>
 *
 */
public class TencentSmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(TencentSmsSender.class);

    private Integer appId;

    private String appKey;

    private String sign;

    public TencentSmsSender(Integer appId, String appKey, String sign) {
        this.appId = appId;
        this.appKey = appKey;
        this.sign = sign;
    }

    @Override
    public void send(SmsMessage smsMessage) {
        log.info("Send SMS");
        //TODO Under high performance, the message is published by MQ queue and sent to the subscriber for consumption.
        // Here, the message is sent by single thread temporarily
        try {
            String smsTemplateCode = smsMessage.getTemplateCode();
            SmsSingleSender sender = new SmsSingleSender(appId, appKey);
            SmsSingleSenderResult result = sender.sendWithParam(StrUtil.strip(smsMessage.getAreaCode(), "+"),
                smsMessage.getMobile(), Integer.parseInt(smsTemplateCode),
                smsMessage.getParams(), sign,
                "", "");
            if (result.result != 0) {
                log.error("fail in send, code:{}, error message:{}", result.result, result.errMsg);
                throw new RuntimeException(StrUtil.format("fail in send, code:{}, error message:{}", result.result, result.errMsg));
            }
        }
        catch (HTTPException e) {
            // HTTP response code error
            e.printStackTrace();
            log.error("Failed to connect to SMS server,code:{}, msg{}", e.getStatusCode(), e.getMessage());
            throw new RuntimeException(StrUtil.format("Failed to connect to SMS server,code:{}, msg{}", e.getStatusCode(), e.getMessage()));
        }
        catch (IOException e) {
            // Network IO error
            e.printStackTrace();
            log.error("Error connecting to SMS network, msg{}", e.getMessage());
            throw new RuntimeException(StrUtil.format("Error connecting to SMS network, msg{}", e.getMessage()));
        }
        catch (Exception e) {
            // other errors
            e.printStackTrace();
            log.error("The SMS server failed to parse the returned information, msg{}", e.getMessage());
            throw new RuntimeException(StrUtil.format("The SMS server failed to parse the returned information, msg{}", e.getMessage()));
        }
    }
}
