package com.vikadata.boot.autoconfigure.mail;

import java.util.Collections;

/**
 * <p>
 * 邮件消息体构造工厂
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/8/23 20:15
 */
public class EmailMessageFactory {

    /**
     * 构建单条消息模板
     *
     * @param personal 个人签名
     * @param to       发送者
     * @param subject  邮件主题
     * @param html     邮件正文（html）
     * @return EmailMessage
     */
    public static EmailMessage createSingleMessage(String personal, String to, String subject, String html) {
        EmailMessage emailMessage = new EmailMessage();
        emailMessage.setPersonal(personal);
        emailMessage.setTo(Collections.singletonList(to));
        emailMessage.setSubject(subject);
        emailMessage.setHtmlText(html);
        return emailMessage;
    }
}
