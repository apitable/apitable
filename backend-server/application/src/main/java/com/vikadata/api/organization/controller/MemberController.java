package com.vikadata.api.organization.controller;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.notification.annotation.Notification;
import com.vikadata.api.shared.util.page.PageObjectParam;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.component.Auth0Service;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.notification.NotificationManager;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.shared.util.page.PageHelper;
import com.vikadata.api.shared.holder.SpaceHolder;
import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.model.SpaceGlobalFeature;
import com.vikadata.api.organization.ro.DeleteBatchMemberRo;
import com.vikadata.api.organization.ro.DeleteMemberRo;
import com.vikadata.api.organization.ro.InviteMemberAgainRo;
import com.vikadata.api.organization.ro.InviteMemberRo;
import com.vikadata.api.organization.ro.InviteRo;
import com.vikadata.api.organization.ro.TeamAddMemberRo;
import com.vikadata.api.organization.ro.UpdateMemberOpRo;
import com.vikadata.api.organization.ro.UpdateMemberRo;
import com.vikadata.api.organization.ro.UpdateMemberTeamRo;
import com.vikadata.api.organization.ro.UploadMemberTemplateRo;
import com.vikadata.api.organization.vo.MemberInfoVo;
import com.vikadata.api.organization.vo.MemberPageVo;
import com.vikadata.api.organization.vo.MemberUnitsVo;
import com.vikadata.api.organization.vo.RoleVo;
import com.vikadata.api.organization.vo.SearchMemberVo;
import com.vikadata.api.organization.vo.UploadParseResultVO;
import com.vikadata.api.enterprise.billing.service.IBlackListService;
import com.vikadata.api.organization.enums.DeleteMemberType;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.mapper.TeamMapper;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.IRoleService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.space.mapper.SpaceMapper;
import com.vikadata.api.space.model.SpaceUpdateOperate;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.api.user.model.UserLangDTO;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.enterprise.common.afs.AfsCheckService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.shared.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;
import static com.vikadata.api.organization.enums.OrganizationException.DELETE_MEMBER_PARAM_ERROR;
import static com.vikadata.api.organization.enums.OrganizationException.DELETE_SPACE_ADMIN_ERROR;
import static com.vikadata.api.organization.enums.OrganizationException.INVITE_EMAIL_HAS_ACTIVE;
import static com.vikadata.api.organization.enums.OrganizationException.INVITE_EMAIL_NOT_FOUND;
import static com.vikadata.api.organization.enums.OrganizationException.INVITE_TOO_OFTEN;
import static com.vikadata.api.organization.enums.OrganizationException.NOT_EXIST_MEMBER;
import static com.vikadata.api.base.enums.ParameterException.NO_ARG;
import static com.vikadata.core.constants.RedisConstants.GENERAL_LOCKED;

@RestController
@Api(tags = "Contact Member Api")
@ApiResource(path = "/org/member")
@Slf4j
public class MemberController {

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private AfsCheckService afsCheckService;

    @Resource
    private IBlackListService iBlackListService;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private Auth0Service auth0Service;

    @Resource
    private IUserService iUserService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private ServerProperties serverProperties;

