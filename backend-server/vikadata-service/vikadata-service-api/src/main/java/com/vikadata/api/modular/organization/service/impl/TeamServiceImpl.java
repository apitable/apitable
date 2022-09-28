package com.vikadata.api.modular.organization.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.dto.organization.TeamMemberDto;
import com.vikadata.api.model.vo.organization.MemberInfoVo;
import com.vikadata.api.model.vo.organization.MemberPageVo;
import com.vikadata.api.model.vo.organization.TeamInfoVo;
import com.vikadata.api.model.vo.organization.TeamTreeVo;
import com.vikadata.api.model.vo.organization.TeamVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.model.vo.space.SpaceRoleDetailVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.mapper.UnitMapper;
import com.vikadata.api.modular.organization.model.MemberIsolatedInfo;
import com.vikadata.api.modular.organization.model.MemberTeamInfoDTO;
import com.vikadata.api.modular.organization.model.MemberTeamPathInfo;
import com.vikadata.api.modular.organization.model.TeamCteInfo;
import com.vikadata.api.modular.organization.model.TeamPathInfo;
import com.vikadata.api.modular.organization.service.IRoleMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceInviteLinkService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.support.tree.DefaultTreeBuildFactory;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.UnitEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.OrganizationException.CREATE_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.DELETE_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.GET_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.UPDATE_TEAM_NAME_ERROR;

