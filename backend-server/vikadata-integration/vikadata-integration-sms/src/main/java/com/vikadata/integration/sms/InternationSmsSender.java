package com.vikadata.integration.sms;

/**
 * <p>
 * 国际短信发送接口
 * </p>
 *
 * @author Chambers
 * @date 2021/5/10
 */
public interface InternationSmsSender {

    /**
     * 单个发送短信
     *
     * @param smsMessage 短信消息
     * @author Chambers
     * @date 2021/5/10
     */
    void send(SmsMessage smsMessage);
}
