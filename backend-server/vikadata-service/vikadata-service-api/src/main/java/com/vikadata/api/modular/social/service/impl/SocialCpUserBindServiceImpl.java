package com.vikadata.api.modular.social.service.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.social.mapper.SocialCpUserBindMapper;
import com.vikadata.api.modular.social.service.ISocialCpTenantUserService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.core.util.SqlTool;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SocialCpUserBindEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 第三方平台集成-企业微信用户绑定 服务接口
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:19:36
 */
@Slf4j
@Service
public class SocialCpUserBindServiceImpl extends ServiceImpl<SocialCpUserBindMapper, SocialCpUserBindEntity> implements ISocialCpUserBindService {

    @Resource
    private ISocialCpTenantUserService iSocialCpTenantUserService;

    @Override
    public void create(Long userId, Long cpTenantUserId) {
        SocialCpUserBindEntity cpUserBind = new SocialCpUserBindEntity()
                .setUserId(userId)
                .setCpTenantUserId(cpTenantUserId);
        boolean flag = save(cpUserBind);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public Long getUserIdByTenantIdAndAppIdAndCpUserId(String tenantId, String appId, String cpUserId) {
        Long cpTenantUserId = iSocialCpTenantUserService.getCpTenantUserId(tenantId, appId, cpUserId);
        return getUserIdByCpTenantUserId(cpTenantUserId);
    }

    @Override
    public Long getUserIdByTenantIdAndCpUserId(String tenantId, String cpUserId) {
        return baseMapper.selectUserIdByTenantIdAndCpUserId(tenantId, cpUserId);
    }

    @Override
    public Long getUserIdByCpTenantUserId(Long cpTenantUserId) {
        return baseMapper.selectUserIdByCpTenantUserId(cpTenantUserId);
    }

    @Override
    public List<SocialCpUserBindEntity> getByCpTenantUserIds(List<Long> cpTenantUserIds) {
        return baseMapper.selectByCpTenantUserIds(cpTenantUserIds);
    }

    @Override
    public String getOpenIdByTenantIdAndUserId(String tenantId, Long userId) {
        return baseMapper.selectOpenIdByTenantIdAndUserId(tenantId, userId);
    }

    @Override
    public boolean isCpTenantUserIdBind(Long userId, Long cpTenantUserId) {
        Long bindUserId = getUserIdByCpTenantUserId(cpTenantUserId);
        return ObjectUtil.equals(bindUserId, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDeleteByCpTenantUserIds(List<Long> removeCpTenantUserIds) {
        if (CollUtil.isEmpty(removeCpTenantUserIds)) {
            return;
        }
        baseMapper.batchDeleteByCpTenantUserIds(removeCpTenantUserIds);
    }

    @Override
    public long countTenantBindByUserId(String tenantId, Long userId) {
        return SqlTool.retCount(baseMapper.countTenantBindByUserId(tenantId, userId));
    }

    @Override
    public void deleteByUserId(Long userId) {
        baseMapper.deleteByUserId(userId);
    }

}
