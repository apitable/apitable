package com.vikadata.social.service.dingtalk.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent;
import com.vikadata.social.service.dingtalk.entity.SocialTenantEntity;
import com.vikadata.social.service.dingtalk.enums.SocialAppType;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantDto;

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
     * @author Shawn Deng 
     * @date 2021/8/2 16:39
     */
    boolean isTenantAppExist(String tenantId, String appId);

    /**
     * 新增第三方平台租户
     *
     * @param appType    应用类型
     * @param suiteId    套件ID
     * @param status  状态，0 停用，1 启用
     * @author zoe zheng
     * @date 2021/9/10 5:36 下午
     */
    void createTenant(SocialAppType appType, String suiteId, Integer status, BaseOrgSuiteEvent suiteAuthEvent);

    /**
     * 更新租户状态
     *
     * @param corpId 租户ID
     * @param suiteId 套件ID
     * @param enabled true ｜ false
     * @author zoe zheng
     * @date 2021/9/16 12:57 下午
     */
    void updateTenantStatus(String corpId, String suiteId, boolean enabled);

    /**
     * 删除租户
     * @param corpId 租户ID
     * @param suiteId 套件ID
     * @param isDeleted 是否删除
     * @author zoe zheng
     * @date 2021/9/23 18:24
     */
    void updateTenantIsDeleteStatus(String corpId, String suiteId, Boolean isDeleted);

    /**
     * 获取租户状态
     *
     * @param corpId 租户ID
     * @param suiteId 套件ID
     * @return 租户状态
     * @author zoe zheng
     * @date 2021/9/16 1:17 下午
     */
    Boolean getTenantStatus(String corpId, String suiteId);

    /**
     * 更新企业授权信息
     * @param tenantId 企业标识
     * @param appId 应用标识
     * @param changeEvent 事件
     * @return 处理结果
     * @author zoe zheng
     * @date 2021/9/24 13:59
     */
    Integer updateTenantAuthInfo(String tenantId, String appId, BaseOrgSuiteEvent changeEvent);

    /**
     * 查询信息
     *
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return SocialTenantEntity
     * @author zoe zheng
     * @date 2021/10/13 13:01
     */
    SocialTenantDto getByTenantIdAndAppId(String tenantId, String appId);
}
