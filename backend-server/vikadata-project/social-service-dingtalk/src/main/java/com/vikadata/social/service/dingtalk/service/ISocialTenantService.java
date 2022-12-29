package com.vikadata.social.service.dingtalk.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent;
import com.vikadata.social.service.dingtalk.entity.SocialTenantEntity;
import com.vikadata.social.service.dingtalk.enums.SocialAppType;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantDto;

public interface ISocialTenantService extends IService<SocialTenantEntity> {

    boolean isTenantAppExist(String tenantId, String appId);

    void createTenant(SocialAppType appType, String suiteId, Integer status, BaseOrgSuiteEvent suiteAuthEvent);

    void updateTenantStatus(String corpId, String suiteId, boolean enabled);

    void updateTenantIsDeleteStatus(String corpId, String suiteId, Boolean isDeleted);

    Boolean getTenantStatus(String corpId, String suiteId);

    Integer updateTenantAuthInfo(String tenantId, String appId, BaseOrgSuiteEvent changeEvent);
    
    SocialTenantDto getByTenantIdAndAppId(String tenantId, String appId);
}
