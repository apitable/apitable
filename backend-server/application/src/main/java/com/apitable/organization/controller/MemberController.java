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

package com.apitable.organization.controller;

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

import com.apitable.interfaces.security.facade.BlackListServiceFacade;
import com.apitable.interfaces.security.facade.HumanVerificationServiceFacade;
import com.apitable.interfaces.security.model.NonRobotMetadata;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.interfaces.user.facade.InvitationServiceFacade;
import com.apitable.interfaces.user.model.InvitationMetadata;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.enums.DeleteMemberType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.ro.DeleteBatchMemberRo;
import com.apitable.organization.ro.DeleteMemberRo;
import com.apitable.organization.ro.InviteMemberAgainRo;
import com.apitable.organization.ro.InviteMemberRo;
import com.apitable.organization.ro.InviteRo;
import com.apitable.organization.ro.TeamAddMemberRo;
import com.apitable.organization.ro.UpdateMemberOpRo;
import com.apitable.organization.ro.UpdateMemberRo;
import com.apitable.organization.ro.UpdateMemberTeamRo;
import com.apitable.organization.ro.UploadMemberTemplateRo;
import com.apitable.organization.service.IMemberSearchService;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.MemberInfoVo;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.MemberUnitsVo;
import com.apitable.organization.vo.RoleVo;
import com.apitable.organization.vo.SearchMemberVo;
import com.apitable.organization.vo.UploadParseResultVO;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationManager;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.shared.util.page.PageObjectParam;
import com.apitable.space.enums.SpaceUpdateOperate;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.user.mapper.UserMapper;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.apitable.base.enums.ParameterException.NO_ARG;
import static com.apitable.organization.enums.OrganizationException.DELETE_MEMBER_PARAM_ERROR;
import static com.apitable.organization.enums.OrganizationException.DELETE_SPACE_ADMIN_ERROR;
import static com.apitable.organization.enums.OrganizationException.INVITE_EMAIL_HAS_ACTIVE;
import static com.apitable.organization.enums.OrganizationException.INVITE_EMAIL_NOT_FOUND;
import static com.apitable.organization.enums.OrganizationException.INVITE_TOO_OFTEN;
import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_MEMBER;
import static com.apitable.shared.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.apitable.shared.constants.PageConstants.PAGE_DESC;
import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;
import static com.apitable.core.constants.RedisConstants.GENERAL_LOCKED;

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
    private IMemberSearchService iMemberSearchService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private BlackListServiceFacade blackListServiceFacade;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private HumanVerificationServiceFacade humanVerificationServiceFacade;

    @Resource
    private InvitationServiceFacade invitationServiceFacade;

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
        List<SearchMemberVo> resultList = iMemberSearchService.getLikeMemberName(spaceId, CharSequenceUtil.trim(keyword), filter, className);
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
        humanVerificationServiceFacade.verifyNonRobot(new NonRobotMetadata(data.getData()));
        // space id be invited
        String spaceId = LoginContext.me().getSpaceId();
        // whether in black list
        blackListServiceFacade.checkSpace(spaceId);
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
        List<Long> memberIds = iMemberService.emailInvitation(userId, spaceId, inviteEmails);
        if (!memberIds.isEmpty()) {
            List<Long> unitIds = iUnitService.getUnitIdsByRefIds(memberIds);
            unitsVo.setUnitIds(unitIds);
        }
        return ResponseData.success(unitsVo);
    }

    @PostResource(path = "/sendInviteSingle", tags = "INVITE_MEMBER")
    @ApiOperation(value = "Again send an email to invite members", notes = "If a member is not activated, it can send an invitation again regardless of whether the invitation has expired. After the invitation is successfully sent, the invitation link sent last time will be invalid.", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> inviteMemberSingle(@RequestBody @Valid InviteMemberAgainRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check black space
        blackListServiceFacade.checkSpace(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // Again email invite members
        MemberEntity member = memberMapper.selectBySpaceIdAndEmail(spaceId, data.getEmail());
        ExceptionUtil.isNotNull(member, INVITE_EMAIL_NOT_FOUND);
        ExceptionUtil.isFalse(member.getIsActive(), INVITE_EMAIL_HAS_ACTIVE);
        // Limit the frequency for 10 minutes
        String lockKey = StrUtil.format(GENERAL_LOCKED, "invite:email", data.getEmail());
        BoundValueOperations<String, String> ops = redisTemplate.boundValueOps(lockKey);
        ExceptionUtil.isNull(ops.get(), INVITE_TOO_OFTEN);
        ops.set("", 10, TimeUnit.MINUTES);
        Long userId = SessionContext.getUserId();
        invitationServiceFacade.sendInvitationEmail(new InvitationMetadata(spaceId, userId, data.getEmail()));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.ASSIGNED_TO_GROUP)
    @PostResource(path = "/addMember", tags = "ADD_MEMBER")
    @ApiOperation(value = "Add member", notes = "When adding new members, they can only be selected from within the organization structure and can be transferred by department", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> addMember(@RequestBody @Valid TeamAddMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.addTeamMember(spaceId, data);
        return ResponseData.success();
    }

    @PostResource(path = "/update")
    @ApiOperation(value = "Edit self member information", notes = "Edit self member information", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> update(@RequestBody @Valid UpdateMemberOpRo opRo) {
        Long memberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.updateMember(memberId, opRo);
        return ResponseData.success();
    }

    @PostResource(path = "/updateInfo", tags = "UPDATE_MEMBER")
    @ApiOperation(value = "Edit member info", notes = "Edit member info", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateInfo(@RequestBody @Valid UpdateMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.updateMember(data);
        return ResponseData.success();
    }

    @PostResource(path = "/updateMemberTeam", tags = "UPDATE_MEMBER")
    @ApiOperation(value = "Update team", notes = "assign members to departments", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateTeam(@RequestBody @Valid UpdateMemberTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
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
            socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
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
            socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
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
        humanVerificationServiceFacade.verifyNonRobot(new NonRobotMetadata(data.getData()));
        String spaceId = LoginContext.me().getSpaceId();
        // check black space
        blackListServiceFacade.checkSpace(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        UploadParseResultVO resultVo = iMemberService.parseExcelFile(spaceId, data.getFile());
        return ResponseData.success(resultVo);
    }
}
