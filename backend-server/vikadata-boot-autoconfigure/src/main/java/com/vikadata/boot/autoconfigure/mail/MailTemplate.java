package com.vikadata.boot.autoconfigure.mail;

/**
 * <p>
 * 邮件操作模版接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/28 14:38
 */
public interface MailTemplate {

    /**
     * 发送邮件
     *
     * @param emailMessage 消息体
     */
    void send(EmailMessage emailMessage);

    /**
     * 批量发送邮件
     *
     * @param emailMessages 消息体集合
     */
    void send(EmailMessage... emailMessages);
}
