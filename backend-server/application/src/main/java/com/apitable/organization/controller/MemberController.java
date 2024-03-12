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

import static com.apitable.base.enums.ParameterException.NO_ARG;
import static com.apitable.organization.enums.OrganizationException.DELETE_MEMBER_PARAM_ERROR;
import static com.apitable.organization.enums.OrganizationException.DELETE_SPACE_ADMIN_ERROR;
import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_MEMBER;
import static com.apitable.shared.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.apitable.shared.constants.PageConstants.PAGE_DESC;
import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;
import static com.apitable.space.enums.SpaceException.NOT_IN_SPACE;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.interfaces.billing.facade.EntitlementServiceFacade;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import com.apitable.interfaces.security.facade.BlackListServiceFacade;
import com.apitable.interfaces.security.facade.HumanVerificationServiceFacade;
import com.apitable.interfaces.security.model.NonRobotMetadata;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.enums.DeleteMemberType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.ro.DeleteBatchMemberRo;
import com.apitable.organization.ro.DeleteMemberRo;
import com.apitable.organization.ro.TeamAddMemberRo;
import com.apitable.organization.ro.UpdateMemberOpRo;
import com.apitable.organization.ro.UpdateMemberRo;
import com.apitable.organization.ro.UpdateMemberTeamRo;
import com.apitable.organization.ro.UploadMemberTemplateRo;
import com.apitable.organization.service.IMemberSearchService;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
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
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contact Member Api.
 */
