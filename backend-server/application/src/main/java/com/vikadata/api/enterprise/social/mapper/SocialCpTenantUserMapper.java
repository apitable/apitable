package com.vikadata.api.enterprise.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enterprise.social.model.CpTenantUserDTO;
import com.vikadata.entity.SocialCpTenantUserEntity;

/**
 * <p>
 * Third party platform integration WeCom tenant user Mapper
 * </p>
 */
public interface SocialCpTenantUserMapper extends BaseMapper<SocialCpTenantUserEntity> {

    /**
     * Quick Bulk Insert
     *
     * @param entities list
     * @return Number of execution results
     */
    int insertBatch(@Param("entities") List<SocialCpTenantUserEntity> entities);

    /**
     * Query all open IDs under the tenant
     *
     * @param tenantId Tenant ID
     * @param appId    Tenant application ID
     * @return openIds
     */
    List<CpTenantUserDTO> selectOpenIdsByTenantId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * Mass deletion of We Com users
     *
     * @param tenantId  WeCom ID
     * @param appId     WeCom application ID
     * @param cpUserIds WeCom user Ids
     * @return int
     */
    int batchDeleteByCorpAgent(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserIds") List<String> cpUserIds);

    /**
     * Query the information that the enterprise is a member
     *
     * @param tenantId  WeCom ID
     * @param appId     WeCom application ID
     * @param cpUserId  WeCom user ID
     * @return WeCom member information
     */
    SocialCpTenantUserEntity selectByTenantIdAndAppIdAndCpUserId(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserId") String cpUserId);

    /**
     * Query WeCom member information
     *
     * @param tenantId  WeCom ID
     * @param appId     WeCom application ID
     * @param cpUserIds  WeCom user ID
     * @return WeCom member information
     */
    List<SocialCpTenantUserEntity> selectByTenantIdAndAppIdAndCpUserIds(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserIds") List<String> cpUserIds);

    /**
     * Query We Com member information
     *
     * @param tenantId tenant ID
     * @param appId application ID
     * @param userId vika user ID
     * @return WeCom member information
     */
    SocialCpTenantUserEntity selectByTenantIdAndAppIdAndUserId(@Param("tenantId") String tenantId,
            @Param("appId") String appId, @Param("userId") Long userId);

    /**
     * Query CpTenantUserId
     *
     * @param tenantId  WeComId
     * @param appId     WeCom application ID
     * @param cpUserId  WeCom user ID
     * @return WeCom member information
     */
    Long selectIdByTenantIdAndAppIdAndCpUserId(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserId") String cpUserId);

}
