package com.vikadata.social.service.dingtalk.service.impl;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.core.util.SqlTool;
import com.vikadata.social.service.dingtalk.entity.SocialTenantUserEntity;
import com.vikadata.social.service.dingtalk.mapper.SocialTenantUserMapper;
import com.vikadata.social.service.dingtalk.service.ISocialTenantUserService;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SocialTenantUserServiceImpl extends ServiceImpl<SocialTenantUserMapper, SocialTenantUserEntity> implements ISocialTenantUserService {

    @Override
    public void create(String tenantId, String openId, String unionId) {
        SocialTenantUserEntity tenantUserEntity = new SocialTenantUserEntity();
        tenantUserEntity.setTenantId(tenantId);
        tenantUserEntity.setOpenId(openId);
        tenantUserEntity.setUnionId(unionId);
        save(tenantUserEntity);
    }

    @Override
    public void createBatch(List<SocialTenantUserEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        baseMapper.insertBatch(entities);
    }

    @Override
    public boolean isTenantUserOpenIdExist(String tenantId, String openId) {
        return SqlTool.retCount(baseMapper.selectCountByTenantIdAndOpenId(tenantId, openId)) > 0;
    }

    @Override
    public void deleteByTenantIdAndOpenId(String tenantId, String openId) {
        baseMapper.deleteByTenantIdAndOpenId(tenantId, openId);
    }
}
