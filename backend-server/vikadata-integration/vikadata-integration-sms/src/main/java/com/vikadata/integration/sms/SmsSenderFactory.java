package com.vikadata.integration.sms;

/**
 * <p>
 * SMS transmitter factory
 * </p>
 *
 * @author Chambers
 * @date 2021/5/13
 */
public interface SmsSenderFactory {

    /**
     * Create SMS sender
     *
     * @return SmsSender
     */
    SmsSender createSender();
}
