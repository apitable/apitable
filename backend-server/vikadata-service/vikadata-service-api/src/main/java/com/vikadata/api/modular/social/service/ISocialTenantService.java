package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.model.TenantBaseInfoDto;
import com.vikadata.entity.SocialTenantEntity;

/**
 * <p>
 * 第三方集成 - 企业租户 服务 接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/30 17:13
 */
public interface ISocialTenantService extends IService<SocialTenantEntity> {

    /**
     * 企业是否存在
     * @param tenantId 企业标识
     * @param appId 应用标识
     * @return true | false
     */
    boolean isTenantExist(String tenantId, String appId);

    /**
     * 新增第三方平台租户
     *
     * @param socialType 第三方社交软件平台类型
     * @param appType    应用类型
     * @param appId      应用ID
     * @param tenantId   企业标识
     * @author Shawn Deng
     * @date 2020/12/14 15:30
     */
    void createTenant(SocialPlatformType socialType, SocialAppType appType, String appId, String tenantId, String contactScope);

    /**
     * 更新租户状态
     * @param tenantId 租户ID
     * @param appId    应用ID
     * @param enabled true ｜ false
     */
    void updateTenantStatus(String appId, String tenantId, boolean enabled);

    /**
     * 租户停用
     *
     * @param appId    应用ID
     * @param tenantId 企业标识
     * @author Shawn Deng
     * @date 2020/12/14 15:30
     */
    void stopByTenant(String appId, String tenantId);

    /**
     * 停用租户
     *
     * @param appId    应用ID
     * @param tenantId 企业标识
     * @param spaceId 空间ID
     * @author Shawn Deng
     * @date 2020/12/14 15:30
     */
    void removeTenant(String appId, String tenantId, String spaceId);

    /**
     * 移除飞书自建应用
     * @param appId    应用ID
     * @param tenantId 企业标识
     * @param spaceId 空间ID
     */
    void removeInternalTenant(String appId, String tenantId, String spaceId);

    /**
     * 获取租户信息
     *
     * @param appId 应用ID
     * @param tenantId 企业标识
     * @return SocialTenantEntity
     * @author Shawn Deng
     * @date 2020/12/15 11:31
     */
    SocialTenantEntity getByAppIdAndTenantId(String appId, String tenantId);

    /**
     * 删除平台绑定信息
     *
     * @param spaceId 空间站ID
     * @author zoe zheng
     * @date 2021/5/20 4:28 下午
     */
    void removeSpaceIdSocialBindInfo(String spaceId);

    /**
     * 新增或者更新第三方平台租户
     *
     * @param socialType 第三方社交软件平台类型
     * @param appType    应用类型
     * @param appId      应用ID
     * @param tenantId   企业标识
     * @param scope 应用通讯录可见范围
     * @param authInfo 企业授权信息
     * @author zoe zheng
     * @date 2021/5/21 3:48 下午
     */
    void createOrUpdateWithScope(SocialPlatformType socialType, SocialAppType appType, String appId, String tenantId,
            String scope, String authInfo);

    /**
     * 根据企业 ID 和应用 ID 新增或者更新第三方平台租户信息
     *
     * @param entity 数据信息
     * @author 刘斌华
     * @date 2022-01-06 16:01:36
     */
    void createOrUpdateByTenantAndApp(SocialTenantEntity entity);

    /**
     * 获取钉钉应用的agentId
     *
     * @param tenantId 租户唯一标识
     * @param appId 租户应用唯一标识
     * @return agentId
     * @author zoe zheng
     * @date 2021/6/10 4:28 下午
     */
    String getDingTalkAppAgentId(String tenantId, String appId);

    /**
     * 获取租户企业具体信息
     *
     * @param tenantId 租户唯一标识
     * @param appId 租户应用唯一标识
     * @return TenantBaseInfoDto
     * @author zoe zheng
     * @date 2021/9/23 14:20
     */
    TenantBaseInfoDto getTenantBaseInfo(String tenantId, String appId);

    /**
     * 检查租户绑定状态
     *
     * @param tenantId 租户唯一标识
     * @param appId 租户应用唯一标识
     * @return boolean
     * @author zoe zheng
     * @date 2021/9/24 17:52
     */
    boolean isTenantActive(String tenantId, String appId);

    /**
     * 批量查询租户实体类
     * @param tenantIds 租户ID列表
     * @return SocialTenantEntity List
     */
    List<SocialTenantEntity> getByTenantIds(List<String> tenantIds);

    /**
     * 查询第三方平台信息
     * @param platformType 平台类型
     * @param appType 应用类型
     * @return List<SocialTenantEntity>
     * @author zoe zheng
     * @date 2022/6/7 17:27
     */
    List<SocialTenantEntity> getByPlatformTypeAndAppType(SocialPlatformType platformType, SocialAppType appType);

    /**
     * 查询第三方平台绑定空间站列表
     * @param platformType 平台类型
     * @param appType 应用类型
     * @return List<SocialTenantEntity>
     * @author zoe zheng
     * @date 2022/6/7 17:27
     */
    List<String> getSpaceIdsByPlatformTypeAndAppType(SocialPlatformType platformType, SocialAppType appType);
}