@RestController
@Tag(name = "Contact Member Api")
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
    private ISpaceService iSpaceService;

    @Resource
    private BlackListServiceFacade blackListServiceFacade;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private HumanVerificationServiceFacade humanVerificationServiceFacade;

    @Resource
    private EntitlementServiceFacade entitlementServiceFacade;

    /**
     * Fuzzy Search Members.
     */
    @GetResource(path = "/search")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "className", description = "the highlighting style",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "highLight"),
        @Parameter(name = "filter", description = "whether to filter unadded members",
            schema = @Schema(type = "boolean"), in = ParameterIn.QUERY, example = "true"),
        @Parameter(name = "keyword", description = "keyword", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "Luck")
    })
    @Operation(summary = "Fuzzy Search Members", description = "Fuzzy Search Members")
    public ResponseData<List<SearchMemberVo>> getMembers(
        @RequestParam(name = "keyword") String keyword,
        @RequestParam(value = "filter", required = false, defaultValue = "true") Boolean filter,
        @RequestParam(value = "className", required = false, defaultValue = "highLight")
        String className) {

        if (CharSequenceUtil.isBlank(keyword)) {
            return ResponseData.success(Collections.emptyList());
        }

        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceHolder.setGlobalFeature(feature);
        List<SearchMemberVo> resultList =
            iMemberSearchService.getLikeMemberName(spaceId, CharSequenceUtil.trim(keyword), filter,
                className);
        return ResponseData.success(resultList);
    }

    /**
     * Page query the team's member.
     */
    @GetResource(path = "/page")
    @Operation(summary = "Page query the team's member",
        description = "Query all the members of the department, "
            + " including the members of the sub department. "
            + "The query must be paging not full query.\n" + PAGE_DESC)
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", in = ParameterIn.QUERY,
            description = "team id. if root team can lack teamId, teamId default 0.",
            schema = @Schema(type = "string"), example = "1"),
        @Parameter(name = "isActive", description = "whether to filter unadded members",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "1"),
        @Parameter(name = PAGE_PARAM, description = "page's parameter", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({"rawtypes", "unchecked"})
    public ResponseData<PageInfo<MemberPageVo>> readPage(
        @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId,
        @RequestParam(name = "isActive", required = false) Integer isActive,
        @PageObjectParam Page page) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceHolder.setGlobalFeature(feature);
        if (teamId == 0) {
            // query the members of the root department
            IPage<MemberPageVo> pageResult =
                teamMapper.selectMembersByRootTeamId(page, spaceId, isActive);
            if (ObjectUtil.isNotNull(pageResult)) {
                // handle member's team name, get full hierarchy team names
                iTeamService.handlePageMemberTeams(pageResult, spaceId);
            }
            return ResponseData.success(PageHelper.build(pageResult));
        }
        List<Long> teamIds = iTeamService.getAllTeamIdsInTeamTree(teamId);
        IPage<MemberPageVo> resultList =
            teamMapper.selectMemberPageByTeamId(page, teamIds, isActive);
        if (ObjectUtil.isNotNull(resultList)) {
            // handle member's team name, get full hierarchy team names
            iTeamService.handlePageMemberTeams(resultList, spaceId);
        }
        return ResponseData.success(PageHelper.build(resultList));
    }

    /**
     * Check whether email in space.
     */
    @Deprecated
    @GetResource(path = "/checkEmail")
    @Operation(summary = "Check whether email in space")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "email", description = "email", schema = @Schema(type = "string"),
            required = true, in = ParameterIn.QUERY, example = "xxx@admin.com")
    })
    public ResponseData<Boolean> checkEmailInSpace(@RequestParam("email") String email) {
        String spaceId = LoginContext.me().getSpaceId();
        int count = memberMapper.selectCountBySpaceIdAndEmail(spaceId, email);
        return ResponseData.success(count > 0);
    }

    /**
     * Get member's detail info.
     */
    @GetResource(path = "/read")
    @Operation(summary = "Get member's detail info", description = "Get member's detail info")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "memberId", description = "member id", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "1"),
        @Parameter(name = "uuid", description = "user uuid", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "1")
    })
    public ResponseData<MemberInfoVo> read(
        @RequestParam(value = "memberId", required = false) Long memberId,
        @RequestParam(value = "uuid", required = false) String uuid) {
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(memberId)
            || StrUtil.isNotBlank(uuid), NO_ARG);
        String spaceId = LoginContext.me().getSpaceId();
        // For member information hiding use
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceHolder.setGlobalFeature(feature);
        if (StrUtil.isNotBlank(uuid)) {
            List<Long> userIds = userMapper.selectIdByUuidList(Collections.singletonList(uuid));
            ExceptionUtil.isNotEmpty(userIds, NOT_EXIST_MEMBER);
            memberId = memberMapper.selectIdByUserIdAndSpaceId(userIds.get(0), spaceId);
            ExceptionUtil.isNotNull(memberId, NOT_EXIST_MEMBER);
        }
        MemberInfoVo memberInfoVo = memberMapper.selectInfoById(memberId);
        ExceptionUtil.isNotNull(memberInfoVo, NOT_EXIST_MEMBER);
        ExceptionUtil.isTrue(spaceId.equals(memberInfoVo.getSpaceId()), NOT_IN_SPACE);
        // handle member's team name, get full hierarchy team path name
        iMemberService.handleMemberTeamInfo(memberInfoVo);
        List<RoleVo> roleVos = iRoleService.getRoleVosByMemberId(memberId);
        memberInfoVo.setRoles(roleVos);
        return ResponseData.success(memberInfoVo);
    }

    /**
     * Query the units which a user belongs in space.
     */
    @GetResource(path = "/units")
    @Operation(summary = "Query the units which a user belongs in space",
        description = "Query the units which a user belongs, include self")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<MemberUnitsVo> getUnits() {
        Long memberId = LoginContext.me().getMemberId();
        List<Long> unitIds = iMemberService.getUnitsByMember(memberId);
        MemberUnitsVo unitsVo = MemberUnitsVo.builder().unitIds(unitIds).build();
        return ResponseData.success(unitsVo);
    }

    /**
     * Add member.
     */
    @Notification(templateId = NotificationTemplateId.ASSIGNED_TO_GROUP)
    @PostResource(path = "/addMember", tags = "ADD_MEMBER")
    @Operation(summary = "Add member", description = "When adding new members, they can only be "
        + "selected from within the organization structure and can be transferred by department")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> addMember(@RequestBody @Valid TeamAddMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.addTeamMember(spaceId, data);
        return ResponseData.success();
    }

    /**
     * Edit self member information.
     */
    @PostResource(path = "/update")
    @Operation(summary = "Edit self member information",
        description = "Edit self member information")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> update(@RequestBody @Valid UpdateMemberOpRo opRo) {
        Long memberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.updateMember(memberId, opRo);
        return ResponseData.success();
    }

    /**
     * Edit member info.
     */
    @PostResource(path = "/updateInfo", tags = "UPDATE_MEMBER")
    @Operation(summary = "Edit member info", description = "Edit member info")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateInfo(@RequestBody @Valid UpdateMemberRo data) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.updateMember(userId, data);
        return ResponseData.success();
    }

    /**
     * Update team.
     */
    @PostResource(path = "/updateMemberTeam", tags = "UPDATE_MEMBER")
    @Operation(summary = "Update team", description = "assign members to departments")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateTeam(@RequestBody @Valid UpdateMemberTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        List<Long> memberIds = data.getMemberIds();
        List<Long> teamIds = data.getNewTeamIds();
        iMemberService.updateMemberByTeamId(spaceId, memberIds, teamIds);
        return ResponseData.success();
    }

    /**
     * Delete a Member.
     */
    @PostResource(path = "/delete", method = {RequestMethod.DELETE}, tags = "DELETE_MEMBER")
    @Operation(summary = "Delete a Member", description = "action provides two deletion modes."
        + "1.delete from organization 2. delete from team")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> deleteMember(@RequestBody @Valid DeleteMemberRo data) {
        DeleteMemberType type = DeleteMemberType.getByValue(data.getAction());
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = data.getMemberId();
        // check whether the member exists
        MemberEntity member = iMemberService.getById(memberId);
        ExceptionUtil.isNotNull(member, NOT_EXIST_MEMBER);
        if (type == DeleteMemberType.FROM_TEAM) {
            socialServiceFacade.checkCanOperateSpaceUpdate(spaceId,
                SpaceUpdateOperate.UPDATE_MEMBER);
            // delete member from department
            ExceptionUtil.isTrue(data.getTeamId() != null && !data.getTeamId().equals(0L),
                DELETE_MEMBER_PARAM_ERROR);
            iMemberService.batchDeleteMemberFromTeam(spaceId, Collections.singletonList(memberId),
                data.getTeamId());
        } else if (type == DeleteMemberType.FROM_SPACE) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
            // delete from space
            Long administrator = spaceMapper.selectSpaceMainAdmin(spaceId);
            // an administrator cannot be deleted
            ExceptionUtil.isFalse(memberId.equals(administrator), DELETE_SPACE_ADMIN_ERROR);
            iMemberService.batchDeleteMemberFromSpace(spaceId,
                Collections.singletonList(data.getMemberId()), true);
            // notice self
            Long userId = SessionContext.getUserId();
            TaskManager.me().execute(() -> NotificationManager.me()
                .playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_ADMIN, null, userId,
                    spaceId, Dict.create().set(INVOLVE_MEMBER_ID, ListUtil.toList(memberId))));
            TaskManager.me().execute(() -> NotificationManager.me()
                .playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_USER,
                    ListUtil.toList(memberId), userId, spaceId, null));
            TaskManager.me().execute(() -> NotificationManager.me()
                .playerNotify(NotificationTemplateId.REMOVED_MEMBER_TO_MYSELF,
                    ListUtil.toList(userId), 0L, spaceId,
                    Dict.create().set(INVOLVE_MEMBER_ID, ListUtil.toList(memberId))));
        }
        return ResponseData.success();
    }

    /**
     * Delete members.
     */
    @PostResource(path = "/deleteBatch", method = {RequestMethod.DELETE}, tags = "DELETE_MEMBER")
    @Operation(summary = "Delete members", description = "action provides two deletion modes，1"
        + ".delete from organization 2. delete from team")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> deleteBatchMember(@RequestBody @Valid DeleteBatchMemberRo data) {
        DeleteMemberType type = DeleteMemberType.getByValue(data.getAction());
        String spaceId = LoginContext.me().getSpaceId();
        List<Long> memberIds = data.getMemberId();
        // check whether the member exists
        List<MemberEntity> members = iMemberService.listByIds(memberIds);
        ExceptionUtil.isNotEmpty(members, NOT_EXIST_MEMBER);
        if (type == DeleteMemberType.FROM_TEAM) {
            socialServiceFacade.checkCanOperateSpaceUpdate(spaceId,
                SpaceUpdateOperate.UPDATE_MEMBER);
            //delete members from a department in batches
            ExceptionUtil.isTrue(data.getTeamId() != null && !data.getTeamId().equals(0L),
                DELETE_MEMBER_PARAM_ERROR);
            iMemberService.batchDeleteMemberFromTeam(spaceId, data.getMemberId(), data.getTeamId());
        } else if (type == DeleteMemberType.FROM_SPACE) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
            // delete members in bulk from space
            Long administrator = spaceMapper.selectSpaceMainAdmin(spaceId);
            // administrator cannot be deleted
            ExceptionUtil.isFalse(memberIds.contains(administrator), DELETE_SPACE_ADMIN_ERROR);
            iMemberService.batchDeleteMemberFromSpace(spaceId, data.getMemberId(), true);
            // notice self
            Long userId = SessionContext.getUserId();
            TaskManager.me().execute(() -> NotificationManager.me()
                .playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_ADMIN, null, userId,
                    spaceId, Dict.create().set(INVOLVE_MEMBER_ID, data.getMemberId())));
            TaskManager.me().execute(() -> NotificationManager.me()
                .playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_USER, data.getMemberId(),
                    userId, spaceId, null));
            TaskManager.me().execute(() -> NotificationManager.me()
                .playerNotify(NotificationTemplateId.REMOVED_MEMBER_TO_MYSELF,
                    ListUtil.toList(userId), 0L, spaceId,
                    Dict.create().set(INVOLVE_MEMBER_ID, data.getMemberId())));
        }
        return ResponseData.success();
    }

    /**
     * Download contact template.
     */
    @GetResource(path = "/downloadTemplate", requiredPermission = false)
    @Operation(summary = "Download contact template", description = "Download contact template")
    public void downloadTemplate(HttpServletResponse response) {
        log.info("generate download template");
        try {
            response.setContentType("application/vnd.ms-excel");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            // fileName is the name of the file that displays the download dialog box
            String name = "员工信息模板";
            String fileName =
                URLEncoder.encode(name, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
            response.setHeader("Content-disposition",
                "attachment;filename*=utf-8''" + fileName + ".xlsx");
            InputStream inputStream =
                this.getClass().getResourceAsStream("/excel/contact_example.xlsx");
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
        } catch (Exception e) {
            // reset response
            response.reset();
            throw new BusinessException("download template failure", e);
        }
    }

    /**
     * Upload employee sheet.
     */
    @PostResource(path = "/uploadExcel", tags = "INVITE_MEMBER")
    @Operation(summary = "Upload employee sheet",
        description = "Upload employee sheet，then parse it.")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<UploadParseResultVO> uploadExcel(UploadMemberTemplateRo data) {
        // human verification
        humanVerificationServiceFacade.verifyNonRobot(new NonRobotMetadata(data.getData()));
        String spaceId = LoginContext.me().getSpaceId();
        // check black space
        blackListServiceFacade.checkSpace(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        SubscriptionInfo subscriptionInfo =
            entitlementServiceFacade.getSpaceSubscription(spaceId);
        if (subscriptionInfo.isFree() && iMemberService.shouldPreventInvitation(spaceId)) {
            return ResponseData.success(new UploadParseResultVO());
        }
        UploadParseResultVO resultVo = iMemberService.parseExcelFile(spaceId, data.getFile());
        return ResponseData.success(resultVo);
    }
}
