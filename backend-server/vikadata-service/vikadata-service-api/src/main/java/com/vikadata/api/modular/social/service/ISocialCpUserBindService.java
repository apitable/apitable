package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialCpUserBindEntity;

/**
 * <p>
 * 第三方平台集成-企业微信用户绑定 服务接口
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:19:36
 */
public interface ISocialCpUserBindService extends IService<SocialCpUserBindEntity> {

    /**
     * 创建用户绑定第三方账户
     *
     * @param userId            用户ID
     * @param cpTenantUserId    第三方用户标识（SocialCpTenantUser#ID）
     * @author Pengap
     * @date 2021/8/18 18:33:30
     */
    void create(Long userId, Long cpTenantUserId);

    /**
     * 获取用户Id
     *
     * @param tenantId  企业Id
     * @param appId     企业应用Id
     * @param cpUserId  企业微信用户Id
     * @return Vika用户Id
     * @author Pengap
     * @date 2021/8/23 15:42:32
     */
    Long getUserIdByTenantIdAndAppIdAndCpUserId(String tenantId, String appId, String cpUserId);

    /**
     * 获取用户Id
     * 同个企业不同应用只要存在绑定关系就返回用户Id
     *
     * @param tenantId  企业Id
     * @param cpUserId  企业微信用户Id
     * @return Vika用户Id
     * @author Pengap
     * @date 2021/8/23 16:03:40
     */
    Long getUserIdByTenantIdAndCpUserId(String tenantId, String cpUserId);

    /**
     * 获取用户Id
     *
     * @param cpTenantUserId   第三方平台用户标识（SocialCpTenantUser#ID）
     * @return Vika用户ID
     * @author Pengap
     * @date 2021/8/18 18:33:30
     */
    Long getUserIdByCpTenantUserId(Long cpTenantUserId);

    /**
     * 批量获取信息
     *
     * @param cpTenantUserIds 第三方平台用户标识（SocialCpTenantUser#ID）
     * @return 信息列表
     * @author 刘斌华
     * @date 2022-04-13 17:48:31
     */
    List<SocialCpUserBindEntity> getByCpTenantUserIds(List<Long> cpTenantUserIds);

    /**
     * 获取OpenId
     *
     * @param tenantId  企业Id
     * @param userId    Vika用户ID
     * @return 企业微信OpenId
     * @author Pengap
     * @date 2021/9/17 17:26:34
     */
    String getOpenIdByTenantIdAndUserId(String tenantId, Long userId);

    /**
     * 检查unionId是否绑定
     *
     * @param userId            用户维格账号ID
     * @param cpTenantUserId    第三方平台用户唯一标识（SocialCpTenantUser#ID）
     * @return 是否绑定
     * @author Pengap
     * @date 2021/8/18 18:33:30
     */
    boolean isCpTenantUserIdBind(Long userId, Long cpTenantUserId);

    /**
     * 批量删除企业微信绑定关系
     *
     * @param removeCpTenantUserIds    第三方平台用户唯一标识（SocialCpTenantUser#ID）
     * @author Pengap
     * @date 2021/8/16 21:14:02
     */
    void batchDeleteByCpTenantUserIds(List<Long> removeCpTenantUserIds);

    /**
     * 统计指定租户下，指定用户出现数量
     *
     * @param tenantId    租户Id
     * @param userId      用户Id
     * @return 用户出现数量
     * @author Pengap
     * @date 2021/9/14 17:35:24
     */
    long countTenantBindByUserId(String tenantId, Long userId);

    /**
     * 根据用户ID物理删除用户第三方信息.
     * @param userId
     */
    void deleteByUserId(Long userId);

}
