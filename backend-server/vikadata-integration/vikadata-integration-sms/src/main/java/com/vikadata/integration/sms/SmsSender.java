package com.vikadata.integration.sms;


/**
 * <p>
 * 短信发送操作接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019-04-16 17:03
 */
public interface SmsSender {

    /**
     * 单个发送短信
     *
     * @param smsMessage 短信消息
     * @author Shawn Deng
     * @date 2019/12/25 17:03
     */
    void send(SmsMessage smsMessage);
}
