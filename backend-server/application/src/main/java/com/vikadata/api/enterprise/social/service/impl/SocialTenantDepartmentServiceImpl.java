package com.vikadata.api.enterprise.social.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.social.mapper.SocialTenantDepartmentBindMapper;
import com.vikadata.api.enterprise.social.mapper.SocialTenantDepartmentMapper;
import com.vikadata.api.enterprise.social.model.TenantDepartmentBindDTO;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDepartmentService;
import com.vikadata.entity.SocialTenantDepartmentEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Third party platform integration - tenant department service interface implementation
 */
@Service
@Slf4j
public class SocialTenantDepartmentServiceImpl extends ServiceImpl<SocialTenantDepartmentMapper, SocialTenantDepartmentEntity> implements ISocialTenantDepartmentService {

    @Resource
    private SocialTenantDepartmentMapper socialTenantDepartmentMapper;

    @Resource
    private ISocialTenantDepartmentBindService iSocialTenantDepartmentBindService;

    @Resource
    private SocialTenantDepartmentBindMapper socialTenantDepartmentBindMapper;

    @Resource
    private ITeamService iTeamService;

    @Override
    public Long getIdByDepartmentId(String spaceId, String tenantId, String departmentId) {
        return socialTenantDepartmentMapper.selectIdByDepartmentId(spaceId, tenantId, departmentId);
    }

    @Override
    public SocialTenantDepartmentEntity getByDepartmentId(String spaceId, String tenantId, String departmentId) {
        return socialTenantDepartmentMapper.selectByDepartmentId(spaceId, tenantId, departmentId);
    }

    @Override
    public List<String> getDepartmentIdsByTenantId(String tenantId, String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            // First time acquisition, it must be empty
            return Collections.emptyList();
        }
        return socialTenantDepartmentMapper.selectDepartmentIdsByTenantId(tenantId, spaceId);
    }

    @Override
    public List<SocialTenantDepartmentEntity> getByTenantId(String tenantId, String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            // First time acquisition, it must be empty
            return Collections.emptyList();
        }
        return socialTenantDepartmentMapper.selectByTenantId(tenantId, spaceId);
    }

    @Override
    public void createBatch(List<SocialTenantDepartmentEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        // Add or modify the tenant's department list, overlay
        socialTenantDepartmentMapper.insertBatch(entities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTenantDepartment(String spaceId, String tenantId, String departmentId) {
        Long bindTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantId, departmentId);
        // Delete the team bound to the space station
        if (bindTeamId != null) {
            iTeamService.deleteTeam(bindTeamId);
        }
        // Delete tenant department binding group record
        iSocialTenantDepartmentBindService.deleteByTenantDepartmentId(spaceId, tenantId, departmentId);
        socialTenantDepartmentMapper.deleteByDepartmentId(spaceId, tenantId, departmentId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteBatchByDepartmentId(String spaceId, String tenantId, Collection<String> departmentIds) {
        if (CollUtil.isEmpty(departmentIds)) {
            return;
        }
        List<Long> bindTeamIds = iSocialTenantDepartmentBindService.getBindSpaceTeamIds(spaceId, tenantId, new ArrayList<>(departmentIds));
        // Delete the team bound to the space station
        bindTeamIds.forEach(bindTeamId -> iTeamService.deleteTeam(bindTeamId));
        // Delete tenant department binding group record
        iSocialTenantDepartmentBindService.deleteBatchByTenantDepartmentId(spaceId, tenantId, new ArrayList<>(departmentIds));
        socialTenantDepartmentMapper.deleteBatchByDepartmentId(spaceId, tenantId, departmentIds);

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTenantId(String spaceId, String tenantId) {
        // Delete department record
        socialTenantDepartmentMapper.deleteByTenantId(tenantId, spaceId);
        // Delete Binding
        iSocialTenantDepartmentBindService.deleteByTenantId(spaceId, tenantId);
    }

    @Override
    public SocialTenantDepartmentEntity getByTenantIdAndDepartmentId(String spaceId, String tenantId,
            String departmentId) {
        return socialTenantDepartmentMapper.selectByTenantIdAndDeptId(spaceId, tenantId, departmentId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSpaceTenantDepartment(String spaceId, String tenantId, String departmentId) {
        Long bindTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamIdBySpaceId(spaceId, tenantId,
                departmentId);
        // Delete the team bound to the space station
        if (bindTeamId != null) {
            iTeamService.deleteTeam(bindTeamId);
        }
        // Delete tenant department binding group record
        iSocialTenantDepartmentBindService.deleteSpaceBindTenantDepartment(spaceId, tenantId, departmentId);
        socialTenantDepartmentMapper.deleteBySpaceIdAndTenantIdAndDepartmentId(spaceId, tenantId, departmentId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTenantIdAndSpaceId(String tenantId, String spaceId) {
        // Delete department record
        socialTenantDepartmentMapper.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // Delete Binding
        socialTenantDepartmentBindMapper.deleteByTenantIdAndSpaceId(tenantId, spaceId);
    }

    @Override
    public List<TenantDepartmentBindDTO> getTenantBindTeamListBySpaceId(String spaceId) {
        return socialTenantDepartmentMapper.selectTenantBindTeamListBySpaceId(spaceId);
    }

}
