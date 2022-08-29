package com.vikadata.integration.sms;

/**
 * <p>
 * 云片短信发送器工厂
 * </p>
 *
 * @author Chambers
 * @date 2021/5/13
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
