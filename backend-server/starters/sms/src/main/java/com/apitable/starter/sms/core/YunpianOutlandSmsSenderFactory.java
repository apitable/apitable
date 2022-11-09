package com.apitable.starter.sms.core;

/**
 * <p>
 * Cloud chip SMS transmitter factory
 * </p>
 *
 */
public class YunpianOutlandSmsSenderFactory implements OutlandSmsSenderFactory {

    private String apikey;

    public YunpianOutlandSmsSenderFactory(String apikey) {
        this.apikey = apikey;
    }

    @Override
    public SmsSender createSender() {
        return new YunpianSmsSender(apikey);
    }
}
