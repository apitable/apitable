package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.social.mapper.SocialTenantDepartmentBindMapper;
import com.vikadata.api.modular.social.mapper.SocialTenantDepartmentMapper;
import com.vikadata.api.modular.social.model.TenantDepartmentBindDTO;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentService;
import com.vikadata.entity.SocialTenantDepartmentEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 第三方平台集成-租户部门 服务接口 实现
 *
 * @author Shawn Deng
 * @date 2020-12-09 14:57:11
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
            // 首次获取，肯定是空的
            return Collections.emptyList();
        }
        return socialTenantDepartmentMapper.selectDepartmentIdsByTenantId(tenantId, spaceId);
    }

    @Override
    public List<SocialTenantDepartmentEntity> getByTenantId(String tenantId, String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            // 首次获取，肯定是空的
            return Collections.emptyList();
        }
        return socialTenantDepartmentMapper.selectByTenantId(tenantId, spaceId);
    }

    @Override
    public void createBatch(List<SocialTenantDepartmentEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        // 添加或修改租户的部门列表，覆盖式
        socialTenantDepartmentMapper.insertBatch(entities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTenantDepartment(String spaceId, String tenantId, String departmentId) {
        Long bindTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamId(spaceId, tenantId, departmentId);
        // 删除空间站绑定的小组
        if (bindTeamId != null) {
            iTeamService.deleteTeam(bindTeamId);
        }
        // 删除租户部门绑定小组记录
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
        // 删除空间站绑定的小组
        bindTeamIds.forEach(bindTeamId -> iTeamService.deleteTeam(bindTeamId));
        // 删除租户部门绑定小组记录
        iSocialTenantDepartmentBindService.deleteBatchByTenantDepartmentId(spaceId, tenantId, new ArrayList<>(departmentIds));
        socialTenantDepartmentMapper.deleteBatchByDepartmentId(spaceId, tenantId, departmentIds);

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTenantId(String spaceId, String tenantId) {
        // 删除部门记录
        socialTenantDepartmentMapper.deleteByTenantId(tenantId, spaceId);
        // 删除绑定
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
        // 删除空间站绑定的小组
        if (bindTeamId != null) {
            iTeamService.deleteTeam(bindTeamId);
        }
        // 删除租户部门绑定小组记录
        iSocialTenantDepartmentBindService.deleteSpaceBindTenantDepartment(spaceId, tenantId, departmentId);
        socialTenantDepartmentMapper.deleteBySpaceIdAndTenantIdAndDepartmentId(spaceId, tenantId, departmentId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteByTenantIdAndSpaceId(String tenantId, String spaceId) {
        // 删除部门记录
        socialTenantDepartmentMapper.deleteByTenantIdAndSpaceId(tenantId, spaceId);
        // 删除绑定
        socialTenantDepartmentBindMapper.deleteByTenantIdAndSpaceId(tenantId, spaceId);
    }

    @Override
    public List<TenantDepartmentBindDTO> getTenantBindTeamListBySpaceId(String spaceId) {
        return socialTenantDepartmentMapper.selectTenantBindTeamListBySpaceId(spaceId);
    }

}
