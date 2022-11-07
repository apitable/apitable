package com.apitable.starter.autoconfigure.mail;


import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * Cloud Platform Email Push Configuration Properties
 * </p>
 *
 * @author Chambers
 */
@ConfigurationProperties(prefix = "vikadata-starter.mail")
public class CloudMailProperties {

    private MailType type;

    private String region;

    private String from;

    private String reply;

    private Tencent tencent;

    private Aliyun aliyun;

    public MailType getType() {
        return type;
    }

    public void setType(MailType type) {
        this.type = type;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public Tencent getTencent() {
        return tencent;
    }

    public void setTencent(Tencent tencent) {
        this.tencent = tencent;
    }

    public Aliyun getAliyun() {
        return aliyun;
    }

    public void setAliyun(Aliyun aliyun) {
        this.aliyun = aliyun;
    }

    public enum MailType {

        TENCENT,

        ALIYUN
    }

    public static class Tencent {

        private String secretId;

        private String secretKey;

        public String getSecretId() {
            return secretId;
        }

        public void setSecretId(String secretId) {
            this.secretId = secretId;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }
    }

    public static class Aliyun {

        private String accessKey;

        private String accessSecret;

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getAccessSecret() {
            return accessSecret;
        }

        public void setAccessSecret(String accessSecret) {
            this.accessSecret = accessSecret;
        }
    }

}
