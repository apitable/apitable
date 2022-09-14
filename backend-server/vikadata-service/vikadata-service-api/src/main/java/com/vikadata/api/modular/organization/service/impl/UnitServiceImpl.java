package com.vikadata.api.modular.organization.service.impl;

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

import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.model.vo.organization.UnitInfoVo;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.mapper.UnitMapper;
import com.vikadata.api.modular.organization.model.MemberBaseInfoDTO;
import com.vikadata.api.modular.organization.model.TeamBaseInfoDTO;
import com.vikadata.api.modular.organization.model.UnitInfoDTO;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.service.ExpandServiceImpl;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.UnitEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DatabaseException.DELETE_ERROR;
import static com.vikadata.api.enums.exception.DatabaseException.INSERT_ERROR;
import static com.vikadata.api.enums.exception.PermissionException.ORG_UNIT_NOT_EXIST;

/**
 * <p>
 * 组织单元 服务接口实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/10 14:20
 */
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

    @Override
    public Long getUnitIdByRefId(Long refId) {
        return baseMapper.selectUnitIdByRefId(refId);
    }

    @Override
    public List<Long> getUnitIdsByRefIds(Collection<Long> refIds) {
        log.info("根据关联ID集合获取组织单元ID集合");
        return baseMapper.selectIdsByRefIds(refIds);
    }

    @Override
    public List<UnitEntity> getByRefIds(Collection<Long> refIds) {
        log.info("根据关联ID集合批量获取组织单元");
        return baseMapper.selectByRefIds(refIds);
    }

    @Override
    public void checkInSpace(String spaceId, List<Long> unitIds) {
        log.info("检查组织是否在空间内");
        int result = SqlTool.retCount(baseMapper.selectCountBySpaceIdAndIds(spaceId, unitIds));
        ExceptionUtil.isTrue(result == unitIds.size(), ORG_UNIT_NOT_EXIST);
    }

    @Override
    public Long create(String spaceId, UnitType unitType, Long unitRefId) {
        log.info("创建组织单元，单元类型:{}, 单元ID:{}", unitType, unitRefId);
        UnitEntity unit = new UnitEntity();
        unit.setSpaceId(spaceId);
        unit.setUnitType(unitType.getType());
        unit.setUnitRefId(unitRefId);
        boolean flag = save(unit);
        ExceptionUtil.isTrue(flag, INSERT_ERROR);
        return unit.getId();
    }

    @Override
    public boolean createBatch(List<UnitEntity> unitEntities) {
        log.info("批量创建组织单元");
        return saveBatch(unitEntities);
    }

    @Override
    public void restoreMemberUnit(String spaceId, Collection<Long> memberIds) {
        log.info("恢复成员组织单元");
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
        log.info("删除组织单元(部门)，部门ID：{}", teamId);
        Long unitId = baseMapper.selectUnitIdByRefId(teamId);
        boolean flag = removeById(unitId);
        ExceptionUtil.isTrue(flag, DELETE_ERROR);
        // 删除节点权限、字段权限（若有）
        iControlRoleService.removeByUnitIds(Collections.singletonList(unitId));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchRemoveByTeamId(List<Long> teamIds) {
        log.info("批量删除组织单元(部门)，部门ID：{}", teamIds);
        List<Long> unitIds = baseMapper.selectIdsByRefIds(teamIds);
        boolean flag = removeByIds(unitIds);
        ExceptionUtil.isTrue(flag, DELETE_ERROR);
        // 删除节点权限、字段权限（若有）
        iControlRoleService.removeByUnitIds(unitIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByMemberId(List<Long> memberIds) {
        log.info("删除组织单元(成员)，成员ID：{}", memberIds);
        List<Long> unitIds = getUnitIdsByRefIds(memberIds);
        if (CollUtil.isEmpty(unitIds)) {
            return;
        }
        removeByIds(unitIds);
        // 删除节点权限、字段权限（若有）
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
        groupUnitMap.forEach((unitType, units) -> {
            UnitType typeEnum = UnitType.toEnum(unitType);
            List<Long> refIds = units.stream().map(UnitEntity::getUnitRefId).collect(Collectors.toList());
            if (typeEnum == UnitType.MEMBER) {
                // 加载成员必要信息
                List<MemberBaseInfoDTO> memberBaseInfoDTOList = memberMapper.selectBaseInfoDTOByIds(refIds);
                memberBaseInfoDTOList.forEach(info -> memberInfoMap.put(info.getId(), info));
            }

            if (typeEnum == UnitType.TEAM) {
                // 加载部门必要信息
                List<TeamBaseInfoDTO> teamBaseInfoDTOList = teamMapper.selectBaseInfoDTOByIds(refIds);
                teamBaseInfoDTOList.forEach(info -> teamBaseInfoMap.put(info.getId(), info));
            }
        });
        // 按序插入数据
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
                    unitInfoVo.setIsActive(baseInfo.getIsActive());
                    unitInfoVo.setIsNickNameModified(baseInfo.getIsNickNameModified());
                    unitInfoVo.setIsMemberNameModified(baseInfo.getIsMemberNameModified());
                }
                // 冷静期/已注销用户
                if (baseInfo == null || !baseInfo.getIsPaused()) {
                    unitInfoList.add(unitInfoVo);
                }
            }

            if (unitType == UnitType.TEAM) {
                UnitInfoVo unitInfoVo = new UnitInfoVo();
                unitInfoVo.setUnitId(unitId);
                unitInfoVo.setUnitRefId(unitEntity.getUnitRefId());
                unitInfoVo.setType(unitEntity.getUnitType());
                unitInfoVo.setIsDeleted(unitEntity.getIsDeleted());
                TeamBaseInfoDTO baseInfo = teamBaseInfoMap.get(unitEntity.getUnitRefId());
                if (baseInfo != null) {
                    unitInfoVo.setName(baseInfo.getTeamName());
                }
                unitInfoList.add(unitInfoVo);
            }
        }
        return unitInfoList;
    }

    @Override
    public List<Long> getMembersIdByUnitIds(Collection<Long> unitIds) {
        log.info("获取组织单元下所有的成员ID");
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
        // 查询组织单元信息
        List<UnitEntity> unitEntities = baseMapper.selectByUnitIds(unitIds);
        // 以类型分组，批量查询同一个类型的关联对象信息
        Map<Integer, List<UnitEntity>> groupUnitMap = unitEntities.stream()
                .collect(Collectors.groupingBy(UnitEntity::getUnitType));
        groupUnitMap.forEach((unitType, units) -> {
            UnitType typeEnum = UnitType.toEnum(unitType);
            Map<Long, Long> refIdToUnitIdMap = units.stream().collect(Collectors.toMap(UnitEntity::getUnitRefId, UnitEntity::getId));
            Set<Long> refIds = refIdToUnitIdMap.keySet();
            if (typeEnum == UnitType.MEMBER) {
                // 查询成员信息
                List<MemberEntity> members = memberMapper.selectByMemberIdsIgnoreDelete(refIds);
                members.forEach(member -> unitInfoList.add(new UnitInfoDTO(refIdToUnitIdMap.get(member.getId()), member.getMemberName())));
            }
            else if (typeEnum == UnitType.TEAM) {
                // 查询部门信息
                List<TeamEntity> teams = teamMapper.selectByTeamIdsIgnoreDelete(refIds);
                teams.forEach(team -> unitInfoList.add(new UnitInfoDTO(refIdToUnitIdMap.get(team.getId()), team.getTeamName())));
            }
        });
        return unitInfoList;
    }

    @Override
    public List<Long> getRelUserIdsByUnitIds(List<Long> unitIds) {
        // 获取组织单元下所有的成员ID
        List<Long> membersIds = this.getMembersIdByUnitIds(unitIds);
        if (membersIds.isEmpty()) {
            return new ArrayList<>();
        }
        return memberMapper.selectUserIdsByMemberIds(membersIds);
    }
}
