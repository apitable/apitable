package com.vikadata.integration.sms;


/**
 * <p>
 * SMS sending operation interface
 * </p>
 *
 */
public interface SmsSender {

    /**
     * Single SMS
     *
     * @param smsMessage SMS message
     */
    void send(SmsMessage smsMessage);
}
