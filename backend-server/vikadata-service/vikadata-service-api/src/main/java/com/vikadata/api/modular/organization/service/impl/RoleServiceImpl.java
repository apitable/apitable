package com.vikadata.api.modular.organization.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.model.vo.organization.RoleInfoVo;
import com.vikadata.api.model.vo.organization.RoleVo;
import com.vikadata.api.modular.organization.mapper.RoleMapper;
import com.vikadata.api.modular.organization.model.RoleBaseInfoDto;
import com.vikadata.api.modular.organization.model.RoleInfoDTO;
import com.vikadata.api.modular.organization.model.RoleMemberInfoDTO;
import com.vikadata.api.modular.organization.service.IRoleMemberService;
import com.vikadata.api.modular.organization.service.IRoleService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.RoleEntity;
import com.vikadata.entity.UnitEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DatabaseException.DELETE_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.CREATE_ROLE_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.CREATE_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.UPDATE_ROLE_NAME_ERROR;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

/**
 * <p>
 *     organization module - role service impl.
 * </p>
 * @author tao
 */
@Slf4j
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, RoleEntity> implements IRoleService {

    @Resource
    IUnitService iUnitService;

    @Resource
    IRoleMemberService iRoleMemberService;

    @Resource
    ITeamService iTeamService;

    @Override
    public void checkDuplicationRoleName(String spaceId, String roleName, Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(baseMapper.selectCountBySpaceIdAndRoleName(spaceId, roleName));
        consumer.accept(count > 0);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createRole(Long userId, String spaceId, String roleName) {
        log.info("create role: {}", roleName);
        int maxSequence = getMaxSequenceBySpaceId(spaceId);
        RoleEntity role = new RoleEntity();
        role.setSpaceId(spaceId);
        role.setRoleName(roleName);
        role.setPosition(maxSequence * 2);
        role.setCreateBy(userId);
        boolean flag = save(role);
        ExceptionUtil.isTrue(flag, CREATE_ROLE_ERROR);
        iUnitService.create(spaceId, UnitType.ROLE, role.getId());
        return role.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateRole(Long userId, Long roleId, String roleName) {
        log.info("modify role's information");
        RoleEntity role = new RoleEntity();
        role.setId(roleId);
        role.setRoleName(roleName);
        role.setUpdateBy(userId);
        boolean flag = updateById(role);
        ExceptionUtil.isTrue(flag, UPDATE_ROLE_NAME_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteRole(Long roleId) {
        // clear role's member
        iRoleMemberService.removeByRoleId(roleId);
        // delete the ref unit and control role.
        iUnitService.removeByRefId(roleId);
        // delete the role.
        boolean flag = removeById(roleId);
        ExceptionUtil.isTrue(flag, DELETE_ERROR);
    }

    @Override
    public void checkRoleExistBySpaceIdAndRoleId(String spaceId, Long roleId, Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(baseMapper.selectCountByIdAndSpaceId(roleId, spaceId));
        consumer.accept(count > 0);
    }

    @Override
    public List<RoleInfoVo> getRoles(String spaceId) {
        List<RoleInfoVo> roles = new ArrayList<>();
        // 1. query the space's roles.
        List<RoleInfoDTO> roleInfos = baseMapper.selectBySpaceId(spaceId);
        if (CollUtil.isEmpty(roleInfos)) {
            return roles;
        }
        // 2. populate role vo.
        roleInfos.forEach(roleInfo -> {
            // populate role information.
            RoleInfoVo role = RoleInfoVo.builder()
                    .unitId(roleInfo.getUnitId())
                    .roleId(roleInfo.getId())
                    .roleName(roleInfo.getRoleName())
                    .position(roleInfo.getPosition())
                    .memberCount(0)
                    .build();
            roles.add(role);
        });
        // 3. the number of members in the roles.
        roleFillMemberCount(roles, roleInfos);
        return roles;
    }

    @Override
    public String getRoleNameByRoleId(Long roleId) {
        return baseMapper.selectRoleNameById(roleId);
    }

    @Override
    public List<RoleVo> getRoleVosByMemberId(Long memberId) {
        List<Long> roleIds = iRoleMemberService.getRoleIdsByRoleMemberId(memberId);
        if (CollUtil.isEmpty(roleIds)) {
            return CollUtil.newArrayList();
        }
        List<RoleInfoDTO> roleInfos = baseMapper.selectRoleInfoDtoByIds(roleIds);
        return roleInfos.stream()
                .map(roleInfo -> RoleVo.builder()
                        .roleId(roleInfo.getId())
                        .roleName(roleInfo.getRoleName())
                        .build())
                .collect(toList());
    }

    @Override
    public List<Long> getRoleIdsByKeyWord(String spaceId, String keyword) {
        return baseMapper.selectIdsBySpaceIdAndLikeRoleName(spaceId, keyword);
    }

    @Override
    public List<RoleBaseInfoDto> getBaseInfoDtoByRoleIds(List<Long> roleIds) {
        return baseMapper.selectRoleBaseInfoDtoByIds(roleIds);
    }

    @Override
    public Map<Long, List<Long>> flatMapToRoleMemberUnitIds(List<Long> roleIds) {
        if (CollUtil.isEmpty(roleIds)) {
            return new HashMap<>(0);
        }
        List<RoleMemberInfoDTO> roleMembers = iRoleMemberService.getRoleMembersByRoleIds(roleIds);
        List<UnitEntity> roleUnits = iUnitService.getUnitEntitiesByUnitRefIds(roleIds);
        Map<Long, List<Long>> roleIdToUnitIds = roleMembers.stream().collect(groupingBy(RoleMemberInfoDTO::getRoleId, mapping(RoleMemberInfoDTO::getUnitId, toList())));
        return roleUnits.stream().collect(toMap(UnitEntity::getId, unit -> roleIdToUnitIds.getOrDefault(unit.getUnitRefId(), CollUtil.newArrayList())));
    }

    @Override
    public List<RoleInfoVo> getRoleVos(String spaceId, List<Long> roleIds) {
        // 1. query the space's roles.
        List<RoleInfoDTO> roleInfoDtos = baseMapper.selectRoleInfoDtoByIdsAndSpaceId(roleIds, spaceId);
        List<RoleInfoVo> roleInfoVos = new ArrayList<>(roleInfoDtos.size());
        roleInfoDtos.forEach(roleInfoDTO -> {
            RoleInfoVo roleInfoVo = RoleInfoVo.builder()
                    .unitId(roleInfoDTO.getUnitId())
                    .roleId(roleInfoDTO.getId())
                    .roleName(roleInfoDTO.getRoleName())
                    .position(roleInfoDTO.getPosition())
                    .build();
            roleInfoVos.add(roleInfoVo);
        });
        roleFillMemberCount(roleInfoVos, roleInfoDtos);
        return roleInfoVos;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void initRoleList(Long userId, String spaceId) {
        List<String> roleNames = getInitRoleNames();
        if (roleNames.isEmpty()) {
            return;
        }
        List<RoleEntity> roles = new ArrayList<>();
        for (int i = 0; i < roleNames.size(); i++) {
            String roleName = roleNames.get(i);
            RoleEntity role = RoleEntity.builder()
                    .spaceId(spaceId)
                    .roleName(roleName)
                    .position(1000 * (2 << i))
                    .createBy(userId)
                    .build();
            roles.add(role);
        }
        boolean flag = saveBatch(roles);
        ExceptionUtil.isTrue(flag, CREATE_ROLE_ERROR);
        List<UnitEntity> units = new ArrayList<>();
        for (RoleEntity role : roles) {
            UnitEntity unit = UnitEntity.builder()
                    .spaceId(spaceId)
                    .unitRefId(role.getId())
                    .unitType(UnitType.ROLE.getType())
                    .build();
            units.add(unit);
        }
        boolean unitsInsertFlag = iUnitService.createBatch(units);
        ExceptionUtil.isTrue(unitsInsertFlag, CREATE_ROLE_ERROR);
    }

    @Override
    public void checkRoleExistBySpaceId(String spaceId, Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(baseMapper.selectCountBySpaceId(spaceId));
        consumer.accept(count > 0);
    }

    private List<String> getInitRoleNames() {
        String roles = VikaStrings.t("init_roles");
        return StrUtil.splitTrim(roles, StrUtil.C_COMMA);
    }

    private void roleFillMemberCount(List<RoleInfoVo> roles, List<RoleInfoDTO> roleInfos) {
        List<Long> roleIds = roleInfos.stream().map(RoleInfoDTO::getId).collect(toList());
        List<RoleMemberInfoDTO> allRoleMembers = iRoleMemberService.getRoleMembersByRoleIds(roleIds);
        if (CollUtil.isEmpty(allRoleMembers)) {
            return;
        }
        // group roles' members by role.
        Map<Long, List<RoleMemberInfoDTO>> roleIdToRoleMembers = allRoleMembers.stream()
                .collect(groupingBy(RoleMemberInfoDTO::getRoleId, toList()));
        roles.forEach(role -> {
            if (!roleIdToRoleMembers.containsKey(role.getRoleId())) {
                return;
            }
            // count the number of members in the role
            List<RoleMemberInfoDTO> roleMembers = roleIdToRoleMembers.get(role.getRoleId());
            Map<Integer, List<Long>> unitTypeToUnitRefIds = roleMembers.stream()
                    .collect(groupingBy(RoleMemberInfoDTO::getUnitType,
                            mapping(RoleMemberInfoDTO::getUnitRefId, toList())));
            List<Long> memberIds = unitTypeToUnitRefIds
                    .getOrDefault(UnitType.MEMBER.getType(), CollUtil.newArrayList());
            int memberCount;
            if (unitTypeToUnitRefIds.containsKey(UnitType.TEAM.getType())) {
                List<Long> teamIds = unitTypeToUnitRefIds.get(UnitType.TEAM.getType());
                List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(teamIds);
                memberCount = CollUtil.unionDistinct(memberIds, teamMemberIds).size();
            }
            else {
                memberCount = memberIds.size();
            }
            role.setMemberCount(memberCount);
        });
    }

    private int getMaxSequenceBySpaceId(String spaceId) {
        Integer maxSequence = baseMapper.selectMaxSequenceBySpaceId(spaceId);
        return ObjectUtil.isNull(maxSequence) ? 1000 : maxSequence;
    }

}
