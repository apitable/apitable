package com.vikadata.api.modular.organization.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

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
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearchResp;

import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.Auth0Service;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationRenderField;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.audit.InviteType;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.SpaceException;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.event.NodeShareDisableEvent;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.factory.NotifyMailFactory.MailWithLang;
import com.vikadata.api.holder.NotificationRenderFieldHolder;
import com.vikadata.api.model.dto.asset.UploadDataDto;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.dto.organization.SearchMemberDto;
import com.vikadata.api.model.ro.organization.OrgUnitRo;
import com.vikadata.api.model.ro.organization.TeamAddMemberRo;
import com.vikadata.api.model.ro.organization.UpdateMemberOpRo;
import com.vikadata.api.model.ro.organization.UpdateMemberRo;
import com.vikadata.api.model.vo.organization.MemberBriefInfoVo;
import com.vikadata.api.model.vo.organization.MemberInfoVo;
import com.vikadata.api.model.vo.organization.SearchMemberResultVo;
import com.vikadata.api.model.vo.organization.SearchMemberVo;
import com.vikadata.api.model.vo.organization.UploadParseResultVO;
import com.vikadata.api.modular.audit.mapper.AuditUploadParseRecordMapper;
import com.vikadata.api.modular.organization.excel.handler.UploadDataListener;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.model.MemberTeamPathInfo;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IRoleMemberService;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.service.ExpandServiceImpl;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.model.TenantMemberDto;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.mapper.SpaceApplyMapper;
import com.vikadata.api.modular.space.mapper.SpaceInviteLinkMapper;
import com.vikadata.api.modular.space.mapper.SpaceInviteRecordMapper;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.statics.mapper.StaticsMapper;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.AuditUploadParseRecordEntity;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceInviteRecordEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.entity.UnitEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static com.vikadata.api.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.vikadata.api.constants.NotificationConstants.TEAM_ID;
import static com.vikadata.api.constants.NotificationConstants.TEAM_NAME;
import static com.vikadata.api.enums.exception.OrganizationException.DELETE_MEMBER_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.EXCEL_CAN_READ_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.GET_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.NOT_EXIST_MEMBER;
import static com.vikadata.api.enums.exception.OrganizationException.UPDATE_MEMBER_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.UPDATE_MEMBER_TEAM_ERROR;
import static com.vikadata.api.enums.exception.PermissionException.SET_MAIN_ADMIN_FAIL;

