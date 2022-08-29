package com.vikadata.integration.sms;

/**
 * <p>
 * 短信发送器工厂
 * </p>
 *
 * @author Chambers
 * @date 2021/5/13
 */
public interface SmsSenderFactory {

    /**
     * 创建短信发送器
     *
     * @return SmsSender
     * @author Chambers
     * @date 2021/5/13
     */
    SmsSender createSender();
}
