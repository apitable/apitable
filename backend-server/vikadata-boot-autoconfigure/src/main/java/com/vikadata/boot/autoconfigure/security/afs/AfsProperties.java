package com.vikadata.boot.autoconfigure.security.afs;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 人机验证服务配置信息
 * </p>
 *
 * @author Chambers
 * @date 2020/3/2
 */
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

		/**
		 * 地区ID
		 */
		private String regionId;

		/**
		 * 标志用户
		 */
		private String accessKeyId;

		/**
		 * 密钥
		 */
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
