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

package com.apitable.organization.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.control.service.IControlRoleService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.organization.dto.MemberBaseInfoDTO;
import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.TeamBaseInfoDTO;
import com.apitable.organization.dto.UnitInfoDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.shared.util.ibatis.ExpandServiceImpl;
import com.apitable.workspace.enums.PermissionException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class UnitServiceImpl extends ExpandServiceImpl<UnitMapper, UnitEntity>
    implements IUnitService {

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private IControlRoleService iControlRoleService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private ITeamService iTeamService;

    @Override
    public Long getUnitIdByRefId(Long refId) {
        return baseMapper.selectUnitIdByRefId(refId);
    }

    @Override
    public List<Long> getUnitIdsByRefIds(Collection<Long> refIds) {
        log.info("get unit ids by ref ids");
        return baseMapper.selectIdsByRefIds(refIds);
    }

    @Override
    public List<UnitEntity> getByRefIds(Collection<Long> refIds) {
        log.info("get unit by ref ids");
        return baseMapper.selectByRefIds(refIds);
    }

    @Override
    public void checkInSpace(String spaceId, List<Long> unitIds) {
        log.info("check if the unit is in space.");
        int result = SqlTool.retCount(baseMapper.selectCountBySpaceIdAndIds(spaceId, unitIds));
        ExceptionUtil.isTrue(result == unitIds.size(), PermissionException.ORG_UNIT_NOT_EXIST);
    }

    @Override
    public Long create(String spaceId, UnitType unitType, Long unitRefId) {
        log.info("create unit，unit type:{}, unit id:{}", unitType, unitRefId);
        UnitEntity unit = new UnitEntity();
        unit.setSpaceId(spaceId);
        unit.setUnitType(unitType.getType());
        unit.setUnitRefId(unitRefId);
        boolean flag = save(unit);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return unit.getId();
    }

    @Override
    public boolean createBatch(List<UnitEntity> unitEntities) {
        log.info("Batch create unit.");
        return saveBatch(unitEntities);
    }

    @Override
    public void restoreMemberUnit(String spaceId, Collection<Long> memberIds) {
        log.info("Restore member unit");
        List<Long> restores = new ArrayList<>();
        List<UnitEntity> unitEntities = baseMapper.selectByRefIds(memberIds);
        for (UnitEntity unitEntity : unitEntities) {
            restores.add(unitEntity.getId());
        }

        if (CollUtil.isNotEmpty(restores)) {
            baseMapper.batchRestoreByIds(restores);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByTeamId(Long teamId) {
        log.info("Delete an organizational Unit(team)，team id：{}", teamId);
        removeByRefId(teamId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByRefId(Long refId) {
        Long unitId = baseMapper.selectUnitIdByRefId(refId);
        boolean flag = removeById(unitId);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        // delete node role or field role
        iControlRoleService.removeByUnitIds(Collections.singletonList(unitId));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByMemberId(List<Long> memberIds) {
        log.info("Batch delete an organizational Unit(member)，member ids：[{}]", memberIds);
        List<Long> unitIds = getUnitIdsByRefIds(memberIds);
        if (CollUtil.isEmpty(unitIds)) {
            return;
        }
        removeByIds(unitIds);
        //delete node role or field role
        iControlRoleService.removeByUnitIds(unitIds);
    }

    @Override
    public List<UnitInfoVo> getUnitInfoList(String spaceId, List<Long> unitIds) {
        List<UnitEntity> unitEntities = baseMapper.selectByUnitIds(unitIds);
        Map<Long, UnitEntity> unitEntityMap = unitEntities.stream()
            .filter(unit -> spaceId.equals(unit.getSpaceId()))
            .collect(Collectors.toMap(UnitEntity::getId, entity -> entity));
        Map<Integer, List<UnitEntity>> groupUnitMap = unitEntities.stream()
            .collect(Collectors.groupingBy(UnitEntity::getUnitType));
        List<UnitInfoVo> unitInfoList = new ArrayList<>();
        Map<Long, MemberBaseInfoDTO> memberInfoMap = MapUtil.newHashMap();
        Map<Long, TeamBaseInfoDTO> teamBaseInfoMap = MapUtil.newHashMap();
        Map<Long, RoleBaseInfoDto> roleBaseInfoMap = MapUtil.newHashMap();
        groupUnitMap.forEach((unitType, units) -> {
            UnitType typeEnum = UnitType.toEnum(unitType);
            List<Long> refIds =
                units.stream().map(UnitEntity::getUnitRefId).collect(Collectors.toList());
            if (typeEnum == UnitType.MEMBER) {
                // load the required member information
                List<List<Long>> split = CollUtil.split(refIds, 1000);
                for (List<Long> ids : split) {
                    List<MemberBaseInfoDTO> memberBaseInfoDTOList =
                        memberMapper.selectBaseInfoDTOByIds(ids);
                    memberBaseInfoDTOList.forEach(info -> memberInfoMap.put(info.getId(), info));
                }
            } else if (typeEnum == UnitType.TEAM) {
                // load the required team information
                List<TeamBaseInfoDTO> teamBaseInfoDTOList =
                    teamMapper.selectBaseInfoDTOByIds(refIds);
                teamBaseInfoDTOList.forEach(info -> teamBaseInfoMap.put(info.getId(), info));
            } else if (typeEnum == UnitType.ROLE) {
                // load required role information
                List<RoleBaseInfoDto> roleBaseInfoDtoList =
                    iRoleService.getBaseInfoDtoByRoleIds(refIds);
                roleBaseInfoDtoList.forEach(info -> roleBaseInfoMap.put(info.getId(), info));
            }
        });
        // handle member's team name, get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
            iTeamService.batchGetFullHierarchyTeamNames(new ArrayList<>(memberInfoMap.keySet()),
                spaceId);
        // insert data in order
        for (Long unitId : unitIds) {
            UnitEntity unitEntity = unitEntityMap.get(unitId);
            if (unitEntity == null) {
                continue;
            }
            UnitType unitType = UnitType.toEnum(unitEntity.getUnitType());
            if (unitType == UnitType.MEMBER) {
                UnitInfoVo unitInfoVo = new UnitInfoVo();
                unitInfoVo.setUnitId(unitId);
                unitInfoVo.setUnitRefId(unitEntity.getUnitRefId());
                unitInfoVo.setType(unitEntity.getUnitType());
                unitInfoVo.setIsDeleted(unitEntity.getIsDeleted());
                MemberBaseInfoDTO baseInfo = memberInfoMap.get(unitEntity.getUnitRefId());
                if (baseInfo != null) {
                    unitInfoVo.setName(baseInfo.getMemberName());
                    unitInfoVo.setUserId(baseInfo.getUuid());
                    unitInfoVo.setUuid(baseInfo.getUuid());
                    unitInfoVo.setAvatar(baseInfo.getAvatar());
                    unitInfoVo.setAvatarColor(baseInfo.getColor());
                    unitInfoVo.setNickName(baseInfo.getNickName());
                    unitInfoVo.setEmail(baseInfo.getEmail());
                    unitInfoVo.setIsActive(baseInfo.getIsActive());
                    unitInfoVo.setIsNickNameModified(baseInfo.getIsNickNameModified());
                    unitInfoVo.setIsMemberNameModified(baseInfo.getIsMemberNameModified());
                    if (memberToTeamPathInfoMap.containsKey(unitEntity.getUnitRefId())) {
                        List<MemberTeamPathInfo> teamPathInfos =
                            memberToTeamPathInfoMap.get(unitEntity.getUnitRefId());
                        unitInfoVo.setTeamData(teamPathInfos);
                    }
                }
                // cooling-off-period/cancelled user
                if (baseInfo == null || !baseInfo.getIsPaused()) {
                    unitInfoList.add(unitInfoVo);
                }
                continue;
            }

            UnitInfoVo unitInfoVo = new UnitInfoVo();
            unitInfoVo.setUnitId(unitId);
            unitInfoVo.setUnitRefId(unitEntity.getUnitRefId());
            unitInfoVo.setType(unitEntity.getUnitType());
            unitInfoVo.setIsDeleted(unitEntity.getIsDeleted());
            if (unitType == UnitType.TEAM) {
                TeamBaseInfoDTO baseInfo = teamBaseInfoMap.get(unitEntity.getUnitRefId());
                if (baseInfo != null) {
                    unitInfoVo.setName(baseInfo.getTeamName());
                }
            } else if (unitType == UnitType.ROLE) {
                RoleBaseInfoDto baseInfo = roleBaseInfoMap.get(unitEntity.getUnitRefId());
                if (baseInfo != null) {
                    unitInfoVo.setName(baseInfo.getRoleName());
                }
            }
            unitInfoList.add(unitInfoVo);

        }
        return unitInfoList;
    }

    @Override
    public List<Long> getMembersIdByUnitIds(Collection<Long> unitIds) {
        log.info("get the unit's ref members.");
        List<UnitEntity> entities = baseMapper.selectByUnitIds(unitIds);
        if (CollUtil.isEmpty(entities)) {
            return new ArrayList<>();
        }
        Map<Integer, List<Long>> typeToRefIdsMap =
            entities.stream().collect(Collectors.groupingBy(UnitEntity::getUnitType,
                Collectors.mapping(UnitEntity::getUnitRefId, Collectors.toList())));
        if (typeToRefIdsMap.isEmpty()) {
            return new ArrayList<>();
        }
        List<Long> memberIds = new ArrayList<>();
        for (Map.Entry<Integer, List<Long>> entry : typeToRefIdsMap.entrySet()) {
            UnitType type = UnitType.toEnum(entry.getKey());
            switch (type) {
                case TEAM:
                    Collection<Long> teamIds =
                        iTeamService.getAllTeamIdsInTeamTree(entry.getValue());
                    List<Long> teamMemberIds =
                        teamMemberRelMapper.selectMemberIdsByTeamIds(teamIds);
                    if (CollUtil.isNotEmpty(teamMemberIds)) {
                        memberIds.addAll(teamMemberIds);
                    }
                    break;
                case MEMBER:
                    memberIds.addAll(entry.getValue());
                    break;
                case ROLE:
                    List<Long> roleMemberIds =
                        iRoleMemberService.getMemberIdsByRoleIds(entry.getValue());
                    memberIds.addAll(roleMemberIds);
                default:
                    break;
            }
        }
        return memberIds;
    }

    @Override
    public void batchUpdateIsDeletedBySpaceIdAndRefId(String spaceId, List<Long> refIds,
        UnitType unitType, Boolean isDeleted) {
        baseMapper.batchUpdateIsDeletedBySpaceIdAndRefId(spaceId, refIds, unitType, isDeleted);
    }

    @Override
    public List<UnitInfoDTO> getUnitInfoDTOByUnitIds(List<Long> unitIds) {
        List<UnitInfoDTO> unitInfoList = new ArrayList<>();
        // Query information about an organization unit
        List<UnitEntity> unitEntities = baseMapper.selectByUnitIds(unitIds);
        // grouping by unit type
        Map<Integer, List<UnitEntity>> groupUnitMap = unitEntities.stream()
            .collect(Collectors.groupingBy(UnitEntity::getUnitType));
        groupUnitMap.forEach((unitType, units) -> {
            UnitType typeEnum = UnitType.toEnum(unitType);
            Map<Long, Long> refIdToUnitIdMap = units.stream()
                .collect(Collectors.toMap(UnitEntity::getUnitRefId, UnitEntity::getId));
            Set<Long> refIds = refIdToUnitIdMap.keySet();
            if (typeEnum == UnitType.MEMBER) {
                // querying member information
                List<MemberEntity> members = memberMapper.selectByMemberIdsIgnoreDelete(refIds);
                members.forEach(member -> unitInfoList.add(
                    new UnitInfoDTO(refIdToUnitIdMap.get(member.getId()), member.getMemberName())));
            } else if (typeEnum == UnitType.TEAM) {
                // querying department information
                List<TeamEntity> teams = teamMapper.selectByTeamIdsIgnoreDelete(refIds);
                teams.forEach(team -> unitInfoList.add(
                    new UnitInfoDTO(refIdToUnitIdMap.get(team.getId()), team.getTeamName())));
            }
        });
        return unitInfoList;
    }

    @Override
    public List<Long> getRelUserIdsByUnitIds(List<Long> unitIds) {
        // gets all the user ids associated with the units
        List<Long> membersIds = this.getMembersIdByUnitIds(unitIds);
        if (membersIds.isEmpty()) {
            return new ArrayList<>();
        }
        return memberMapper.selectUserIdsByMemberIds(membersIds);
    }

    @Override
    public List<UnitEntity> getUnitEntitiesByUnitRefIds(List<Long> refIds) {
        return baseMapper.selectByRefIds(refIds);
    }
}
