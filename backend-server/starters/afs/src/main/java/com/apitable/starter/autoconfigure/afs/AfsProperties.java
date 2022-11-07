package com.apitable.starter.autoconfigure.afs;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.afs")
public class AfsProperties {

    private boolean enabled = false;

    private Aliyun aliyun;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Aliyun getAliyun() {
        return aliyun;
    }

    public void setAliyun(Aliyun aliyun) {
        this.aliyun = aliyun;
    }

    /**
     * Aliyun afs properties
     */
	public static class Aliyun {

		private String regionId;

		private String accessKeyId;

		private String secret;

        public String getRegionId() {
            return regionId;
        }

        public void setRegionId(String regionId) {
            this.regionId = regionId;
        }

        public String getAccessKeyId() {
            return accessKeyId;
        }

        public void setAccessKeyId(String accessKeyId) {
            this.accessKeyId = accessKeyId;
        }

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }
    }
}
