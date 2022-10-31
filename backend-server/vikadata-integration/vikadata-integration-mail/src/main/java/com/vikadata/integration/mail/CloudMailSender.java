package com.vikadata.integration.mail;

/**
 * <p>
 * Cloud platform email push interface
 * </p>
 *
 */
public interface CloudMailSender {

    void send(CloudEmailMessage message);
}
