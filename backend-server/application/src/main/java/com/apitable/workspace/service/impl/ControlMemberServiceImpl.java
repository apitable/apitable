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

package com.apitable.workspace.service.impl;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.apitable.control.entity.ControlSettingEntity;
import com.apitable.control.infrastructure.ControlIdBuilder.ControlId;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Field;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.service.IControlRoleService;
import com.apitable.control.service.IControlService;
import com.apitable.control.service.IControlSettingService;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.workspace.dto.ControlMemberDTO;
import com.apitable.workspace.dto.ControlRoleUnitDTO;
import com.apitable.workspace.service.IControlMemberService;
import com.apitable.workspace.vo.ControlRoleMemberVo;
import com.apitable.workspace.vo.NodeRoleMemberVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import org.springframework.stereotype.Service;

/**
 * control member service implentation.
 */
@Service
public class ControlMemberServiceImpl implements IControlMemberService {

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    @Resource
    private IControlService iControlService;

    @Resource
    private IControlSettingService iControlSettingService;

    @Resource
    private IControlRoleService iControlRoleService;

    @Override
    public <T extends ControlRoleMemberVo> PageInfo<T> getControlRoleMemberPageInfo(
        Page<T> page, String spaceId, ControlId controlId, Class<T> clz
    ) {
        Map<Long, ControlMemberDTO> memberControlRoleMap =
            this.getMemberControlRoleMap(spaceId, controlId);
        // calculate position
        long sub = (page.getCurrent() - 1) * page.getSize();
        if (sub > memberControlRoleMap.size()) {
            return PageHelper.build(page.getCurrent(), page.getSize(),
                memberControlRoleMap.size(), new ArrayList<>());
        }

        long end = (sub + page.getSize()) > memberControlRoleMap.size()
            ? memberControlRoleMap.size() : sub + page.getSize();
        List<Long> memberIds =
            new ArrayList<>(memberControlRoleMap.keySet()).subList((int) sub, (int) end);
        List<T> records = new ArrayList<>(memberIds.size());
        List<NodeRoleMemberVo> results = iMemberService.getNodeRoleMemberWithSort(memberIds);
        // Give permission value
        results.forEach(result -> {
            ControlMemberDTO controlMemberDTO = memberControlRoleMap.get(result.getMemberId());
            result.setRole(controlMemberDTO.getControlRoleTag());
            result.setIsWorkbenchAdmin(controlMemberDTO.getIsAdmin());
            result.setIsControlOwner(controlMemberDTO.getIsControlOwner());
            records.add(BeanUtil.toBean(result, clz));
        });
        return PageHelper.build(page.getCurrent(), page.getSize(),
            memberControlRoleMap.size(), records);
    }

    @Override
    public Map<Long, ControlMemberDTO> getMemberControlRoleMap(String spaceId,
                                                               ControlId controlId) {
        Map<Long, ControlMemberDTO> memberRoleMap = new LinkedHashMap<>();
        // 1、space workbench administrator + control owner
        Long ownerId = this.getControlOwnerId(controlId);
        String roleTag = controlId.getControlType() == ControlType.NODE
            ? Node.MANAGER : Field.EDITOR;
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        for (Long memberId : admins) {
            if (memberRoleMap.containsKey(memberId)) {
                continue;
            }
            memberRoleMap.put(memberId, new ControlMemberDTO(memberId, true,
                Objects.equals(memberId, ownerId), roleTag));
        }
        if (ownerId != null && !memberRoleMap.containsKey(ownerId)) {
            memberRoleMap.put(ownerId, new ControlMemberDTO(ownerId, false,
                true, roleTag));
        }
        // 2、The control specifies the organizational unit of the role.
        Map<String, List<ControlRoleUnitDTO>> roleUnitMap = groupRoleByControlId(controlId);
        for (Map.Entry<String, List<ControlRoleUnitDTO>> entry : roleUnitMap.entrySet()) {
            List<Long> memberIds = new ArrayList<>();
            List<Long> teamIds = new ArrayList<>();
            List<Long> roleIds = new ArrayList<>();
            for (ControlRoleUnitDTO control : entry.getValue()) {
                UnitType unitType = UnitType.toEnum(control.getUnitType());
                switch (unitType) {
                    case TEAM:
                        teamIds.add(control.getUnitRefId());
                        break;
                    case MEMBER:
                        memberIds.add(control.getUnitRefId());
                        break;
                    case ROLE:
                        roleIds.add(control.getUnitRefId());
                        break;
                    default:
                        break;
                }
            }
            // Summary query team and role
            if (CollUtil.isNotEmpty(teamIds)) {
                List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(teamIds);
                if (CollUtil.isNotEmpty(teamMemberIds)) {
                    memberIds.addAll(teamMemberIds);
                }
            }
            if (CollUtil.isNotEmpty(roleIds)) {
                List<Long> roleMemberIds = iRoleMemberService.getMemberIdsByRoleIds(roleIds);
                memberIds.addAll(roleMemberIds);
            }
            for (Long memberId : memberIds) {
                if (memberRoleMap.containsKey(memberId)) {
                    continue;
                }
                memberRoleMap.put(memberId, new ControlMemberDTO(memberId, entry.getKey()));
            }
        }
        return memberRoleMap;
    }

    private Long getControlOwnerId(ControlId controlId) {
        if (controlId.getControlType() == ControlType.NODE) {
            Long ownerUnitId =
                iControlRoleService.getUnitIdByControlIdAndRoleCode(controlId.toString(),
                    Node.OWNER);
            return ownerUnitId != null ? iUnitService.getUnitRefIdById(ownerUnitId) : null;
        }
        ControlSettingEntity controlSetting =
            iControlSettingService.getByControlId(controlId.toString());
        if (controlSetting.getUpdatedBy() == null) {
            return null;
        }
        String spaceId = iControlService.getSpaceIdByControlId(controlId.toString());
        if (spaceId == null) {
            return null;
        }
        return iMemberService.getMemberIdByUserIdAndSpaceId(controlSetting.getUpdatedBy(), spaceId);
    }

    private Map<String, List<ControlRoleUnitDTO>> groupRoleByControlId(ControlId controlId) {
        List<ControlRoleUnitDTO> controlRoles =
            iControlRoleService.getControlRolesUnitDtoByControlId(controlId.toString());
        if (controlId.getControlType() == ControlType.NODE) {
            return controlRoles.stream().filter(t -> !t.getRole().equals(Node.OWNER))
                .sorted(Comparator.comparing(
                    (Function<ControlRoleUnitDTO, Long>) t -> ControlRoleManager.parseNodeRole(
                        t.getRole()).getBits()).reversed())
                .collect(groupingBy(ControlRoleUnitDTO::getRole, LinkedHashMap::new, toList()));
        }
        // group by role
        return controlRoles.stream()
            .sorted(Comparator.comparing(
                (Function<ControlRoleUnitDTO, Long>) t -> ControlRoleManager.parseFieldRole(
                    t.getRole()).getBits()).reversed())
            .collect(groupingBy(ControlRoleUnitDTO::getRole, LinkedHashMap::new, toList()));
    }
}
