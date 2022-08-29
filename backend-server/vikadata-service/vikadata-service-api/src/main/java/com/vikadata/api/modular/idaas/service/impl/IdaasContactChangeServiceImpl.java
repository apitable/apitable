package com.vikadata.api.modular.idaas.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.google.common.collect.Lists;

import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.modular.idaas.model.IdaasContactChange;
import com.vikadata.api.modular.idaas.service.IIdaasContactChangeService;
import com.vikadata.api.modular.idaas.service.IIdaasGroupBindService;
import com.vikadata.api.modular.idaas.service.IIdaasUserBindService;
import com.vikadata.api.modular.organization.factory.OrganizationFactory;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.entity.IdaasGroupBindEntity;
import com.vikadata.entity.IdaasUserBindEntity;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.entity.UserEntity;
import com.vikadata.integration.idaas.model.GroupsResponse.GroupResponse;
import com.vikadata.integration.idaas.model.UsersResponse.UserResponse;
import com.vikadata.integration.idaas.model.UsersResponse.UserResponse.Values;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 玉符 IDaaS 通讯录变更统一处理
 * </p>
 * @author 刘斌华
 * @date 2022-06-04 09:26:42
 */
@Service
public class IdaasContactChangeServiceImpl implements IIdaasContactChangeService {

    @Resource
    private IIdaasGroupBindService idaasGroupBindService;

    @Resource
    private IIdaasUserBindService idaasUserBindService;

    @Resource
    private IMemberService memberService;

    @Resource
    private ITeamService teamService;

    @Resource
    private ITeamMemberRelService teamMemberRelService;

