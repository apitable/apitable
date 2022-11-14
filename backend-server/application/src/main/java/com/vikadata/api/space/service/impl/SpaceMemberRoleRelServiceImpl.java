package com.vikadata.api.space.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.space.mapper.SpaceResourceMapper;
import com.vikadata.api.space.mapper.SpaceRoleResourceRelMapper;
import com.vikadata.api.space.service.ISpaceMemberRoleRelService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SpaceMemberRoleRelEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.workspace.enums.PermissionException.CREATE_SUB_ADMIN_ERROR;
import static com.vikadata.api.workspace.enums.PermissionException.ROLE_NOT_EXIST;
import static com.vikadata.api.workspace.enums.PermissionException.UPDATE_ROLE_ERROR;

@Service
@Slf4j
public class SpaceMemberRoleRelServiceImpl extends ServiceImpl<SpaceMemberRoleRelMapper, SpaceMemberRoleRelEntity> implements ISpaceMemberRoleRelService {

    @Resource
    private SpaceResourceMapper spaceResourceMapper;

    @Resource
    private SpaceRoleResourceRelMapper spaceRoleResourceRelMapper;

    @Override
    public void create(String spaceId, List<Long> memberIds, String roleCode) {
        log.info("Create the ref of member and space role.");
        List<SpaceMemberRoleRelEntity> entities = new ArrayList<>();
        memberIds.forEach(memberId -> {
            SpaceMemberRoleRelEntity spaceMemberRoleRel = new SpaceMemberRoleRelEntity();
            spaceMemberRoleRel.setId(IdWorker.getId());
            spaceMemberRoleRel.setSpaceId(spaceId);
            spaceMemberRoleRel.setMemberId(memberId);
            spaceMemberRoleRel.setRoleCode(roleCode);
            entities.add(spaceMemberRoleRel);
        });

        boolean flag = SqlHelper.retBool(baseMapper.insertBatch(entities));
        ExceptionUtil.isTrue(flag, CREATE_SUB_ADMIN_ERROR);
    }

    @Override
    public SpaceMemberRoleRelEntity findById(Long memberRoleId) {
        log.info("query role by id");
        SpaceMemberRoleRelEntity entity = getById(memberRoleId);
        ExceptionUtil.isNotNull(entity, ROLE_NOT_EXIST);
        return entity;
    }

    @Override
    public void updateMemberIdById(Long memberRoleId, Long memberId) {
        log.info("change the member id of the space role");
        SpaceMemberRoleRelEntity update = new SpaceMemberRoleRelEntity();
        update.setId(memberRoleId);
        update.setMemberId(memberId);
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, UPDATE_ROLE_ERROR);
    }
    
    @Override
    public List<Long> getMemberId(String spaceId, List<String> resourceGroupCodes) {
        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByGroupCode(resourceGroupCodes);
        if (resourceCodes.isEmpty()) {
            return new ArrayList<>();
        }
        List<String> roleCodes = spaceRoleResourceRelMapper.selectRoleCodeByResourceCodes(resourceCodes);
        if (roleCodes.isEmpty()) {
            return new ArrayList<>();
        }
        return this.baseMapper.selectMemberIdBySpaceIdAndRoleCodes(spaceId, roleCodes);
    }
}
