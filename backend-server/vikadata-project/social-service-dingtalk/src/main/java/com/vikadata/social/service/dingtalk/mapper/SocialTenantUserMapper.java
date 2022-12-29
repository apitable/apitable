package com.vikadata.social.service.dingtalk.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.social.service.dingtalk.entity.SocialTenantUserEntity;

public interface SocialTenantUserMapper extends BaseMapper<SocialTenantUserEntity> {
    /**
     * fast batch insert
     *
     * @param entities list
     * @return number of execution results
     */
    int insertBatch(@Param("entities") List<SocialTenantUserEntity> entities);

    /**
     * query whether the user under the tenant exists
     *
     * @param tenantId Tenant ID
     * @param openId   user id under the tenant
     * @return total
     */
    Integer selectCountByTenantIdAndOpenId(@Param("tenantId") String tenantId, @Param("openId") String openId);

    /**
     * delete a user under a tenant
     *
     * @param tenantId Tenant ID
     * @param openId   user id under the tenant
     * @return results
     */
    int deleteByTenantIdAndOpenId(@Param("tenantId") String tenantId, @Param("openId") String openId);
}
