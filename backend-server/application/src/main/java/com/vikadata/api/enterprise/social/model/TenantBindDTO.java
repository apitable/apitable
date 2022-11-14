package com.vikadata.api.enterprise.social.model;

import lombok.Data;

/**
 * <p> 
 * Basic information of tenant binding space station
 * </p>
 */
@Data
public class TenantBindDTO {

    private String spaceId;

    /**
     * The unique identifier of the enterprise. The terms of the major platforms are inconsistent. Tenants are used here to represent
     */
    private String tenantId;

    /**
     * Application unique identification
     */
    private String appId;
}
