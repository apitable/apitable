/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.starter.sms.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * SMS properties.
 * </p>
 *
 * @author Shawn Deng
 */
@ConfigurationProperties(prefix = "starter.sms")
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

    /**
     * sms type.
     */
    public enum SmsType {

        /**
         * Tencent Cloud.
         */
        TENCENT,

        /**
         * Aliyun Cloud.
         */
        ALIYUN,

        YUNPIAN
    }

    /**
     * sms server properties.
     */
    public static class SmsServer {

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
         * Tencent sms properties.
         */
        public static class Tencent {

            private Integer appId;

            private String appKey;

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
         * Aliyun sms properties.
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
         * Yunpian sms properties.
         */
        public static class Yunpian {

            /**
             * API key.
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