    @Resource
    private IUserService userService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveContactChange(String tenantName, String spaceId, IdaasContactChange contactChange) {
        // 1 处理新增的用户组
        List<GroupResponse> addGroupResponses = contactChange.getAddGroups();
        if (CollUtil.isNotEmpty(addGroupResponses)) {
            // 分批处理，防止大批量数据操作
            CollUtil.split(addGroupResponses, 500).forEach(addGroups -> {
                List<TeamEntity> teamEntities = Lists.newArrayListWithCapacity(addGroups.size());
                List<IdaasGroupBindEntity> groupBindEntities = Lists.newArrayListWithCapacity(addGroups.size());
                addGroups.forEach(addGroup -> {
                    Long teamId = IdWorker.getId();
                    Long rootTeamId = teamService.getRootTeamId(spaceId);
                    TeamEntity teamEntity = OrganizationFactory.createTeam(spaceId, teamId, rootTeamId, addGroup.getName(), addGroup.getOrder());
                    // 用户组没有多层结构，都位于一级根目录下
                    teamEntity.setTeamLevel(2);
                    teamEntities.add(teamEntity);

                    IdaasGroupBindEntity groupBindEntity = IdaasGroupBindEntity.builder()
                            .tenantName(tenantName)
                            .groupId(addGroup.getId())
                            .groupName(addGroup.getName())
                            .groupOrder(addGroup.getOrder())
                            .spaceId(spaceId)
                            .teamId(teamEntity.getId())
                            .build();
                    groupBindEntities.add(groupBindEntity);
                });

                teamService.saveBatch(teamEntities);
                idaasGroupBindService.saveBatch(groupBindEntities);
            });
        }
        // 2 处理更新的用户组
        List<IdaasGroupBindEntity> updateGroupBinds = contactChange.getUpdateGroups();
        if (CollUtil.isNotEmpty(updateGroupBinds)) {
            // 分批处理，防止大批量数据操作
            CollUtil.split(updateGroupBinds, 500).forEach(groupBinds -> {
                List<TeamEntity> teamEntities = Lists.newArrayListWithCapacity(groupBinds.size());
                List<IdaasGroupBindEntity> groupBindEntities = Lists.newArrayListWithCapacity(groupBinds.size());
                groupBinds.forEach(groupBind -> {
                    teamEntities.add(TeamEntity.builder()
                            .id(groupBind.getTeamId())
                            .teamName(groupBind.getGroupName())
                            .sequence(groupBind.getGroupOrder())
                            .isDeleted(false)
                            .build());
                    groupBindEntities.add(IdaasGroupBindEntity.builder()
                            .id(groupBind.getId())
                            .groupName(groupBind.getGroupName())
                            .groupOrder(groupBind.getGroupOrder())
                            .isDeleted(false)
                            .build());
                });

                teamService.updateBatchById(teamEntities);
                idaasGroupBindService.updateBatchById(groupBindEntities);
            });
        }
        // 3 处理删除的用户组
        // 逻辑删除空间站组织结构和用户组绑定信息
        List<IdaasGroupBindEntity> deleteGroupBinds = contactChange.getDeleteGroups();
        if (CollUtil.isNotEmpty(deleteGroupBinds)) {
            // 分批处理，防止大批量数据操作
            CollUtil.split(deleteGroupBinds, 500).forEach(groupBinds -> {
                List<Long> deleteTeamIds = groupBinds.stream()
                        .map(IdaasGroupBindEntity::getTeamId)
                        .collect(Collectors.toList());
                List<Long> deleteGroupBindIds = groupBinds.stream()
                        .map(IdaasGroupBindEntity::getId)
                        .collect(Collectors.toList());

                teamService.removeBatchByIds(deleteTeamIds);
                idaasGroupBindService.removeBatchByIds(deleteGroupBindIds);
            });
        }
        // 4 获取团队信息
        List<IdaasGroupBindEntity> effectiveGroupBinds = idaasGroupBindService.getAllBySpaceId(spaceId);
        Map<String, Long> groupBindTeamMap = effectiveGroupBinds.stream()
                .collect(Collectors.toMap(IdaasGroupBindEntity::getGroupId, IdaasGroupBindEntity::getTeamId, (k1, k2) -> k2));
        Long rootTeamId = teamService.getRootTeamId(spaceId);
        // 5 处理新增的用户
        List<UserResponse> addUserResponses = contactChange.getAddUsers();
        if (CollUtil.isNotEmpty(addUserResponses)) {
            // 分批处理，防止大批量数据操作
            CollUtil.split(addUserResponses, 500).forEach(addUsers -> {
                List<UserEntity> userEntities = Lists.newArrayListWithCapacity(addUsers.size());
                List<MemberEntity> memberEntities = Lists.newArrayListWithCapacity(addUsers.size());
                List<TeamMemberRelEntity> teamMemberRelEntities = Lists.newArrayListWithCapacity(addUsers.size());
                List<IdaasUserBindEntity> userBindEntities = Lists.newArrayListWithCapacity(addUsers.size());
                addUsers.forEach(addUser -> {
                    Values addUserValues = addUser.getValues();
                    Long userId = IdWorker.getId();
                    Long memberId = IdWorker.getId();
                    userEntities.add(UserEntity.builder()
                            .id(userId)
                            .uuid(IdUtil.fastSimpleUUID())
                            .nickName(addUserValues.getDisplayName())
                            .mobilePhone(addUserValues.getPhoneNum())
                            .email(addUserValues.getPrimaryMail())
                            .isSocialNameModified(SocialNameModified.NO_SOCIAL.getValue())
                            .build());
                    memberEntities.add(MemberEntity.builder()
                            .id(memberId)
                            .spaceId(spaceId)
                            .userId(userId)
                            .memberName(addUserValues.getDisplayName())
                            .mobile(addUserValues.getPhoneNum())
                            .email(addUserValues.getPrimaryMail())
                            .status(UserSpaceStatus.INACTIVE.getStatus())
                            .nameModified(false)
                            .isSocialNameModified(SocialNameModified.NO_SOCIAL.getValue())
                            .isPoint(true)
                            .position(null)
                            .isActive(false)
                            .isAdmin(false)
                            .build());
                    List<TeamMemberRelEntity> teamMemberRels = null;
                    if (CollUtil.isNotEmpty(addUserValues.getGroups())) {
                        teamMemberRels = addUserValues.getGroups().stream()
                                .filter(group -> Objects.nonNull(groupBindTeamMap.get(group)))
                                .map(group -> TeamMemberRelEntity.builder()
                                        .memberId(memberId)
                                        .teamId(groupBindTeamMap.get(group))
                                        .build())
                                .collect(Collectors.toList());
                    }
                    if (CollUtil.isNotEmpty(teamMemberRels)) {
                        teamMemberRelEntities.addAll(teamMemberRels);
                    } else {
                        // 没有分配有效的用户组则放在根目录下
                        teamMemberRelEntities.add(TeamMemberRelEntity.builder()
                                .memberId(memberId)
                                .teamId(rootTeamId)
                                .build());
                    }
                    userBindEntities.add(IdaasUserBindEntity.builder()
                            .tenantName(tenantName)
                            .userId(addUser.getId())
                            .nickName(addUserValues.getDisplayName())
                            .email(addUserValues.getPrimaryMail())
                            .mobile(addUserValues.getPhoneNum())
                            .groupIds(CollUtil.isEmpty(addUserValues.getGroups()) ? null : JSONUtil.toJsonStr(addUserValues.getGroups()))
                            .vikaUserId(userId)
                            .createdAt(LocalDateTime.now(ZoneOffset.ofHours(8)))
                            .updatedAt(LocalDateTime.now(ZoneOffset.ofHours(8)))
                            .build());
                });

                userService.saveBatch(userEntities);
                memberService.batchCreate(spaceId, memberEntities);
                teamMemberRelService.saveBatch(teamMemberRelEntities);
                idaasUserBindService.saveBatch(userBindEntities);
            });
        }
        // 6 处理新增的成员
        List<IdaasUserBindEntity> addMemberBinds = contactChange.getAddMembers();
        if (CollUtil.isNotEmpty(addMemberBinds)) {
            // 分批处理，防止大批量数据操作
            CollUtil.split(addMemberBinds, 500).forEach(addMembers -> {
                List<MemberEntity> memberEntities = Lists.newArrayListWithCapacity(addMembers.size());
                List<TeamMemberRelEntity> teamMemberRelEntities = Lists.newArrayListWithCapacity(addMembers.size());
                addMembers.forEach(addMember -> {
                    Long memberId = IdWorker.getId();
                    memberEntities.add(MemberEntity.builder()
                            .id(memberId)
                            .spaceId(spaceId)
                            .userId(addMember.getVikaUserId())
                            .memberName(addMember.getNickName())
                            .mobile(addMember.getMobile())
                            .email(addMember.getEmail())
                            .status(UserSpaceStatus.INACTIVE.getStatus())
                            .nameModified(false)
                            .isSocialNameModified(SocialNameModified.NO_SOCIAL.getValue())
                            .isPoint(true)
                            .position(null)
                            .isActive(false)
                            .isAdmin(false)
                            .build());
                    List<TeamMemberRelEntity> teamMemberRels = JSONUtil.toList(addMember.getGroupIds(), String.class).stream()
                            .filter(group -> Objects.nonNull(groupBindTeamMap.get(group)))
                            .map(group -> TeamMemberRelEntity.builder()
                                    .memberId(memberId)
                                    .teamId(groupBindTeamMap.get(group))
                                    .build())
                            .collect(Collectors.toList());
                    if (CollUtil.isNotEmpty(teamMemberRels)) {
                        teamMemberRelEntities.addAll(teamMemberRels);
                    } else {
                        // 没有分配有效的用户组则放在根目录下
                        teamMemberRelEntities.add(TeamMemberRelEntity.builder()
                                .memberId(memberId)
                                .teamId(rootTeamId)
                                .build());
                    }
                });

                memberService.batchCreate(spaceId, memberEntities);
                teamMemberRelService.saveBatch(teamMemberRelEntities);
            });
        }
        // 7 处理更新的用户
        List<IdaasUserBindEntity> updateUserBinds = contactChange.getUpdateUsers();
        if (CollUtil.isNotEmpty(updateUserBinds)) {
            // 分批处理，防止大批量数据操作
            CollUtil.split(updateUserBinds, 500).forEach(userBinds -> {
                List<UserEntity> userEntities = Lists.newArrayListWithCapacity(userBinds.size());
                List<MemberEntity> memberEntities = Lists.newArrayListWithCapacity(userBinds.size());
                List<TeamMemberRelEntity> teamMemberRelEntities = Lists.newArrayListWithCapacity(userBinds.size());
                List<IdaasUserBindEntity> userBindEntities = Lists.newArrayListWithCapacity(userBinds.size());
                // 7.1 获取空间站已绑定的成员信息
                List<Long> vikaUserIds = userBinds.stream()
                        .map(IdaasUserBindEntity::getVikaUserId)
                        .collect(Collectors.toList());
                List<MemberEntity> members = memberService.getByUserIdsAndSpaceId(vikaUserIds, spaceId);
                Map<Long, Long> userMemberIdMap = members.stream()
                        .collect(Collectors.toMap(MemberEntity::getUserId, MemberEntity::getId, (k1, k2) -> k2));
                userBinds.forEach(userBind -> {
                    Long memberId = userMemberIdMap.get(userBind.getVikaUserId());
                    userEntities.add(UserEntity.builder()
                            .id(userBind.getVikaUserId())
                            .nickName(userBind.getNickName())
                            .email(userBind.getEmail())
                            .mobilePhone(userBind.getMobile())
                            .isDeleted(false)
                            .build());
                    memberEntities.add(MemberEntity.builder()
                            .id(memberId)
                            .memberName(userBind.getNickName())
                            .email(userBind.getEmail())
                            .mobile(userBind.getMobile())
                            .isDeleted(false)
                            .build());
                    List<TeamMemberRelEntity> teamMemberRels = JSONUtil.toList(userBind.getGroupIds(), String.class).stream()
                            .filter(group -> Objects.nonNull(groupBindTeamMap.get(group)))
                            .map(group -> TeamMemberRelEntity.builder()
                                    .memberId(memberId)
                                    .teamId(groupBindTeamMap.get(group))
                                    .build())
                            .collect(Collectors.toList());
                    if (CollUtil.isNotEmpty(teamMemberRels)) {
                        teamMemberRelEntities.addAll(teamMemberRels);
                    } else {
                        // 没有分配有效的用户组则放在根目录下
                        teamMemberRelEntities.add(TeamMemberRelEntity.builder()
                                .memberId(memberId)
                                .teamId(rootTeamId)
                                .build());
                    }
                    userBindEntities.add(IdaasUserBindEntity.builder()
                            .id(userBind.getId())
                            .nickName(userBind.getNickName())
                            .email(userBind.getEmail())
                            .mobile(userBind.getMobile())
                            .groupIds(userBind.getGroupIds())
                            .isDeleted(false)
                            .build());
                });

                userService.updateBatchById(userEntities);
                memberService.updateBatchById(memberEntities);
                // 将已有的成员小组信息全部删除，再重新添加
                teamMemberRelService.removeByMemberIds(new ArrayList<>(userMemberIdMap.values()));
                teamMemberRelService.saveBatch(teamMemberRelEntities);
                idaasUserBindService.updateBatchById(userBindEntities);
            });
        }
        // 8 处理删除的用户
        // 逻辑删除成员
        List<Long> deleteMemberIds = contactChange.getDeleteMemberIds();
        if (CollUtil.isNotEmpty(deleteMemberIds)) {
            // 分批处理，防止大批量数据操作
            CollUtil.split(deleteMemberIds, 500).forEach(memberIds -> {
                memberService.removeBatchByIds(memberIds);
            });
        }
    }

}
