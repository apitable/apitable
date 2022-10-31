package com.vikadata.boot.autoconfigure.fundebug;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * fundebug properties
 * </p>
 *
 * @author Benson Cheung
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
     * environment
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
