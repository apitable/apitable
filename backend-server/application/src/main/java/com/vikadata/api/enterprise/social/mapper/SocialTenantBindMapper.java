package com.vikadata.api.enterprise.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.enterprise.social.model.TenantBindDTO;
import com.vikadata.entity.SocialTenantBindEntity;

/**
 * Third party platform integration - enterprise tenant binding space table Mapper
 */
public interface SocialTenantBindMapper extends BaseMapper<SocialTenantBindEntity> {

    /**
     * Total number of tenants querying space binding
     *
     * @param spaceId Space ID
     * @return Total
     */
    Integer selectCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query the total space bound by the tenant
     *
     * @param tenantId Tenant ID
     * @return Total
     */
    Integer selectCountByTenantId(@Param("tenantId") String tenantId);

    /**
     * Query the tenant ID of the space binding
     *
     * @param spaceId Space ID
     * @return Tenant ID
     */
    List<String> selectTenantIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query all spaces bound by the tenant
     *
     * @param tenantId Tenant ID
     * @return Space ID List
     */
    List<String> selectSpaceIdByTenantId(@Param("tenantId") String tenantId);

    /**
     * Query all spaces bound by the tenant
     *
     * @param tenantId Tenant ID
     * @param appId App ID
     * @return Space ID List
     */
    List<String> selectSpaceIdsByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * Delete Tenant Binding
     *
     * @param spaceId Space ID
     * @param tenantId Tenant ID
     * @return Number of successful executions
     */
    int deleteBySpaceIdAndTenantId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId);

    /**
     * Batch delete tenant bindings
     *
     * @param tenantIds Tenant ID List
     * @return Number of successful executions
     */
    int deleteBatchByTenantId(@Param("tenantIds") List<String> tenantIds);

    /**
     * Get the binding information of the space
     *
     * @param spaceId Space ID
     * @return Tenant Id List
     */
    TenantBindDTO selectBaseInfoBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query the total space bound by the tenant
     *
     * @param tenantId Tenant ID
     * @param appId Tenant app Id
     * @return Integer
     */
    Integer selectCountByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);


    /**
     * Get the tenant bound space station ID
     *
     * @param tenantId Tenant ID
     * @param appId Tenant app Id
     * @return Space ID
     */
    String selectSpaceIdByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);


    /**
     * Get the tenant bound space station ID
     *
     * @param tenantId Tenant ID
     * @param appId Tenant app Id
     * @return Space ID
     */
    SocialTenantBindEntity selectByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * Delete binding relationship according to tenant ID and application ID
     *
     * @param spaceId Space ID
     * @return Number of records deleted
     */
    int deleteBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Total number of tenant types for querying space binding
     *
     * @param spaceId Space ID
     * @param platform Platform(1: WeChat, 2: DingTalk, 3: Lark)
     * @return Total Records
     */
    Integer selectCountBySpaceIdAndPlatform(@Param("spaceId") String spaceId, @Param("platform") Integer platform);

    /**
     * Query the tenant authorization information of space binding
     *
     * @param spaceId   Space ID
     * @param platform  Platform(1: WeChat, 2: DingTalk, 3: Lark)
     * @return Space binding tenant authorization information
     */
    SpaceBindTenantInfoDTO selectSpaceBindTenantInfoByPlatform(@Param("spaceId") String spaceId, @Param("platform") Integer platform);

    /**
     * Query the space of enterprises bound by third parties
     * todo Here is full table scanning
     * @param platformType Platform(1: WeChat, 2: DingTalk, 3: Lark)
     * @param appType Application Type
     * @return List<String>
     */
    List<String> selectSpaceIdByPlatformTypeAndAppType(@Param("platformType") SocialPlatformType platformType,
            @Param("appType") SocialAppType appType);

    /**
     * Delete based on space and tenant identity
     * @param tenantId Tenant ID
     * @param spaceId Space ID
     */
    int deleteByTenantIdAndSpaceId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * Query based on space and tenant identity
     * @param spaceId Space ID
     * @param tenantId Tenant ID
     * @return SocialTenantBindEntity List
     */
    List<SocialTenantBindEntity> selectBySpaceIdAndTenantId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId);

    /**
     * Query the tenants of space binding
     * @param spaceId Space ID
     * @return SocialTenantBindEntity
     */
    SocialTenantBindEntity selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Get the list of third-party bound space stations
     * @param tenantIds Platform ID
     * @param appIds App ID
     * @return List<String>
     */
    List<String> selectSpaceIdsByTenantIdsAndAppIds(@Param("tenantIds") List<String> tenantIds,
            @Param("appIds") List<String> appIds);

    /**
     * Get all space ID by app ID
     *
     * @param appId App ID
     * @return Space ID
     */
    List<String> selectAllSpaceIdsByAppId(String appId);

}
