package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.social.model.CpTenantUserDTO;
import com.vikadata.entity.SocialCpTenantUserEntity;

/**
 * <p>
 * 第三方平台集成-企业微信租户用户 Mapper
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:26:21
 */
public interface SocialCpTenantUserMapper extends BaseMapper<SocialCpTenantUserEntity> {

    /**
     * 快速批量插入
     *
     * @param entities 列表
     * @return 执行结果数
     * @author Pengap
     * @date 2021/8/5 20:40:41
     */
    int insertBatch(@Param("entities") List<SocialCpTenantUserEntity> entities);

    /**
     * 查询租户下的所有openId
     *
     * @param tenantId 租户标识
     * @param appId    租户应用标识
     * @return openIds
     * @author Pengap
     * @date 2021/8/5 20:40:41
     */
    List<CpTenantUserDTO> selectOpenIdsByTenantId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * 批量删除企业微信用户
     *
     * @param tenantId  企业微信Id
     * @param appId     企业微信应用Id
     * @param cpUserIds 企业微信用户Ids
     * @return int
     * @author Pengap
     * @date 2021/8/16 21:17:32
     */
    int batchDeleteByCorpAgent(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserIds") List<String> cpUserIds);

    /**
     * 查询企业为成员信息
     *
     * @param tenantId  企业微信Id
     * @param appId     企业微信应用Id
     * @param cpUserId  企业微信用户Id
     * @return 企业微信成员信息
     * @author Pengap
     * @date 2021/8/19 16:21:15
     */
    SocialCpTenantUserEntity selectByTenantIdAndAppIdAndCpUserId(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserId") String cpUserId);

    /**
     * 查询企业微信成员信息
     *
     * @param tenantId  企业微信Id
     * @param appId     企业微信应用Id
     * @param cpUserIds  企业微信用户Id
     * @return 企业微信成员信息
     * @author 刘斌华
     * @date 2022-04-13 17:09:05
     */
    List<SocialCpTenantUserEntity> selectByTenantIdAndAppIdAndCpUserIds(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserIds") List<String> cpUserIds);

    /**
     * 查询企业微信成员信息
     *
     * @param tenantId 租户 ID
     * @param appId 应用 ID
     * @param userId 维格用户 ID
     * @return 企业微信成员信息
     * @author 刘斌华
     * @date 2022-02-15 11:55:50
     */
    SocialCpTenantUserEntity selectByTenantIdAndAppIdAndUserId(@Param("tenantId") String tenantId,
            @Param("appId") String appId, @Param("userId") Long userId);

    /**
     * 查询CpTenantUserId
     *
     * @param tenantId  企业微信Id
     * @param appId     企业微信应用Id
     * @param cpUserId  企业微信用户Id
     * @return 企业微信成员信息
     * @author Pengap
     * @date 2021/8/19 16:21:15
     */
    Long selectIdByTenantIdAndAppIdAndCpUserId(@Param("tenantId") String tenantId, @Param("appId") String appId, @Param("cpUserId") String cpUserId);

}
