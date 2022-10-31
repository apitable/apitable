package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialTenantUserEntity;

/**
 * Third party platform integration - enterprise tenant user service interface
 */
public interface ISocialTenantUserService extends IService<SocialTenantUserEntity> {

    /**
     * Create
     *
     * @param tenantId Tenant ID
     * @param openId   Tenant  User ID
     * @param unionId  Tenant user unique ID
     */
    void create(String appId, String tenantId, String openId, String unionId);

    /**
     * Bulk Insert
     *
     * @param entities Entity List
     */
    void createBatch(List<SocialTenantUserEntity> entities);

    /**
     * Get the open IDs of all users under the tenant
     *
     * @param tenantId Tenant ID
     * @return openIds
     */
    List<String> getOpenIdsByTenantId(String appId, String tenantId);

    /**
     * Get the open ID bound by the user under the tenant
     *
     * @param tenantId Tenant ID
     * @param userId   User ID
     * @return unionId
     */
    String getOpenIdByTenantIdAndUserId(String appId, String tenantId, Long userId);

    /**
     * Get the open ID under the tenant
     *
     * @param appId App ID
     * @param tenantId Tenant ID
     * @return openId list
     */
    List<String> getOpenIdsByAppIdAndTenantId(String appId, String tenantId);

    /**
     * Get the unionId according to the openId
     *
     * @param tenantId Tenant ID
     * @param openId User ID under the tenant
     * @return UnionId
     */
    String getUnionIdByOpenId(String appId, String tenantId, String openId);

    /**
     * Whether the tenant's user exists
     *
     * @param tenantId Tenant ID
     * @param openId   User ID under the tenant
     * @return TRUE | FALSE
     */
    boolean isTenantUserOpenIdExist(String appId, String tenantId, String openId);

    /**
     * Whether the tenant's user exists
     *
     * @param tenantId Tenant ID
     * @param openId   User ID under the tenant
     * @param unionId Unique ID of the user under the developer account
     * @return TRUE | FALSE
     */
    boolean isTenantUserUnionIdExist(String appId, String tenantId, String openId, String unionId);

    /**
     * Delete tenant's user record
     *
     * @param tenantId Tenant ID
     */
    void deleteByTenantId(String appId, String tenantId);

    /**
     * Delete tenant's user record
     *
     * @param openIds User ID under the tenant
     */
    void deleteByFeishuOpenIds(String appId, String tenantId, List<String> openIds);

    /**
     * Remove tenant user record
     *
     * @param tenantId Tenant ID
     * @param openId   User ID under the tenant
     */
    void deleteByTenantIdAndOpenId(String appId, String tenantId, String openId);

    /**
     * Delete the user of the DingTalk application binding
     *
     * @param tenantId Tenant ID
     * @param openIds Unique ID of the user under the application
     */
    void deleteByTenantIdAndOpenIds(String appId, String tenantId, List<String> openIds);

    /**
     * Delete according to application ID and Tenant ID
     *
     * @param appId Application ID
     * @param tenantId Tenant ID
     */
    void deleteByAppIdAndTenantId(String appId, String tenantId);

    /**
     * Query User ID according to unionId
     *
     * @param unionId Tenant user unique ID
     * @return User ID
     */
    Long getUserIdByDingTalkUnionId(String unionId);

    /**
     * Get the map of open Id ->union Ids through the tenant Id
     *
     * @param tenantId Tenant ID
     * @return Map<String, List < String>>
     * @author zoe zheng
     * @date 2022/2/15 14:37
     */
    Map<String, List<String>> getOpenIdMapByTenantId(String appId, String tenantId);
}
