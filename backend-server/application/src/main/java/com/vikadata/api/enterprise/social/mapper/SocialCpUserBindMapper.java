package com.vikadata.api.enterprise.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialCpUserBindEntity;

/**
 * <p>
 * Third party platform integration WeCom user binding Mapper
 * </p>
 */
public interface SocialCpUserBindMapper extends BaseMapper<SocialCpUserBindEntity> {

    /**
     * Query user ID
     *
     * @param cpTenantUserId    Third party platform user ID (Social Cp Tenant User ID)
     * @return user ID
     */
    Long selectUserIdByCpTenantUserId(@Param("cpTenantUserId") Long cpTenantUserId);

    /**
     * Get information in batches
     *
     * @param cpTenantUserIds Third party platform user ID (Social Cp Tenant User ID)
     * @return Information List
     */
    List<SocialCpUserBindEntity> selectByCpTenantUserIds(@Param("cpTenantUserIds") List<Long> cpTenantUserIds);

    /**
     * Query user ID
     *
     * @param tenantId  Enterprise Id
     * @param cpUserId  Application User Id
     * @return User ID
     */
    Long selectUserIdByTenantIdAndCpUserId(@Param("tenantId") String tenantId, @Param("cpUserId") String cpUserId);

    /**
     * Get Open Id
     *
     * @param tenantId  Enterprise Id
     * @param userId    vika User ID
     * @return WeChat OpenId
     */
    String selectOpenIdByTenantIdAndUserId(@Param("tenantId") String tenantId, @Param("userId") Long userId);

    /**
     * Batch Delete WeCom Binding Relationship
     *
     * @param removeCpTenantUserIds Third party platform user unique ID (Social Cp Tenant User ID)
     * @return int Number of rows affected
     */
    int batchDeleteByCpTenantUserIds(@Param("removeCpTenantUserIds") List<Long> removeCpTenantUserIds);

    /**
     * Count the number of specified users under the specified tenant
     *
     * @param tenantId    Tenant Id
     * @param userId      User Id
     * @return Number of users
     */
    Long countTenantBindByUserId(@Param("tenantId") String tenantId, @Param("userId") Long userId);

    /**
     * Physical deletion based on user ID
     * @param userId user id
     * @return deleted number
     */
    int deleteByUserId(@Param("userId") Long userId);
}
