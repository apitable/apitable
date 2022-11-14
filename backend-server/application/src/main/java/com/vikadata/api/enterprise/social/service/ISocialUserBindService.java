package com.vikadata.api.enterprise.social.service;

import java.util.HashMap;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialUserBindEntity;

/**
 * Third party platform integration - user binding service interface
 */
public interface ISocialUserBindService extends IService<SocialUserBindEntity> {

    /**
     * Create user binding third-party account
     *
     * @param userId  User ID
     * @param unionId Third party user ID
     */
    void create(Long userId, String unionId);

    /**
     * Query the union ID bound by the user
     *
     * @param userId User ID
     * @return unionIds
     */
    List<String> getUnionIdsByUserId(Long userId);

    /**
     * Get the bound User ID
     *
     * @param unionId User ID of third-party platform
     * @return User ID
     */
    Long getUserIdByUnionId(String unionId);

    /**
     * Get the corresponding open ID of the tenant
     *
     * @param appId Application ID
     * @param tenantId Tenant ID
     * @param userId User ID
     * @return open id
     */
    String getOpenIdByTenantIdAndUserId(String appId, String tenantId, Long userId);

    /**
     * Get entity according to Union Id
     *
     * @param unionIds User ID of third-party platform
     * @return SocialUserBindEntity List
     */
    List<SocialUserBindEntity> getEntitiesByUnionId(List<String> unionIds);

    /**
     * Batch deletion
     *
     * @param unionIds User ID of third-party platform
     */
    void deleteBatchByUnionId(List<String> unionIds);

    /**
     * Physically delete the user's third-party information according to the User ID
     *
     * @param userId
     */
    void deleteByUserId(Long userId);

    /**
     * Check whether the union ID is bound
     *
     * @param unionId Third party platform user unique ID
     * @param userId User vika account ID
     * @return boolean
     */
    Boolean isUnionIdBind(Long userId, String unionId);

    /**
     * Get the user name according to the union ID
     *
     * @param unionIds User ID of third-party platform
     * @return unionId->userName
     */
    HashMap<String, String> getUserNameByUnionIds(List<String> unionIds);
}
