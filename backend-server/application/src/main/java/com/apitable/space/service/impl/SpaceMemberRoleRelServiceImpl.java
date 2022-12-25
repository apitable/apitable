/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.space.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.apitable.space.mapper.SpaceMemberRoleRelMapper;
import com.apitable.space.mapper.SpaceResourceMapper;
import com.apitable.space.mapper.SpaceRoleResourceRelMapper;
import com.apitable.space.service.ISpaceMemberRoleRelService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.space.entity.SpaceMemberRoleRelEntity;

import org.springframework.stereotype.Service;

import static com.apitable.workspace.enums.PermissionException.CREATE_SUB_ADMIN_ERROR;
import static com.apitable.workspace.enums.PermissionException.ROLE_NOT_EXIST;
import static com.apitable.workspace.enums.PermissionException.UPDATE_ROLE_ERROR;

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
