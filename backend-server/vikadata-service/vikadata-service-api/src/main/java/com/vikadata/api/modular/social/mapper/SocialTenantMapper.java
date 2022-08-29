package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.entity.SocialTenantEntity;

/**
 * <p>
 * 第三方集成 - 企业租户表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/30 17:10
 */
public interface SocialTenantMapper extends BaseMapper<SocialTenantEntity> {

    /**
     * 查询第三方平台应用的租户ID
     *
     * @param appId 应用ID
     * @return 租户标识列表
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    List<String> selectTenantIdByAppId(@Param("appId") String appId);

    /**
     * 查询租户
     *
     * @param appId    应用ID
     * @param tenantId 租户ID
     * @return SocialTenantEntity
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    SocialTenantEntity selectByAppIdAndTenantId(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 条件查询租户总数
     *
     * @param appId    应用ID
     * @param tenantId 租户ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    Integer selectCountByAppIdAndTenantId(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 重启租户
     *
     * @param appId    应用ID
     * @param tenantId 租户ID
     * @return 执行数
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    int setTenantOpen(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 停止租户
     *
     * @param appId    应用ID
     * @param tenantId 租户ID
     * @return 执行数
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    int setTenantStop(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 删除应用的所有租户
     *
     * @param appId 应用ID
     * @return 执行数
     * @author Shawn Deng
     * @date 2020/12/14 14:55
     */
    int deleteByAppId(@Param("appId") String appId);

    /**
     * 租户通讯录授权范围
     *
     * @param tenantId 租户ID
     * @param scope    通讯录授权范围
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/24 15:57
     */
    int updateScopeByTenantId(@Param("tenantId") String tenantId, @Param("scope") String scope);

    /**
     * 获取租户下绑定的应用数量
     *
     * @param tenantId 租户ID
     * @return 租户绑定的应用数量
     * @author zoe zheng
     * @date 2021/5/20 6:09 下午
     */
    Integer selectCountByTenantId(@Param("tenantId") String tenantId);

    /**
     * 获取钉钉应用的agentId
     *
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return agentId
     * @author zoe zheng
     * @date 2021/6/10 4:33 下午
     */
    String selectAgentIdByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 查询租户授权范围
     * @param tenantId 租户ID
     * @return 通讯录授权范围
     */
    String selectAuthScopeByTenantId(@Param("tenantId") String tenantId);

    /**
     * 更新租户停启用状态
     * @param appId 应用ID
     * @param tenantId 租户ID
     * @param enabled true 或者 false
     * @return 影响条数
     */
    int updateTenantStatus(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("enabled") Boolean enabled);

    /**
     * 查询租户状态
     *
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return 租户状态
     * @author zoe zheng
     * @date 2021/9/24 17:54
     */
    Integer selectTenantStatusByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 查询钉钉第三方app的agentId
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return agentId
     */
    String selectIsvAgentIdByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 批量根据租户ID查询
     * @param tenantIds 租户ID列表
     * @return SocialTenantEntity List
     */
    List<SocialTenantEntity> selectByTenantIds(@Param("tenantIds") List<String> tenantIds);

    /**
     * 根据租户ID删除
     * @param tenantId 租户ID
     * @return 执行成功行数
     */
    int deleteByTenantId(@Param("tenantId") String tenantId);

    /**
     * 查询第三方平台信息
     * @param platformType 平台类型
     * @param appType 应用类型
     * @return List<SocialTenantEntity>
     * @author zoe zheng
     * @date 2022/6/7 17:27
     */
    List<SocialTenantEntity> selectByPlatformTypeAndAppType(@Param("platformType") SocialPlatformType platformType,
            @Param("appType") SocialAppType appType);
}
