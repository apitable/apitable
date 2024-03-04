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

import static com.apitable.shared.constants.SpaceConstants.SPACE_ROOT_TEAM_UNIT_ID;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.control.service.IControlRoleService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.organization.dto.MemberBaseInfoDTO;
import com.apitable.organization.dto.MemberUserDTO;
import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.RoleMemberDTO;
import com.apitable.organization.dto.TeamBaseInfoDTO;
import com.apitable.organization.dto.UnitBaseInfoDTO;
import com.apitable.organization.dto.UnitInfoDTO;
import com.apitable.organization.dto.UnitMemberDTO;
import com.apitable.organization.dto.UnitTeamDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.MemberType;
import com.apitable.organization.enums.OrganizationException;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.RoleMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.organization.vo.UnitMemberInfoVo;
import com.apitable.organization.vo.UnitRoleInfoVo;
import com.apitable.organization.vo.UnitRoleMemberVo;
import com.apitable.organization.vo.UnitTeamInfoVo;
import com.apitable.shared.util.ibatis.ExpandServiceImpl;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.user.dto.UserSensitiveDTO;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.service.INodeService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * unit service implementation.
 */
@Slf4j
@Service
public class UnitServiceImpl extends ExpandServiceImpl<UnitMapper, UnitEntity>
    implements IUnitService {

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private RoleMapper roleMapper;

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

    @Resource
    private IUserService iUserService;

    @Resource
    private INodeService iNodeService;

    @Override
    public Long getUnitRefIdById(Long id) {
        return baseMapper.selectRefIdById(id);
    }

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
    public UnitEntity create(String spaceId, UnitType unitType, Long unitRefId) {
        log.info("create unit，unit type:{}, unit id:{}", unitType, unitRefId);
        UnitEntity unit = new UnitEntity();
        unit.setId(IdWorker.getId());
        unit.setSpaceId(spaceId);
        unit.setUnitType(unitType.getType());
        unit.setUnitRefId(unitRefId);
        unit.setUnitId(IdUtil.fastSimpleUUID());
        boolean flag = save(unit);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return unit;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
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
            // restore private nodes
            iNodeService.restoreMembersNodes(restores);
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
                    iTeamService.getTeamBaseInfo(refIds);
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
                    break;
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

    @Override
    public Long getUnitRefIdByUnitIdAndSpaceIdAndUnitType(String unitId, String spaceId,
                                                          UnitType unitType) {
        return baseMapper.selectUnitRefIdByUnitIdAndSpaceIdAndUnitType(unitId, spaceId, unitType);
    }

    @Override
    public List<UnitBaseInfoDTO> getUnitBaseInfoBySpaceIdAndUnitTypeAndUnitIds(String spaceId,
                                                                               UnitType unitType,
                                                                               List<String> unitIds) {
        return baseMapper.selectBySpaceIdAndUnitTypeAndUnitIds(spaceId, unitType, unitIds);
    }

    @Override
    public List<UnitBaseInfoDTO> getUnitBaseInfoByRefIds(List<Long> refIds) {
        if (refIds.isEmpty()) {
            return new ArrayList<>();
        }
        return baseMapper.selectByUnitRefIds(refIds);
    }

    @Override
    public List<UnitTeamDTO> getUnitTeamBaseInfoByTeamIds(List<Long> teamIds) {
        if (teamIds.isEmpty()) {
            return new ArrayList<>();
        }
        Map<Long, String> teamUnits = this.getUnitBaseInfoByRefIds(teamIds).stream()
            .collect(Collectors.toMap(UnitBaseInfoDTO::getUnitRefId,
                UnitBaseInfoDTO::getUnitId));
        List<TeamBaseInfoDTO> teams = iTeamService.getTeamBaseInfo(teamIds);
        if (teams.isEmpty()) {
            return new ArrayList<>();
        }
        Long rootTeamId = iTeamService.getRootTeamId(teams.get(0).getSpaceId());
        List<Long> parentTeamIds =
            teams.stream().map(TeamBaseInfoDTO::getParentId).filter(i -> !i.equals(rootTeamId))
                .collect(Collectors.toList());
        Map<Long, String> parentTeamUnits = getUnitBaseInfoByRefIds(parentTeamIds).stream()
            .collect(Collectors.toMap(UnitBaseInfoDTO::getUnitRefId,
                UnitBaseInfoDTO::getUnitId));
        // root
        parentTeamUnits.put(rootTeamId, SPACE_ROOT_TEAM_UNIT_ID);
        List<UnitTeamDTO> units = new ArrayList<>();
        teams.forEach(team -> {
            UnitTeamDTO unit =
                UnitTeamDTO.builder().id(team.getId()).unitId(teamUnits.get(team.getId()))
                    .parentUnitId(parentTeamUnits.get(team.getParentId()))
                    .teamName(team.getTeamName()).sequence(team.getSequence()).build();
            units.add(unit);
        });
        return units;
    }

    @Override
    public List<UnitMemberDTO> getUnitMemberBaseInfoByMemberIds(List<Long> memberIds) {
        Map<Long, String> memberUnits = this.getUnitBaseInfoByRefIds(memberIds).stream()
            .collect(Collectors.toMap(UnitBaseInfoDTO::getUnitRefId,
                UnitBaseInfoDTO::getUnitId));
        // get members info
        List<MemberUserDTO> members =
            memberMapper.selectMemberNameAndUserIdAndIsActiveByIds(memberIds);
        // get member's related user information
        List<Long> userIds =
            members.stream().map(MemberUserDTO::getUserId).filter(Objects::nonNull)
                .collect(Collectors.toList());
        Map<Long, UserSensitiveDTO> users = new HashMap<>();
        if (!userIds.isEmpty()) {
            users = iUserService.getUserSensitiveInfoByIds(userIds).stream()
                .collect(Collectors.toMap(UserSensitiveDTO::getId, i -> i));
        }
        // assemble return data
        List<UnitMemberDTO> units = new ArrayList<>();
        for (MemberUserDTO member : members) {
            UnitMemberDTO unitMember = UnitMemberDTO.builder().id(member.getId())
                .unitId(memberUnits.get(member.getId()))
                .status(Boolean.compare(member.getIsActive(), false))
                .type(member.getIsAdmin() ? MemberType.PRIMARY_ADMIN : MemberType.MEMBER)
                .memberName(member.getMemberName()).build();
            if (null != member.getUserId() && users.containsKey(member.getUserId())) {
                UserSensitiveDTO user = users.get(member.getUserId());
                unitMember.setAvatar(user.getAvatar());
                unitMember.setEmail(users.get(member.getUserId()).getEmail());
                unitMember.setCode(user.getCode());
                unitMember.setMobilePhone(user.getMobilePhone());
            }
            units.add(unitMember);
        }
        return units;
    }

    @Override
    public List<UnitMemberInfoVo> getUnitMemberByMemberIds(List<Long> memberIds,
                                                           boolean includeSensitive) {
        // get members teams
        List<TeamMemberRelEntity> memberTeamRel =
            teamMemberRelMapper.selectTeamIdsByMemberIds(memberIds);
        List<Long> teamIds =
            memberTeamRel.stream().map(TeamMemberRelEntity::getTeamId).collect(Collectors.toList());
        Map<Long, UnitTeamDTO> teamUnitMap = getUnitTeamBaseInfoByTeamIds(teamIds).stream()
            .collect(Collectors.toMap(UnitTeamDTO::getId, i -> i));
        // get team roles
        Map<Long, List<UnitRoleInfoVo>> teamRoles =
            iRoleMemberService.getRefUnitRoles(teamIds, UnitType.TEAM);
        // actually data
        Map<Long, List<UnitTeamInfoVo>> memberTeamMap = memberTeamRel.stream().collect(
            Collectors.groupingBy(TeamMemberRelEntity::getMemberId,
                Collectors.mapping(i -> {
                    UnitTeamDTO team = teamUnitMap.get(i.getTeamId());
                    return UnitTeamInfoVo.builder().unitId(team.getUnitId())
                        .name(team.getTeamName()).sequence(team.getSequence())
                        .roles(teamRoles.get(i.getTeamId())).build();
                }, Collectors.toList())));
        // get members roles
        Map<Long, List<UnitRoleInfoVo>> refRoles =
            iRoleMemberService.getRefUnitRoles(new ArrayList<>(memberIds),
                UnitType.MEMBER);
        List<UnitMemberDTO> members = getUnitMemberBaseInfoByMemberIds(memberIds);
        // return data
        List<UnitMemberInfoVo> units = new ArrayList<>();
        for (UnitMemberDTO member : members) {
            UnitMemberInfoVo vo =
                UnitMemberInfoVo.builder().name(member.getMemberName()).unitId(member.getUnitId())
                    .avatar(member.getAvatar()).status(member.getStatus())
                    .type(member.getType().getType()).roles(refRoles.get(member.getId()))
                    .teams(memberTeamMap.get(member.getId()))
                    .build();
            if (includeSensitive && StrUtil.isNotBlank(member.getMobilePhone())) {
                UnitMemberInfoVo.MemberMobile mobile = new UnitMemberInfoVo.MemberMobile();
                mobile.setAreaCode(member.getCode());
                mobile.setNumber(member.getMobilePhone());
                vo.setMobile(mobile);
            }
            if (includeSensitive && StrUtil.isNotBlank(member.getEmail())) {
                vo.setEmail(member.getEmail());
            }
            units.add(vo);
        }
        return units;
    }

    @Override
    public List<UnitTeamInfoVo> getUnitTeamByTeamIds(List<Long> teamIds) {
        List<UnitTeamDTO> teams = getUnitTeamBaseInfoByTeamIds(teamIds);
        Map<Long, List<UnitRoleInfoVo>> refRoles =
            iRoleMemberService.getRefUnitRoles(new ArrayList<>(teamIds), UnitType.TEAM);
        List<UnitTeamInfoVo> units = new ArrayList<>();
        teams.forEach(team -> {
            UnitTeamInfoVo unit = UnitTeamInfoVo.builder().unitId(team.getUnitId())
                .parentUnitId(team.getParentUnitId())
                .name(team.getTeamName())
                .sequence(team.getSequence())
                .roles(refRoles.get(team.getId()))
                .build();
            units.add(unit);
        });
        return units;
    }

    @Override
    public List<UnitRoleInfoVo> getUnitRoleByRoleIds(List<Long> roleIds) {
        List<RoleBaseInfoDto> roles = iRoleService.getBaseInfoDtoByRoleIds(roleIds);
        Map<Long, String> roleUnit = getUnitBaseInfoByRefIds(roleIds).stream()
            .collect(Collectors.toMap(UnitBaseInfoDTO::getUnitRefId, UnitBaseInfoDTO::getUnitId));

        List<UnitRoleInfoVo> units = new ArrayList<>();
        roles.forEach(role -> {
            UnitRoleInfoVo unit = UnitRoleInfoVo.builder().unitId(roleUnit.get(role.getId()))
                .name(role.getRoleName())
                .sequence(role.getPosition())
                .build();
            units.add(unit);
        });
        return units;
    }

    @Override
    public PageInfo<UnitTeamInfoVo> getUnitSubTeamsWithPage(String spaceId, Long parentTeamId,
                                                            Page<Long> page) {
        IPage<Long> teamIds =
            teamMapper.selectTeamIdsBySpaceIdAndParentIdAndPage(page, spaceId, parentTeamId);
        if (teamIds.getSize() == 0) {
            return PageHelper.build(teamIds.getCurrent(), teamIds.getSize(),
                teamIds.getTotal(), new ArrayList<>());
        }
        List<UnitTeamInfoVo> units = getUnitTeamByTeamIds(teamIds.getRecords());
        return PageHelper.build(teamIds.getCurrent(), teamIds.getSize(),
            teamIds.getTotal(), units);
    }

    @Override
    public PageInfo<UnitRoleInfoVo> getUnitRolesWithPage(String spaceId,
                                                         Page<RoleBaseInfoDto> page) {
        IPage<RoleBaseInfoDto> roles = roleMapper.selectBySpaceIdAndPage(page, spaceId);
        if (roles.getSize() == 0) {
            return PageHelper.build(roles.getCurrent(), roles.getSize(),
                roles.getTotal(), new ArrayList<>());
        }
        List<Long> roleIds =
            roles.getRecords().stream().map(RoleBaseInfoDto::getId).collect(Collectors.toList());
        Map<Long, String> roleUnits = getUnitBaseInfoByRefIds(roleIds).stream()
            .collect(Collectors.toMap(UnitBaseInfoDTO::getUnitRefId,
                UnitBaseInfoDTO::getUnitId));
        if (roleUnits.keySet().isEmpty()) {
            return PageHelper.build(roles.getCurrent(), roles.getSize(),
                roles.getTotal(), new ArrayList<>());
        }
        List<UnitRoleInfoVo> units = new ArrayList<>();
        roles.getRecords().forEach(r -> {
            UnitRoleInfoVo unit = UnitRoleInfoVo.builder().unitId(roleUnits.get(r.getId()))
                .name(r.getRoleName())
                .sequence(r.getPosition())
                .build();
            units.add(unit);
        });
        return PageHelper.build(roles.getCurrent(), roles.getSize(),
            roles.getTotal(), units);
    }

    @Override
    public PageInfo<UnitMemberInfoVo> getMembersByTeamId(String spaceId, Long parentTeamId,
                                                         boolean sensitiveData, Page<Long> page) {
        IPage<Long> memberIds =
            teamMemberRelMapper.selectMemberIdsByTeamIdAndPage(page, parentTeamId);
        if (memberIds.getRecords().isEmpty()) {
            return PageHelper.build(memberIds.getCurrent(), memberIds.getSize(),
                memberIds.getTotal(), new ArrayList<>());
        }
        List<UnitMemberInfoVo> members =
            getUnitMemberByMemberIds(memberIds.getRecords(), sensitiveData);
        return PageHelper.build(memberIds.getCurrent(), memberIds.getSize(),
            memberIds.getTotal(), members);
    }

    @Override
    public UnitRoleMemberVo getRoleMembers(String spaceId, Long roleId,
                                           Boolean sensitiveData) {
        List<RoleMemberDTO> roleMembers =
            iRoleMemberService.getByRoleIds(Collections.singletonList(roleId));
        Map<Integer, List<Long>> roleMemberMap =
            roleMembers.stream().collect(Collectors.groupingBy(RoleMemberDTO::getUnitType,
                Collectors.mapping(RoleMemberDTO::getUnitRefId, Collectors.toList())));
        List<Long> memberIds = roleMemberMap.get(UnitType.MEMBER.getType());
        UnitRoleMemberVo vo = UnitRoleMemberVo.builder().build();
        if (null != memberIds && !memberIds.isEmpty()) {
            vo.setMembers(getUnitMemberByMemberIds(memberIds, sensitiveData));
        }
        List<Long> teamIds = roleMemberMap.get(UnitType.TEAM.getType());
        if (null != teamIds && !teamIds.isEmpty()) {
            vo.setTeams(getUnitTeamByTeamIds(teamIds));
        }
        return vo;
    }

    @Override
    public void checkUnit(Long memberId, String unitId) {
        if (null == unitId) {
            return;
        }
        UnitEntity unit = baseMapper.selectById(NumberUtil.parseLong(unitId));
        ExceptionUtil.isFalse(null == unit, OrganizationException.ILLEGAL_UNIT_ID);
        if (unit.getUnitType().equals(UnitType.MEMBER.getType())) {
            ExceptionUtil.isTrue(unit.getUnitRefId().equals(memberId),
                OrganizationException.ILLEGAL_UNIT_ID);
        }
        if (unit.getUnitType().equals(UnitType.TEAM.getType())) {
            List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamId(unit.getUnitRefId());
            ExceptionUtil.isTrue(memberIds.contains(memberId),
                OrganizationException.ILLEGAL_UNIT_ID);
        }
    }
}


