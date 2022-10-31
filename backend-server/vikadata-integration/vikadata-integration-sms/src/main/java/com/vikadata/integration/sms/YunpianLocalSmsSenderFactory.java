package com.vikadata.integration.sms;

/**
 * <p>
 * Cloud chip SMS transmitter factory
 * </p>
 *
 */
public class YunpianLocalSmsSenderFactory implements LocalSmsSenderFactory {

    private String apikey;

    public YunpianLocalSmsSenderFactory(String apikey) {
        this.apikey = apikey;
    }

    @Override
    public SmsSender createSender() {
        return new YunpianSmsSender(apikey);
    }
}
