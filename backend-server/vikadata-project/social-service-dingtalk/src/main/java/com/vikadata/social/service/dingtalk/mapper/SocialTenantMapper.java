package com.vikadata.social.service.dingtalk.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.social.service.dingtalk.entity.SocialTenantEntity;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantDto;

/**
 * <p>
 * 第三方集成 - 企业租户表 Mapper 接口
 * </p>
 * @author zoe zheng
 * @date 2021/8/30 2:44 下午
 */
public interface SocialTenantMapper extends BaseMapper<SocialTenantEntity> {
    /**
     * 获取租户下绑定的应用数量
     *
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return 租户绑定的应用数量
     * @author zoe zheng
     * @date 2021/5/20 6:09 下午
     */
    Integer selectCountByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 更新租户停启用状态
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @param enabled true 或者 false
     * @return 影响条数
     */
    int updateTenantStatusByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("enabled") Boolean enabled);

    /**
     * 获取租户状态
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return 租户状态
     * @author zoe zheng
     * @date 2021/9/16 1:18 下午
     */
    Integer selectStatusByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 更新isDeleted
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return 影响行数
     * @author zoe zheng
     * @date 2021/9/23 18:25
     */
    Integer updateIsDeletedByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("isDeleted") Boolean isDeleted);

    /**
     * 更新企业授权信息
     *
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @param authInfo 授权所有信息
     * @param authScope 通讯录可见范围
     * @return 影响行数
     * @author zoe zheng
     * @date 2021/9/24 14:08
     */
    Integer updateTenantAuthInfoByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("authInfo") String authInfo, @Param("authScope") String authScope);

    /**
     * 查询信息
     *
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return SocialTenantEntity
     * @author zoe zheng
     * @date 2021/10/13 13:01
     */
    SocialTenantDto selectByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);
}
