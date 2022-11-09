package com.apitable.starter.sms.core;

/**
 * <p>
 * International SMS sending interface
 * </p>
 *
 */
public interface InternationSmsSender {

    /**
     * Single SMS
     *
     * @param smsMessage  SMS message
     */
    void send(SmsMessage smsMessage);
}
