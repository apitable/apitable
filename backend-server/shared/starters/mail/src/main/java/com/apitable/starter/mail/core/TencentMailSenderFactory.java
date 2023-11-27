package com.apitable.starter.mail.core;

/**
 * tencent mail sender factory.
 */
public class TencentMailSenderFactory implements MailSenderFactory {

    private final String region;

    private final String secretId;

    private final String secretKey;

    private final String from;

    private final String reply;

    /**
     * constructor.
     *
     * @param region    region
     * @param secretId  secretId
     * @param secretKey secretKey
     * @param from      from
     * @param reply     reply
     */
    public TencentMailSenderFactory(String region, String secretId, String secretKey, String from,
                                    String reply) {
        this.region = region;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.from = from;
        this.reply = reply;
    }

    @Override
    public CloudMailSender createSender() {
        return new TencentMailSender(region, secretId, secretKey, from, reply);
    }
}
