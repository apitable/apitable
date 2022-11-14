package com.vikadata.api.enterprise.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialCpUserBindEntity;

/**
 * <p>
 * Third party platform integration WeCom user binding service interface
 * </p>
 */
public interface ISocialCpUserBindService extends IService<SocialCpUserBindEntity> {

    /**
     * Create user binding third-party account
     *
     * @param userId            User ID
     * @param cpTenantUserId    Third party user ID (Social Cp Tenant User ID)
     */
    void create(Long userId, Long cpTenantUserId);

    /**
     * Get User Id
     *
     * @param tenantId  Enterprise Id
     * @param appId     Enterprise Application Id
     * @param cpUserId  Enterprise WeCom user ID
     * @return vika User Id
     */
    Long getUserIdByTenantIdAndAppIdAndCpUserId(String tenantId, String appId, String cpUserId);

    /**
     * Get User Id
     * The user ID is returned for different applications in the same enterprise as long as the binding relationship exists
     *
     * @param tenantId  Enterprise Id
     * @param cpUserId  Enterprise WeCom user ID
     * @return vika User Id
     */
    Long getUserIdByTenantIdAndCpUserId(String tenantId, String cpUserId);

    /**
     * Get User Id
     *
     * @param cpTenantUserId   Third party platform user ID (Social Cp Tenant User ID)
     * @return vika User ID
     */
    Long getUserIdByCpTenantUserId(Long cpTenantUserId);

    /**
     * Get information in batches
     *
     * @param cpTenantUserIds Third party platform user ID (Social Cp Tenant User ID)
     * @return Information List
     */
    List<SocialCpUserBindEntity> getByCpTenantUserIds(List<Long> cpTenantUserIds);

    /**
     * Get Open Id
     *
     * @param tenantId  Enterprise Id
     * @param userId    vika User ID
     * @return Enterprise WeCom Open Id
     */
    String getOpenIdByTenantIdAndUserId(String tenantId, Long userId);

    /**
     * Check whether the union ID is bound
     *
     * @param userId            User vika account ID
     * @param cpTenantUserId    Third party platform user unique ID (Social Cp Tenant User ID)
     * @return Whether to bind
     */
    boolean isCpTenantUserIdBind(Long userId, Long cpTenantUserId);

    /**
     * Batch Delete WeCom Binding Relationship
     *
     * @param removeCpTenantUserIds    Third party platform user unique ID (Social Cp Tenant User ID)
     */
    void batchDeleteByCpTenantUserIds(List<Long> removeCpTenantUserIds);

    /**
     * Count the number of specified users under the specified tenant
     *
     * @param tenantId    Tenant Id
     * @param userId      User Id
     * @return Number of users
     */
    long countTenantBindByUserId(String tenantId, Long userId);

    /**
     * The third party information of the user is physically deleted according to the user ID
     *
     * @param userId
     */
    void deleteByUserId(Long userId);

}
