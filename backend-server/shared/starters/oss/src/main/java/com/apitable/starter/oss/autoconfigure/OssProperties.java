package com.apitable.starter.oss.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * OSS Object Storage Properties
 *
 * @author Benson Cheung
 */
@ConfigurationProperties(prefix = "vikadata-starter.oss")
public class OssProperties {

    private boolean enabled = false;

    private OssType type;

    private Aws aws;

    private Qiniu qiniu;

    private Aliyun aliyun;

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

    public enum OssType {

        /**
         * AWS S3
         */
        AWS,

        /**
         * Qiniu Cloud
         */
        QINIU,

        /**
         * Aliyun Oss
         */
        ALIYUN,

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

    public Minio getMinio() {
        return minio;
    }

    public void setMinio(Minio minio) {
        this.minio = minio;
    }

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

    public static class Callback {

        private String url;

        private String bodyType;

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
