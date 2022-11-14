package com.vikadata.api.enterprise.social.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.social.mapper.SocialTenantDepartmentBindMapper;
import com.vikadata.api.enterprise.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;

import org.springframework.stereotype.Service;

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
            // The application is opened for the first time, and the department is empty, because after deactivation, the bound data will be deleted, which is empty
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
