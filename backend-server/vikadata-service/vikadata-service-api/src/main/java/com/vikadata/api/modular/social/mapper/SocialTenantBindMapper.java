package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.entity.SocialTenantBindEntity;

/**
 * 第三方平台集成-企业租户绑定空间表 Mapper
 *
 * @author Shawn Deng
 * @date 2020-12-02 18:05:48
 */
public interface SocialTenantBindMapper extends BaseMapper<SocialTenantBindEntity> {

    /**
     * 查询空间绑定的租户总数
     *
     * @param spaceId 空间ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/12/14 14:50
     */
    Integer selectCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询租户绑定的空间总数
     *
     * @param tenantId 租户ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/12/14 14:50
     */
    Integer selectCountByTenantId(@Param("tenantId") String tenantId);

    /**
     * 查询空间绑定的租户标识
     *
     * @param spaceId 空间ID
     * @return 租户标识
     * @author Shawn Deng
     * @date 2020/12/16 19:24
     */
    List<String> selectTenantIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询租户绑定的所有空间
     *
     * @param tenantId 租户ID
     * @return 空间ID列表
     * @author Shawn Deng
     * @date 2020/12/14 14:51
     */
    List<String> selectSpaceIdByTenantId(@Param("tenantId") String tenantId);

    /**
     * 查询租户绑定的所有空间
     *
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return 空间ID列表
     * @author zoe zheng
     * @date 2021/9/23 16:23
     */
    List<String> selectSpaceIdsByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 删除租户绑定
     *
     * @param spaceId 空间ID
     * @param tenantId 租户ID
     * @return 成功执行数
     * @author Shawn Deng
     * @date 2020/12/14 14:51
     */
    int deleteBySpaceIdAndTenantId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId);

    /**
     * 批量删除租户绑定
     *
     * @param tenantIds 租户ID列表
     * @return 成功执行数
     * @author Shawn Deng
     * @date 2020/12/14 14:52
     */
    int deleteBatchByTenantId(@Param("tenantIds") List<String> tenantIds);

    /**
     * 获取空间站绑定信息
     *
     * @param spaceId 空间ID
     * @return 租户Id列表
     * @author zoe zheng
     * @date 2021/5/12 3:44 下午
     */
    TenantBindDTO selectBaseInfoBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询租户绑定的空间总数
     *
     * @param tenantId 租户ID
     * @param appId 租户appId
     * @return Integer
     * @author zoe zheng
     * @date 2021/5/12 6:17 下午
     */
    Integer selectCountByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);


    /**
     * 获取租户绑定空间站ID
     *
     * @param tenantId 租户ID
     * @param appId 租户appId
     * @return 空间ID
     * @author zoe zheng
     * @date 2021/5/12 3:44 下午
     */
    String selectSpaceIdByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);


    /**
     * 获取租户绑定空间站ID
     *
     * @param tenantId 租户ID
     * @param appId 租户appId
     * @return 空间ID
     * @author zoe zheng
     * @date 2021/5/12 3:44 下午
     */
    SocialTenantBindEntity selectByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 根据租户ID和应用ID删除绑定关系
     *
     * @param spaceId 空间站ID
     * @return 删除记录条数
     * @author zoe zheng
     * @date 2021/5/17 9:01 下午
     */
    int deleteBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间绑定的租户类型总数
     *
     * @param spaceId 空间站ID
     * @param platform 所属平台(1: 企业微信, 2: 钉钉, 3: 飞书)
     * @return 记录总数
     * @author zoe zheng
     * @date 2021/8/6 4:45 下午
     */
    Integer selectCountBySpaceIdAndPlatform(@Param("spaceId") String spaceId, @Param("platform") Integer platform);

    /**
     * 查询空间绑定的租户授权信息
     *
     * @param spaceId   空间站ID
     * @param platform  所属平台(1: 企业微信, 2: 钉钉, 3: 飞书)
     * @return 空间绑定租户授权信息
     * @author Pengap
     * @date 2021/8/16 11:17:07
     */
    SpaceBindTenantInfoDTO selectSpaceBindTenantInfoByPlatform(@Param("spaceId") String spaceId, @Param("platform") Integer platform);

    /**
     * 查询第三方绑定的企业的空间
     * todo 这里是全表扫描
     * @param platformType 所属平台(1: 企业微信, 2: 钉钉, 3: 飞书)
     * @param appType 应用类型
     * @return List<String>
     * @author zoe zheng
     * @date 2021/11/1 12:11
     */
    List<String> selectSpaceIdByPlatformTypeAndAppType(@Param("platformType") SocialPlatformType platformType,
            @Param("appType") SocialAppType appType);

    /**
     * 根据空间和租户标识删除
     * @param tenantId 租户标识
     * @param spaceId 空间标识
     */
    int deleteByTenantIdAndSpaceId(@Param("tenantId") String tenantId, @Param("spaceId") String spaceId);

    /**
     * 根据空间和租户标识查询
     * @param spaceId 空间标识
     * @param tenantId 租户标识
     * @return SocialTenantBindEntity List
     */
    List<SocialTenantBindEntity> selectBySpaceIdAndTenantId(@Param("spaceId") String spaceId, @Param("tenantId") String tenantId);

    /**
     * 查询空间绑定的租户
     * @param spaceId 空间标识
     * @return SocialTenantBindEntity
     */
    SocialTenantBindEntity selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 获取第三方绑定的空间站列表
     * @param tenantIds 平台ID
     * @param appIds 应用ID
     * @return List<String>
     * @author zoe zheng
     * @date 2022/6/7 17:36
     */
    List<String> selectSpaceIdsByTenantIdsAndAppIds(@Param("tenantIds") List<String> tenantIds,
            @Param("appIds") List<String> appIds);
}