/**
 * <p>
 * 组织架构-成员表 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
@Service
@Slf4j
public class MemberServiceImpl extends ExpandServiceImpl<MemberMapper, MemberEntity> implements IMemberService {

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private IUserService iUserService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private ServerProperties serverProperties;

    @Resource
    private SpaceInviteRecordMapper spaceInviteRecordMapper;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private UserSpaceService userSpaceService;

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
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Resource
    private SpaceApplyMapper spaceApplyMapper;

    @Resource
    private StaticsMapper staticsMapper;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private Auth0Service auth0Service;

    @Resource
    private MemberMapper memberMapper;

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
        ExceptionUtil.isTrue(flag, SET_MAIN_ADMIN_FAIL);
    }

    @Override
    public void cancelMemberMainAdmin(Long memberId) {
        MemberEntity member = MemberEntity.builder().id(memberId).isAdmin(false).build();
        boolean flag = updateById(member);
        ExceptionUtil.isTrue(flag, SET_MAIN_ADMIN_FAIL);
    }

    @Override
    public String getSpaceIdByMemberId(Long memberId) {
        return baseMapper.selectSpaceIdByMemberId(memberId);
    }

    @Override
    public List<Long> getUnitsByMember(Long memberId) {
        log.info("获取成员归属的所有组织单元ID");
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
    public MemberEntity getBySpaceIdAndEmailIgnoreDeleted(String spaceId, String email) {
        return baseMapper.selectBySpaceIdAndEmailIgnoreDeleted(spaceId, email);
    }

    @Override
    public List<MemberEntity> getBySpaceIdAndEmailsIgnoreDeleted(String spaceId, List<String> emails) {
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
    public List<MemberDto> getInactiveMemberByEmails(String email) {
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
        // 将 member、unit 组合成最终的返回结果
        return memberEntities.stream()
                .map(member -> {
                    MemberBriefInfoVo item = new MemberBriefInfoVo();
                    item.setMemberId(member.getId());
                    item.setMemberName(member.getMemberName());
                    Integer memberNameModified = member.getIsSocialNameModified();
                    item.setIsMemberNameModified(Objects.isNull(memberNameModified) || memberNameModified != 0);

                    Optional.ofNullable(memberUnitIdMap.get(member.getId()))
                            .ifPresent(item::setUnitId);

                    return item;
                }).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchCreate(String spaceId, List<MemberEntity> entities) {
        log.info("批量创建成员");
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        saveBatch(entities);
        // 创建组织单元
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
    @Transactional(rollbackFor = Exception.class)
    public List<Long> userInvitation(String spaceId, Long teamId, List<String> emails) {
        if (teamId != null) {
            String teamSpaceId = teamMapper.selectSpaceIdById(teamId);
            // check whether team in space
            ExceptionUtil.isTrue(spaceId.equals(teamSpaceId), GET_TEAM_ERROR);
        }
        else {
            // root team id
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        List<MemberEntity> memberEntities = new LinkedList<>();
        List<Long> memberIds = new ArrayList<>();
        // 查询邮箱绑定的用户
        List<String> distinctEmails = CollUtil.distinct(emails);
        List<UserEntity> userEntities = iUserService.getByEmails(distinctEmails);
        if (CollUtil.isNotEmpty(userEntities)) {
            List<Long> restoreMemberIds = new ArrayList<>();
            // 查询用户是否已经加入过该空间
            List<Long> userIds = userEntities.stream().map(UserEntity::getId).collect(Collectors.toList());
            List<MemberDto> members = baseMapper.selectDtoBySpaceIdAndUserIds(spaceId, userIds);
            Map<Long, Long> userToMemberIdMap = members.stream().collect(Collectors.toMap(MemberDto::getUserId, MemberDto::getId));
            for (UserEntity user : userEntities) {
                distinctEmails.remove(user.getEmail());
                // 用户已激活空间数量到达上限的，受邀空间归入未激活空间列表
                MemberEntity member = new MemberEntity();
                member.setUserId(user.getId());
                member.setSpaceId(spaceId);
                member.setMemberName(user.getNickName());
                member.setMobile(user.getMobilePhone());
                member.setEmail(user.getEmail());
                member.setIsActive(true);
                member.setIsPoint(true);
                member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
                member.setNameModified(false);
                member.setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue());
                member.setIsAdmin(false);
                Long memberId = userToMemberIdMap.get(user.getId());
                // 恢复的历史成员
                if (memberId != null) {
                    memberIds.add(memberId);
                    restoreMemberIds.add(memberId);
                    member.setId(memberId);
                    restoreMember(member);
                    continue;
                }
                // 绑定用户、激活的新成员
                Long id = IdWorker.getId();
                member.setId(id);
                memberEntities.add(member);
                memberIds.add(id);
            }
            if (CollUtil.isNotEmpty(restoreMemberIds)) {
                // 恢复组织单元
                iUnitService.restoreMemberUnit(spaceId, restoreMemberIds);
            }
            // 令主动加入空间的申请失效
            spaceApplyMapper.invalidateTheApply(userIds, spaceId, InviteType.EMAIL_INVITE.getType());
        }
        // 无绑定用户、未激活的新成员
        distinctEmails.forEach(email -> {
            MemberEntity member = new MemberEntity();
            Long id = IdWorker.getId();
            memberIds.add(id);
            member.setId(id);
            createInactiveMember(member, spaceId, email);
            memberEntities.add(member);
        });

        //添加成员
        if (CollUtil.isNotEmpty(memberEntities)) {
            this.batchCreate(spaceId, memberEntities);
        }
        // 部门绑定
        iTeamMemberRelService.addMemberTeams(memberIds, Collections.singletonList(teamId));
        return iUnitService.getUnitIdsByRefIds(memberIds);
    }

    @Override
    public void restoreMember(MemberEntity member) {
        baseMapper.restoreMember(member);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<Long> emailInvitation(Long inviteUserId, String spaceId, List<String> emails) {
        // remove empty string or null element in collection, then make it distinct
        final List<String> distinctEmails = CollectionUtil.distinctIgnoreCase(CollUtil.removeBlank(emails));
        if (distinctEmails.isEmpty()) {
            return new ArrayList<>();
        }
        // find email in users
        List<UserEntity> userEntities = iUserService.getByEmails(distinctEmails);
        Map<String, Long> emailUserMap = userEntities.stream()
                .collect(Collectors.toMap(UserEntity::getEmail, UserEntity::getId));
        // find email in spaces
        List<MemberEntity> memberEntities = getBySpaceIdAndEmailsIgnoreDeleted(spaceId, distinctEmails);
        Map<String, List<MemberEntity>> emailMemberMap = memberEntities.stream()
                .filter(m -> StrUtil.isNotBlank(m.getEmail()))
                .collect(Collectors.groupingBy(MemberEntity::getEmail));
        // collect emails whether it can send invitation
        List<String> shouldSendInvitationEmails = new ArrayList<>();
        List<String> shouldSendInvitationForSignupEmail = new ArrayList<>();
        List<Long> shouldSendInvitationNotify = new ArrayList<>();
        List<MemberEntity> members = new ArrayList<>();
        List<MemberEntity> restoreMembers = new ArrayList<>();
        distinctEmails.forEach(inviteEmail -> {
            MemberEntity member = new MemberEntity();
            // check member if existed
            if (emailMemberMap.containsKey(inviteEmail)) {
                // email member exist in space
                MemberEntity existedMember = emailMemberMap.get(inviteEmail).stream().findFirst().orElseThrow(() -> new BusinessException("invite member error"));
                // history member can be restored
                if (existedMember.getIsDeleted()) {
                    restoreMembers.add(existedMember);
                }
                shouldSendInvitationNotify.add(existedMember.getId());
            }
            else {
                // email is not exist in space
                member.setId(IdWorker.getId());
                createInactiveMember(member, spaceId, inviteEmail);
                members.add(member);
            }

            // check email user if existed
            if (emailUserMap.containsKey(inviteEmail)) {
                member.setUserId(emailUserMap.get(inviteEmail));
                member.setIsActive(true);
                // remember email should send invitation email
                shouldSendInvitationEmails.add(inviteEmail);
            }
            else {
                shouldSendInvitationForSignupEmail.add(inviteEmail);
            }
        });
        // inviter member id in space
        Long memberId = getMemberIdByUserIdAndSpaceId(inviteUserId, spaceId);

        // save or update members
        batchCreate(spaceId, members);
        // add team relation
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        iTeamMemberRelService.addMemberTeams(members.stream().map(MemberEntity::getId).collect(Collectors.toList()), Collections.singletonList(rootTeamId));

        // restore member
        if (!restoreMembers.isEmpty()) {
            restoreMembers.forEach(this::restoreMember);
            List<Long> restoreMemberIds = restoreMembers.stream().map(MemberEntity::getId).collect(Collectors.toList());
            iUnitService.restoreMemberUnit(spaceId, restoreMemberIds);
            iTeamMemberRelService.addMemberTeams(restoreMemberIds, Collections.singletonList(rootTeamId));
        }

        // send email
        final String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        if (auth0Service.isOpen()) {
            // create space workbench link
            shouldSendInvitationEmails.forEach(email -> {
                String link = String.format("%s/workbench?spaceId=%s", constProperties.getServerDomain(), spaceId);
                if (log.isDebugEnabled()) {
                    log.debug("link to send: {}", link);
                }
                final String locale = iUserService.getLangByEmail(defaultLang, email);
                sendUserInvitationEmail(locale, spaceId, memberId, link, email);
            });
            // create invitation link for sign up
            String returnUrl = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() + "/invitation/callback";
            shouldSendInvitationForSignupEmail.forEach(email -> {
                String link = auth0Service.createUserInvitationLink(email, returnUrl);
                if (log.isDebugEnabled()) {
                    log.debug("link to send: {}", link);
                }
                final String locale = iUserService.getLangByEmail(defaultLang, email);
                sendUserInvitationEmail(locale, spaceId, memberId, link, email);
            });
        }
        else {
            // create unique link
            distinctEmails.forEach(email -> {
                final String locale = iUserService.getLangByEmail(defaultLang, email);
                sendInviteEmail(locale, spaceId, memberId, email);
            });
        }

        TaskManager.me().execute(() -> sendInviteNotification(inviteUserId, shouldSendInvitationNotify, spaceId, false));
        List<Long> memberIds = members.stream().map(MemberEntity::getId).collect(Collectors.toList());
        if (!memberIds.isEmpty()) {
            return iUnitService.getUnitIdsByRefIds(memberIds);
        }
        return new ArrayList<>();
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
        log.info("发送邀请邮件");
        //当前空间的对应邮箱其他邀请链接失效
        spaceInviteRecordMapper.expireBySpaceIdAndEmail(Collections.singletonList(spaceId), email);
        // create user invitation link
        String inviteToken = IdUtil.fastSimpleUUID();
        String inviteUrl = StrUtil.format(constProperties.getServerDomain() + "/invite/mail?inviteToken={}", inviteToken);

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
        }
        catch (Exception e) {
            log.error("Send invitation email {} fail, Cause: {}", email, e);
            // record fail
            spaceInviteRecordMapper.insert(record.setSendStatus(false).setStatusDesc("Fail"));
        }
    }

    @Override
    public void sendUserInvitationNotifyEmail(String lang, String spaceId, Long fromMemberId, String email) {
        try {
            log.info("Begin send user invitation notify email :{}", DateUtil.now());
            //渲染邮件HTML正文
            String inviteUrl = StrUtil.format(constProperties.getServerDomain() + "/space/{}/workbench", spaceId);
            this.sendUserInvitationEmail(lang, spaceId, fromMemberId, inviteUrl, email);
            log.info("End send user invitation notify email :{}", DateUtil.now());
        }
        catch (Exception e) {
            log.error("send user invitation notify email fail", e);
        }
    }

    @Override
    public void sendUserInvitationEmail(String lang, String spaceId, Long inviter, String inviteUrl, String emailAddress) {
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
        NotifyMailFactory.me().sendMail(lang, MailPropConstants.SUBJECT_INVITE_NOTIFY, mapDict, dict, Collections.singletonList(emailAddress));
    }

    @Override
    public void addTeamMember(String spaceId, TeamAddMemberRo data) {
        log.info("部门添加成员");
        Long teamId = data.getTeamId();
        ExceptionUtil.isNotNull(teamId != 0L, GET_TEAM_ERROR);
        if (ObjectUtil.isNotNull(teamId)) {
            TeamEntity team = iTeamService.getById(teamId);
            ExceptionUtil.isNotNull(team, GET_TEAM_ERROR);
        }
        //组织单元列表，部门或成员
        List<OrgUnitRo> unitList = data.getUnitList();
        List<Long> memberIds = new ArrayList<>();
        int teamType = 1, memberType = 2;
        CollUtil.forEach(unitList.iterator(), (value, index) -> {
            if (value.getType().equals(teamType)) {
                //部门单位，查询所有子部门，查询所属成员
                if (value.getId() == 0L) {
                    //根部门，查询空间站所有成员
                    List<Long> members = baseMapper.selectMemberIdsBySpaceId(spaceId);
                    memberIds.addAll(members);
                }
                else {
                    List<Long> subIds = teamMapper.selectAllSubTeamIdsByParentId(value.getId(), true);
                    List<Long> members = teamMemberRelMapper.selectMemberIdsByTeamIds(subIds);
                    memberIds.addAll(members);
                }
            }
            else if (value.getType().equals(memberType)) {
                //成员单位
                memberIds.add(value.getId());
            }
        });
        //查询部门的所属成员，排重，防止重复插入
        List<Long> originMemberIds = teamMemberRelMapper.selectMemberIdsByTeamId(teamId);
        List<Long> distinctIds = CollUtil.filter(memberIds, (Filter<Long>) memberId -> !originMemberIds.contains(memberId));
        //应该是干净的数据插入
        iTeamMemberRelService.addMemberTeams(CollUtil.distinct(distinctIds), Collections.singletonList(teamId));
        //成员关联根部门关系移除
        Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
        teamMemberRelMapper.deleteBatchMemberByTeams(distinctIds, rootTeamId);
        // 发送通知渲染字段
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(distinctIds).bodyExtras(
                Dict.create().set(TEAM_NAME, teamMapper.selectTeamNameById(teamId)).set(TEAM_ID, teamId)).build());
    }

    @Override
    public void updateMember(Long memberId, UpdateMemberOpRo opRo) {
        log.info("编辑成员信息");
        MemberEntity member = new MemberEntity();
        member.setId(memberId);
        member.setMemberName(opRo.getMemberName());
        member.setNameModified(true);
        member.setIsSocialNameModified(SocialNameModified.YES.getValue());
        boolean memUpdate = updateById(member);
        ExceptionUtil.isTrue(memUpdate, UPDATE_MEMBER_ERROR);
        //删除缓存
        TaskManager.me().execute(() -> {
            MemberEntity entity = this.getById(memberId);
            if (entity.getUserId() == null) {
                return;
            }
            userSpaceService.delete(entity.getUserId(), entity.getSpaceId());
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateMember(UpdateMemberRo data) {
        log.info("编辑成员信息");
        Long memberId = data.getMemberId();
        MemberEntity member = getById(memberId);
        ExceptionUtil.isNotNull(member, NOT_EXIST_MEMBER);
        if (StrUtil.isNotBlank(data.getMemberName())) {
            this.updateMember(memberId, UpdateMemberOpRo.builder().memberName(data.getMemberName()).build());
        }
        List<Long> teamIds = data.getTeamIds();
        if (CollUtil.isNotEmpty(teamIds)) {
            //传递过空，判断是否当前成员有所属部门
            ExceptionUtil.isFalse(data.getTeamIds().contains(0L), UPDATE_MEMBER_TEAM_ERROR);
        }
        else {
            teamIds = new ArrayList<>();
            Long rootTeamId = teamMapper.selectRootIdBySpaceId(member.getSpaceId());
            teamIds.add(rootTeamId);
        }
        //成员原归属部门列表,包含根部门
        List<Long> originTeams = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
        //并集，下面过滤出真实操作的ID
        List<Long> unionTeamList = (List<Long>) CollUtil.union(teamIds, originTeams);
        //新增集合,差集
        List<Long> addTeamList = (List<Long>) CollUtil.disjunction(unionTeamList, originTeams);
        //删除集合,差集
        List<Long> removeTeamList = (List<Long>) CollUtil.disjunction(unionTeamList, teamIds);
        if (CollUtil.isNotEmpty(addTeamList)) {
            iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId), addTeamList);
        }
        if (CollUtil.isNotEmpty(removeTeamList)) {
            boolean dmrFlag = SqlHelper.retBool(teamMemberRelMapper.deleteByTeamIdsAndMemberId(memberId, removeTeamList));
            ExceptionUtil.isTrue(dmrFlag, UPDATE_MEMBER_ERROR);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateMemberByTeamId(String spaceId, List<Long> memberIds, List<Long> teamIds) {
        log.info("根组织下分配成员小组");
        //检查调整后的部门是否有重复的，重复的则排除掉
        Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
        teamMemberRelMapper.deleteBatchMemberByTeams(memberIds, rootTeamId);
        //查询成员所属部门，包括根部门
        List<TeamMemberRelEntity> tmrList = teamMemberRelMapper.selectByMemberIds(memberIds);
        Map<Long, List<Long>> toAddMap = new LinkedHashMap<>(memberIds.size());
        memberIds.forEach(memberId -> {
            //成员已关联的部门
            List<TeamMemberRelEntity> memTeamList = tmrList.stream().filter(e -> e.getMemberId().equals(memberId)).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(memTeamList)) {
                Set<Long> belongTeamIds = memTeamList.stream().collect(Collectors.groupingBy(TeamMemberRelEntity::getTeamId)).keySet();
                List<Long> filters = teamIds.stream().filter(i -> !belongTeamIds.contains(i)).collect(Collectors.toList());
                toAddMap.put(memberId, filters);
            }
            else {
                toAddMap.put(memberId, teamIds);
            }
        });
        //过滤不冗余的数据，包括成员与部门的重复关联插入
        CollUtil.forEach(toAddMap, (key, value, index) -> {
            if (CollUtil.isNotEmpty(value)) {
                iTeamMemberRelService.addMemberTeams(Collections.singletonList(key), CollUtil.newArrayList(value));
            }
        });
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchDeleteMemberFromTeam(String spaceId, List<Long> memberIds, Long teamId) {
        log.info("指定部门批量删除成员");
        //如果成员没有所属部门，则重新关联根部门
        List<TeamMemberRelEntity> tmrEntities = teamMemberRelMapper.selectByMemberIds(memberIds);
        List<Long> needRelateRoots = new ArrayList<>();
        for (Long memberId : memberIds) {
            List<TeamMemberRelEntity> memTeamList = CollUtil.filterNew(tmrEntities, (entity) -> entity.getMemberId().equals(memberId));
            Set<Long> belongTeamIds = memTeamList.stream().collect(Collectors.groupingBy(TeamMemberRelEntity::getTeamId)).keySet();
            if (belongTeamIds.size() == 1) {
                needRelateRoots.add(memberId);
            }
        }
        boolean flag = SqlHelper.retBool(teamMemberRelMapper.deleteBatchMemberByTeams(memberIds, teamId));
        ExceptionUtil.isTrue(flag, DELETE_MEMBER_ERROR);
        if (CollUtil.isNotEmpty(needRelateRoots)) {
            //关联根部门
            Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
            iTeamMemberRelService.addMemberTeams(needRelateRoots, Collections.singletonList(rootTeamId));
        }
        Long userId = SessionContext.getUserId();
        TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVED_FROM_GROUP, memberIds, userId, spaceId, Dict.create().set(TEAM_NAME, teamMapper.selectTeamNameById(teamId)).set(TEAM_ID, teamId)));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByMemberIds(List<Long> memberIds) {
        baseMapper.deleteBatchByIds(memberIds);
        // 从组织单元逻辑删除成员单位
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
    public void batchDeleteMemberFromSpace(String spaceId, List<Long> memberIds, boolean mailNotify) {
        if (CollUtil.isEmpty(memberIds)) {
            return;
        }
        log.info("从空间里批量彻底删除成员");
        //删除缓存
        List<Long> userIds = baseMapper.selectUserIdsByMemberIds(memberIds);
        if (CollUtil.isNotEmpty(userIds)) {
            for (Long userId : userIds) {
                if (userId != null) {
                    userActiveSpaceService.delete(userId);
                    userSpaceService.delete(userId, spaceId);
                }
            }
            // 分享过的节点分享链接收回，关闭分享
            List<String> nodeIds = nodeShareSettingMapper.selectNodeIdsByUpdatersAndSpaceId(userIds, spaceId);
            if (CollUtil.isNotEmpty(nodeIds)) {
                // 禁用节点分享
                nodeShareSettingMapper.disableByNodeIds(nodeIds);
                // 发布节点分享关闭事件
                SpringContextHolder.getApplicationContext().publishEvent(new NodeShareDisableEvent(this, nodeIds));
                TaskManager.me().execute(() -> NotificationManager.me().nodeShareNotify(spaceId, nodeIds, false));
            }
        }
        List<MemberEntity> memberEntities = baseMapper.selectBatchIds(memberIds);
        //邀请链接失效，并且一并删除其创建的公开链接
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
        // 删除成员关联部门
        iTeamMemberRelService.removeByMemberIds(memberIds);
        // delete the associated role
        iRoleMemberService.removeByRoleMemberIds(memberIds);
        // 删除成员
        removeByMemberIds(memberIds);
        // 从空间管理角色里删除
        iSpaceRoleService.batchRemoveByMemberIds(spaceId, memberIds);
        // 发送通知邮件
        if (mailNotify) {
            String spaceName = iSpaceService.getNameBySpaceId(spaceId);
            List<String> emails = baseMapper.selectEmailByBatchMemberId(memberIds);
            Dict dict = Dict.create();
            dict.set("SPACE_NAME", spaceName);
            dict.set("YEARS", LocalDate.now().getYear());
            Dict mapDict = Dict.create();
            mapDict.set("SPACE_NAME", spaceName);
            final String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
            List<UserLangDTO> emailsWithLang = iUserService.getLangByEmails(defaultLang, emails);
            List<MailWithLang> tos = emailsWithLang.stream()
                    .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()))
                    .collect(Collectors.toList());
            TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_REMOVE_MEMBER, mapDict, dict, tos));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateActiveStatus(String spaceId, Long userId) {
        log.info("将指定的空间更改为活跃状态");
        // 最近活跃空间一致则直接返回
        String activeSpaceId = baseMapper.selectActiveSpaceByUserId(userId);
        if (spaceId.equals(activeSpaceId)) {
            return;
        }
        // 修改空间的活跃状态
        baseMapper.updateInactiveStatusByUserId(userId);
        baseMapper.updateActiveStatusByUserIdAndSpaceId(userId, spaceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void preDelBySpaceId(String spaceId, Long userId) {
        log.info("将空间内除了主管理员外的成员删除");
        List<Long> userIds = baseMapper.selectUserIdBySpaceIds(Collections.singletonList(spaceId));
        if (CollUtil.isNotEmpty(userIds)) {
            userIds.remove(userId);
            userIds.forEach(id -> {
                userActiveSpaceService.delete(id);
                userSpaceService.delete(id, spaceId);
            });
            NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(userIds).build());
        }
        baseMapper.delBySpaceIds(Collections.singletonList(spaceId), userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UploadParseResultVO parseExcelFile(String spaceId, MultipartFile multipartFile) {
        // 订阅限制
        // iSubscriptionService.checkSeat(spaceId);
        // 操作用户在空间的信息
        UserSpaceDto userSpaceDto = LoginContext.me().getUserSpaceDto(spaceId);
        UploadParseResultVO resultVo = new UploadParseResultVO();
        try {
            // 获取统计数量
            int currentMemberCount = (int) SqlTool.retCount(staticsMapper.countMemberBySpaceId(spaceId));
            // long defaultMaxMemberCount = iSubscriptionService.getPlanSeats(spaceId);
            // 使用对象一行行读取数据，设置表头行数，第4行开始读取数据，异步读取
            UploadDataListener listener = new UploadDataListener(spaceId, this, -1, currentMemberCount)
                    .resources(userSpaceDto.getResourceCodes());
            EasyExcel.read(multipartFile.getInputStream(), listener).sheet().headRowNumber(3).doRead();
            // 获取解析存储记录
            resultVo.setRowCount(listener.getRowCount());
            resultVo.setSuccessCount(listener.getSuccessCount());
            resultVo.setErrorCount(listener.getErrorCount());
            resultVo.setErrorList(listener.getErrorList());
            // 保存错误信息到数据库
            AuditUploadParseRecordEntity record = new AuditUploadParseRecordEntity();
            record.setSpaceId(spaceId);
            record.setRowSize(listener.getRowCount());
            record.setSuccessCount(listener.getSuccessCount());
            record.setErrorCount(listener.getErrorCount());
            record.setErrorMsg(JSONUtil.toJsonStr(listener.getErrorList()));
            auditUploadParseRecordMapper.insert(record);
            // 发送邀请邮件
            this.batchSendInviteEmailOnUpload(spaceId, userSpaceDto.getMemberId(), listener.getSendInviteEmails());
            // 发送通知邮件
            this.batchSendInviteNotifyEmailOnUpload(spaceId, userSpaceDto.getMemberId(), listener.getSendNotifyEmails());
            // 发送邀请通知，异步操作
            Long userId = userSpaceDto.getUserId();
            TaskManager.me().execute(() -> this.sendInviteNotification(userId, listener.getMemberIds(), spaceId, false));
        }
        catch (IOException e) {
            e.printStackTrace();
            log.error("无法读取文件", e);
            throw new BusinessException(EXCEL_CAN_READ_ERROR);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new BusinessException("解析文件失败，请下载模板导入");
        }
        return resultVo;
    }

    /**
     * 批量发送邀请邮箱到指定邮箱地址
     *
     * @param spaceId 空间ID
     * @param fromMemberId 发送者（成员ID）
     * @param inviteEmails 邮箱地址
     */
    private void batchSendInviteEmailOnUpload(String spaceId, Long fromMemberId, List<String> inviteEmails) {
        // 发送邀请邮件
        if (CollUtil.isNotEmpty(inviteEmails)) {
            String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
            List<UserLangDTO> emailsWithLang = iUserService.getLangByEmails(defaultLang, inviteEmails);
            for (UserLangDTO emailWithLang : emailsWithLang) {
                TaskManager.me().execute(() -> this.sendInviteEmail(emailWithLang.getLocale(), spaceId, fromMemberId, emailWithLang.getEmail()));
            }
        }
    }

    /**
     * 批量发送邀请通知邮箱到指定邮箱地址
     *
     * @param spaceId 空间ID
     * @param fromMemberId 发送者（成员ID）
     * @param notifyEmails 邮箱地址
     */
    private void batchSendInviteNotifyEmailOnUpload(String spaceId, Long fromMemberId, List<String> notifyEmails) {
        // 发送邀请告知邮件
        if (CollUtil.isNotEmpty(notifyEmails)) {
            String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
            List<UserLangDTO> emailsWithLang = iUserService.getLangByEmails(defaultLang, notifyEmails);
            for (UserLangDTO emailWithLang : emailsWithLang) {
                TaskManager.me().execute(() -> sendUserInvitationNotifyEmail(emailWithLang.getLocale(), spaceId, fromMemberId, emailWithLang.getEmail()));
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long saveUploadData(String spaceId, UploadDataDto uploadData, List<String> inviteEmails,
            List<String> notifyEmails, boolean teamCreatable) {
        log.info("保存模板数据:{}", JSONUtil.toJsonStr(uploadData));
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
        // 查询是否存在用户绑定此邮箱
        UserEntity user = iUserService.getByEmail(uploadData.getEmail());
        boolean historyMember = false;
        if (user != null) {
            // 通知邮件
            notifyEmails.add(uploadData.getEmail());
            // 邮箱绑定了用户，直接激活成员
            Long userId = user.getId();
            member.setUserId(userId);
            member.setMemberName(StrUtil.isBlank(uploadData.getName()) ? user.getNickName() : StrUtil.subWithLength(uploadData.getName(), 0, 32));
            member.setIsActive(true);
            // 是否用户已在空间
            MemberEntity existInSpace = baseMapper.selectByUserIdAndSpaceIdIgnoreDelete(userId, spaceId);
            if (existInSpace != null) {
                memberId = existInSpace.getId();
                member.setId(existInSpace.getId());
                historyMember = true;
            }
            // 令主动加入空间的申请失效
            spaceApplyMapper.invalidateTheApply(ListUtil.toList(userId), spaceId, InviteType.FILE_IMPORT.getType());
        }
        else {
            // 邮箱没有绑定任何用户，未激活状态，待用户接受邀请注册进入空间
            member.setMemberName(StrUtil.isBlank(uploadData.getName()) ? "未命名" : StrUtil.subWithLength(uploadData.getName(), 0, 32));
            member.setIsActive(false);
            // 邀请邮件
            inviteEmails.add(uploadData.getEmail());
        }
        if (historyMember) {
            // 逻辑删除恢复
            restoreMember(member);
            // 恢复组织单元
            iUnitService.restoreMemberUnit(spaceId, Collections.singletonList(member.getId()));
        }
        else {
            this.batchCreate(spaceId, Collections.singletonList(member));
        }
        // 处理关联部门
        if (StrUtil.isNotBlank(uploadData.getTeam())) {
            // 填写了部门
            List<TeamMemberRelEntity> dmrEntities = new ArrayList<>();
            // 逗号截取部门
            List<String> teamNamePaths = StrUtil.splitTrim(Convert.toDBC(uploadData.getTeam().trim()), ',');
            // 根部门
            Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
            // 遍历查找是否存在
            for (String teamNamePath : teamNamePaths) {
                if (StrUtil.isBlank(teamNamePath)) {
                    // 空值直接跳过，关联到根部门下
                    TeamMemberRelEntity dmr = new TeamMemberRelEntity();
                    dmr.setId(IdWorker.getId());
                    dmr.setMemberId(memberId);
                    dmr.setTeamId(rootTeamId);
                    dmrEntities.add(dmr);
                    continue;
                }
                log.debug("截取前:{}", teamNamePath);
                // 截取是有序的，一级-二级-三级
                List<String> teamNames = StrUtil.splitTrim(teamNamePath, '-');
                log.info("截取后:{}", teamNames);
                // 根据部门路径查找部门是否存在
                Long teamId = iTeamService.getByTeamNamePath(spaceId, teamNames);
                if (teamId != null) {
                    // 存在，直接关联上
                    TeamMemberRelEntity dmr = new TeamMemberRelEntity();
                    dmr.setId(IdWorker.getId());
                    dmr.setMemberId(memberId);
                    dmr.setTeamId(teamId);
                    dmrEntities.add(dmr);
                }
                else {
                    // 不存在，如果有管理小组权限则创建，没有则关联到根部门下
                    if (teamCreatable) {
                        // 有权限，创建小组并关联员工
                        List<Long> teamIds = iTeamService.createBatchByTeamName(spaceId, rootTeamId, teamNames);
                        for (Long id : teamIds) {
                            TeamMemberRelEntity dmr = new TeamMemberRelEntity();
                            dmr.setId(IdWorker.getId());
                            dmr.setMemberId(memberId);
                            dmr.setTeamId(id);
                            dmrEntities.add(dmr);
                        }
                    }
                    else {
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
        }
        else {
            // 没填部门，直接绑定到根部门下
            Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
            iTeamMemberRelService.addMemberTeams(Collections.singletonList(memberId), Collections.singletonList(rootTeamId));
        }
        return memberId;
    }

    @Override
    public void sendInviteNotification(Long fromUserId, List<Long> invitedMemberIds, String spaceId, Boolean isToFromUser) {
        // 发送消息通知
        if (ObjectUtil.isNotEmpty(invitedMemberIds)) {
            NotificationManager.me().playerNotify(NotificationTemplateId.INVITE_MEMBER_TO_ADMIN, invitedMemberIds, fromUserId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, invitedMemberIds));
            NotificationManager.me().playerNotify(NotificationTemplateId.INVITE_MEMBER_TO_USER, invitedMemberIds, fromUserId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, invitedMemberIds));
            if (isToFromUser) {
                NotificationManager.me().playerNotify(NotificationTemplateId.INVITE_MEMBER_TO_MYSELF, ListUtil.toList(fromUserId), 0L, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, invitedMemberIds));
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createMember(Long userId, String spaceId, Long teamId) {
        log.info("创建成员");
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
        // 查询用户是否曾加入过该空间
        MemberEntity historyMember = baseMapper.selectByUserIdAndSpaceIdIgnoreDelete(userId, spaceId);
        if (historyMember != null && historyMember.getIsDeleted()) {
            // 恢复历史成员
            member.setId(historyMember.getId());
            restoreMember(member);
            // 恢复组织单元
            iUnitService.restoreMemberUnit(spaceId, Collections.singletonList(member.getId()));
        }
        else {
            // 首次加入，创建成员
            member.setId(IdWorker.getId());
            this.batchCreate(spaceId, Collections.singletonList(member));
        }
        if (teamId == null) {
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        // 创建部门与成员绑定
        iTeamMemberRelService.addMemberTeams(Collections.singletonList(member.getId()), Collections.singletonList(teamId));
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
    public List<MemberDto> getInactiveMemberDtoByMobile(String mobile) {
        return baseMapper.selectInactiveMemberByMobile(mobile);
    }

    @Override
    public List<MemberDto> getInactiveMemberDtoByEmail(String email) {
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
    public List<SearchMemberResultVo> getByName(String spaceId, String keyword, String highlightClassName) {

        // 查询本地符合条件的成员
        List<SearchMemberDto> searchMembers = baseMapper.selectByName(spaceId, keyword);
        List<SearchMemberResultVo> results = searchMembers.stream()
                .map(searchMember -> {
                    SearchMemberResultVo result = new SearchMemberResultVo();
                    result.setMemberId(searchMember.getMemberId());
                    result.setOriginName(searchMember.getMemberName());
                    result.setMemberName(InformationUtil.keywordHighlight(searchMember.getMemberName(), keyword, highlightClassName));
                    result.setAvatar(searchMember.getAvatar());
                    result.setIsActive(searchMember.getIsActive());
                    if (CollUtil.isNotEmpty(searchMember.getTeam())) {
                        List<String> teamNames = CollUtil.getFieldValues(searchMember.getTeam(), "teamName", String.class);
                        result.setTeam(CollUtil.join(teamNames, "｜"));
                    }

                    return result;
                }).collect(Collectors.toList());

        SocialTenantBindEntity bindEntity = socialTenantBindService.getBySpaceId(spaceId);
        SocialTenantEntity socialTenantEntity = Optional.ofNullable(bindEntity)
                .map(bind -> socialTenantService
                        .getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId()))
                .orElse(null);
        if (Objects.nonNull(socialTenantEntity)
                && SocialPlatformType.WECOM.getValue().equals(socialTenantEntity.getPlatform())
                && SocialAppType.ISV.getType() == socialTenantEntity.getAppType()) {
            // 如果是企业微信服务商绑定的空间站，需要查询企微通讯录中符合条件的用户
            String suiteId = socialTenantEntity.getAppId();
            String authCorpId = socialTenantEntity.getTenantId();
            Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
            Integer agentId = agent.getAgentId();
            try {
                WxCpTpContactSearchResp.QueryResult queryResult = socialCpIsvService.search(suiteId, authCorpId, agentId, keyword, 1);
                List<String> cpUserIds = queryResult.getUser().getUserid();
                if (CollUtil.isNotEmpty(cpUserIds)) {
                    // 将其中未改名的成员填充至返回结果
                    List<SearchMemberDto> socialMembers = baseMapper.selectByNameAndOpenIds(spaceId, cpUserIds);
                    List<SearchMemberResultVo> socialResults = socialMembers.stream()
                            .map(socialMember -> {
                                SearchMemberResultVo result = new SearchMemberResultVo();
                                result.setMemberId(socialMember.getMemberId());
                                result.setOriginName(socialMember.getMemberName());
                                // 企微用户名称需要前端渲染，搜索结果不返回高亮
                                result.setMemberName(socialMember.getMemberName());
                                result.setAvatar(socialMember.getAvatar());
                                if (CollUtil.isNotEmpty(socialMember.getTeam())) {
                                    List<String> teamNames = CollUtil.getFieldValues(socialMember.getTeam(), "teamName", String.class);
                                    result.setTeam(CollUtil.join(teamNames, "｜"));
                                }

                                return result;
                            }).collect(Collectors.toList());

                    results.addAll(socialResults);
                }
            }
            catch (WxErrorException ex) {
                log.error("Failed to search users from wecom isv.", ex);
            }
        }

        // get all member's ids
        List<Long> memberIds = results.stream().map(SearchMemberResultVo::getMemberId).collect(Collectors.toList());
        // handle member's team name，get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (SearchMemberResultVo member : results) {
            if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
                member.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
            }
        }

        return results;

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
        log.info("空间站恢复成员");
        if (CollUtil.isEmpty(memberIds)) {
            return;
        }
        // 恢复成员
        batchResetIsDeletedAndUserIdByIds(memberIds);
        // todo 恢复部门迁移到此处？
        // 从组织单元恢复成员
        iUnitService.batchUpdateIsDeletedBySpaceIdAndRefId(spaceId, memberIds, UnitType.MEMBER, false);
    }

    @Override
    public List<SearchMemberVo> getLikeMemberName(String spaceId, String keyword, Boolean filter, String highlightClassName) {

        // 查询本地符合条件的成员
        List<SearchMemberVo> searchMembers = baseMapper.selectLikeMemberName(spaceId, keyword, filter);
        searchMembers.forEach(vo -> {
            vo.setOriginName(vo.getMemberName());
            vo.setMemberName(InformationUtil.keywordHighlight(vo.getMemberName(), keyword, highlightClassName));
        });

        SocialTenantBindEntity bindEntity = socialTenantBindService.getBySpaceId(spaceId);
        SocialTenantEntity socialTenantEntity = Optional.ofNullable(bindEntity)
                .map(bind -> socialTenantService
                        .getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId()))
                .orElse(null);
        if (Objects.nonNull(socialTenantEntity)
                && SocialPlatformType.WECOM.getValue().equals(socialTenantEntity.getPlatform())
                && SocialAppType.ISV.getType() == socialTenantEntity.getAppType()) {
            // 如果是企业微信服务商绑定的空间站，需要查询企微通讯录中符合条件的用户
            String suiteId = socialTenantEntity.getAppId();
            String authCorpId = socialTenantEntity.getTenantId();
            Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
            Integer agentId = agent.getAgentId();
            try {
                WxCpTpContactSearchResp.QueryResult queryResult = socialCpIsvService.search(suiteId, authCorpId, agentId, keyword, 1);
                List<String> cpUserIds = queryResult.getUser().getUserid();
                if (CollUtil.isNotEmpty(cpUserIds)) {
                    // 将其中未改名的成员填充至返回结果
                    List<SearchMemberVo> socialMembers = baseMapper.selectLikeMemberNameByOpenIds(spaceId, cpUserIds, filter);
                    socialMembers.forEach(vo -> {
                        vo.setOriginName(vo.getMemberName());
                        // 企微用户名称需要前端渲染，搜索结果不返回高亮
                        vo.setMemberName(vo.getMemberName());
                    });

                    searchMembers.addAll(socialMembers);
                }
            }
            catch (WxErrorException ex) {
                log.error("Failed to search users from wecom isv.", ex);
            }
        }

        return searchMembers;

    }

    @Override
    public void handleMemberTeamInfo(MemberInfoVo memberInfoVo) {
        String spaceId = memberMapper.selectSpaceIdByMemberId(memberInfoVo.getMemberId());
        List<Long> memberIds = CollUtil.newArrayList(memberInfoVo.getMemberId());
        // handle member's team name, get full hierarchy team path name
        Map<Long, List<MemberTeamPathInfo>> memberTeamPathInfosMap = iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        if (memberTeamPathInfosMap.containsKey(memberInfoVo.getMemberId())) {
            memberInfoVo.setTeamData(memberTeamPathInfosMap.get(memberInfoVo.getMemberId()));
        }
    }
}
