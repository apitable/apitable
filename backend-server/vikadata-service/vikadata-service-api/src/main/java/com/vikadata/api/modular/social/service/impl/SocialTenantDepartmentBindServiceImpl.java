package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.mapper.SocialTenantDepartmentBindMapper;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;

import org.springframework.stereotype.Service;

/**
 * @author Shawn Deng
 * @date 2020-12-09 15:00:11
 */
@Service
@Slf4j
public class SocialTenantDepartmentBindServiceImpl extends ServiceImpl<SocialTenantDepartmentBindMapper, SocialTenantDepartmentBindEntity> implements ISocialTenantDepartmentBindService {

    @Resource
    private SocialTenantDepartmentBindMapper socialTenantDepartmentBindMapper;

    @Override
    public void createBatch(List<SocialTenantDepartmentBindEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        socialTenantDepartmentBindMapper.insertBatch(entities);
    }

    @Override
    public List<SocialTenantDepartmentBindEntity> getBindDepartmentList(String tenantKey, String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            // 应用首次开通，部门为空，因为停用后，绑定的数据将删除，为空
            return Collections.emptyList();
        }
        return getBindListByTenantId(tenantKey, spaceId);
    }

    @Override
    public List<SocialTenantDepartmentBindEntity> getBindListByTenantId(String tenantId, String spaceId) {
        return socialTenantDepartmentBindMapper.selectByTenantId(tenantId, spaceId);
    }

    @Override
    public Long getBindSpaceTeamId(String spaceId, String tenantId, String tenantDepartmentId) {
        return socialTenantDepartmentBindMapper.selectTeamIdByTenantDepartmentId(spaceId, tenantId, tenantDepartmentId);
    }

    @Override
    public Long getBindSpaceTeamIdBySpaceId(String spaceId, String tenantId, String tenantDepartmentId) {
        return socialTenantDepartmentBindMapper.selectSpaceTeamIdByTenantIdAndDepartmentId(spaceId, tenantId,
                tenantDepartmentId);
    }

    @Override
    public List<Long> getBindSpaceTeamIds(String spaceId, String tenantId, List<String> tenantDepartmentIds) {
        if (CollUtil.isEmpty(tenantDepartmentIds)) {
            return new ArrayList<>();
        }
        return socialTenantDepartmentBindMapper.selectTeamIdsByTenantDepartmentId(spaceId, tenantId, tenantDepartmentIds);
    }

    @Override
    public void deleteByTenantDepartmentId(String spaceId, String tenantId, String tenantDepartmentId) {
        socialTenantDepartmentBindMapper.deleteByTenantDepartmentId(spaceId, tenantId, tenantDepartmentId);
    }

    @Override
    public void deleteBatchByTenantDepartmentId(String spaceId, String tenantId, List<String> tenantDepartmentIds) {
        socialTenantDepartmentBindMapper.deleteBatchByTenantDepartmentId(spaceId, tenantId, tenantDepartmentIds);
    }

    @Override
    public void deleteByTenantId(String spaceId, String tenantId) {
        socialTenantDepartmentBindMapper.deleteByTenantId(spaceId, tenantId);
    }

    @Override
    public void deleteSpaceBindTenantDepartment(String spaceId, String tenantId, String departmentId) {
        socialTenantDepartmentBindMapper.deleteBySpaceIdAndTenantIdAndDepartmentId(spaceId, tenantId, departmentId);
    }

    @Override
    public List<Long> getBindSpaceTeamIdsByTenantId(String spaceId, String tenantId, List<String> tenantDepartmentIds) {
        if (CollUtil.isEmpty(tenantDepartmentIds)) {
            return new ArrayList<>();
        }
        return socialTenantDepartmentBindMapper.selectSpaceTeamIdsByTenantIdAndDepartmentId(spaceId, tenantId,
                tenantDepartmentIds);
    }
}