    @GetResource(path = "/search")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "className", value = "the highlighting style", dataTypeClass = String.class, paramType = "query", example = "highLight"),
            @ApiImplicitParam(name = "filter", value = "whether to filter unadded members", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
            @ApiImplicitParam(name = "keyword", value = "keyword", required = true, dataTypeClass = String.class, paramType = "query", example = "Luck")
    })
    @ApiOperation(value = "Fuzzy Search Members", notes = "Fuzzy Search Members")
    public ResponseData<List<SearchMemberVo>> getMembers(@RequestParam(name = "keyword") String keyword,
            @RequestParam(value = "filter", required = false, defaultValue = "true") Boolean filter,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {

        if (CharSequenceUtil.isBlank(keyword)) {
            return ResponseData.success(Collections.emptyList());
        }

        String spaceId = LoginContext.me().getSpaceId();
        List<SearchMemberVo> resultList = iMemberService.getLikeMemberName(spaceId, CharSequenceUtil.trim(keyword), filter, className);

        return ResponseData.success(resultList);

    }

    @GetResource(path = "/list")
    @ApiOperation(value = "Query the team's members", notes = "Query all the members of the department, including the members of the sub department.if root team can lack teamId, teamId default 0.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "teamId", value = "team id. if root team can lack teamId, teamId default 0.", dataTypeClass = String.class, paramType = "query", example = "0")
    })
    public ResponseData<List<MemberInfoVo>> getMemberList(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceHolder.setGlobalFeature(feature);
        if (teamId == 0) {
            // query the members of the root department
            List<MemberInfoVo> resultList = memberMapper.selectMembersByRootTeamId(spaceId);
            if (CollUtil.isNotEmpty(resultList)) {
                // handle member's team name, get full hierarchy team names
                iTeamService.handleListMemberTeams(resultList, spaceId);
            }
            return ResponseData.success(resultList);
        }
        // query the ids of all sub departments
        List<Long> teamIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        List<MemberInfoVo> resultList = memberMapper.selectMembersByTeamId(teamIds);
        if (CollUtil.isNotEmpty(resultList)) {
            // handle member's team name, get full hierarchy team names
            iTeamService.handleListMemberTeams(resultList, spaceId);
        }
        return ResponseData.success(resultList);
    }

    @GetResource(path = "/page")
    @ApiOperation(value = "Page query the team's member", notes = "Query all the members of the department, including the members of the sub department. The query must be paging not full query.\n" + PAGE_DESC, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "teamId", value = "team id. if root team can lack teamId, teamId default 0.", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "isActive", value = "whether to filter unadded members", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "page's parameter", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<MemberPageVo>> readPage(
            @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId,
            @RequestParam(name = "isActive", required = false) Integer isActive,
            @PageObjectParam Page page) {
        String spaceId = LoginContext.me().getSpaceId();
        if (teamId == 0) {
            // query the members of the root department
            IPage<MemberPageVo> pageResult = teamMapper.selectMembersByRootTeamId(page, spaceId, isActive);
            if (ObjectUtil.isNotNull(pageResult)) {
                // handle member's team name, get full hierarchy team names
                iTeamService.handlePageMemberTeams(pageResult, spaceId);
            }
            return ResponseData.success(PageHelper.build(pageResult));
        }
        List<Long> teamIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        IPage<MemberPageVo> resultList = teamMapper.selectMemberPageByTeamId(page, teamIds, isActive);
        if (ObjectUtil.isNotNull(resultList)) {
            // handle member's team name, get full hierarchy team names
            iTeamService.handlePageMemberTeams(resultList, spaceId);
        }
        return ResponseData.success(PageHelper.build(resultList));
    }

    @Deprecated
    @GetResource(path = "/checkEmail")
    @ApiOperation(value = "Check whether email in space", notes = "Check whether email in space", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "email", value = "email", dataTypeClass = String.class, required = true, paramType = "query", example = "xxx@admin.com")
    })
    public ResponseData<Boolean> checkEmailInSpace(@RequestParam("email") String email) {
        String spaceId = LoginContext.me().getSpaceId();
        int count = memberMapper.selectCountBySpaceIdAndEmail(spaceId, email);
        return ResponseData.success(count > 0);
    }

    @GetResource(path = "/read")
    @ApiOperation(value = "Get member's detail info", notes = "Get member's detail info", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "memberId", value = "member id", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "uuid", value = "user uuid", dataTypeClass = String.class, paramType = "query", example = "1")
    })
    public ResponseData<MemberInfoVo> read(@RequestParam(value = "memberId", required = false) Long memberId,
            @RequestParam(value = "uuid", required = false) String uuid) {
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(memberId) || StrUtil.isNotBlank(uuid), NO_ARG);
        if (StrUtil.isNotBlank(uuid)) {
            String spaceId = LoginContext.me().getSpaceId();
            List<Long> userIds = userMapper.selectIdByUuidList(Collections.singletonList(uuid));
            ExceptionUtil.isNotEmpty(userIds, NOT_EXIST_MEMBER);
            memberId = memberMapper.selectIdByUserIdAndSpaceId(userIds.get(0), spaceId);
            ExceptionUtil.isNotNull(memberId, NOT_EXIST_MEMBER);
        }
        MemberInfoVo memberInfoVo = memberMapper.selectInfoById(memberId);
        ExceptionUtil.isNotNull(memberInfoVo, NOT_EXIST_MEMBER);
        // handle member's team name, get full hierarchy team path name
        iMemberService.handleMemberTeamInfo(memberInfoVo);
        List<RoleVo> roleVos = iRoleService.getRoleVosByMemberId(memberId);
        memberInfoVo.setRoles(roleVos);
        return ResponseData.success(memberInfoVo);
    }

    @GetResource(path = "/units")
    @ApiOperation(value = "Query the units which a user belongs in space", notes = "Query the units which a user belongs, include self", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<MemberUnitsVo> getUnits() {
        Long memberId = LoginContext.me().getMemberId();
        List<Long> unitIds = iMemberService.getUnitsByMember(memberId);
        MemberUnitsVo unitsVo = MemberUnitsVo.builder().unitIds(unitIds).build();
        return ResponseData.success(unitsVo);
    }

    @PostResource(path = "/sendInvite", tags = "INVITE_MEMBER")
    @ApiOperation(value = "Send an email to invite members",
            notes = "Send an email to invite. The email is automatically bound to the platform user. The invited member will be in the state to be activated, and will not take effect until the user self activates.",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<MemberUnitsVo> inviteMember(@RequestBody @Valid InviteRo data) {
        // human verification
        afsCheckService.noTraceCheck(data.getData());
        // space id be invited
        String spaceId = LoginContext.me().getSpaceId();
        // whether in black list
        iBlackListService.checkBlackSpace(spaceId);
        Long userId = SessionContext.getUserId();
        // check whether space can invite user
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        List<InviteMemberRo> inviteMembers = data.getInvite();
        MemberUnitsVo unitsVo = MemberUnitsVo.builder().build();
        // get invited emails
        List<String> inviteEmails = inviteMembers.stream()
                .map(InviteMemberRo::getEmail)
                .filter(StrUtil::isNotBlank).collect(Collectors.toList());
        if (CollUtil.isEmpty(inviteEmails)) {
            // without email, response success directly
            return ResponseData.success(unitsVo);
        }
        // invite new members
        List<Long> unitIds = iMemberService.emailInvitation(userId, spaceId, inviteEmails);
        unitsVo.setUnitIds(unitIds);
        return ResponseData.success(unitsVo);
    }

    @PostResource(path = "/sendInviteSingle", tags = "INVITE_MEMBER")
    @ApiOperation(value = "Again send an email to invite members", notes = "If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> inviteMemberSingle(@RequestBody @Valid InviteMemberAgainRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check black space
        iBlackListService.checkBlackSpace(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // Again send an email to invite members
        MemberEntity member = memberMapper.selectBySpaceIdAndEmail(spaceId, data.getEmail());
        ExceptionUtil.isNotNull(member, INVITE_EMAIL_NOT_FOUND);
        ExceptionUtil.isFalse(member.getIsActive(), INVITE_EMAIL_HAS_ACTIVE);
        Long memberId = LoginContext.me().getMemberId();
        // Limit the frequency for 10 minutes
        String lockKey = StrUtil.format(GENERAL_LOCKED, "invite:email", data.getEmail());
        BoundValueOperations<String, String> ops = redisTemplate.boundValueOps(lockKey);
        ExceptionUtil.isNull(ops.get(), INVITE_TOO_OFTEN);
        ops.set("", 10, TimeUnit.MINUTES);
        String lang = LocaleContextHolder.getLocale().toLanguageTag();
        UserLangDTO userLangDTO = userMapper.selectLocaleByEmail(data.getEmail());
        if (ObjectUtil.isNotNull(userLangDTO) && StrUtil.isNotBlank(userLangDTO.getLocale())) {
            lang = userLangDTO.getLocale();
        }
        if (auth0Service.isOpen()) {
            UserEntity user = iUserService.getByEmail(data.getEmail());
            if (user == null) {
                String returnUrl = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() + "/invitation/callback";
                String link = auth0Service.createUserInvitationLink(data.getEmail(), returnUrl);
                iMemberService.sendUserInvitationEmail(lang, spaceId, memberId, link, data.getEmail());
            } else {
                String link = String.format("%s/workbench?spaceId=%s", constProperties.getServerDomain(), spaceId);
                iMemberService.sendUserInvitationEmail(lang, spaceId, memberId, link, data.getEmail());
            }
        } else {
            iMemberService.sendInviteEmail(lang, spaceId, memberId, data.getEmail());
        }
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.ASSIGNED_TO_GROUP)
    @PostResource(path = "/addMember", tags = "ADD_MEMBER")
    @ApiOperation(value = "Add member", notes = "When adding new members, they can only be selected from within the organization structure and can be transferred by department", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> addMember(@RequestBody @Valid TeamAddMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.addTeamMember(spaceId, data);
        return ResponseData.success();
    }

    @PostResource(path = "/update")
    @ApiOperation(value = "Edit self member information", notes = "Edit self member information", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> update(@RequestBody @Valid UpdateMemberOpRo opRo) {
        Long memberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.updateMember(memberId, opRo);
        return ResponseData.success();
    }

    @PostResource(path = "/updateInfo", tags = "UPDATE_MEMBER")
    @ApiOperation(value = "Edit member info", notes = "Edit member info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateInfo(@RequestBody @Valid UpdateMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.updateMember(data);
        return ResponseData.success();
    }

    @PostResource(path = "/updateMemberTeam", tags = "UPDATE_MEMBER")
    @ApiOperation(value = "Update team", notes = "assign members to departments", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateTeam(@RequestBody @Valid UpdateMemberTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        List<Long> memberIds = data.getMemberIds();
        List<Long> teamIds = data.getNewTeamIds();
        iMemberService.updateMemberByTeamId(spaceId, memberIds, teamIds);
        return ResponseData.success();
    }

    @PostResource(path = "/delete", method = { RequestMethod.DELETE }, tags = "DELETE_MEMBER")
    @ApiOperation(value = "Delete a Member", notes = "action provides two deletion modes，1.delete from organization 2. delete from team", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> deleteMember(@RequestBody @Valid DeleteMemberRo data) {
        DeleteMemberType type = DeleteMemberType.getByValue(data.getAction());
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = data.getMemberId();
        // check whether the member exists
        MemberEntity member = iMemberService.getById(memberId);
        ExceptionUtil.isNotNull(member, NOT_EXIST_MEMBER);
        if (type == DeleteMemberType.FROM_TEAM) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
            // delete member from department
            ExceptionUtil.isTrue(data.getTeamId() != null && !data.getTeamId().equals(0L), DELETE_MEMBER_PARAM_ERROR);
            iMemberService.batchDeleteMemberFromTeam(spaceId, Collections.singletonList(memberId), data.getTeamId());
        }
        else if (type == DeleteMemberType.FROM_SPACE) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
            // delete from space
            Long administrator = spaceMapper.selectSpaceMainAdmin(spaceId);
            // an administrator cannot be deleted
            ExceptionUtil.isFalse(memberId.equals(administrator), DELETE_SPACE_ADMIN_ERROR);
            iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(data.getMemberId()), true);
            // notice self
            Long userId = SessionContext.getUserId();
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_ADMIN, null, userId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, ListUtil.toList(memberId))));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_USER, ListUtil.toList(memberId), userId, spaceId, null));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVED_MEMBER_TO_MYSELF, ListUtil.toList(userId), 0L, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, ListUtil.toList(memberId))));
        }
        return ResponseData.success();
    }

    @PostResource(path = "/deleteBatch", method = { RequestMethod.DELETE }, tags = "DELETE_MEMBER")
    @ApiOperation(value = "Delete members", notes = "action provides two deletion modes，1.delete from organization 2. delete from team", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> deleteBatchMember(@RequestBody @Valid DeleteBatchMemberRo data) {
        DeleteMemberType type = DeleteMemberType.getByValue(data.getAction());
        String spaceId = LoginContext.me().getSpaceId();
        List<Long> memberIds = data.getMemberId();
        // check whether the member exists
        List<MemberEntity> members = iMemberService.listByIds(memberIds);
        ExceptionUtil.isNotEmpty(members, NOT_EXIST_MEMBER);
        if (type == DeleteMemberType.FROM_TEAM) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
            //delete members from a department in batches
            ExceptionUtil.isTrue(data.getTeamId() != null && !data.getTeamId().equals(0L), DELETE_MEMBER_PARAM_ERROR);
            iMemberService.batchDeleteMemberFromTeam(spaceId, data.getMemberId(), data.getTeamId());
        }
        else if (type == DeleteMemberType.FROM_SPACE) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
            // delete members in bulk from space
            Long administrator = spaceMapper.selectSpaceMainAdmin(spaceId);
            // administrator cannot be deleted
            ExceptionUtil.isFalse(memberIds.contains(administrator), DELETE_SPACE_ADMIN_ERROR);
            iMemberService.batchDeleteMemberFromSpace(spaceId, data.getMemberId(), true);
            // notice self
            Long userId = SessionContext.getUserId();
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_ADMIN, null, userId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, data.getMemberId())));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_USER, data.getMemberId(), userId, spaceId, null));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVED_MEMBER_TO_MYSELF, ListUtil.toList(userId), 0L, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, data.getMemberId())));
        }
        return ResponseData.success();
    }

    @GetResource(path = "/downloadTemplate", requiredPermission = false)
    @ApiOperation(value = "Download contact template", notes = "Download contact template")
    public void downloadTemplate(HttpServletResponse response) {
        log.info("generate download template");
        try {
            response.setContentType("application/vnd.ms-excel");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            // fileName is the name of the file that displays the download dialog box
            String name = "员工信息模板";
            String fileName = URLEncoder.encode(name, "UTF-8").replaceAll("\\+", "%20");
            response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
            InputStream inputStream = this.getClass().getResourceAsStream("/excel/contact_example.xlsx");
            OutputStream outputStream = response.getOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while (true) {
                assert inputStream != null;
                if ((length = inputStream.read(buffer)) <= 0) {
                    break;
                }
                outputStream.write(buffer, 0, length);
            }
            outputStream.flush();
            outputStream.close();
            inputStream.close();
        }
        catch (Exception e) {
            // reset response
            response.reset();
            throw new BusinessException("download template failure", e);
        }
    }

    @PostResource(path = "/uploadExcel", tags = "INVITE_MEMBER")
    @ApiOperation(value = "Upload employee sheet", notes = "Upload employee sheet，then parse it.")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<UploadParseResultVO> uploadExcel(UploadMemberTemplateRo data) {
        // human verification
        afsCheckService.noTraceCheck(data.getData());
        String spaceId = LoginContext.me().getSpaceId();
        // check black space
        iBlackListService.checkBlackSpace(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        UploadParseResultVO resultVo = iMemberService.parseExcelFile(spaceId, data.getFile());
        return ResponseData.success(resultVo);
    }
}
