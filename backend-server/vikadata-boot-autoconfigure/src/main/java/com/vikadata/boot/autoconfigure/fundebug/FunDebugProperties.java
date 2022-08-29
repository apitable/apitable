package com.vikadata.boot.autoconfigure.fundebug;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * Fundebug配置信息
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/3/13
 */
@ConfigurationProperties(prefix = "vikadata-starter.fundebug")
public class FunDebugProperties {

    private boolean enabled = false;

    private boolean silent = false;

    /**
     * API KEY
     */
    private String apiKey;

    /**
     * 区分环境
     */
    private String releaseStage;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isSilent() {
        return silent;
    }

    public void setSilent(boolean silent) {
        this.silent = silent;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getReleaseStage() {
        return releaseStage;
    }

    public void setReleaseStage(String releaseStage) {
        this.releaseStage = releaseStage;
    }
}
