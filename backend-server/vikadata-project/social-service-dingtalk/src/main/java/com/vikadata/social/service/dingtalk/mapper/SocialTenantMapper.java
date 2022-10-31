package com.vikadata.social.service.dingtalk.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.social.service.dingtalk.entity.SocialTenantEntity;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantDto;

public interface SocialTenantMapper extends BaseMapper<SocialTenantEntity> {
    /**
     * Get the number of applications bound under the tenant
     *
     * @param tenantId Tenant ID
     * @param appId app id
     * @return The number of applications bound to the tenant
     */
    Integer selectCountByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * Update tenant deactivation status
     * @param tenantId Tenant ID
     * @param appId app id
     * @param enabled true or false
     * @return affect numbers
     */
    int updateTenantStatusByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("enabled") Boolean enabled);

    /**
     * Get tenant status
     * @param tenantId Tenant ID
     * @param appId app id
     * @return tenant status
     */
    Integer selectStatusByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * Update is Deleted
     * @param tenantId Tenant ID
     * @param appId app id
     * @return affect numbers
     */
    Integer updateIsDeletedByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("isDeleted") Boolean isDeleted);

    /**
     * Update enterprise authorization information
     *
     * @param tenantId Tenant ID
     * @param appId app id
     * @param authInfo authorize all information
     * @param authScope contacts visible range
     * @return affect numbers
     */
    Integer updateTenantAuthInfoByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("authInfo") String authInfo, @Param("authScope") String authScope);

    /**
     * search information
     *
     * @param tenantId Tenant ID
     * @param appId app id
     * @return SocialTenantEntity
     */
    SocialTenantDto selectByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);
}
