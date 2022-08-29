package com.vikadata.integration.mail;

/**
 * <p>
 * 云平台邮件推送接口
 * </p>
 *
 * @author Chambers
 * @date 2022/2/7
 */
public interface CloudMailSender {

    void send(CloudEmailMessage message);
}
