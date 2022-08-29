package com.vikadata.integration.sms;

import java.io.IOException;

import cn.hutool.core.util.StrUtil;
import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import com.github.qcloudsms.httpclient.HTTPException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>
 * 腾讯云短信发送器
 * </p>
 *
 * @author Shawn Deng
 * @date 2019-04-16 17:45
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
        log.info("发送短信消息");
        //TODO 高性能下，借助MQ队列发布消息，交予订阅者消费发送消息,这里暂时使用单线程发送
        try {
            String smsTemplateCode = smsMessage.getTemplateCode();
            SmsSingleSender sender = new SmsSingleSender(appId, appKey);
            SmsSingleSenderResult result = sender.sendWithParam(StrUtil.strip(smsMessage.getAreaCode(), "+"),
                smsMessage.getMobile(), Integer.parseInt(smsTemplateCode),
                smsMessage.getParams(), sign,
                "", "");
            if (result.result != 0) {
                log.error("发送失败，代码:{}，错误信息:{}", result.result, result.errMsg);
                throw new RuntimeException(StrUtil.format("发送失败，代码:{}，错误信息:{}", result.result, result.errMsg));
            }
        }
        catch (HTTPException e) {
            // HTTP 响应码错误
            e.printStackTrace();
            log.error("连接短信服务服务器失败,code:{}, msg{}", e.getStatusCode(), e.getMessage());
            throw new RuntimeException(StrUtil.format("连接短信服务服务器失败,code:{}, msg{}", e.getStatusCode(), e.getMessage()));
        }
        catch (IOException e) {
            // 网络 IO 错误
            e.printStackTrace();
            log.error("连接短信服务网络出错, msg{}", e.getMessage());
            throw new RuntimeException(StrUtil.format("连接短信服务网络出错, msg{}", e.getMessage()));
        }
        catch (Exception e) {
            // 其他错误
            e.printStackTrace();
            log.error("短信服务器解析返回信息失败, msg{}", e.getMessage());
            throw new RuntimeException(StrUtil.format("短信服务器解析返回信息失败, msg{}", e.getMessage()));
        }
    }
}
