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

import static com.apitable.organization.enums.OrganizationException.DUPLICATION_ROLE_NAME;
import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_ROLE;
import static com.apitable.organization.enums.OrganizationException.ROLE_EXIST_ROLE_MEMBER;
import static com.apitable.organization.enums.OrganizationException.SPACE_EXIST_ROLES;
import static com.apitable.shared.constants.NotificationConstants.ROLE_NAME;
import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;
import static com.apitable.workspace.enums.PermissionException.MEMBER_NOT_IN_SPACE;

import cn.hutool.core.lang.Dict;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.organization.ro.AddRoleMemberRo;
import com.apitable.organization.ro.CreateRoleRo;
import com.apitable.organization.ro.DeleteRoleMemberRo;
import com.apitable.organization.ro.UpdateRoleRo;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.vo.RoleInfoVo;
import com.apitable.organization.vo.RoleMemberVo;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.holder.UserHolder;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.shared.util.page.PageObjectParam;
import com.apitable.space.service.ISpaceService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contacts Role Api.
 */
@RestController
@Tag(name = "Contacts Role Api")
@ApiResource(path = "/org")
@Slf4j
public class RoleController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    /**
     * Create new role.
     */
    @PostResource(path = "/roles", tags = "CREATE_ROLE")
    @Operation(summary = "create new role", description = "create new role")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> createRole(@RequestBody @Valid CreateRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if exist the same role name.
        iRoleService.checkDuplicationRoleName(spaceId, data.getRoleName(),
            status -> ExceptionUtil.isFalse(status, DUPLICATION_ROLE_NAME));
        Long userId = UserHolder.get();
        // add the role.
        iRoleService.createRole(userId, spaceId, data.getRoleName());
        return ResponseData.success();
    }

    /**
     * Update role information.
     */
    @PostResource(path = "/roles/{roleId}", method = RequestMethod.PATCH, tags = "UPDATE_ROLE")
    @Operation(summary = "update role information", description = "update role information")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "role id", in = ParameterIn.PATH, required = true,
            schema = @Schema(type = "string"), example = "15622")
    })
    public ResponseData<Void> updateRole(@PathVariable("roleId") Long roleId,
                                         @RequestBody @Valid UpdateRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if exist the same role name.
        iRoleService.checkDuplicationRoleName(spaceId, data.getRoleName(),
            status -> ExceptionUtil.isFalse(status, DUPLICATION_ROLE_NAME));
        Long userId = UserHolder.get();
        // update role information.
        iRoleService.updateRole(userId, roleId, data.getRoleName());
        return ResponseData.success();
    }

    /**
     * Query roles.
     */
    @GetResource(path = "/roles")
    @Operation(summary = "query roles", description = "query the space's roles")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<List<RoleInfoVo>> getRoles() {
        String spaceId = LoginContext.me().getSpaceId();
        // check if user in the space.
        Long userId = UserHolder.get();
        iSpaceService.checkUserInSpace(userId, spaceId,
            status -> ExceptionUtil.isTrue(status, MEMBER_NOT_IN_SPACE));
        // get the space's roles.
        return ResponseData.success(iRoleService.getRoles(spaceId));
    }

    /**
     * Query role members.
     */
    @GetResource(path = "/roles/{roleId}/members")
    @Operation(summary = "query role members", description = "query the role's members")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "role id", in = ParameterIn.PATH, required = true,
            schema = @Schema(type = "string"), example = "15622"),
        @Parameter(name = PAGE_PARAM, description = "page parameters", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = PAGE_SIMPLE_EXAMPLE)
    })
    public ResponseData<PageInfo<RoleMemberVo>> getRoleMembers(@PathVariable("roleId") Long roleId,
                                                               @PageObjectParam Page<Void> page) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if user in the space.
        Long userId = UserHolder.get();
        iSpaceService.checkUserInSpace(userId, spaceId,
            status -> ExceptionUtil.isTrue(status, MEMBER_NOT_IN_SPACE));
        // check if space has the role.
        iRoleService.checkRoleExistBySpaceIdAndRoleId(spaceId, roleId,
            status -> ExceptionUtil.isTrue(status, NOT_EXIST_ROLE));
        IPage<RoleMemberVo> resultPage =
            iRoleMemberService.getRoleMembersPage(spaceId, roleId, page);
        return ResponseData.success(PageHelper.build(resultPage));
    }

    /**
     * Add role members.
     */
    @PostResource(path = "/roles/{roleId}/members", tags = "ADD_ROLE_MEMBER")
    @Notification(templateId = NotificationTemplateId.ASSIGNED_TO_ROLE)
    @Operation(summary = "add role members", description = "add role members")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "role id", in = ParameterIn.PATH, required = true,
            schema = @Schema(type = "string"), example = "15622")
    })
    public ResponseData<Void> addRoleMembers(@PathVariable("roleId") Long roleId,
                                             @RequestBody @Valid AddRoleMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if space has the role.
        iRoleService.checkRoleExistBySpaceIdAndRoleId(spaceId, roleId,
            status -> ExceptionUtil.isTrue(status, NOT_EXIST_ROLE));
        // add role members.
        List<Long> memberIds = iRoleMemberService.addRoleMembers(roleId, data.getUnitList());
        // send the message being added to the role to the members.
        // ps: it no filter the role exist teams' member. so member may be notified repeatedly.
        NotificationRenderFieldHolder.set(
            NotificationRenderField.builder().playerIds(memberIds).bodyExtras(
                Dict.create().set(ROLE_NAME, iRoleService.getRoleNameByRoleId(roleId))).build());
        return ResponseData.success();
    }

    /**
     * Remove role members.
     */
    @PostResource(path = "/roles/{roleId}/members",
        method = RequestMethod.DELETE, tags = "REMOVE_ROLE_MEMBER")
    @Operation(summary = "remove role members", description = "remove role members")
    @Notification(templateId = NotificationTemplateId.REMOVED_FROM_ROLE)
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "role id", in = ParameterIn.PATH, required = true,
            schema = @Schema(type = "string"), example = "15622")
    })
    public ResponseData<Void> removeRoleMembers(@PathVariable("roleId") Long roleId,
                                                @RequestBody @Valid DeleteRoleMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if space has the role.
        iRoleService.checkRoleExistBySpaceIdAndRoleId(spaceId, roleId,
            status -> ExceptionUtil.isTrue(status, NOT_EXIST_ROLE));
        // remove role members.
        List<Long> memberIds =
            iRoleMemberService.removeByRoleIdAndRoleMemberIds(roleId, data.getUnitIds());
        // send the message being removed to the role to the members.
        // ps: it no filter the role exist teams' member. so member may be notified repeatedly.
        NotificationRenderFieldHolder.set(
            NotificationRenderField.builder().playerIds(memberIds).bodyExtras(
                Dict.create().set(ROLE_NAME, iRoleService.getRoleNameByRoleId(roleId))).build());
        return ResponseData.success();
    }

    /**
     * Delete role.
     */
    @PostResource(path = "/roles/{roleId}",
        method = RequestMethod.DELETE, tags = "DELETE_ROLE")
    @Operation(summary = "delete role", description = "delete role")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "role id", in = ParameterIn.PATH, required = true,
            schema = @Schema(type = "string"), example = "15622")
    })
    public ResponseData<Void> deleteRole(@PathVariable("roleId") Long roleId) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if space has the role.
        iRoleService.checkRoleExistBySpaceIdAndRoleId(spaceId, roleId,
            status -> ExceptionUtil.isTrue(status, NOT_EXIST_ROLE));
        // check if role has role members.
        iRoleMemberService.checkRoleMemberExistByRoleId(roleId,
            status -> ExceptionUtil.isFalse(status, ROLE_EXIST_ROLE_MEMBER));
        // delete the role by role id.
        iRoleService.deleteRole(roleId);
        return ResponseData.success();
    }

    /**
     * Create init role.
     */
    @PostResource(path = "/roles/init", tags = "CREATE_ROLE")
    @Operation(summary = "create init role", description = "create init role")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> initRoles() {
        String spaceId = LoginContext.me().getSpaceId();
        // check if no exist roles in space.
        iRoleService.checkRoleExistBySpaceId(spaceId,
            status -> ExceptionUtil.isFalse(status, SPACE_EXIST_ROLES));
        Long userId = UserHolder.get();
        // init the space's role list.
        iRoleService.initRoleList(userId, spaceId);
        return ResponseData.success();
    }
}
