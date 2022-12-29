package com.apitable.starter.mail.core;

/**
 * <p>
 * Cloud platform email push interface
 * </p>
 *
 */
public interface CloudMailSender {

    void send(CloudEmailMessage message);
}
