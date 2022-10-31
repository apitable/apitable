package com.vikadata.api.modular.social.service;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.model.TenantBaseInfoDto;
import com.vikadata.entity.SocialTenantEntity;

/**
 * <p>
 * Third party integration - enterprise tenant service interface
 * </p>
 */
public interface ISocialTenantService extends IService<SocialTenantEntity> {

    /**
     * Whether the enterprise exists
     * 
     * @param tenantId Enterprise ID
     * @param appId Application ID
     * @return true | false
     */
    boolean isTenantExist(String tenantId, String appId);

    /**
     * New third-party platform tenants
     *
     * @param socialType Third party social software platform type
     * @param appType    Application Type
     * @param appId      Application ID
     * @param tenantId   Enterprise ID
     */
    void createTenant(SocialPlatformType socialType, SocialAppType appType, String appId, String tenantId, String contactScope);

    /**
     * Update tenant status
     *
     * @param tenantId Tenant ID
     * @param appId    Application ID
     * @param enabled true ｜ false
     */
    void updateTenantStatus(String appId, String tenantId, boolean enabled);

    /**
     * Tenant deactivation
     *
     * @param appId    Application ID
     * @param tenantId Enterprise ID
     */
    void stopByTenant(String appId, String tenantId);

    /**
     * Deactivate Tenant
     *
     * @param appId    Application ID
     * @param tenantId Enterprise ID
     * @param spaceId Space ID
     */
    void removeTenant(String appId, String tenantId, String spaceId);

    /**
     * Remove Lark self built application
     *
     * @param appId    Application ID
     * @param tenantId Enterprise ID
     * @param spaceId Space ID
     */
    void removeInternalTenant(String appId, String tenantId, String spaceId);

    /**
     * Obtain tenant information
     *
     * @param appId Application ID
     * @param tenantId Enterprise ID
     * @return SocialTenantEntity
     */
    SocialTenantEntity getByAppIdAndTenantId(String appId, String tenantId);

    /**
     * Delete Platform Binding Information
     *
     * @param spaceId Space ID
     */
    void removeSpaceIdSocialBindInfo(String spaceId);

    /**
     * Add or update third-party platform tenants
     *
     * @param socialType Third party social software platform Type
     * @param appType    Application Type
     * @param appId      Application ID
     * @param tenantId   Enterprise ID
     * @param scope Visible range of application address book
     * @param authInfo Enterprise authorization information
     */
    void createOrUpdateWithScope(SocialPlatformType socialType, SocialAppType appType, String appId, String tenantId,
            String scope, String authInfo);

    /**
     * Add or update third-party platform tenant information according to enterprise ID and application ID
     *
     * @param entity Data information
     */
    void createOrUpdateByTenantAndApp(SocialTenantEntity entity);

    /**
     * Get the agent ID of the DingTalk application
     *
     * @param tenantId Tenant ID
     * @param appId Tenant Application ID
     * @return agentId
     */
    String getDingTalkAppAgentId(String tenantId, String appId);

    /**
     * Obtain the specific information of the tenant enterprise
     *
     * @param tenantId Tenant ID
     * @param appId Tenant Application ID
     * @return TenantBaseInfoDto
     */
    TenantBaseInfoDto getTenantBaseInfo(String tenantId, String appId);

    /**
     * Check tenant binding status
     *
     * @param tenantId Tenant ID
     * @param appId Tenant Application ID
     * @return boolean
     */
    boolean isTenantActive(String tenantId, String appId);

    /**
     * Batch Query Tenant Entity Class
     *
     * @param tenantIds Tenant ID List
     * @return SocialTenantEntity List
     */
    List<SocialTenantEntity> getByTenantIds(List<String> tenantIds);

    /**
     * Query third-party platform information
     *
     * @param platformType Platform Type
     * @param appType Application Type
     * @return List<SocialTenantEntity>
     */
    List<SocialTenantEntity> getByPlatformTypeAndAppType(SocialPlatformType platformType, SocialAppType appType);

    /**
     * Query the list of third-party platform bound space stations
     *
     * @param platformType Platform Type
     * @param appType Application Type
     * @return List<SocialTenantEntity>
     */
    List<String> getSpaceIdsByPlatformTypeAndAppType(SocialPlatformType platformType, SocialAppType appType);

    /**
     * get a permanent authorization code
     *
     * @param tenantId auth corp id
     * @param appId app id
     * @return permanentCode
     */
    String getPermanentCodeByAppIdAndTenantId(String appId, String tenantId);

    /**
     * get created at time
     *
     * @param tenantId auth corp id
     * @param appId app ido
     * @return LocalDateTime
     */
    LocalDateTime getCreatedAtByAppIdAndTenantId(String appId, String tenantId);

}
