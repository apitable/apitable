package com.vikadata.social.service.dingtalk.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.service.dingtalk.entity.SocialTenantUserEntity;

/**
 * <p>
 * 第三方集成 - 企业租户 服务 接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/30 17:13
 */
public interface ISocialTenantUserService extends IService<SocialTenantUserEntity> {

    /**
     * 创建
     *
     * @param tenantId 租户标识
     * @param openId   租户用户标识
     * @param unionId  租户用户唯一标识
     * @author zoe zheng
     * @date 2021/9/18 13:38
     */
    void create(String tenantId, String openId, String unionId);

    /**
     * 批量插入
     *
     * @param entities 实体列表
     * @author zoe zheng
     * @date 2021/9/18 13:25
     */
    void createBatch(List<SocialTenantUserEntity> entities);

    /**
     * 租户的用户是否存在
     *
     * @param tenantId 租户标识
     * @param openId   租户下用户标识
     * @return TRUE | FALSE
     * @author zoe zheng
     * @date 2021/9/18 13:26
     */
    boolean isTenantUserOpenIdExist(String tenantId, String openId);

    /**
     * 移除租户用户记录
     *
     * @param tenantId 租户标识
     * @param openId   租户下用户标识
     * @author zoe zheng
     * @date 2021/9/22 13:46
     */
    void deleteByTenantIdAndOpenId(String tenantId, String openId);
}
