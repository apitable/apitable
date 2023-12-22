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

package com.apitable.starter.oss.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * OSS Object Storage Properties.
 *
 * @author Benson Cheung
 */
@ConfigurationProperties(prefix = "starter.oss")
public class OssProperties {

    private boolean enabled = false;

    private OssType type;

    private Signature signature;

    private Aws aws;

    private Qiniu qiniu;

    private Aliyun aliyun;

    private HuaweiCloud huaweiCloud;

    private Minio minio;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public OssType getType() {
        return type;
    }

    public void setType(OssType type) {
        this.type = type;
    }

    /**
     * oss type.
     */
    public static enum OssType {

        /**
         * AWS S3.
         */
        AWS,

        /**
         * Qiniu Cloud.
         */
        QINIU,

        /**
         * Aliyun Oss.
         */
        ALIYUN,

        /**
         * Huawei Cloud.
         */
        HUAWEICLOUD,

        MINIO
    }

    public Aws getAws() {
        return aws;
    }

    public void setAws(Aws aws) {
        this.aws = aws;
    }

    public Qiniu getQiniu() {
        return qiniu;
    }

    public void setQiniu(Qiniu qiniu) {
        this.qiniu = qiniu;
    }

    public Aliyun getAliyun() {
        return aliyun;
    }

    public void setAliyun(Aliyun aliyun) {
        this.aliyun = aliyun;
    }

    public HuaweiCloud getHuaweiCloud() {
        return huaweiCloud;
    }

    public void setHuaweiCloud(HuaweiCloud huaweicloud) {
        this.huaweiCloud = huaweicloud;
    }

    public Minio getMinio() {
        return minio;
    }

    public void setMinio(Minio minio) {
        this.minio = minio;
    }

    public Signature getSignature() {
        return signature;
    }

    public void setSignature(Signature signature) {
        this.signature = signature;
    }

    /**
     * aws properties.
     */
    public static class Aws {

        private String accessKeyId;

        private String accessKeySecret;

        private String endpoint;

        private String region;

        public String getAccessKeyId() {
            return accessKeyId;
        }

        public void setAccessKeyId(String accessKeyId) {
            this.accessKeyId = accessKeyId;
        }

        public String getAccessKeySecret() {
            return accessKeySecret;
        }

        public void setAccessKeySecret(String accessKeySecret) {
            this.accessKeySecret = accessKeySecret;
        }

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }
    }

    /**
     * qiuniu properties.
     */
    public static class Qiniu {

        private String accessKey;

        private String secretKey;

        private String downloadDomain;

        private String region;

        private Callback callback;

        private String uploadUrl;

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public String getDownloadDomain() {
            return downloadDomain;
        }

        public void setDownloadDomain(String downloadDomain) {
            this.downloadDomain = downloadDomain;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public Callback getCallback() {
            return callback;
        }

        public void setCallback(Callback callback) {
            this.callback = callback;
        }

        public String getUploadUrl() {
            return uploadUrl;
        }

        public void setUploadUrl(String uploadUrl) {
            this.uploadUrl = uploadUrl;
        }
    }

    /**
     * aliyun properties.
     */
    public static class Aliyun {

        private String endpoint;

        private String accessKeyId;

        private String accessKeySecret;

        private String bucketName;

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getAccessKeyId() {
            return accessKeyId;
        }

        public void setAccessKeyId(String accessKeyId) {
            this.accessKeyId = accessKeyId;
        }

        public String getAccessKeySecret() {
            return accessKeySecret;
        }

        public void setAccessKeySecret(String accessKeySecret) {
            this.accessKeySecret = accessKeySecret;
        }

        public String getBucketName() {
            return bucketName;
        }

        public void setBucketName(String bucketName) {
            this.bucketName = bucketName;
        }
    }

    /**
     * huaweicloud properties.
     */
    public static class HuaweiCloud {
        private String endpoint;
        private String accessKey;
        private String secretKey;
        private String bucketName;

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public String getBucketName() {
            return bucketName;
        }

        public void setBucketName(String bucketName) {
            this.bucketName = bucketName;
        }
    }

    /**
     * minio properties.
     */
    public static class Minio {

        private String endpoint;

        private String accessKey;

        private String secretKey;

        private String bucketName;

        private String bucketPolicy;

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public String getBucketName() {
            return bucketName;
        }

        public void setBucketName(String bucketName) {
            this.bucketName = bucketName;
        }

        public String getBucketPolicy() {
            return bucketPolicy;
        }

        public void setBucketPolicy(String bucketPolicy) {
            this.bucketPolicy = bucketPolicy;
        }
    }

    /**
     * signature properties.
     */
    public static class Signature {

        private boolean enabled = false;

        private SignatureModel model;

        /**
         * timestamp anti leech encrypt key.
         */
        private String encryptKey;

        private Integer expireSecond;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public SignatureModel getModel() {
            return model;
        }

        public void setModel(SignatureModel model) {
            this.model = model;
        }

        public String getEncryptKey() {
            return encryptKey;
        }

        public void setEncryptKey(String encryptKey) {
            this.encryptKey = encryptKey;
        }

        public Integer getExpireSecond() {
            return expireSecond;
        }

        public void setExpireSecond(Integer expireSecond) {
            this.expireSecond = expireSecond;
        }
    }

    /**
     * signature model.
     */
    public enum SignatureModel {

        // PRIVATE_BUCKET_CDN_TOKEN,

        CDN_TIMESTAMP_ANTI_LEECH,

    }

    /**
     * callback properties.
     */
    public static class Callback {

        private boolean enabled = false;

        private String url;

        private String bodyType;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getBodyType() {
            return bodyType;
        }

        public void setBodyType(String bodyType) {
            this.bodyType = bodyType;
        }
    }

}
