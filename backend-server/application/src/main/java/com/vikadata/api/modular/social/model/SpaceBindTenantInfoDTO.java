package com.vikadata.api.modular.social.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

/**
 * <p> 
 * Space station binding tenant information view
 * </p>
 */
@Data
public class SpaceBindTenantInfoDTO {

    private String spaceId;

    /**
     * The unique identifier of the enterprise. The terms of the major platforms are inconsistent. Tenants are used here to represent
     */
    private String tenantId;

    /**
     * Application unique identification
     */
    private String appId;

    /**
     * Platform(1: WeCom, 2: DingTalk, 3: Lark)
     */
    private Integer platform;

    /**
     * Application Type(1: Enterprise internal application, 2: Independent service provider)
     */
    private Integer appType;

    /**
     * Authorization mode. 1: Enterprise authorization; 2: Member Authorization
     */
    private Integer authMode;

    /**
     * Application authorization information
     */
    private Object authInfo;

    /**
     * State
     */
    private Boolean status;

    @JsonIgnore
    private String authInfoStr;

}
