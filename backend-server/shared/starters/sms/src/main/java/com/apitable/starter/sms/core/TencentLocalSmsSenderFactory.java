package com.apitable.starter.sms.core;

/**
 * <p>
 * Tencent SMS transmitter factory
 * </p>
 *
 */
public class TencentLocalSmsSenderFactory extends AbstractSmsSenderFactory implements LocalSmsSenderFactory {

    public TencentLocalSmsSenderFactory(Integer appId, String appKey, String sign) {
        super(appId, appKey, sign);
    }

    @Override
    public SmsSender createSender() {
        return new TencentSmsSender(getAppId(), getAppKey(), getSign());
    }
}
