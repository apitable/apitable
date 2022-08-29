package com.vikadata.boot.autoconfigure.sms;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 短信配置信息
 * </p>
 *
 * @author Shawn Deng
 * @date 2019-04-16 17:02
 */
@ConfigurationProperties(prefix = "vikadata-starter.sms")
public class SmsProperties {

    private boolean enabled = false;

    private String localAreaCode;

    private SmsServer local;

    private SmsServer outland;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getLocalAreaCode() {
        return localAreaCode;
    }

    public void setLocalAreaCode(String localAreaCode) {
        this.localAreaCode = localAreaCode;
    }

    public SmsServer getLocal() {
        return local;
    }

    public void setLocal(SmsServer local) {
        this.local = local;
    }

    public SmsServer getOutland() {
        return outland;
    }

    public void setOutland(SmsServer outland) {
        this.outland = outland;
    }

    public static class SmsServer {

        public enum SmsType {

            /**
             * Tencent Cloud
             */
            TENCENT,

            /**
             * Aliyun Cloud
             */
            ALIYUN,

            YUNPIAN
        }

        private SmsType type;

        private Tencent tencent;

        private Aliyun aliyun;

        private Yunpian yunpian;

        public Yunpian getYunpian() {
            return yunpian;
        }

        public void setYunpian(Yunpian yunpian) {
            this.yunpian = yunpian;
        }

        public SmsType getType() {
            return type;
        }

        public void setType(SmsType type) {
            this.type = type;
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


        /**
         * Tencent sms properties
         */
        public static class Tencent {

            /**
             * 应用ID
             */
            private Integer appId;

            /**
             * 应用密钥
             */
            private String appKey;

            /**
             * 签名内容
             */
            private String sign;

            public Integer getAppId() {
                return appId;
            }

            public void setAppId(Integer appId) {
                this.appId = appId;
            }

            public String getAppKey() {
                return appKey;
            }

            public void setAppKey(String appKey) {
                this.appKey = appKey;
            }

            public String getSign() {
                return sign;
            }

            public void setSign(String sign) {
                this.sign = sign;
            }
        }

        /**
         * Aliyun sms properties
         */
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

        /**
         * Yunpian sms properties
         */
        public static class Yunpian {

            /**
             * API 密钥
             */
            private String apikey;

            public String getApikey() {
                return apikey;
            }

            public void setApikey(String apikey) {
                this.apikey = apikey;
            }
        }
    }

}
