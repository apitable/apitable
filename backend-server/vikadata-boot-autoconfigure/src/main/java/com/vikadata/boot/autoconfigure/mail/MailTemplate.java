package com.vikadata.boot.autoconfigure.mail;

/**
 * <p>
 * email template instance
 * </p>
 *
 * @author Shawn Deng
 */
public interface MailTemplate {

    /**
     * Send Mail
     *
     * @param emailMessage message body
     */
    void send(EmailMessage emailMessage);

    /**
     * Send mail in bulk
     *
     * @param emailMessages message body list
     */
    void send(EmailMessage... emailMessages);
}
