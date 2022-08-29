package com.vikadata.api.modular.social.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkUserDTO;
import com.vikadata.api.modular.social.service.IDingTalkEventService;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDepartmentService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;
import com.vikadata.entity.SocialTenantDepartmentEntity;
import com.vikadata.entity.SocialTenantUserEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.constants.DingTalkConst;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse.DingTalkDeptDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 第三方平台租户通讯录服务接口 实现
 *
 * @author Shawn Deng
 * @date 2020-12-18 00:48:25
 */
@Service
@Slf4j
public class DingTalkEventServiceImpl implements IDingTalkEventService {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialTenantDepartmentService iSocialTenantDepartmentService;

    @Resource
    private ISocialTenantDepartmentBindService iSocialTenantDepartmentBindService;

    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private IDingTalkService dingTalkService;

    @Resource
    private ConstProperties constProperties;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleUserActiveOrg(String agentId, String tenantKey, String userOpenId) {
        // 员工点击企业后激活
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, agentApp.getCustomKey());
        // 没有绑定空间站返回成功
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        // 用户详细信息
        DingTalkUserDetail userDetail;
        try {
            userDetail = dingTalkService.getUserDetailByUserId(agentId, userOpenId);
        }
        catch (Exception e) {
            log.warn("钉钉用户信息有误:{}:{}", tenantKey, userOpenId, e);
            // 无法获取时，该用户在企业里没有配置访问权利
            return;
        }
        if (userDetail == null) {
            // 无法获取时，该用户在企业里没有配置访问权利
            return;
        }
        // 员工没有激活
        if (BooleanUtil.isFalse(userDetail.getActive())) {
            return;
        }
        // 只有同步通讯录时候才会创建租户用户记录，员工激活后应该是不存在空间站
        // 多应用企业，员工可能已经同步过了
        boolean isExist = iSocialTenantUserService.isTenantUserOpenIdExist(agentId, tenantKey, userOpenId);
        if (!isExist) {
            // 创建租户用户记录
            SocialTenantUserEntity tenantUser = SocialFactory.createTenantUser(agentId, tenantKey, userDetail.getUserid(),
                    userDetail.getUnionid());
            iSocialTenantUserService.save(tenantUser);
        }
        // 检测成员是否存在, 不存在进行创建，也可能是新用户，登录的时候创建了
        Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, userOpenId);
        if (memberId == null) {
            MemberEntity member = new MemberEntity();
            member.setId(IdWorker.getId());
            member.setSpaceId(spaceId);
            member.setMemberName(userDetail.getName());
            // 空间内的成员名称不同步用户名称
            member.setNameModified(true);
            member.setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue());
            member.setOpenId(userDetail.getUserid());
            member.setIsActive(false);
            member.setIsPoint(true);
            member.setMobile(userDetail.getMobile());
            member.setPosition(userDetail.getTitle());
            member.setEmail(userDetail.getEmail());
            member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
            member.setIsAdmin(false);
            iMemberService.batchCreate(spaceId, Collections.singletonList(member));
            // 部门
            handleDingTalkMemberDeptRel(spaceId, tenantKey, member.getId(), userDetail.getDeptIdList());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handUserLeaveOrg(String agentId, String tenantKey, String userOpenId) {
        // 获取当前部门所在的空间ID
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, agentApp.getCustomKey());
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, userOpenId);
        if (memberId == null) {
            return;
        }
        // 禁止使用钉钉授权登录
        iSocialTenantUserService.deleteByTenantIdAndOpenId(agentId, tenantKey, userOpenId);
        // 空间主管理员不允许删除
        Long mainAdminMemberId = iSpaceService.getSpaceMainAdminUserId(spaceId);
        if (mainAdminMemberId.equals(memberId)) {
            return;
        }
        // 移除成员所在空间
        iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(memberId), true);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleUserModifyOrg(String agentId, String tenantKey, String userOpenId) {
        // 编辑员工信息（修改资料、变更部门）
        // 获取当前部门所在的空间ID
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, agentApp.getCustomKey());
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        // 查询空间站的成员信息
        Long memberId = iMemberService.getMemberIdBySpaceIdAndOpenId(spaceId, userOpenId);
        if (memberId == null) {
            // 不存在，不理会
            return;
        }
        // 查询用户信息
        Map<Long, DingTalkContactDTO> contactMap = dingTalkService.getContactTreeMapByOpenIds(agentId,
                Collections.singletonList(userOpenId), null);
        List<DingTalkUserDTO> userList =
                contactMap.values().stream().filter(i -> i.getUserMap() != null).map(i -> i.getUserMap().get(userOpenId)).collect(Collectors.toList());
        if (userList.isEmpty()) {
            throw new BusinessException(SocialException.USER_NOT_EXIST);
        }
        // 更新成员信息
        MemberEntity member = SocialFactory.createDingTalkMember(userList.get(0));
        member.setId(memberId);
        iMemberService.updateById(member);
        boolean withTree = constProperties.getDingTalkContactWithTree();
        if (withTree) {
            // 更新部门关联关系
            handleDingTalkMemberDeptRel(spaceId, tenantKey, memberId, ListUtil.toList(contactMap.keySet()));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgDeptCreate(String agentId, String tenantKey, Long openDepartmentId) {
        // 获取当前部门所在的空间ID
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, agentApp.getCustomKey());
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        // 空间的根组织ID
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        // 获取钉钉企业部门详情
        DingTalkDeptDetail departmentDetail = dingTalkService.getDeptDetail(agentId, openDepartmentId);
        // 新增的部门无需在系统里查询，只需知道此部门在企业租户的父部门是什么
        Long parentDeptId = departmentDetail.getParentId();
        DingTalkAppVisibleScopeResponse visibleScope = dingTalkService.getAppVisibleScopes(agentId);
        List<Long> parentIds = dingTalkService.getDeptParentIdList(agentId, openDepartmentId);
        // 不在可见范围之内，无需同步
        if (!CollUtil.containsAny(visibleScope.getDeptVisibleScopes(), parentIds)) {
            return;
        }
        // 获取父部门ID绑定空间站的小组ID
        Long parentTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamIdBySpaceId(spaceId, tenantKey,
                parentDeptId.toString());
        if (parentTeamId == null) {
            // 上级部门未存在,证明是一级节点
            parentTeamId = rootTeamId;
        }
        // 创建空间站小组
        Long toCreateTeamId = iTeamService.createSubTeam(spaceId, departmentDetail.getName(), parentTeamId);
        // 新增tenant部门记录
        SocialTenantDepartmentEntity tenantDepartment = SocialFactory.createDingTalkDepartment(spaceId, tenantKey,
                dingTalkService.formatDingTalkDepartmentDto(departmentDetail));
        iSocialTenantDepartmentService.createBatch(Collections.singletonList(tenantDepartment));
        // 新增绑定
        SocialTenantDepartmentBindEntity tenantDepartmentBind = SocialFactory.createTenantDepartmentBind(spaceId,
                toCreateTeamId, tenantKey, departmentDetail.getDeptId().toString());
        iSocialTenantDepartmentBindService.createBatch(Collections.singletonList(tenantDepartmentBind));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgDeptModify(String agentId, String tenantKey, Long departmentId) {
        // 前提条件：名称修改 ｜ 部门层级调整（调整时会自动将下面的员工带过去,注意部门调整排序略显复杂）
        // 获取当前部门所在的空间ID
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, agentApp.getCustomKey());
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        // 绑定的部门ID
        Long teamId = iSocialTenantDepartmentBindService.getBindSpaceTeamIdBySpaceId(spaceId, tenantKey, departmentId.toString());
        if (teamId == null) {
            return;
        }
        // 获取企业部门详情
        DingTalkDeptDetail departmentDetail = dingTalkService.getDeptDetail(agentId, departmentId);
        SocialTenantDepartmentEntity tenantDepartment = iSocialTenantDepartmentService.getByTenantIdAndDepartmentId(spaceId, tenantKey, departmentId.toString());
        // 部门层级调整
        if (!tenantDepartment.getParentId().equals(departmentDetail.getParentId().toString())) {
            Long dingTalkRootDeptId = DingTalkConst.ROOT_DEPARTMENT_ID;
            // 修改了父级部门
            Long newParentDeptId = departmentDetail.getParentId();
            Long parentTeamId;
            Integer sequence = null;
            if (!tenantDepartment.getParentId().equals(dingTalkRootDeptId.toString()) && newParentDeptId.equals(dingTalkRootDeptId)) {
                // 子部门 -> 一级部门
                parentTeamId = iTeamService.getRootTeamId(spaceId);
            }
            else {
                // 子部门 -> 其他子部门
                parentTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamIdBySpaceId(spaceId, tenantKey, newParentDeptId.toString());
            }
            // 父部门没有同步
            if (ObjectUtil.isEmpty(parentTeamId)) {
                Long rootTeamId = iTeamService.getRootTeamId(spaceId);
                parentTeamId = handleDingTalkDeptParentCreate(spaceId, tenantKey, agentId, departmentId, rootTeamId);
                sequence = 1;
            }
            TeamEntity team = new TeamEntity();
            team.setId(teamId);
            team.setTeamName(departmentDetail.getName());
            team.setParentId(parentTeamId);
            team.setSequence(sequence != null ? sequence : iTeamService.getMaxSequenceByParentId(parentTeamId));
            iTeamService.updateById(team);
        }
        else {
            TeamEntity team = new TeamEntity();
            team.setId(teamId);
            team.setTeamName(departmentDetail.getName());
            iTeamService.updateById(team);
        }
        // 覆盖钉钉部门的值
        SocialTenantDepartmentEntity updateTenantDepartment = new SocialTenantDepartmentEntity();
        updateTenantDepartment.setId(tenantDepartment.getId());
        updateTenantDepartment.setDepartmentName(departmentDetail.getName());
        updateTenantDepartment.setParentId(departmentDetail.getParentId().toString());
        updateTenantDepartment.setParentOpenDepartmentId(departmentDetail.getParentId().toString());
        iSocialTenantDepartmentService.updateById(updateTenantDepartment);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void handleOrgDeptRemove(String agentId, String tenantKey, Long departmentId) {
        // 获取当前部门所在的空间ID
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantKey, agentApp.getCustomKey());
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        // 不用理会部门下面的成员，部门的删除前提条件是必须删除部门下面的成员才能删除
        // 被删除的部门下面必须不存在子部门，所以也不用理会子部门的变更
        // 删除租户部门记录
        iSocialTenantDepartmentService.deleteSpaceTenantDepartment(spaceId, tenantKey, departmentId.toString());
    }

    private void handleDingTalkMemberDeptRel(String spaceId, String tenantKey, Long memberId, List<Long> userDepartmentIds) {
        // 员工旧的企业部门
        List<Long> beforeTeamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
        // 员工新的企业部门
        List<String> userDepartmentIdsByStr = userDepartmentIds.stream().map(Convert::toStr).collect(Collectors.toList());
        List<Long> afterTeamIds = iSocialTenantDepartmentBindService.getBindSpaceTeamIdsByTenantId(spaceId, tenantKey, userDepartmentIdsByStr);
        if (userDepartmentIds.contains(DingTalkConst.ROOT_DEPARTMENT_ID) || afterTeamIds.isEmpty()) {
            // 由于第三方同步没有同步根部门，如果人员归属根部门手动添加一条记录
            // 人员归属部门变更到不在可见区域时，也手动插入一条根部门记录
            afterTeamIds.add(iTeamService.getRootTeamId(spaceId));
        }
        // 先处理需要删除关联关系的部门
        List<Long> removeTeamIds = CollUtil.subtractToList(beforeTeamIds, afterTeamIds);
        if (CollUtil.isNotEmpty(removeTeamIds)) {
            // 删除部门关联关系
            teamMemberRelMapper.deleteByTeamIdsAndMemberId(memberId, CollUtil.distinct(removeTeamIds));
        }
        // 在处理需要添加关联关系的部门
        List<Long> addTeamIds = CollUtil.subtractToList(afterTeamIds, beforeTeamIds);
        if (CollUtil.isNotEmpty(addTeamIds)) {
            // 添加部门关联关系
            iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId), CollUtil.distinct(addTeamIds));
        }
    }

    private Long handleDingTalkDeptParentCreate(String spaceId, String tenantKey, String agentId, Long deptId, Long
            rootTeamId) {
        Long teamId = rootTeamId;
        List<Long> parentIds = dingTalkService.getDeptParentIdList(agentId, deptId);
        // 移除自己
        parentIds.remove(deptId);
        parentIds.remove(DingTalkConst.ROOT_DEPARTMENT_ID);
        Map<Long, Long> openDeptIdTeamIdMap = CollUtil.newHashMap();
        openDeptIdTeamIdMap.put(DingTalkConst.ROOT_DEPARTMENT_ID, rootTeamId);
        List<SocialTenantDepartmentEntity> createTenantDept = CollUtil.newArrayList();
        List<SocialTenantDepartmentBindEntity> createTenantDeptBind = CollUtil.newArrayList();
        // 倒序 新建父部门
        for (int i = parentIds.size() - 1; i >= 0; i--) {
            Long parentDeptId = parentIds.get(i);
            DingTalkDeptDetail parentDeptDetail = dingTalkService.getDeptDetail(agentId, parentDeptId);
            Long parentTeamId = iSocialTenantDepartmentBindService.getBindSpaceTeamIdBySpaceId(spaceId, tenantKey, parentDeptId.toString());
            // 需要新建
            if (ObjectUtil.isEmpty(parentTeamId)) {
                Long toCreateTeamId = iTeamService.createSubTeam(spaceId, parentDeptDetail.getName(), openDeptIdTeamIdMap.get(parentDeptDetail.getParentId()));
                openDeptIdTeamIdMap.put(parentDeptDetail.getDeptId(), toCreateTeamId);
                // 新增tenant部门记录
                createTenantDept.add(SocialFactory.createDingTalkDepartment(spaceId, tenantKey, dingTalkService.formatDingTalkDepartmentDto(parentDeptDetail)));
                // 新增绑定
                createTenantDeptBind.add(SocialFactory.createTenantDepartmentBind(spaceId, toCreateTeamId, tenantKey,
                        parentDeptDetail.getDeptId().toString()));
                parentTeamId = toCreateTeamId;
            }
            else {
                openDeptIdTeamIdMap.put(parentDeptId, parentTeamId);
            }
            teamId = parentTeamId;
        }
        if (!createTenantDept.isEmpty()) {
            iSocialTenantDepartmentService.createBatch(createTenantDept);
        }
        if (!createTenantDeptBind.isEmpty()) {
            iSocialTenantDepartmentBindService.createBatch(createTenantDeptBind);
        }
        return teamId;
    }
}
