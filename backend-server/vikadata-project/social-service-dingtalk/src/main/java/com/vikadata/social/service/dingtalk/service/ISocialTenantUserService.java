package com.vikadata.social.service.dingtalk.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.social.service.dingtalk.entity.SocialTenantUserEntity;

public interface ISocialTenantUserService extends IService<SocialTenantUserEntity> {


    void create(String tenantId, String openId, String unionId);

    void createBatch(List<SocialTenantUserEntity> entities);

    boolean isTenantUserOpenIdExist(String tenantId, String openId);
    
    void deleteByTenantIdAndOpenId(String tenantId, String openId);
}
