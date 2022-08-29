package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialCpTenantUserEntity;
import com.vikadata.entity.UserEntity;

/**
 * <p>
 * 第三方平台集成-企业微信租户用户 服务接口
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:20:01
 */
public interface ISocialCpTenantUserService extends IService<SocialCpTenantUserEntity> {

    /**
     * 创建
     *
     * @param tenantId  租户标识
     * @param appId     租户应用Id
     * @param cpUserId  租户用户UserId
     * @param cpOpenUserId 租户平台 OpenUserId。可能为 {@code null}
     * @author Pengap
     * @return 新增数据Id
     * @date 2021/8/5 20:36:19
     */
    Long create(String tenantId, String appId, String cpUserId, String cpOpenUserId);

    /**
     * 批量插入
     *
     * @param entities 实体列表
     * @author Pengap
     * @date 2021/8/5 20:36:19
     */
    void createBatch(List<SocialCpTenantUserEntity> entities);

    /**
     * 获取企业微信成员
     *
     * @param tenantId  租户标识
     * @param appId     租户应用Id
     * @param cpUserId  租户用户UserId
     * @return 企业微信用户信息
     * @author Pengap
     * @date 2021/8/19 16:19:14
     */
    SocialCpTenantUserEntity getCpTenantUser(String tenantId, String appId, String cpUserId);

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
    SocialCpTenantUserEntity getCpTenantUser(String tenantId, String appId, Long userId);

    /**
     * 获取CpTenantUserId
     *
     * @param tenantId  租户标识
     * @param appId     租户应用Id
     * @param cpUserId  租户用户UserId
     * @return 企业微信住户Id（主键）
     * @author Pengap
     * @date 2021/8/23 15:46:58
     */
    Long getCpTenantUserId(String tenantId, String appId, String cpUserId);

    /**
     * 批量获取 openId 对应的维格用户信息
     *
     * @param tenantId 租户 ID
     * @param appId 应用 ID
     * @param cpUserIds openId
     * @return 维格用户信息。key 对应参数中的 cpUserId（openId）
     * @author 刘斌华
     * @date 2022-04-13 17:50:08
     */
    Map<String, UserEntity> getUserByCpUserIds(String tenantId, String appId, List<String> cpUserIds);

    /**
     * 批量删除企业微信用户
     *
     * @param tenantId          企业Id
     * @param appId             企业应用Id
     * @param removeCpUserIds   企业微信用户Ids
     * @author Pengap
     * @date 2021/8/16 21:14:02
     */
    void batchDeleteByCorpAgentUsers(String tenantId, String appId, List<String> removeCpUserIds);

    /**
     * 批量删除企业微信自定义应用所有用户
     *
     * @param tenantId  企业Id
     * @param appId     企业应用Id
     * @author Pengap
     * @date 2021/8/25 18:41:37
     */
    void batchDeleteByCorpAgent(String tenantId, String appId);

    /**
     * 获取租户下的所有用户openId
     *
     * @param tenantId 租户标识
     * @param appId    租户应用标识
     * @return openIds
     * @author Pengap
     * @date 2021/8/5 20:36:19
     */
    Map<String, Long> getOpenIdsByTenantId(String tenantId, String appId);

}
