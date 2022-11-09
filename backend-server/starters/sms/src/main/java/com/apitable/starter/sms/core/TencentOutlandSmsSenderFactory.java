package com.apitable.starter.sms.core;

/**
 * <p>
 * Tencent SMS transmitter factory
 * </p>
 *
 */
public class TencentOutlandSmsSenderFactory extends AbstractSmsSenderFactory implements OutlandSmsSenderFactory {

    public TencentOutlandSmsSenderFactory(Integer appId, String appKey, String sign) {
        super(appId, appKey, sign);
    }

    @Override
    public SmsSender createSender() {
        return new TencentSmsSender(getAppId(), getAppKey(), getSign());
    }
}
