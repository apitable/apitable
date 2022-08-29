package com.vikadata.api.modular.space.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.space.mapper.SpaceMemberRoleRelMapper;
import com.vikadata.api.modular.space.mapper.SpaceResourceMapper;
import com.vikadata.api.modular.space.mapper.SpaceRoleResourceRelMapper;
import com.vikadata.api.modular.space.service.ISpaceMemberRoleRelService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SpaceMemberRoleRelEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.PermissionException.CREATE_SUB_ADMIN_ERROR;
import static com.vikadata.api.enums.exception.PermissionException.ROLE_NOT_EXIST;
import static com.vikadata.api.enums.exception.PermissionException.UPDATE_ROLE_ERROR;

/**
 * <p>
 * 工作空间-角色权限关联表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
@Service
@Slf4j
public class SpaceMemberRoleRelServiceImpl extends ServiceImpl<SpaceMemberRoleRelMapper, SpaceMemberRoleRelEntity> implements ISpaceMemberRoleRelService {

    @Resource
    private SpaceResourceMapper spaceResourceMapper;

    @Resource
    private SpaceRoleResourceRelMapper spaceRoleResourceRelMapper;

    @Override
    public void create(String spaceId, List<Long> memberIds, String roleCode) {
        log.info("创建成员与角色关联");
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
        log.info("根据ID查询成员与角色关联ID");
        SpaceMemberRoleRelEntity entity = getById(memberRoleId);
        ExceptionUtil.isNotNull(entity, ROLE_NOT_EXIST);
        return entity;
    }

    @Override
    public void updateMemberIdById(Long memberRoleId, Long memberId) {
        log.info("更新角色关联成员");
        SpaceMemberRoleRelEntity update = new SpaceMemberRoleRelEntity();
        update.setId(memberRoleId);
        update.setMemberId(memberId);
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, UPDATE_ROLE_ERROR);
    }
    
    @Override
    public List<Long> getMemberId(String spaceId, List<String> resourceGroupCodes) {
        // 获取权限资源编码
        List<String> resourceCodes = spaceResourceMapper.selectResourceCodesByGroupCode(resourceGroupCodes);
        if (resourceCodes.isEmpty()) {
            return new ArrayList<>();
        }
        // 获取角色编码
        List<String> roleCodes = spaceRoleResourceRelMapper.selectRoleCodeByResourceCodes(resourceCodes);
        if (roleCodes.isEmpty()) {
            return new ArrayList<>();
        }
        // 根据角色编码获取成员ID
        return this.baseMapper.selectMemberIdBySpaceIdAndRoleCodes(spaceId, roleCodes);
    }
}
