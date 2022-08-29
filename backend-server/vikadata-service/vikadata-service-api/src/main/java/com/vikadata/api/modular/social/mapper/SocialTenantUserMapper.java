package com.vikadata.api.modular.social.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.mapper.ExpandBaseMapper;
import com.vikadata.api.modular.social.model.SocialTenantUserDTO;
import com.vikadata.entity.SocialTenantUserEntity;

/**
 * 第三方平台集成-企业租户用户 Mapper
 *
 * @author Shawn Deng
 * @date 2020-12-18 00:26:37
 */
public interface SocialTenantUserMapper extends ExpandBaseMapper<SocialTenantUserEntity> {

    /**
     * 快速批量插入
     *
     * @param entities 列表
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2019/12/17 20:34
     */
    int insertBatch(@Param("entities") List<SocialTenantUserEntity> entities);

    /**
     * 查询租户下的所有unionId
     *
     * @param tenantId 租户标识
     * @return unionId
     * @author Shawn Deng
     * @date 2020/12/22 00:18
     */
    List<String> selectUnionIdsByTenantId(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 查询租户下的所有openId
     *
     * @param tenantId 租户标识
     * @return openId
     * @author Shawn Deng
     * @date 2020/12/22 00:18
     */
    List<String> selectOpenIdsByTenantId(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 删除租户的记录
     *
     * @param tenantId 租户ID
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2020/12/15 10:16
     */
    int deleteByTenantId(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 查询租户下的用户是否存在
     *
     * @param tenantId 租户ID
     * @param openId   租户下用户标识
     * @return 总数
     * @author Shawn Deng
     * @date 2020/12/22 12:12
     */
    Integer selectCountByTenantIdAndOpenId(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("openId") String openId);

    /**
     * 根据openId查询unionId
     *
     * @param tenantId 租户标识
     * @param openId 租户下用户标识
     * @return unionId
     * @author Shawn Deng
     * @date 2020/12/22 12:55
     */
    String selectUnionIdByOpenId(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("openId") String openId);

    /**
     * 根据openId查询unionId
     *
     * @param tenantId 租户标识
     * @param openIds 租户下用户标识列表
     * @return unionId
     * @author Shawn Deng
     * @date 2020/12/22 12:55
     */
    List<String> selectUnionIdsByOpenIds(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("openIds") List<String> openIds);

    /**
     * 根据unionId查询openId
     *
     * @param tenantId 租户标识
     * @param unionIds 租户下用户标识列表
     * @return unionId
     * @author Shawn Deng
     * @date 2020/12/22 12:55
     */
    List<String> selectOpenIdByAppIdAndTenantIdAndUnionIds(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("unionIds") List<String> unionIds);

    /**
     * 删除租户下用户
     *
     * @param tenantId 租户标识
     * @param openId   租户下用户标识
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/22 12:47
     */
    int deleteByTenantIdAndOpenId(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("openId") String openId);

    /**
     * 批量删除
     *
     * @param tenantId 租户标识
     * @param openIds 租户下用户标识
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/22 15:23
     */
    int deleteBatchByTenantIdAndOpenId(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("openIds") List<String> openIds);

    /**
     * 批量删除
     *
     * @param tenantId 租户标识
     * @param openIds 租户下用户标识
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/22 15:23
     */
    int deleteBatchByOpenId(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("openIds") List<String> openIds);

    /**
     * 根据unionId 查询openId
     *
     * @param unionId 用户统一ID
     * @param platformType 平台标识
     * @return 租户下用户标识
     * @author zoe zheng
     * @date 2021/9/13 4:13 下午
     */
    String selectOpenIdByUnionIdAndPlatform(@Param("unionId") String unionId,
            @Param("platformType") SocialPlatformType platformType);

    /**
     * 根据应用和租户标识删除
     * @param appId 应用标识
     * @param tenantId 租户标识
     * @return 执行
     */
    int deleteByAppIdAndTenantId(@Param("appId") String appId, @Param("tenantId") String tenantId);

    /**
     * 获取企业用户的unionId和openId
     *
     * @param tenantId 租户ID
     * @return List<SocialTenantUserDTO>
     * @author zoe zheng
     * @date 2022/2/15 14:37
     */
    List<SocialTenantUserDTO> selectOpenIdAndUnionIdByTenantId(@Param("tenantId") String tenantId, @Param("appId") String appId);
}
