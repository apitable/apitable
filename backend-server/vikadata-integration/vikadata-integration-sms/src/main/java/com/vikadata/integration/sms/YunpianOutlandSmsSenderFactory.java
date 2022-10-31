package com.vikadata.integration.sms;

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
