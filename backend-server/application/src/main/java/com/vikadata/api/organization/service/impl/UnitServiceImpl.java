package com.vikadata.api.organization.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.organization.enums.UnitType;
import com.vikadata.api.organization.vo.UnitInfoVo;
import com.vikadata.api.enterprise.control.service.IControlRoleService;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.mapper.TeamMapper;
import com.vikadata.api.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.organization.mapper.UnitMapper;
import com.vikadata.api.organization.model.MemberBaseInfoDTO;
import com.vikadata.api.organization.model.MemberTeamPathInfo;
import com.vikadata.api.organization.model.RoleBaseInfoDto;
import com.vikadata.api.organization.model.TeamBaseInfoDTO;
import com.vikadata.api.organization.model.UnitInfoDTO;
import com.vikadata.api.organization.service.IRoleMemberService;
import com.vikadata.api.organization.service.IRoleService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.shared.util.ibatis.ExpandServiceImpl;
import com.vikadata.api.workspace.enums.PermissionException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.api.user.entity.UnitEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class UnitServiceImpl extends ExpandServiceImpl<UnitMapper, UnitEntity> implements IUnitService {

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
    @Transactional(rollbackFor =  Exception.class)
    public void removeByRefId(Long refId) {
        Long unitId = baseMapper.selectUnitIdByRefId(refId);
        boolean flag = removeById(unitId);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        // delete node role or field role
        iControlRoleService.removeByUnitIds(Collections.singletonList(unitId));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchRemoveByTeamId(List<Long> teamIds) {
        log.info("Batch delete an organizational Unit(team)，team ids：[{}]", teamIds);
        List<Long> unitIds = baseMapper.selectIdsByRefIds(teamIds);
        boolean flag = removeByIds(unitIds);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
        // delete node role or field role
        iControlRoleService.removeByUnitIds(unitIds);
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
            List<Long> refIds = units.stream().map(UnitEntity::getUnitRefId).collect(Collectors.toList());
            if (typeEnum == UnitType.MEMBER) {
                // load the required member information
                List<MemberBaseInfoDTO> memberBaseInfoDTOList = memberMapper.selectBaseInfoDTOByIds(refIds);
                memberBaseInfoDTOList.forEach(info -> memberInfoMap.put(info.getId(), info));
            }
            else if (typeEnum == UnitType.TEAM) {
                // load the required team information
                List<TeamBaseInfoDTO> teamBaseInfoDTOList = teamMapper.selectBaseInfoDTOByIds(refIds);
                teamBaseInfoDTOList.forEach(info -> teamBaseInfoMap.put(info.getId(), info));
            }
            else if (typeEnum == UnitType.ROLE) {
                // load required role information
                List<RoleBaseInfoDto> roleBaseInfoDtoList = iRoleService.getBaseInfoDtoByRoleIds(refIds);
                roleBaseInfoDtoList.forEach(info -> roleBaseInfoMap.put(info.getId(), info));
            }
        });
        // handle member's team name, get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = iTeamService.batchGetFullHierarchyTeamNames(new ArrayList<>(memberInfoMap.keySet()), spaceId);
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
                    unitInfoVo.setEmail(baseInfo.getEmail());
                    unitInfoVo.setIsActive(baseInfo.getIsActive());
                    unitInfoVo.setIsNickNameModified(baseInfo.getIsNickNameModified());
                    unitInfoVo.setIsMemberNameModified(baseInfo.getIsMemberNameModified());
                    if (memberToTeamPathInfoMap.containsKey(unitEntity.getUnitRefId())) {
                        unitInfoVo.setTeamData(memberToTeamPathInfoMap.get(unitEntity.getUnitRefId()));
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
            }
            else if (unitType == UnitType.ROLE) {
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
        Map<Integer, List<Long>> typeToRefIdsMap = entities.stream().collect(Collectors.groupingBy(UnitEntity::getUnitType,
                Collectors.mapping(UnitEntity::getUnitRefId, Collectors.toList())));
        if (typeToRefIdsMap.isEmpty()) {
            return new ArrayList<>();
        }
        List<Long> memberIds = new ArrayList<>();
        for (Map.Entry<Integer, List<Long>> entry : typeToRefIdsMap.entrySet()) {
            UnitType type = UnitType.toEnum(entry.getKey());
            switch (type) {
                case TEAM:
                    List<Long> subTeamIds = teamMapper.selectAllSubTeamIds(entry.getValue());
                    List<Long> teamMemberIds = teamMemberRelMapper.selectMemberIdsByTeamIds(CollUtil.union(entry.getValue(), subTeamIds));
                    if (CollUtil.isNotEmpty(teamMemberIds)) {
                        memberIds.addAll(teamMemberIds);
                    }
                    break;
                case MEMBER:
                    memberIds.addAll(entry.getValue());
                    break;
                case ROLE:
                    List<Long> roleMemberIds = iRoleMemberService.getMemberIdsByRoleIds(entry.getValue());
                    memberIds.addAll(roleMemberIds);
                default:
                    break;
            }
        }
        return memberIds;
    }

    @Override
    public boolean batchUpdateIsDeletedBySpaceIdAndRefId(String spaceId, List<Long> refIds, UnitType unitType,
            Boolean isDeleted) {
        return SqlHelper.retBool(baseMapper.batchUpdateIsDeletedBySpaceIdAndRefId(spaceId, refIds, unitType, isDeleted));
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
            Map<Long, Long> refIdToUnitIdMap = units.stream().collect(Collectors.toMap(UnitEntity::getUnitRefId, UnitEntity::getId));
            Set<Long> refIds = refIdToUnitIdMap.keySet();
            if (typeEnum == UnitType.MEMBER) {
                // querying member information
                List<MemberEntity> members = memberMapper.selectByMemberIdsIgnoreDelete(refIds);
                members.forEach(member -> unitInfoList.add(new UnitInfoDTO(refIdToUnitIdMap.get(member.getId()), member.getMemberName())));
            }
            else if (typeEnum == UnitType.TEAM) {
                // querying department information
                List<TeamEntity> teams = teamMapper.selectByTeamIdsIgnoreDelete(refIds);
                teams.forEach(team -> unitInfoList.add(new UnitInfoDTO(refIdToUnitIdMap.get(team.getId()), team.getTeamName())));
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
