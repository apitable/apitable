package com.vikadata.integration.sms;

import java.util.Optional;

import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * 短信发送模板
 * </p>
 *
 * @author Chambers
 * @date 2021/5/13
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
            throw new RuntimeException(StrUtil.format("{}短信服务未配置", isLocal ? "本地" : "外地"));
        }
        SmsSender sender = factory.createSender();
        sender.send(smsMessage);
    }
}
