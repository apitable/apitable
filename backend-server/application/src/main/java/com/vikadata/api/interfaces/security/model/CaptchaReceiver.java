package com.vikadata.api.interfaces.security.model;

public class CaptchaReceiver {

    private String receiver;

    private String captchaCode;

    public CaptchaReceiver(String receiver, String captchaCode) {
        this.receiver = receiver;
        this.captchaCode = captchaCode;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getCaptchaCode() {
        return captchaCode;
    }
}
