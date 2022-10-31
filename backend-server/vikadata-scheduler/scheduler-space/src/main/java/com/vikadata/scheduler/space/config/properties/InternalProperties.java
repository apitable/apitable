package com.vikadata.scheduler.space.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;


/**
 * <p>
 * Internal Service API Properties
 * </p>
 */
@Data
@ConfigurationProperties(prefix = "internal")
public class InternalProperties {

    private String domain;

    /**
     * Get user history operation record API url
     */
    private String getPausedUserHistoryInfoURL;

    /**
     * Close account API url
     */
    private String closePausedUserURL;

    /**
     * API url for batch processing enterprise-micro interface permission delay tasks
     */
    private String batchProcessSocialWecomPermitDelayUrl;

}
