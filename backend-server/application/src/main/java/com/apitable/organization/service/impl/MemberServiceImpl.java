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

import static com.apitable.shared.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.apitable.shared.constants.NotificationConstants.TEAM_ID;
import static com.apitable.shared.constants.NotificationConstants.TEAM_NAME;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.lang.Filter;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.alibaba.excel.EasyExcel;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.social.enums.SocialNameModified;
import com.apitable.interfaces.user.facade.InvitationServiceFacade;
import com.apitable.interfaces.user.model.MultiInvitationMetadata;
import com.apitable.organization.dto.MemberDTO;
import com.apitable.organization.dto.TenantMemberDto;
import com.apitable.organization.dto.UploadDataDTO;
import com.apitable.organization.entity.AuditUploadParseRecordEntity;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.OrganizationException;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.enums.UserSpaceStatus;
import com.apitable.organization.excel.handler.UploadDataListener;
import com.apitable.organization.mapper.AuditUploadParseRecordMapper;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.ro.OrgUnitRo;
import com.apitable.organization.ro.TeamAddMemberRo;
import com.apitable.organization.ro.UpdateMemberOpRo;
import com.apitable.organization.ro.UpdateMemberRo;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.MemberBriefInfoVo;
import com.apitable.organization.vo.MemberInfoVo;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.UploadParseResultVO;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.UserActiveSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationManager;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.NotifyMailFactory;
import com.apitable.shared.component.notification.NotifyMailFactory.MailWithLang;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.constants.MailPropConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.util.CollectionUtil;
import com.apitable.shared.util.ibatis.ExpandServiceImpl;
import com.apitable.space.entity.SpaceInviteRecordEntity;
import com.apitable.space.enums.InviteType;
import com.apitable.space.enums.SpaceException;
import com.apitable.space.mapper.SpaceApplyMapper;
import com.apitable.space.mapper.SpaceInviteLinkMapper;
import com.apitable.space.mapper.SpaceInviteRecordMapper;
import com.apitable.space.mapper.StaticsMapper;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.enums.PermissionException;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Member Service Implements.
 */
