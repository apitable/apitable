package com.apitable.starter.sms.core;

import java.util.Optional;

import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * SMS sending template
 * </p>
 *
 */
public class SmsSenderTemplate {

    private String localAreaCode;

    private LocalSmsSenderFactory localSmsSenderFactory;

    private OutlandSmsSenderFactory outlandSmsSenderFactory;

    public SmsSenderTemplate() {
    }

    public String getLocalAreaCode() {
        return Optional.ofNullable(localAreaCode).orElse("");
    }

    public void setLocalAreaCode(String localAreaCode) {
        this.localAreaCode = localAreaCode;
    }

    public LocalSmsSenderFactory getLocalSmsSenderFactory() {
        return localSmsSenderFactory;
    }

    public void setLocalSmsSenderFactory(LocalSmsSenderFactory localSmsSenderFactory) {
        this.localSmsSenderFactory = localSmsSenderFactory;
    }

    public OutlandSmsSenderFactory getOutlandSmsSenderFactory() {
        return outlandSmsSenderFactory;
    }

    public void setOutlandSmsSenderFactory(OutlandSmsSenderFactory outlandSmsSenderFactory) {
        this.outlandSmsSenderFactory = outlandSmsSenderFactory;
    }

    public void send(SmsMessage smsMessage) {
        boolean isLocal = this.getLocalAreaCode().equals(smsMessage.getAreaCode());
        SmsSenderFactory factory = isLocal ? this.getLocalSmsSenderFactory() : this.getOutlandSmsSenderFactory();
        if (factory == null) {
            throw new RuntimeException(StrUtil.format("{}SMS service is not configured", isLocal ? "local" : "field"));
        }
        SmsSender sender = factory.createSender();
        sender.send(smsMessage);
    }
}
