package com.vikadata.api.modular.social.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;

/**
 * 第三方平台集成-企业租户绑定空间 服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-08 23:53:48
 */
public interface ISocialTenantBindService extends IService<SocialTenantBindEntity> {

    /**
     * 获取租户绑定状态
     *
     * @param tenantId 第三方企业标识
     * @return True | False
     * @author Shawn Deng
     * @date 2020/12/14 15:26
     */
    boolean getTenantBindStatus(String tenantId);

    /**
     * 获取空间绑定状态
     *
     * @param spaceId 空间ID
     * @return True | False
     * @author Shawn Deng
     * @date 2020/12/14 15:26
     */
    boolean getSpaceBindStatus(String spaceId);

    /**
     * 获取空间绑定的租户
     *
     * @param spaceId 空间ID
     * @return 租户标识
     * @author Shawn Deng
     * @date 2020/12/16 19:26
     */
    List<String> getTenantIdBySpaceId(String spaceId);

    /**
     * 获取空间绑定的租户
     *
     * @param spaceId 空间ID
     * @return SocialTenantBindEntity
     */
    SocialTenantBindEntity getBySpaceId(String spaceId);

    /**
     * 获取企业绑定的空间列表
     * 废弃： 不同应用下的租户是一样的
     * @param tenantId 第三方企业标识
     * @return 绑定的空间列表
     * @author Shawn Deng
     * @date 2020/12/14 15:26
     */
    @Deprecated
    List<String> getSpaceIdsByTenantId(String tenantId);

    /**
     * 获取企业绑定的空间列表
     *
     * @param tenantId 第三方企业标识
     * @param appId 应用ID
     * @return 绑定的空间列表
     * @author Shawn Deng
     * @date 2020/12/14 15:26
     */
    List<String> getSpaceIdsByTenantIdAndAppId(String tenantId, String appId);

    /**
     * 检查空间绑定租户是否存在
     * @param appId 应用ID
     * @param spaceId 空间ID
     * @param tenantId 租户标识
     * @return true | false
     */
    boolean checkExistBySpaceIdAndTenantId(String appId, String spaceId, String tenantId);

    /**
     * 企业绑定空间
     *
     * @param appId 第三方应用ID
     * @param tenantId 第三方企业标识
     * @param spaceId 空间ID
     * @author Shawn Deng
     * @date 2020/12/14 15:26
     */
    void addTenantBind(String appId, String tenantId, String spaceId);

    /**
     * 查询企业的绑定信息
     *
     * @param tenantId 租户 ID
     * @param appId 应用 ID
     * @return 绑定信息
     * @author 刘斌华
     * @date 2022-06-16 16:17:43
     */
    SocialTenantBindEntity getByTenantIdAndAppId(String tenantId, String appId);

    /**
     * 移除空间指定的租户
     * @param spaceId 空间ID
     * @param tenantId 第三方企业标识
     */
    void removeBySpaceIdAndTenantId(String spaceId, String tenantId);

    /**
     * 获取空间绑定租户列表
     *
     * @param spaceId 空间ID
     * @return 绑定租户列表
     * @author zoe zheng
     * @date 2021/5/12 3:48 下午
     */
    TenantBindDTO getTenantBindInfoBySpaceId(String spaceId);

    /**
     * 钉钉第三方集成获取租户绑定状态
     * @param tenantId 第三方企业标识
     * @param appId 第三方应用标识
     * @return boolean
     * @author zoe zheng
     * @date 2021/5/12 6:16 下午
     */
    boolean getDingTalkTenantBindStatus(String tenantId, String appId);

    /**
     * 企业微信第三方应用是否已绑定空间站
     * @param tenantId 第三方企业标识
     * @param appId 第三方应用标识
     * @return true | false
     */
    boolean getWeComTenantBindStatus(String tenantId, String appId);

    /**
     * 钉钉应用绑定空间
     *
     * @param agentId  应用的agentId
     * @param spaceId    空间ID
     * @param operatorUserId 绑定空间的操作用户ID
     * @param contactMap 通讯录可见范围
     * @return 绑定成功的钉钉用户ID
     * @author zoe zheng
     * @date 2021/5/11 11:51 上午
     */
    Set<String> dingTalkAppBindSpace(String agentId, String spaceId, Long operatorUserId, LinkedHashMap<Long,
            DingTalkContactDTO> contactMap);

    /**
     * 钉钉第三方集成获取租户绑定空间站ID
     *
     * @param tenantId 第三方企业标识
     * @param appId 第三方应用标识
     * @return boolean
     * @author zoe zheng
     * @date 2021/5/12 6:16 下午
     */
    String getTenantBindSpaceId(String tenantId, String appId);

    /**
     * 解绑空间站绑定的应用
     *
     * @param spaceId 空间站ID
     * @author zoe zheng
     * @date 2021/5/17 9:06 下午
     */
    void removeBySpaceId(String spaceId);

    /**
     * 钉钉应用绑定空间
     *
     * @param agentId  应用的agentId
     * @param spaceId    空间ID
     * @param operatorOpenId 绑定空间的操作用户的平台ID
     * @param contactMap
     * @return 绑定成功的钉钉用户ID
     * @author zoe zheng
     * @date 2021/5/11 11:51 上午
     */
    Set<String> dingTalkRefreshContact(String spaceId, String agentId, String operatorOpenId, LinkedHashMap<Long,
            DingTalkContactDTO> contactMap);

    /**
     * 检查空间是否绑定了特定的第三方平台
     *
     * @param spaceId 空间ID
     * @param socialPlatformType 第三方平台类型
     * @return boolean
     * @author zoe zheng
     * @date 2021/8/6 4:54 下午
     */
    boolean getSpaceBindStatusByPlatformType(String spaceId, SocialPlatformType socialPlatformType);

    /**
     * 获取租户绑定的空间id
     * @param tenantKey 租户标识
     * @return 绑定的空间站id
     * @author Shawn Deng
     * @date 2021/8/30 12:23
     */
    String getTenantDepartmentBindSpaceId(String appId, String tenantKey);

    /**
     * 根据绑定平台获取空间站绑定租户授权信息
     *
     * @param spaceId               空间ID
     * @param socialPlatformType    第三方平台类型
     * @param authInfoType          授权信息Class类型 可以为NULL
     * @return 空间站绑定信息
     * @author Pengap
     * @date 2021/8/16 11:09:20
     */
    SpaceBindTenantInfoDTO getSpaceBindTenantInfoByPlatform(String spaceId, SocialPlatformType socialPlatformType, Class<?> authInfoType);

    /**
     * 获取空间对应的租户列表
     * @param spaceId 空间ID
     * @return SocialTenantEntity 列表
     */
    List<SocialTenantEntity> getFeishuTenantsBySpaceId(String spaceId);

    /**
     * 获取第三方绑定的空间站列表
     * @param tenantIds 平台ID
     * @param appIds 应用ID
     * @return List<String>
     * @author zoe zheng
     * @date 2022/6/7 17:36
     */
    List<String> getSpaceIdsByTenantIdsAndAppIds(List<String> tenantIds, List<String> appIds);

    /**
     * Get all space ID by app ID
     *
     * @param appId App ID
     * @return Space ID
     * @author Codeman
     * @date 2022-09-02 18:25:28
     */
    List<String> getAllSpaceIdsByAppId(String appId);

}