@Service
@Slf4j
public class MemberServiceImpl extends ExpandServiceImpl<MemberMapper, MemberEntity>
    implements IMemberService {

  @Resource
  private ITeamMemberRelService iTeamMemberRelService;

  @Resource
  private TeamMemberRelMapper teamMemberRelMapper;

  @Resource
  private IUserService iUserService;

  @Resource
  private ConstProperties constProperties;

  @Resource
  private SpaceInviteRecordMapper spaceInviteRecordMapper;

  @Resource
  private ITeamService iTeamService;

  @Resource
  private UserActiveSpaceCacheService userActiveSpaceCacheService;

  @Resource
  private UserSpaceCacheService userSpaceCacheService;

  @Resource
  private IUnitService iUnitService;

  @Resource
  private TeamMapper teamMapper;

  @Resource
  private ISpaceService iSpaceService;

  @Resource
  private AuditUploadParseRecordMapper auditUploadParseRecordMapper;

  @Resource
  private SpaceInviteLinkMapper spaceInviteLinkMapper;

  @Resource
  private ISpaceRoleService iSpaceRoleService;

  @Resource
  private SpaceApplyMapper spaceApplyMapper;

  @Resource
  private StaticsMapper staticsMapper;

  @Resource
  private MemberMapper memberMapper;

  @Resource
  private InvitationServiceFacade invitationServiceFacade;

  @Override
  public String getMemberNameById(Long memberId) {
    return baseMapper.selectMemberNameById(memberId);
  }

  @Resource
  private IRoleMemberService iRoleMemberService;


  @Override
  public Long getMemberIdByUserIdAndSpaceId(Long userId, String spaceId) {
    return baseMapper.selectIdByUserIdAndSpaceId(userId, spaceId);
  }

  @Override
  public MemberEntity getByUserIdAndSpaceId(Long userId, String spaceId) {
    return baseMapper.selectByUserIdAndSpaceId(userId, spaceId);
  }

  @Override
  public List<MemberEntity> getByUserIdsAndSpaceId(List<Long> userIds, String spaceId) {
    return baseMapper.selectByUserIdsAndSpaceId(userIds, spaceId);
  }

  @Override
  public void checkUserIfInSpace(Long userId, String spaceId) {
    Long memberId = getMemberIdByUserIdAndSpaceId(userId, spaceId);
    ExceptionUtil.isNotNull(memberId, SpaceException.NO_ALLOW_OPERATE);
  }

  @Override
  public void setMemberMainAdmin(Long memberId) {
    MemberEntity member = MemberEntity.builder().id(memberId).isAdmin(true).build();
    boolean flag = updateById(member);
    ExceptionUtil.isTrue(flag, PermissionException.SET_MAIN_ADMIN_FAIL);
  }

  @Override
  public void cancelMemberMainAdmin(Long memberId) {
    MemberEntity member = MemberEntity.builder().id(memberId).isAdmin(false).build();
    boolean flag = updateById(member);
    ExceptionUtil.isTrue(flag, PermissionException.SET_MAIN_ADMIN_FAIL);
  }

  @Override
  public String getSpaceIdByMemberId(Long memberId) {
    return baseMapper.selectSpaceIdByMemberId(memberId);
  }

  @Override
  public List<Long> getUnitsByMember(Long memberId) {
    log.info("Gets all unit ids for the member");
    List<Long> unitRefIds = CollUtil.newArrayList(memberId);
    List<Long> teamIds = teamMemberRelMapper.selectAllTeamIdByMemberId(memberId);
    unitRefIds.addAll(teamIds);
    List<Long> roleIds = iRoleMemberService.getRoleIdsByRoleMemberId(memberId);
    unitRefIds.addAll(roleIds);
    return iUnitService.getUnitIdsByRefIds(unitRefIds);
  }

  @Override
  public List<MemberEntity> getSocialMemberBySpaceId(String spaceId, long offset, int limit) {
    return baseMapper.selectBindSocialListBySpaceIdWithOffset(spaceId, offset, limit);
  }

  @Override
  public List<Long> getMemberIdsBySpaceId(String spaceId) {
    return baseMapper.selectMemberIdsBySpaceId(spaceId);
  }

  @Override
  public List<MemberEntity> getMembersBySpaceId(String spaceId, boolean ignoreDeleted) {
    return baseMapper.selectBySpaceId(spaceId, ignoreDeleted);
  }

  @Override
  public Long getMemberIdBySpaceIdAndOpenId(String spaceId, String openId) {
    return baseMapper.selectMemberIdBySpaceIdAndOpenId(spaceId, openId);
  }

  @Override
  public MemberEntity getBySpaceIdAndOpenId(String spaceId, String openId) {
    return baseMapper.selectBySpaceIdAndOpenId(spaceId, openId);
  }

  @Override
  public List<MemberEntity> getBySpaceIdAndOpenIds(String spaceId, List<String> openIds) {
    return baseMapper.selectBySpaceIdAndOpenIds(spaceId, openIds);
  }

  @Override
  public MemberEntity getBySpaceIdAndEmail(String spaceId, String email) {
    return baseMapper.selectBySpaceIdAndEmail(spaceId, email);
  }

  @Override
  public List<MemberEntity> getBySpaceIdAndEmailsIgnoreDeleted(String spaceId,
                                                               List<String> emails) {
    return baseMapper.selectBySpaceIdAndEmailsIgnoreDeleted(spaceId, emails);
  }

  @Override
  public MemberEntity getAdminBySpaceId(String spaceId) {
    return baseMapper.selectAdminBySpaceId(spaceId);
  }

  @Override
  public List<MemberEntity> getAdminListBySpaceId(String spaceId) {
    return baseMapper.selectAdminListBySpaceId(spaceId);
  }

  @Override
  public String getOpenIdByMemberId(Long memberId) {
    return baseMapper.selectOpenIdById(memberId);
  }

  @Override
  public Long getMemberIdByOpenIdIgnoreDelete(String spaceId, String openId) {
    return baseMapper.selectByOpenIdIgnoreDelete(spaceId, openId);
  }

  @Override
  public MemberEntity getByIdIgnoreDelete(Long memberId) {
    return baseMapper.selectByIdIgnoreDelete(memberId);
  }

  @Override
  public List<MemberEntity> getByUserId(Long userId) {
    return baseMapper.selectByUserId(userId);
  }

  @Override
  public List<String> getSpaceIdByUserId(Long userId) {
    List<MemberEntity> memberEntities = getByUserId(userId);
    return memberEntities.stream()
        .map(MemberEntity::getSpaceId)
        .collect(Collectors.toList());
  }

  @Override
  public List<String> getSpaceIdWithoutNameModifiedByUserId(Long userId) {
    List<MemberEntity> memberEntities = getByUserId(userId);
    return memberEntities.stream()
        .filter(member -> !member.getNameModified())
        .map(MemberEntity::getSpaceId)
        .collect(Collectors.toList());
  }

  @Override
  public List<MemberDTO> getInactiveMemberByEmails(String email) {
    return baseMapper.selectInactiveMemberByEmail(email);
  }

  @Override
  public void updateMemberNameByUserId(Long userId, String memberName) {
    baseMapper.updateMemberNameByUserId(userId, memberName);
  }

  @Override
  public void updateMobileByUserId(Long userId, String mobile) {
    baseMapper.updateMobileByUserId(userId, mobile);
  }

  @Override
  public void resetMobileByUserId(Long userId) {
    baseMapper.resetMobileByUserId(userId);
  }

  @Override
  public void updateEmailByUserId(Long userId, String email) {
    baseMapper.updateEmailByUserId(userId, email);
  }

  @Override
  public void resetEmailByUserId(Long userId) {
    baseMapper.resetEmailByUserId(userId);
  }

  @Override
  public List<MemberBriefInfoVo> getMemberBriefInfo(List<Long> memberIds) {
    if (CollUtil.isEmpty(memberIds)) {
      return Collections.emptyList();
    }

    List<UnitEntity> unitEntities = iUnitService.getByRefIds(memberIds);
    Map<Long, Long> memberUnitIdMap = unitEntities.stream()
        .filter(unit -> UnitType.MEMBER.getType().equals(unit.getUnitType()))
        .collect(Collectors.toMap(UnitEntity::getUnitRefId, UnitEntity::getId, (k1, k2) -> k2));

    List<MemberEntity> memberEntities = listByIds(memberIds);
    // integrate member's and unit's information
    return memberEntities.stream()
        .map(member -> {
          MemberBriefInfoVo item = new MemberBriefInfoVo();
          item.setMemberId(member.getId());
          item.setMemberName(member.getMemberName());
          Integer memberNameModified = member.getIsSocialNameModified();
          item.setIsMemberNameModified(
              Objects.isNull(memberNameModified) || memberNameModified != 0);

          Optional.ofNullable(memberUnitIdMap.get(member.getId()))
              .ifPresent(item::setUnitId);

          return item;
        }).collect(Collectors.toList());
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void batchCreate(String spaceId, List<MemberEntity> entities) {
    log.info("Batch create members.");
    if (CollUtil.isEmpty(entities)) {
      return;
    }
    saveBatch(entities);
    // create units
    List<UnitEntity> unitEntities = new ArrayList<>();
    for (MemberEntity member : entities) {
      UnitEntity unit = new UnitEntity();
      unit.setId(IdWorker.getId());
      unit.setSpaceId(spaceId);
      unit.setUnitType(UnitType.MEMBER.getType());
      unit.setUnitRefId(member.getId());
      unitEntities.add(unit);
    }
    boolean addBatchUnit = iUnitService.createBatch(unitEntities);
    ExceptionUtil.isTrue(addBatchUnit, DatabaseException.INSERT_ERROR);
  }

  @Override
  public void restoreMember(MemberEntity member) {
    baseMapper.restoreMember(member);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public List<Long> emailInvitation(Long inviteUserId, String spaceId, List<String> emails) {
    // remove empty string or null element in collection, then make it distinct
    final List<String> distinctEmails =
        CollectionUtil.distinctIgnoreCase(CollUtil.removeBlank(emails));
    if (distinctEmails.isEmpty()) {
      return new ArrayList<>();
    }
    // find email in users
    List<UserEntity> userEntities = iUserService.getByEmails(distinctEmails);
    Map<String, Long> emailUserMap = userEntities.stream()
        .collect(Collectors.toMap(UserEntity::getEmail, UserEntity::getId));
    // find email in spaces
    List<MemberEntity> memberEntities =
        getBySpaceIdAndEmailsIgnoreDeleted(spaceId, distinctEmails);
    Map<String, List<MemberEntity>> emailMemberMap = memberEntities.stream()
        .filter(m -> StrUtil.isNotBlank(m.getEmail()))
        .collect(Collectors.groupingBy(MemberEntity::getEmail));
    // collect emails whether it can send invitation
    List<Long> shouldSendInvitationNotify = new ArrayList<>();
    List<MemberEntity> members = new ArrayList<>();
    List<MemberEntity> restoreMembers = new ArrayList<>();
    distinctEmails.forEach(inviteEmail -> {
      MemberEntity member = new MemberEntity();
      // check member if existed
      if (emailMemberMap.containsKey(inviteEmail)) {
        // email member exist in space
        MemberEntity existedMember = emailMemberMap.get(inviteEmail).stream().findFirst()
            .orElseThrow(() -> new BusinessException("invite member error"));
        // history member can be restored
        if (existedMember.getIsDeleted()) {
            existedMember.setUserId(emailUserMap.get(inviteEmail));
            existedMember.setIsActive(emailUserMap.containsKey(inviteEmail));
            existedMember.setIsPoint(true);
            restoreMembers.add(existedMember);
        }
        shouldSendInvitationNotify.add(existedMember.getId());
        return;
      }
      // email is not exist in space
      member.setId(IdWorker.getId());
      createInactiveMember(member, spaceId, inviteEmail);
      members.add(member);

      // check email user if existed
      if (emailUserMap.containsKey(inviteEmail)) {
        member.setUserId(emailUserMap.get(inviteEmail));
        member.setIsActive(true);
      }
    });
    // save or update members
    batchCreate(spaceId, members);
    // add team relation
    Long rootTeamId = iTeamService.getRootTeamId(spaceId);
    List<Long> memberIds =
        members.stream().map(MemberEntity::getId).collect(Collectors.toList());
    iTeamMemberRelService.addMemberTeams(memberIds, Collections.singletonList(rootTeamId));

    // restore member
    if (!restoreMembers.isEmpty()) {
      restoreMembers.forEach(this::restoreMember);
      List<Long> restoreMemberIds =
          restoreMembers.stream().map(MemberEntity::getId).collect(Collectors.toList());
      iUnitService.restoreMemberUnit(spaceId, restoreMemberIds);
      iTeamMemberRelService.addMemberTeams(restoreMemberIds,
          Collections.singletonList(rootTeamId));
    }

    // send email
    invitationServiceFacade.sendInvitationEmail(
        new MultiInvitationMetadata(spaceId, inviteUserId, distinctEmails));
    TaskManager.me().execute(
        () -> sendInviteNotification(inviteUserId, shouldSendInvitationNotify, spaceId, false));
    return memberIds;
  }

  private void createInactiveMember(MemberEntity member, String spaceId, String inviteEmail) {
    member.setSpaceId(spaceId);
    member.setMemberName(StrUtil.subBefore(inviteEmail, '@', true));
    member.setEmail(inviteEmail);
    member.setIsActive(false);
    member.setIsPoint(true);
    member.setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue());
    member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
    member.setNameModified(false);
    member.setIsAdmin(false);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void sendInviteEmail(String lang, String spaceId, Long fromMemberId, String email) {
    log.info("send Invite email");
    // Other invitation links of the mailbox corresponding to the current space are invalid
    spaceInviteRecordMapper.expireBySpaceIdAndEmail(Collections.singletonList(spaceId), email);
    // create user invitation link
    String inviteToken = IdUtil.fastSimpleUUID();
    String inviteUrl =
        StrUtil.format(constProperties.getServerDomain() + "/invite/mail?inviteToken={}",
            inviteToken);

    SpaceInviteRecordEntity record = new SpaceInviteRecordEntity();
    record.setInviteMemberId(fromMemberId);
    record.setInviteSpaceId(spaceId);
    record.setInviteEmail(email);
    record.setInviteToken(inviteToken);
    record.setInviteUrl(inviteUrl);

    try {
      log.info("Begin Send User Invitation Email :{}", DateUtil.now());
      sendUserInvitationEmail(lang, spaceId, fromMemberId, inviteUrl, email);
      log.info("End Send User Invitation Email :{}", DateUtil.now());
      // record success
      spaceInviteRecordMapper.insert(record.setSendStatus(true).setStatusDesc("Success"));
    } catch (Exception e) {
      log.error("Send invitation email {} fail, Cause: {}", email, e);
      // record fail
      spaceInviteRecordMapper.insert(record.setSendStatus(false).setStatusDesc("Fail"));
      throw new BusinessException(e.getMessage());
    }
  }

  @Override
  public void sendUserInvitationNotifyEmail(String lang, String spaceId, Long fromMemberId,
                                            String email) {
    try {
      log.info("Begin send user invitation notify email :{}", DateUtil.now());
      //  email HTML main body
      String inviteUrl =
          StrUtil.format(constProperties.getServerDomain() + "/space/{}/workbench", spaceId);
      sendUserInvitationEmail(lang, spaceId, fromMemberId, inviteUrl, email);
      log.info("End send user invitation notify email :{}", DateUtil.now());
    } catch (Exception e) {
      log.error("send user invitation notify email fail", e);
    }
  }

  @Override
  public void sendUserInvitationEmail(String lang, String spaceId, Long inviter, String inviteUrl,
                                      String emailAddress) {
    String inviterName = getMemberNameById(inviter);
    String spaceName = iSpaceService.getNameBySpaceId(spaceId);
    Dict dict = Dict.create();
    dict.set("USER_NAME", inviterName);
    dict.set("SPACE_NAME", spaceName);
    dict.set("INVITE_URL", inviteUrl);
    dict.set("YEARS", LocalDate.now().getYear());
    Dict mapDict = Dict.create();
    mapDict.set("USER_NAME", inviterName);
    mapDict.set("SPACE_NAME", spaceName);
    NotifyMailFactory.me()
        .sendMail(lang, MailPropConstants.SUBJECT_INVITE_NOTIFY, mapDict, dict,
            Collections.singletonList(emailAddress));
  }

  @Override
  public void addTeamMember(String spaceId, TeamAddMemberRo data) {
    log.info("team add member");
    Long teamId = data.getTeamId();
    ExceptionUtil.isNotNull(teamId != 0L, OrganizationException.GET_TEAM_ERROR);
    if (ObjectUtil.isNotNull(teamId)) {
      TeamEntity team = iTeamService.getById(teamId);
      ExceptionUtil.isNotNull(team, OrganizationException.GET_TEAM_ERROR);
    }
    // unit list, member or team
    List<OrgUnitRo> unitList = data.getUnitList();
    List<Long> memberIds = new ArrayList<>();
    int teamType = 1;
    int memberType = 2;
    CollUtil.forEach(unitList.iterator(), (value, index) -> {
      if (value.getType().equals(teamType)) {
        // Department Unit. Query all sub departments and their members
        if (value.getId() == 0L) {
          // Root team, check all members of the space
          List<Long> members = baseMapper.selectMemberIdsBySpaceId(spaceId);
          memberIds.addAll(members);
        } else {
          List<Long> subIds =
              teamMapper.selectAllSubTeamIdsByParentId(value.getId(), true);
          List<Long> members = teamMemberRelMapper.selectMemberIdsByTeamIds(subIds);
          memberIds.addAll(members);
        }
      } else if (value.getType().equals(memberType)) {
        memberIds.add(value.getId());
      }
    });
    // query the team's members. distinct, Prevent repeated insertions
    List<Long> originMemberIds = teamMemberRelMapper.selectMemberIdsByTeamId(teamId);
    List<Long> distinctIds = CollUtil.filter(memberIds,
        (Filter<Long>) memberId -> !originMemberIds.contains(memberId));
    // it should be a clean data insert
    iTeamMemberRelService.addMemberTeams(CollUtil.distinct(distinctIds),
        Collections.singletonList(teamId));
    // member remover from root team.
    Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
    teamMemberRelMapper.deleteBatchMemberByTeams(distinctIds, rootTeamId);
    NotificationRenderFieldHolder.set(
        NotificationRenderField.builder().playerIds(distinctIds).bodyExtras(
            Dict.create().set(TEAM_NAME, teamMapper.selectTeamNameById(teamId))
                .set(TEAM_ID, teamId)).build());
  }

  @Override
  public void updateMember(Long memberId, UpdateMemberOpRo opRo) {
    log.info("update member");
    MemberEntity member = new MemberEntity();
    member.setId(memberId);
    member.setMemberName(opRo.getMemberName());
    member.setNameModified(true);
    member.setIsSocialNameModified(SocialNameModified.YES.getValue());
    boolean memUpdate = updateById(member);
    ExceptionUtil.isTrue(memUpdate, OrganizationException.UPDATE_MEMBER_ERROR);
    // delete cache
    TaskManager.me().execute(() -> {
      MemberEntity entity = this.getById(memberId);
      if (entity.getUserId() == null) {
        return;
      }
      userSpaceCacheService.delete(entity.getUserId(), entity.getSpaceId());
    });
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void updateMember(UpdateMemberRo data) {
    log.info("update member");
    Long memberId = data.getMemberId();
    MemberEntity member = getById(memberId);
    ExceptionUtil.isNotNull(member, OrganizationException.NOT_EXIST_MEMBER);
    if (StrUtil.isNotBlank(data.getMemberName())) {
      this.updateMember(memberId,
          UpdateMemberOpRo.builder().memberName(data.getMemberName()).build());
    }
    List<Long> teamIds = data.getTeamIds();
    if (CollUtil.isNotEmpty(teamIds)) {
      // Check whether the current member belongs to a department
      ExceptionUtil.isFalse(data.getTeamIds().contains(0L),
          OrganizationException.UPDATE_MEMBER_TEAM_ERROR);
    } else {
      teamIds = new ArrayList<>();
      Long rootTeamId = teamMapper.selectRootIdBySpaceId(member.getSpaceId());
      teamIds.add(rootTeamId);
    }
    // List of the original departments of the member, including the root department
    List<Long> originTeams = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
    // unionSet，The following displays the ID of the actual operation
    List<Long> unionTeamList = (List<Long>) CollUtil.union(teamIds, originTeams);
    // the new collection, difference set
    List<Long> addTeamList = (List<Long>) CollUtil.disjunction(unionTeamList, originTeams);
    // delete the collection, difference set
    List<Long> removeTeamList = (List<Long>) CollUtil.disjunction(unionTeamList, teamIds);
    if (CollUtil.isNotEmpty(addTeamList)) {
      iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId), addTeamList);
    }
    if (CollUtil.isNotEmpty(removeTeamList)) {
      boolean dmrFlag = SqlHelper.retBool(
          teamMemberRelMapper.deleteByTeamIdsAndMemberId(memberId, removeTeamList));
      ExceptionUtil.isTrue(dmrFlag, OrganizationException.UPDATE_MEMBER_ERROR);
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void updateMemberByTeamId(String spaceId, List<Long> memberIds, List<Long> teamIds) {
    log.info("assign member groups to the root organization");
    // Check if there are duplicates in the adjusted departments, and eliminate the duplicates
    Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
    teamMemberRelMapper.deleteBatchMemberByTeams(memberIds, rootTeamId);
    // Query the departments to which a member belongs, including the root department
    List<TeamMemberRelEntity> tmrList = teamMemberRelMapper.selectByMemberIds(memberIds);
    Map<Long, List<Long>> toAddMap = new LinkedHashMap<>(memberIds.size());
    memberIds.forEach(memberId -> {
      // member indicates an associated department
      List<TeamMemberRelEntity> memTeamList =
          tmrList.stream().filter(e -> e.getMemberId().equals(memberId))
              .collect(Collectors.toList());
      if (CollUtil.isNotEmpty(memTeamList)) {
        Set<Long> belongTeamIds = memTeamList.stream()
            .collect(Collectors.groupingBy(TeamMemberRelEntity::getTeamId)).keySet();
        List<Long> filters = teamIds.stream().filter(i -> !belongTeamIds.contains(i))
            .collect(Collectors.toList());
        toAddMap.put(memberId, filters);
      } else {
        toAddMap.put(memberId, teamIds);
      }
    });
    // Filters non-redundant data,
    // including repeated association insertions of members and departments
    CollUtil.forEach(toAddMap, (key, value, index) -> {
      if (CollUtil.isNotEmpty(value)) {
        iTeamMemberRelService.addMemberTeams(Collections.singletonList(key),
            CollUtil.newArrayList(value));
      }
    });
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void batchDeleteMemberFromTeam(String spaceId, List<Long> memberIds, Long teamId) {
    log.info("Delete members from the specified department in batches");
    //If the member does not belong to a department, associate the root department again
    List<TeamMemberRelEntity> tmrEntities = teamMemberRelMapper.selectByMemberIds(memberIds);
    List<Long> needRelateRoots = new ArrayList<>();
    for (Long memberId : memberIds) {
      List<TeamMemberRelEntity> memTeamList =
          CollUtil.filterNew(tmrEntities, (entity) -> entity.getMemberId().equals(memberId));
      Set<Long> belongTeamIds =
          memTeamList.stream().collect(Collectors.groupingBy(TeamMemberRelEntity::getTeamId))
              .keySet();
      if (belongTeamIds.size() == 1) {
        needRelateRoots.add(memberId);
      }
    }
    boolean flag =
        SqlHelper.retBool(teamMemberRelMapper.deleteBatchMemberByTeams(memberIds, teamId));
    ExceptionUtil.isTrue(flag, OrganizationException.DELETE_MEMBER_ERROR);
    if (CollUtil.isNotEmpty(needRelateRoots)) {
      // Associating the root team
      Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
      iTeamMemberRelService.addMemberTeams(needRelateRoots,
          Collections.singletonList(rootTeamId));
    }
    Long userId = SessionContext.getUserId();
    TaskManager.me().execute(() -> NotificationManager.me()
        .playerNotify(NotificationTemplateId.REMOVED_FROM_GROUP, memberIds, userId, spaceId,
            Dict.create().set(TEAM_NAME, teamMapper.selectTeamNameById(teamId))
                .set(TEAM_ID, teamId)));
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void removeByMemberIds(List<Long> memberIds) {
    baseMapper.deleteBatchByIds(memberIds);
    // Logically deletes a member unit from an organizational unit
    iUnitService.removeByMemberId(memberIds);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void removeAllMembersBySpaceId(String spaceId) {
    List<Long> allMemberIds = getMemberIdsBySpaceId(spaceId);
    if (CollUtil.isNotEmpty(allMemberIds)) {
      batchDeleteMemberFromSpace(spaceId, allMemberIds, false);
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void batchDeleteMemberFromSpace(String spaceId, List<Long> memberIds,
                                         boolean mailNotify) {
    if (CollUtil.isEmpty(memberIds)) {
      return;
    }
    log.info("Delete members completely from the space in batches");
    // delete cache
    List<Long> userIds = baseMapper.selectUserIdsByMemberIds(memberIds);
    if (CollUtil.isNotEmpty(userIds)) {
      for (Long userId : userIds) {
        if (userId != null) {
          userActiveSpaceCacheService.delete(userId);
          userSpaceCacheService.delete(userId, spaceId);
        }
      }
    }
    List<MemberEntity> memberEntities = baseMapper.selectBatchIds(memberIds);
    // The invitation link is invalid and the public link it created is deleted
    if (CollUtil.isNotEmpty(memberEntities)) {
      List<String> deleteMails = new ArrayList<>();
      for (MemberEntity filter : memberEntities) {
        if (StrUtil.isNotBlank(filter.getEmail())) {
          deleteMails.add(filter.getEmail());
        }
      }
      if (CollUtil.isNotEmpty(deleteMails)) {
        spaceInviteRecordMapper.expireBySpaceIdAndEmails(spaceId, deleteMails);
      }
    }
    spaceInviteLinkMapper.updateByCreators(memberIds);
    // The associated department of a member is deleted
    iTeamMemberRelService.removeByMemberIds(memberIds);
    // delete the associated role
    iRoleMemberService.removeByRoleMemberIds(memberIds);
    // delete members
    removeByMemberIds(memberIds);
    // Removed from the space management role
    iSpaceRoleService.batchRemoveByMemberIds(spaceId, memberIds);
    // sending a notification email
    if (mailNotify) {
      String spaceName = iSpaceService.getNameBySpaceId(spaceId);
      final List<String> emails = baseMapper.selectEmailByBatchMemberId(memberIds);
      Dict dict = Dict.create();
      dict.set("SPACE_NAME", spaceName);
      dict.set("YEARS", LocalDate.now().getYear());
      Dict mapDict = Dict.create();
      mapDict.set("SPACE_NAME", spaceName);
      final String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
      List<UserLangDTO> emailsWithLang = iUserService.getLangByEmails(defaultLang, emails);
      List<MailWithLang> tos = emailsWithLang.stream()
          .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(),
              emailWithLang.getEmail()))
          .collect(Collectors.toList());
      TaskManager.me().execute(() -> NotifyMailFactory.me()
          .sendMail(MailPropConstants.SUBJECT_REMOVE_MEMBER, mapDict, dict, tos));
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void updateActiveStatus(String spaceId, Long userId) {
    log.info("change the space to active");
    // If the most recent active space is consistent, return directly
    String activeSpaceId = baseMapper.selectActiveSpaceByUserId(userId);
    if (spaceId.equals(activeSpaceId)) {
      return;
    }
    // Change the active state of a space
    baseMapper.updateInactiveStatusByUserId(userId);
    baseMapper.updateActiveStatusByUserIdAndSpaceId(userId, spaceId);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void preDelBySpaceId(String spaceId, Long userId) {
    log.info("Delete all members of the space except the master administrator");
    List<Long> userIds = baseMapper.selectUserIdBySpaceIds(Collections.singletonList(spaceId));
    if (CollUtil.isNotEmpty(userIds)) {
      userIds.remove(userId);
      userIds.forEach(id -> {
        userActiveSpaceCacheService.delete(id);
        userSpaceCacheService.delete(id, spaceId);
      });
      NotificationRenderFieldHolder.set(
          NotificationRenderField.builder().playerIds(userIds).build());
    }
    baseMapper.delBySpaceIds(Collections.singletonList(spaceId), userId);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public UploadParseResultVO parseExcelFile(String spaceId, MultipartFile multipartFile) {
    // subscribe to the limit
    // iSubscriptionService.checkSeat(spaceId);
    // manipulate user information in space
    UserSpaceDto userSpaceDto = LoginContext.me().getUserSpaceDto(spaceId);
    UploadParseResultVO resultVo = new UploadParseResultVO();
    try {
      // obtaining statistics
      int currentMemberCount =
          (int) SqlTool.retCount(staticsMapper.countMemberBySpaceId(spaceId));
      // long defaultMaxMemberCount = iSubscriptionService.getPlanSeats(spaceId);
      // Use the object to read data row by row,
      // set the number of rows in the table header,
      // and start reading data at line 4, asynchronous reading.
      UploadDataListener listener =
          new UploadDataListener(spaceId, this, -1, currentMemberCount)
              .resources(userSpaceDto.getResourceCodes());
      EasyExcel.read(multipartFile.getInputStream(), listener).sheet().headRowNumber(3)
          .doRead();
      // gets the parse store record
      resultVo.setRowCount(listener.getRowCount());
      resultVo.setSuccessCount(listener.getSuccessCount());
      resultVo.setErrorCount(listener.getErrorCount());
      resultVo.setErrorList(listener.getErrorList());
      // save the error message to the database
      AuditUploadParseRecordEntity record = new AuditUploadParseRecordEntity();
      record.setSpaceId(spaceId);
      record.setRowSize(listener.getRowCount());
      record.setSuccessCount(listener.getSuccessCount());
      record.setErrorCount(listener.getErrorCount());
      record.setErrorMsg(JSONUtil.toJsonStr(listener.getErrorList()));
      auditUploadParseRecordMapper.insert(record);
      // send an invitation email
      this.batchSendInviteEmailOnUpload(spaceId, userSpaceDto.getMemberId(),
          listener.getSendInviteEmails());
      this.batchSendInviteNotifyEmailOnUpload(spaceId, userSpaceDto.getMemberId(),
          listener.getSendNotifyEmails());
      Long userId = userSpaceDto.getUserId();
      TaskManager.me().execute(
          () -> this.sendInviteNotification(userId, listener.getMemberIds(), spaceId, false));
    } catch (IOException e) {
      e.printStackTrace();
      log.error("file cannot be read", e);
      throw new BusinessException(OrganizationException.EXCEL_CAN_READ_ERROR);
    } catch (Exception e) {
      e.printStackTrace();
      throw new BusinessException(
          "Failed to parse the file. Download the template and import it");
    }
    return resultVo;
  }

  /**
   * Send invitation email addresses to specified email addresses in batches.
   *
   * @param spaceId      space id
   * @param fromMemberId sender
   * @param inviteEmails email
   */
  private void batchSendInviteEmailOnUpload(String spaceId, Long fromMemberId,
                                            List<String> inviteEmails) {
    // send invitation emails
    if (CollUtil.isNotEmpty(inviteEmails)) {
      String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
      List<UserLangDTO> emailsWithLang =
          iUserService.getLangByEmails(defaultLang, inviteEmails);
      for (UserLangDTO emailWithLang : emailsWithLang) {
        TaskManager.me().execute(
            () -> this.sendInviteEmail(emailWithLang.getLocale(), spaceId, fromMemberId,
                emailWithLang.getEmail()));
      }
    }
  }

  /**
   * send invitation notification emails in batches
   *
   * @param spaceId      space id
   * @param fromMemberId sender（member id）
   * @param notifyEmails email
   */
  private void batchSendInviteNotifyEmailOnUpload(String spaceId, Long fromMemberId,
                                                  List<String> notifyEmails) {
    // send an invitation notification email
    if (CollUtil.isNotEmpty(notifyEmails)) {
      String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
      List<UserLangDTO> emailsWithLang =
          iUserService.getLangByEmails(defaultLang, notifyEmails);
      for (UserLangDTO emailWithLang : emailsWithLang) {
        TaskManager.me().execute(
            () -> sendUserInvitationNotifyEmail(emailWithLang.getLocale(), spaceId,
                fromMemberId, emailWithLang.getEmail()));
      }
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Long saveUploadData(String spaceId, UploadDataDTO uploadData, List<String> inviteEmails,
                             List<String> notifyEmails, boolean teamCreatable) {
    log.info("saving template data:{}", JSONUtil.toJsonStr(uploadData));
    Long memberId = IdWorker.getId();
    MemberEntity member = new MemberEntity();
    member.setId(memberId);
    member.setSpaceId(spaceId);
    member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
    member.setEmail(uploadData.getEmail());
    member.setPosition(uploadData.getPosition());
    member.setJobNumber(uploadData.getJobNumber());
    member.setIsPoint(true);
    member.setIsAdmin(false);
    member.setNameModified(false);
    member.setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue());
    // query whether a user is bound to this mailbox
    UserEntity user = iUserService.getByEmail(uploadData.getEmail());
    boolean historyMember = false;
    if (user != null) {
      // notification email
      notifyEmails.add(uploadData.getEmail());
      // The mailbox is bound to the user and directly activates the member
      Long userId = user.getId();
      member.setUserId(userId);
      member.setMemberName(StrUtil.isBlank(uploadData.getName()) ? user.getNickName() :
          StrUtil.subWithLength(uploadData.getName(), 0, 32));
      member.setIsActive(true);
      // whether the user is already in space
      MemberEntity existInSpace =
          baseMapper.selectByUserIdAndSpaceIdIgnoreDelete(userId, spaceId);
      if (existInSpace != null) {
        memberId = existInSpace.getId();
        member.setId(existInSpace.getId());
        historyMember = true;
      }
      // the application for adding space is invalid
      spaceApplyMapper.invalidateTheApply(ListUtil.toList(userId), spaceId,
          InviteType.FILE_IMPORT.getType());
    } else {
      // The mailbox is not bound to any user and is inactive.
      // The mailbox is waiting for the user to accept the invitation
      // and register to enter the space
      member.setMemberName(StrUtil.isBlank(uploadData.getName()) ? "unnamed" :
          StrUtil.subWithLength(uploadData.getName(), 0, 32));
      member.setIsActive(false);
      // invitation email
      inviteEmails.add(uploadData.getEmail());
    }
    if (historyMember) {
      // logical deletion restoration
      restoreMember(member);
      // recovery team unit
      iUnitService.restoreMemberUnit(spaceId, Collections.singletonList(member.getId()));
    } else {
      this.batchCreate(spaceId, Collections.singletonList(member));
    }
    // Deal with related departments
    if (StrUtil.isNotBlank(uploadData.getTeam())) {
      List<TeamMemberRelEntity> dmrEntities = new ArrayList<>();
      // comma intercept department
      List<String> teamNamePaths =
          StrUtil.splitTrim(Convert.toDBC(uploadData.getTeam().trim()), ',');
      // root team
      Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
      // traverse to see if it exists
      for (String teamNamePath : teamNamePaths) {
        if (StrUtil.isBlank(teamNamePath)) {
          // Null values are directly skipped and associated under the root team
          TeamMemberRelEntity dmr = new TeamMemberRelEntity();
          dmr.setId(IdWorker.getId());
          dmr.setMemberId(memberId);
          dmr.setTeamId(rootTeamId);
          dmrEntities.add(dmr);
          continue;
        }
        log.debug("before the intercept:{}", teamNamePath);
        // Interception is in order. First - second - third
        List<String> teamNames = StrUtil.splitTrim(teamNamePath, '-');
        log.info("after  the intercept:{}", teamNames);
        // Check whether the department exists based on the department path
        Long teamId = iTeamService.getByTeamNamePath(spaceId, teamNames);
        if (teamId != null) {
          // There is, directly related to
          TeamMemberRelEntity dmr = new TeamMemberRelEntity();
          dmr.setId(IdWorker.getId());
          dmr.setMemberId(memberId);
          dmr.setTeamId(teamId);
          dmrEntities.add(dmr);
        } else {
          // Does not exist. Create if you have administrative team permission，
          // if not it is related to the root team.
          if (teamCreatable) {
            // Have permission, create team and associate members
            List<Long> teamIds =
                iTeamService.createBatchByTeamName(spaceId, rootTeamId, teamNames);
            for (Long id : teamIds) {
              TeamMemberRelEntity dmr = new TeamMemberRelEntity();
              dmr.setId(IdWorker.getId());
              dmr.setMemberId(memberId);
              dmr.setTeamId(id);
              dmrEntities.add(dmr);
            }
          } else {
            TeamMemberRelEntity dmr = new TeamMemberRelEntity();
            dmr.setId(IdWorker.getId());
            dmr.setMemberId(memberId);
            dmr.setTeamId(rootTeamId);
            dmrEntities.add(dmr);
          }
        }
      }
      if (CollUtil.isNotEmpty(dmrEntities)) {
        teamMemberRelMapper.insertBatch(dmrEntities);
      }
    } else {
      // no department directly tied to the root door
      Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
      iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId),
          Collections.singletonList(rootTeamId));
    }
    return memberId;
  }

  @Override
  public void sendInviteNotification(Long fromUserId, List<Long> invitedMemberIds, String spaceId,
                                     Boolean isToFromUser) {
    // sending message notification
    if (ObjectUtil.isNotEmpty(invitedMemberIds)) {
      NotificationManager.me()
          .playerNotify(NotificationTemplateId.INVITE_MEMBER_TO_ADMIN, invitedMemberIds,
              fromUserId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, invitedMemberIds));
      NotificationManager.me()
          .playerNotify(NotificationTemplateId.INVITE_MEMBER_TO_USER, invitedMemberIds,
              fromUserId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, invitedMemberIds));
      if (isToFromUser) {
        NotificationManager.me()
            .playerNotify(NotificationTemplateId.INVITE_MEMBER_TO_MYSELF,
                ListUtil.toList(fromUserId), 0L, spaceId,
                Dict.create().set(INVOLVE_MEMBER_ID, invitedMemberIds));
      }
    }
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public Long createMember(Long userId, String spaceId, Long teamId) {
    log.info("Create member");
    UserEntity user = iUserService.getById(userId);
    MemberEntity member = new MemberEntity();
    member.setUserId(userId);
    member.setSpaceId(spaceId);
    member.setMemberName(user.getNickName());
    member.setMobile(user.getMobilePhone());
    member.setEmail(user.getEmail());
    member.setStatus(UserSpaceStatus.ACTIVE.getStatus());
    member.setIsActive(true);
    member.setIsPoint(true);
    member.setNameModified(false);
    member.setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue());
    member.setIsAdmin(false);
    // Query whether the user has been added to the space
    MemberEntity historyMember =
        baseMapper.selectByUserIdAndSpaceIdIgnoreDelete(userId, spaceId);
    if (historyMember != null && historyMember.getIsDeleted()) {
      // restoring history member
      member.setId(historyMember.getId());
      restoreMember(member);
      // recovery unit
      iUnitService.restoreMemberUnit(spaceId, Collections.singletonList(member.getId()));
    } else {
      // For the first time, create a member
      member.setId(IdWorker.getId());
      this.batchCreate(spaceId, Collections.singletonList(member));
    }
    if (teamId == null) {
      teamId = teamMapper.selectRootIdBySpaceId(spaceId);
    }
    // bind a department to a member
    iTeamMemberRelService.addMemberTeams(Collections.singletonList(member.getId()),
        Collections.singletonList(teamId));
    return member.getId();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void updatePartPropertyBatchByMemberId(String spaceId, List<MemberEntity> entities) {
    if (CollUtil.isEmpty(entities)) {
      return;
    }
    List<Long> memberIds = new ArrayList<>();
    entities.forEach(entity -> {
      baseMapper.updateMemberById(entity);
      memberIds.add(entity.getId());
    });

    iUnitService.restoreMemberUnit(spaceId, memberIds);
  }

  @Override
  public List<TenantMemberDto> getMemberOpenIdListBySpaceId(String spaceId) {
    return baseMapper.selectMemberOpenIdBySpaceId(spaceId);
  }

  @Override
  public Long getRandomMemberId(String spaceId, Long excludeMemberId) {
    return baseMapper.selectRandomMemberExclude(spaceId, excludeMemberId);
  }

  @Override
  public int getTotalMemberCountBySpaceId(String spaceId) {
    return SqlTool.retCount(baseMapper.selectCountBySpaceId(spaceId));
  }

  @Override
  public int getTotalActiveMemberCountBySpaceId(String spaceId) {
    return SqlTool.retCount(baseMapper.selectActiveMemberCountBySpaceId(spaceId));
  }

  @Override
  public void preDelByMemberIds(List<Long> memberIds) {
    baseMapper.preDelByMemberIds(memberIds);
  }

  @Override
  public void cancelPreDelByUserId(Long userId) {
    baseMapper.cancelPreDelByUserId(userId);
  }

  @Override
  public void clearOpenIdById(Long memberId) {
    baseMapper.clearOpenIdById(memberId);
  }

  @Override
  public List<String> getOpenIdByUserIds(List<Long> userIds) {
    if (CollUtil.isEmpty(userIds)) {
      return new ArrayList<>();
    }
    return baseMapper.selectOpenIdByUserIds(userIds);
  }

  @Override
  public List<String> getOpenIdByIds(List<Long> memberIds) {
    if (CollUtil.isEmpty(memberIds)) {
      return new ArrayList<>();
    }
    return baseMapper.selectOpenIdByMemberIds(memberIds);
  }

  @Override
  public String getMemberNameByUserIdAndSpaceId(Long userId, String spaceId) {
    return baseMapper.selectMemberNameByUserIdAndSpaceId(userId, spaceId);
  }

  @Override
  public List<MemberDTO> getInactiveMemberDtoByMobile(String mobile) {
    return baseMapper.selectInactiveMemberByMobile(mobile);
  }

  @Override
  public List<MemberDTO> getInactiveMemberDtoByEmail(String email) {
    return baseMapper.selectInactiveMemberByEmail(email);
  }

  @Override
  public int getSpaceCountByUserId(Long userId) {
    return SqlTool.retCount(baseMapper.selectCountByUserId(userId));
  }

  @Override
  public boolean checkUserHasModifyNameInSpace(Long userId) {
    return SqlTool.retCount(baseMapper.selectNameModifiedCountByUserId(userId)) > 0;
  }

  @Override
  public void batchUpdateNameAndOpenIdAndIsDeletedByIds(List<MemberEntity> updateEntities) {
    if (CollUtil.isEmpty(updateEntities)) {
      return;
    }
    baseMapper.batchUpdateNameAndIsDeletedByIds(updateEntities);
  }

  @Override
  public void batchResetIsDeletedAndUserIdByIds(List<Long> ids) {
    if (CollUtil.isEmpty(ids)) {
      return;
    }
    baseMapper.updateIsDeletedAndUserIdToDefaultByIds(ids);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void batchRecoveryMemberFromSpace(String spaceId, List<Long> memberIds) {
    log.info("Recovery member from space");
    if (CollUtil.isEmpty(memberIds)) {
      return;
    }
    // recovery member
    batchResetIsDeletedAndUserIdByIds(memberIds);
    // restore a member from an organizational unit
    iUnitService.batchUpdateIsDeletedBySpaceIdAndRefId(spaceId, memberIds, UnitType.MEMBER,
        false);
  }

  @Override
  public void handleMemberTeamInfo(MemberInfoVo memberInfoVo) {
    String spaceId = memberMapper.selectSpaceIdByMemberId(memberInfoVo.getMemberId());
    List<Long> memberIds = CollUtil.newArrayList(memberInfoVo.getMemberId());
    // handle member's team name, get full hierarchy team path name
    Map<Long, List<MemberTeamPathInfo>> memberTeamPathInfosMap =
        iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
    if (memberTeamPathInfosMap.containsKey(memberInfoVo.getMemberId())) {
      memberInfoVo.setTeamData(memberTeamPathInfosMap.get(memberInfoVo.getMemberId()));
    }
  }

  @Override
  public void activeIfExistInvitationSpace(Long userId, List<Long> memberIds) {
    List<MemberEntity> memberEntities = new ArrayList<>();
    for (Long memberId : memberIds) {
      MemberEntity member = new MemberEntity();
      member.setId(memberId);
      member.setUserId(userId);
      member.setIsActive(true);
      memberEntities.add(member);
    }
    updateBatchById(memberEntities);
  }
}