/**
 * <p>
 * 组织架构-部门表 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
@Service
@Slf4j
public class TeamServiceImpl extends ServiceImpl<TeamMapper, TeamEntity> implements ITeamService {

    @Resource
    private IUnitService iUnitService;

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    @Override
    public Set<Long> getTeamIdsByMemberId(String spaceId, Long memberId) {
        log.info("查询成员的所属部门ID，包括所有父级部门");
        List<Long> teamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
        List<TeamEntity> allTeams = baseMapper.selectAllBySpaceId(spaceId);
        Set<Long> resultList = new HashSet<>();
        for (Long teamId : teamIds) {
            TeamEntity team = CollUtil.findOne(allTeams, entity -> entity.getId().equals(teamId));
            //查所有父级ID
            Set<Long> allTeamIds = inverseRecursive(allTeams, team);
            resultList.addAll(allTeamIds);
        }
        return resultList;
    }

    /**
     * 反遍历查询所有父级
     */
    private Set<Long> inverseRecursive(List<TeamEntity> teamList, TeamEntity node) {
        Set<Long> resultList = new HashSet<>();
        resultList.add(node.getId());
        if (node.getParentId() != 0) {
            for (TeamEntity team : teamList) {
                if (node.getParentId().equals(team.getId())) {
                    Set<Long> parent = inverseRecursive(teamList, team);
                    resultList.addAll(parent);
                }
            }
        }
        return resultList;
    }

    @Override
    public MemberIsolatedInfo checkMemberIsolatedBySpaceId(String spaceId, Long memberId) {
        log.info("检查成员是否被通讯录隔离");
        MemberIsolatedInfo memberIsolatedInfo = new MemberIsolatedInfo();
        // 获取当前空间站的全局属性
        SpaceGlobalFeature features = iSpaceService.getSpaceGlobalFeature(spaceId);
        // 获取空间站主管理员Id
        Long spaceMainAdminId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        // 判断是否开启通讯录隔离
        if (Boolean.TRUE.equals(features.getOrgIsolated()) && Boolean.FALSE.equals(spaceMainAdminId.equals(memberId))) {
            // 获取管理员信息
            SpaceRoleDetailVo spaceRoleDetailVo = iSpaceRoleService.getRoleDetail(spaceId, memberId);
            // 判断是否拥有通讯录管理权限
            if (Boolean.FALSE.equals(spaceRoleDetailVo.getResources().contains("MANAGE_MEMBER")) && Boolean.FALSE.equals(spaceRoleDetailVo.getResources().contains("MANAGE_TEAM"))) {
                // 获取空间站的根部门ID
                Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
                // 获取成员所属部门ID
                List<Long> teamIds = memberMapper.selectTeamIdsByMemberId(memberId);
                // 判断成员是否直属根部门
                if (Boolean.FALSE.equals(teamIds.contains(rootTeamId))) {
                    memberIsolatedInfo.setIsolated(true);
                    memberIsolatedInfo.setTeamIds(teamIds);
                    return memberIsolatedInfo;
                }
            }
        }
        memberIsolatedInfo.setIsolated(false);
        return memberIsolatedInfo;
    }

    @Override
    public boolean checkHasSubUnitByTeamId(String spaceId, Long teamId) {
        log.info("检查部门下是否存在成员或部门");
        List<Long> subTeamIds = baseMapper.selectTeamIdsByParentId(spaceId, teamId);
        int subMemberCount = SqlTool.retCount(teamMemberRelMapper.countByTeamId(Collections.singletonList(teamId)));
        return CollUtil.isNotEmpty(subTeamIds) || subMemberCount > 0;
    }

    @Override
    public int countMemberCountByParentId(Long teamId) {
        log.info("统计部门以下所有成员人数，");
        List<Long> allSubTeamIds = baseMapper.selectAllSubTeamIdsByParentId(teamId, true);
        return CollUtil.isNotEmpty(allSubTeamIds) ? SqlTool.retCount(teamMemberRelMapper.countByTeamId(allSubTeamIds)) : 0;
    }

    @Override
    public int getMemberCount(List<Long> teamIds) {
        //获取部门下所有成员数
        return SqlTool.retCount(teamMemberRelMapper.countByTeamId(teamIds));
    }

    @Override
    public List<Long> getMemberIdsByTeamIds(List<Long> teamIds) {
        List<Long> subTeamIds = baseMapper.selectAllSubTeamIds(teamIds);
        return teamMemberRelMapper.selectMemberIdsByTeamIds(CollUtil.union(teamIds, subTeamIds));
    }

    @Override
    public Long getRootTeamId(String spaceId) {
        return baseMapper.selectRootIdBySpaceId(spaceId);
    }

    @Override
    public Long getRootTeamUnitId(String spaceId) {
        Long rootTeamId = this.getRootTeamId(spaceId);
        return unitMapper.selectUnitIdByRefId(rootTeamId);
    }

    @Override
    public List<Long> getUnitsByTeam(Long teamId) {
        log.info("获取部门及所有父级部门的组织单元");
        List<Long> teamIds = baseMapper.selectAllParentTeamIds(teamId, true);
        List<Long> roleIds = iRoleMemberService.getRoleIdsByRoleMemberId(teamId);
        return iUnitService.getUnitIdsByRefIds(CollUtil.addAll(teamIds, roleIds));
    }

    @Override
    public Long getParentId(Long teamId) {
        return baseMapper.selectParentIdByTeamId(teamId);
    }

    @Override
    public List<Long> getAllSubTeamIdsByParentId(Long teamId) {
        return baseMapper.selectAllSubTeamIdsByParentId(teamId, false);
    }

    @Override
    public int getMaxSequenceByParentId(Long parentId) {
        Integer maxSequence = baseMapper.selectMaxSequenceByParentId(parentId);
        return Optional.ofNullable(maxSequence).orElse(0);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createRootTeam(String spaceId, String spaceName) {
        log.info("创建根部门:{}", spaceName);
        TeamEntity rootTeam = new TeamEntity();
        rootTeam.setSpaceId(spaceId);
        rootTeam.setTeamName(spaceName);
        boolean flag = save(rootTeam);
        ExceptionUtil.isTrue(flag, CREATE_TEAM_ERROR);
        return rootTeam.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchCreateTeam(String spaceId, List<TeamEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        boolean flag = saveBatch(entities);
        ExceptionUtil.isTrue(flag, CREATE_TEAM_ERROR);
        List<UnitEntity> unitEntities = new ArrayList<>();
        entities.forEach(team -> {
            UnitEntity unit = new UnitEntity();
            unit.setId(IdWorker.getId());
            unit.setSpaceId(spaceId);
            unit.setUnitType(UnitType.TEAM.getType());
            unit.setUnitRefId(team.getId());
            unitEntities.add(unit);
        });
        iUnitService.createBatch(unitEntities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSubTeam(String spaceId, String name, Long parentId) {
        log.info("创建子部门:{}", name);
        int max = getMaxSequenceByParentId(parentId);
        TeamEntity team = new TeamEntity();
        team.setSpaceId(spaceId);
        team.setTeamName(name);
        team.setParentId(parentId);
        team.setSequence(max + 1);
        boolean flag = save(team);
        ExceptionUtil.isTrue(flag, CREATE_TEAM_ERROR);
        iUnitService.create(spaceId, UnitType.TEAM, team.getId());
        return team.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<Long> createBatchByTeamName(String spaceId, Long rootTeamId, List<String> teamNames) {
        List<Long> teamIds = new ArrayList<>();
        //取最后的索引,也可能是只有一个部门层级
        int lastIndex = teamNames.size() - 1;
        Long parentId = rootTeamId;
        for (int i = 0; i < teamNames.size(); i++) {
            String name = teamNames.get(i);
            // 查找部门名称，并且父级部门对齐
            TeamEntity findTeam = baseMapper.selectBySpaceIdAndName(spaceId, name, parentId);
            if (findTeam != null) {
                // 存在，不创建
                parentId = findTeam.getId();
                if (i == lastIndex) {
                    teamIds.add(findTeam.getId());
                }
            }
            else {
                // 不存在，创建新部门
                parentId = createSubTeam(spaceId, name, parentId);
                if (i == lastIndex) {
                    teamIds.add(parentId);
                }
            }
        }
        return teamIds;
    }

    @Override
    public Long getByTeamNamePath(String spaceId, List<String> teamNames) {
        // 保证进入这里之前是合法数据
        String lastTeamName = CollUtil.getLast(teamNames);
        if (StrUtil.isBlank(lastTeamName)) {
            return null;
        }
        // 根据部门查询部门层级路径
        List<TeamEntity> teamEntities = baseMapper.selectTreeByTeamName(spaceId, lastTeamName);
        // 部门名称业务会重复，分割成树形，并且利用树查找
        Map<String, Long> teamPathName = buildTreeTeamList(teamEntities, lastTeamName);
        // 重新组合部门层次字符串,保险起见，去除了每个部门之间的空格
        String withoutBlankTeamNamePath = CollUtil.join(teamNames, "-");
        // 比较是否存在
        return teamPathName.getOrDefault(withoutBlankTeamNamePath, null);
    }

    public Map<String, Long> buildTreeTeamList(List<TeamEntity> teamEntities, String teamName) {
        Map<String, Long> teamPathMap = new HashMap<>();
        List<Long> teamIds = teamEntities.stream()
                .filter(e -> e.getTeamName().equals(teamName))
                .map(TeamEntity::getId).collect(Collectors.toList());
        teamIds.forEach(teamId -> {
            List<String> teamPath = new ArrayList<>();
            findParentTeam(teamEntities, teamId, teamPath::add);
            Collections.reverse(teamPath);
            teamPathMap.put(CollUtil.join(teamPath, "-"), teamId);
        });
        return teamPathMap;
    }

    private void findParentTeam(List<TeamEntity> teamEntities, Long teamId, Consumer<String> teamPath) {
        for (TeamEntity teamEntity : teamEntities) {
            if (teamEntity.getId().equals(teamId) && !teamEntity.getParentId().equals(0L)) {
                teamPath.accept(teamEntity.getTeamName());
                findParentTeam(teamEntities, teamEntity.getParentId(), teamPath);
            }
        }
    }

    @Override
    public TeamInfoVo getTeamInfoById(String spaceId, Long teamId) {
        log.info("根据部门ID查询部门信息");
        Long rootTeamId = baseMapper.selectRootIdBySpaceId(spaceId);
        ExceptionUtil.isNotNull(rootTeamId, GET_TEAM_ERROR);
        SpaceEntity spaceEntity = spaceMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(spaceEntity, GET_TEAM_ERROR);
        TeamInfoVo teamInfo = new TeamInfoVo();
        if (teamId == 0) {
            // 查询根部门信息，根部门为0
            teamInfo.setTeamId(0L);
            teamInfo.setTeamName(spaceEntity.getName());
            teamInfo.setSequence(1);
            List<Long> subTeamIds = baseMapper.selectTeamIdsByParentId(spaceId, rootTeamId);
            if (CollUtil.isNotEmpty(subTeamIds)) {
                teamInfo.setHasChildren(true);
            }
            // 查询总人数
            int memberCount = SqlTool.retCount(memberMapper.selectCountBySpaceId(spaceId));
            teamInfo.setMemberCount(memberCount);
            // 查询已激活成员数
            int activateMemberCount = SqlTool.retCount(memberMapper.selectActiveMemberCountBySpaceId(spaceId));
            teamInfo.setActivateMemberCount(activateMemberCount);
            return teamInfo;
        }
        // 查询非根部门信息
        TeamEntity teamEntity = baseMapper.selectById(teamId);
        ExceptionUtil.isNotNull(teamEntity, GET_TEAM_ERROR);
        teamInfo.setTeamId(teamId);
        teamInfo.setTeamName(teamEntity.getTeamName());
        teamInfo.setSequence(teamEntity.getSequence());
        if (rootTeamId.equals(teamEntity.getParentId())) {
            teamInfo.setParentId(0L);
            teamInfo.setParentTeamName(spaceEntity.getName());
        }
        else {
            teamInfo.setParentId(teamEntity.getParentId());
            String parentTeamName = baseMapper.selectTeamNameById(teamEntity.getParentId());
            teamInfo.setParentTeamName(parentTeamName);
        }
        List<Long> subTeamIds = baseMapper.selectTeamIdsByParentId(spaceId, teamId);
        if (CollUtil.isNotEmpty(subTeamIds)) {
            // 获取包含子部门人数
            teamInfo.setHasChildren(true);
            List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamIds(subTeamIds);
            teamInfo.setMemberCount(memberIds.isEmpty() ? 0 : new HashSet<>(memberIds).size());
            // 获取子部门中已激活的人数
            List<Long> activeMemberIds = teamMemberRelMapper.selectActiveMemberIdsByTeamIds(subTeamIds);
            teamInfo.setActivateMemberCount(memberIds.isEmpty() ? 0 : new HashSet<>(activeMemberIds).size());
        }
        else {
            teamInfo.setMemberCount(baseMapper.selectMemberCountByTeamId(teamId));
            teamInfo.setActivateMemberCount(baseMapper.selectActiveMemberCountByTeamId(teamId));
        }
        return teamInfo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTeamName(Long teamId, String teamName) {
        log.info("修改部门名称");
        TeamEntity update = new TeamEntity();
        update.setId(teamId);
        update.setTeamName(teamName);
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, UPDATE_TEAM_NAME_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTeamParent(Long teamId, String teamName, Long parentId) {
        log.info("调整部门层级");
        TeamEntity update = new TeamEntity();
        update.setId(teamId);
        update.setTeamName(teamName);
        update.setParentId(parentId);
        Integer maxSequence = baseMapper.selectMaxSequenceByParentId(parentId);
        int max = Optional.ofNullable(maxSequence).orElse(0);
        update.setSequence(max + 1);
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, UPDATE_TEAM_NAME_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTeam(Long teamId) {
        log.info("删除部门");
        iRoleMemberService.removeByRoleMemberIds(CollUtil.newArrayList(teamId));
        boolean flag = removeById(teamId);
        ExceptionUtil.isTrue(flag, DELETE_TEAM_ERROR);
        iUnitService.removeByTeamId(teamId);
        //删除部门，同时删除公开链接
        iSpaceInviteLinkService.deleteByTeamId(teamId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTeam(Collection<Long> teamIds) {
        log.info("批量删除部门");
        if (CollUtil.isEmpty(teamIds)) {
            return;
        }
        iRoleMemberService.removeByRoleMemberIds(teamIds);
        boolean flag = removeByIds(teamIds);
        ExceptionUtil.isTrue(flag, DELETE_TEAM_ERROR);
        // 删除部门关联
        iTeamMemberRelService.removeByTeamIds(teamIds);
        // 批量删除部门，同时删除公开链接
        iSpaceInviteLinkService.deleteByTeamIds(teamIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteSubTeam(String spaceId, Long teamId) {
        log.info("删除子部门");
        List<Long> subTeamIds = baseMapper.selectAllSubTeamIdsByParentId(teamId, false);
        if (CollUtil.isEmpty(subTeamIds)) {
            return;
        }
        iRoleMemberService.removeByRoleMemberIds(subTeamIds);
        boolean flag = removeByIds(subTeamIds);
        ExceptionUtil.isTrue(flag, DELETE_TEAM_ERROR);
        // 删除组织部门
        iUnitService.batchRemoveByTeamId(subTeamIds);
        // 批量删除部门，同时删除公开链接
        iSpaceInviteLinkService.deleteByTeamIds(subTeamIds);
    }

    @Override
    public List<TeamTreeVo> build(String spaceId, Long id) {
        List<TeamMemberDto> results = baseMapper.selectTeamsBySpaceId(spaceId, id);
        List<TeamTreeVo> res = new ArrayList<>();
        for (TeamMemberDto node : results) {
            List<Long> memberIds = new ArrayList<>();
            recurse(results, node, memberIds);
            List<Long> mIds = CollUtil.distinct(memberIds);
            TeamTreeVo teamTreeVo = new TeamTreeVo();
            teamTreeVo.setTeamId(node.getTeamId());
            teamTreeVo.setTeamName(node.getTeamName());
            teamTreeVo.setParentId(node.getParentId());
            teamTreeVo.setMemberCount(mIds.size());
            teamTreeVo.setSequence(node.getSequence());
            res.add(teamTreeVo);
        }
        return res;
    }

    @Override
    public List<TeamTreeVo> buildTree(String spaceId, List<Long> teamIds) {
        if (teamIds.isEmpty()) {
            return new ArrayList<>();
        }
        Long rootTeamId = baseMapper.selectRootIdBySpaceId(spaceId);
        List<TeamMemberDto> resultList = baseMapper.selectMemberTeamsBySpaceIdAndTeamIds(spaceId, teamIds);
        List<TeamTreeVo> res = new ArrayList<>();
        for (TeamMemberDto node : resultList) {
            List<Long> memberIds = new ArrayList<>();
            recurse(resultList, node, memberIds);
            List<Long> mIds = CollUtil.distinct(memberIds);
            TeamTreeVo teamTreeVo = new TeamTreeVo();
            teamTreeVo.setTeamId(node.getTeamId());
            teamTreeVo.setTeamName(node.getTeamName());
            teamTreeVo.setParentId(node.getParentId().equals(rootTeamId) ? 0L : node.getParentId());
            teamTreeVo.setMemberCount(mIds.size());
            teamTreeVo.setSequence(node.getSequence());
            res.add(teamTreeVo);
        }
        return res;
    }

    @Override
    public Map<Long, Integer> getTeamMemberCountMap(Long teamId) {
        List<Long> ids = baseMapper.selectAllSubTeamIdsByParentId(teamId, true);
        Map<Long, Integer> map = new HashMap<>(ids.size());
        if (CollUtil.isNotEmpty(ids)) {
            List<TeamMemberDto> dtoList = baseMapper.selectTeamsByIds(ids);
            dtoList.forEach(dto -> {
                List<Long> memberIds = new ArrayList<>();
                recurse(dtoList, dto, memberIds);
                List<Long> mIds = CollUtil.distinct(memberIds);
                map.put(dto.getTeamId(), mIds.size());
            });
        }
        return map;
    }

    @Override
    public List<Long> getTeamIdsBySpaceId(String spaceId) {
        return baseMapper.selectTeamAllIdBySpaceId(spaceId);
    }

    @Override
    public List<TeamTreeVo> getMemberTeamTree(String spaceId, List<Long> teamIds) {
        log.info("构建成员被隔离后所属部门组织树");
        // 获取成员所属部门及所有子级部门VO
        List<TeamTreeVo> allTeamsVO = this.getMemberAllTeamsVO(spaceId, teamIds);
        // 成员所属部门及所有子级部门ID
        List<Long> teamIdList = allTeamsVO.stream().map(TeamTreeVo::getTeamId).collect(Collectors.toList());
        // 将父级部门ID设置为0. 相当于提高直属部门层级至一级部门位置
        for (TeamTreeVo teamVO : allTeamsVO) {
            if (teamIds.contains(teamVO.getTeamId()) && !teamIdList.contains(teamVO.getParentId()) && teamVO.getParentId() != 0) {
                teamVO.setParentId(0L);
            }
        }
        return new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(allTeamsVO);
    }

    @Override
    public List<TeamTreeVo> getMemberAllTeamsVO(String spaceId, List<Long> teamIds) {
        log.info("获取成员所属部门及所有子级部门VO");
        // 获取所属部门以及所属部门子部门ID
        List<TeamCteInfo> allTeamIds = teamMapper.selectChildTreeByTeamIds(spaceId, teamIds);
        // 获取成员所属部门及所有子级部门VO
        return this.buildTree(spaceId, allTeamIds.stream().map(TeamCteInfo::getId).collect(Collectors.toList()));
    }

    @Override
    public List<TeamTreeVo> loadMemberTeamTree(String spaceId, Long memberId) {
        log.info("加载成员部门组织树");
        // 判断成员是否被通讯录隔离
        MemberIsolatedInfo memberIsolatedInfo = this.checkMemberIsolatedBySpaceId(spaceId, memberId);
        if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
            // 获取部门组织树
            return this.getMemberTeamTree(spaceId, memberIsolatedInfo.getTeamIds());
        }
        // 统计空间站下所有部门
        List<TeamTreeVo> treeList = this.build(spaceId, null);
        // 构建默认加载的组织树
        List<TeamTreeVo> teamTreeVoList = new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(treeList);
        // 将根部门ID处理为0
        for (TeamTreeVo teamTreeVo : teamTreeVoList) {
            if (teamTreeVo.getParentId() == 0) {
                teamTreeVo.setTeamId(0L);
            }
        }
        return teamTreeVoList;
    }

    @Override
    public List<UnitTeamVo> getUnitTeamVo(String spaceId, List<Long> teamIds) {
        return baseMapper.selectUnitTeamVoByTeamIds(spaceId, teamIds);
    }

    @Override
    public void handlePageMemberTeams(IPage<MemberPageVo> page, String spaceId) {
        // get all member's id
        List<Long> memberIds = page.getRecords().stream().map(MemberPageVo::getMemberId).collect(Collectors.toList());
        // handle member's team name. get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = this.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (MemberPageVo memberPageVo : page.getRecords()) {
            if (memberToTeamPathInfoMap.containsKey(memberPageVo.getMemberId())) {
                memberPageVo.setTeamData(memberToTeamPathInfoMap.get(memberPageVo.getMemberId()));
            }
        }
    }

    @Override
    public void handleListMemberTeams(List<MemberInfoVo> memberInfoVos, String spaceId) {
        // get all member's id
        List<Long> memberIds = memberInfoVos.stream().map(MemberInfoVo::getMemberId).collect(Collectors.toList());
        // handle member's team name. get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = this.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (MemberInfoVo memberInfoVo : memberInfoVos) {
            if (memberToTeamPathInfoMap.containsKey(memberInfoVo.getMemberId())) {
                memberInfoVo.setTeamData(memberToTeamPathInfoMap.get(memberInfoVo.getMemberId()));
            }
        }
    }

    @Override
    public Map<Long, List<MemberTeamPathInfo>> batchGetFullHierarchyTeamNames(List<Long> memberIds, String spaceId) {
        if (CollUtil.isEmpty(memberIds)) {
            return new HashMap<>();
        }
        // batch get memberId and teamId
        List<MemberTeamInfoDTO> memberTeamInfoDTOS = memberMapper.selectTeamIdsByMemberIds(memberIds);
        // group by memberId
        Map<Long, List<Long>> memberTeamMap = memberTeamInfoDTOS.stream()
                .collect(Collectors.groupingBy(MemberTeamInfoDTO::getMemberId, Collectors.mapping(MemberTeamInfoDTO::getTeamId, Collectors.toList())));
        // get member's each full hierarchy team name
        Map<Long, List<String>> teamIdToPathMap = this.getMemberEachTeamPathName(memberTeamMap, spaceId);
        // build return object, each team's id and team's full hierarchy path name
        Map<Long, List<MemberTeamPathInfo>> memberToAllTeamPathNameMap = new HashMap<>();
        for (Entry<Long, List<Long>> entry : memberTeamMap.entrySet()) {
            List<MemberTeamPathInfo> memberTeamPathInfos = new ArrayList<>();
            for (Long teamId : entry.getValue()) {
                if (teamIdToPathMap.containsKey(teamId)) {
                    // build return team info and format team name
                    MemberTeamPathInfo memberTeamPathInfo = new MemberTeamPathInfo();
                    memberTeamPathInfo.setTeamId(teamId);
                    memberTeamPathInfo.setFullHierarchyTeamName(StrUtil.join("/", teamIdToPathMap.get(teamId)));
                    memberTeamPathInfos.add(memberTeamPathInfo);
                }
            }
            memberToAllTeamPathNameMap.put(entry.getKey(), memberTeamPathInfos);
        }
        return memberToAllTeamPathNameMap;
    }

    @Override
    public Map<Long, List<String>> getMemberEachTeamPathName(Map<Long, List<Long>> memberTeamMap, String spaceId) {
        // get all teamIds
        Set<Long> allTeamIds = new HashSet<>();
        for (Entry<Long, List<Long>> entry : memberTeamMap.entrySet()) {
            allTeamIds.addAll(entry.getValue());
        }
        // get member's team's all parent team, include itself
        List<TeamPathInfo> teamPathInfos = teamMapper.selectParentTreeByTeamIds(spaceId, new ArrayList<>(allTeamIds));
        List<TeamTreeVo> teamTreeVos = this.buildTree(spaceId, teamPathInfos.stream().map(TeamCteInfo::getId).collect(Collectors.toList()));
        // build team tree
        List<TeamTreeVo> treeVos = new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(teamTreeVos);
        Map<Long, List<String>> teamIdToPathMap = new HashMap<>();
        // TODO:optimize just recurse first level nodeId
        for (TeamTreeVo treeVo : treeVos) {
            // current team full hierarchy team name
            List<String> teamNames = new ArrayList<>();
            List<TeamVo> teamVos = new ArrayList<>();
            // build team info object, include teamId and teamName
            TeamVo teamVo = new TeamVo();
            teamVo.setTeamId(treeVo.getTeamId());
            teamVo.setTeamName(treeVo.getTeamName());
            teamVos.add(teamVo);
            teamNames.add(treeVo.getTeamName());
            if (allTeamIds.contains(treeVo.getTeamId())) {
                teamIdToPathMap.put(treeVo.getTeamId(), teamNames);
            }
            if (CollUtil.isNotEmpty(treeVo.getChildren())) {
                // recurse get this branch's all teamIds and teamNames
                this.recurseGetBranchAllTeamIdsAndTeamNames(treeVo.getChildren(), teamVos, allTeamIds, teamNames, teamIdToPathMap);
            }
        }
        return teamIdToPathMap;
    }

    /**
     * recurse get member's teamId and teamName
     *
     * @param treeVo team tree view
     * @param teamVos team's view
     * @param allTeamIds member's all teamIds
     * @param teamNames member's team path name
     * @param teamIdToPathMap memberId with member's team name map
     */
    private void recurseGetBranchAllTeamIdsAndTeamNames(List<TeamTreeVo> treeVo, List<TeamVo> teamVos, Set<Long> allTeamIds, List<String> teamNames, Map<Long, List<String>> teamIdToPathMap) {
        for (TeamTreeVo team : treeVo) {
            if (allTeamIds.contains(team.getTeamId())) {
                List<String> branchNames = new ArrayList<>(teamNames);
                branchNames.add(team.getTeamName());
                teamIdToPathMap.put(team.getTeamId(), branchNames);
                allTeamIds.remove(team.getTeamId());
            }
            TeamVo teamVo = new TeamVo();
            teamVo.setTeamId(team.getTeamId());
            teamVo.setTeamName(team.getTeamName());
            teamVos.add(teamVo);
            List<String> branchNames = new ArrayList<>(teamNames);
            branchNames.add(team.getTeamName());
            if (CollUtil.isNotEmpty(team.getChildren())) {
                recurseGetBranchAllTeamIdsAndTeamNames(team.getChildren(), teamVos, allTeamIds, branchNames, teamIdToPathMap);
            }
        }
    }

    /**
     * 递归处理
     *
     * @param resultList 列表
     * @param node       接口
     * @param memberIds  成员ID
     */
    private void recurse(List<TeamMemberDto> resultList, TeamMemberDto node, List<Long> memberIds) {
        List<TeamMemberDto> subChildren = getChildNode(resultList, node);
        if (CollUtil.isNotEmpty(subChildren)) {
            for (TeamMemberDto sub : subChildren) {
                recurse(resultList, sub, memberIds);
            }
        }
        memberIds.addAll(node.getMemberIds());
    }

    /**
     * 获取子节点
     *
     * @param resultList 总列表
     * @param node       节点
     * @return 子节点列表
     */
    private List<TeamMemberDto> getChildNode(List<TeamMemberDto> resultList, TeamMemberDto node) {
        List<TeamMemberDto> nodeList = new ArrayList<>();
        for (TeamMemberDto item : resultList) {
            if (item.getParentId().equals(node.getTeamId())) {
                nodeList.add(item);
            }
        }
        return nodeList;
    }
}
