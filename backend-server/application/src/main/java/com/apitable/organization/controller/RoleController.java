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

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.lang.Dict;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.util.page.PageObjectParam;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.holder.UserHolder;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.organization.ro.AddRoleMemberRo;
import com.apitable.organization.ro.CreateRoleRo;
import com.apitable.organization.ro.DeleteRoleMemberRo;
import com.apitable.organization.ro.UpdateRoleRo;
import com.apitable.organization.vo.RoleInfoVo;
import com.apitable.organization.vo.RoleMemberVo;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static com.apitable.shared.constants.NotificationConstants.ROLE_NAME;
import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;
import static com.apitable.organization.enums.OrganizationException.DUPLICATION_ROLE_NAME;
import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_ROLE;
import static com.apitable.organization.enums.OrganizationException.ROLE_EXIST_ROLE_MEMBER;
import static com.apitable.organization.enums.OrganizationException.SPACE_EXIST_ROLES;
import static com.apitable.workspace.enums.PermissionException.MEMBER_NOT_IN_SPACE;

@RestController
@Api(tags = "Contacts Role Api")
@ApiResource(path = "/org")
@Slf4j
public class RoleController {

    @Resource
    IRoleService iRoleService;

    @Resource
    IRoleMemberService iRoleMemberService;

    @Resource
    ISpaceService iSpaceService;

    @PostResource(path = "/roles", name = "create role", tags = "CREATE_ROLE")
    @ApiOperation(value = "create new role", notes = "create new role", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
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

    @PostResource(path = "/roles/{roleId}", method = RequestMethod.PATCH, name = "update role information", tags = "UPDATE_ROLE")
    @ApiOperation(value = "update role information", notes = "update role information", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<Void> updateRole(@PathVariable("roleId") Long roleId, @RequestBody @Valid UpdateRoleRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if exist the same role name.
        iRoleService.checkDuplicationRoleName(spaceId, data.getRoleName(),
                status -> ExceptionUtil.isFalse(status, DUPLICATION_ROLE_NAME));
        Long userId = UserHolder.get();
        // update role information.
        iRoleService.updateRole(userId, roleId, data.getRoleName());
        return ResponseData.success();
    }

    @GetResource(path = "/roles", name = "query space's roles")
    @ApiOperation(value = "query roles", notes = "query the space's roles", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<List<RoleInfoVo>> getRoles() {
        String spaceId = LoginContext.me().getSpaceId();
        // check if user in the space.
        Long userId = UserHolder.get();
        iSpaceService.checkUserInSpace(userId, spaceId,
                status -> ExceptionUtil.isTrue(status, MEMBER_NOT_IN_SPACE));
        // get the space's roles.
        return ResponseData.success(iRoleService.getRoles(spaceId));
    }

    @GetResource(path = "/roles/{roleId}/members", name = "query role's members")
    @ApiOperation(value = "query role members", notes = "query the role's members", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "page parameters", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    public ResponseData<PageInfo<RoleMemberVo>> getRoleMembers(@PathVariable("roleId") Long roleId, @PageObjectParam Page<Void> page) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if user in the space.
        Long userId = UserHolder.get();
        iSpaceService.checkUserInSpace(userId, spaceId,
                status -> ExceptionUtil.isTrue(status, MEMBER_NOT_IN_SPACE));
        // check if space has the role.
        iRoleService.checkRoleExistBySpaceIdAndRoleId(spaceId, roleId,
                status -> ExceptionUtil.isTrue(status, NOT_EXIST_ROLE));
        IPage<RoleMemberVo> resultPage = iRoleMemberService.getRoleMembersPage(spaceId, roleId, page);
        return ResponseData.success(PageHelper.build(resultPage));
    }

    @PostResource(path = "/roles/{roleId}/members", name = "add role members", tags = "ADD_ROLE_MEMBER")
    @Notification(templateId = NotificationTemplateId.ASSIGNED_TO_ROLE)
    @ApiOperation(value = "add role members", notes = "add role members", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<Void> addRoleMembers(@PathVariable("roleId") Long roleId, @RequestBody @Valid AddRoleMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if space has the role.
        iRoleService.checkRoleExistBySpaceIdAndRoleId(spaceId, roleId,
                status -> ExceptionUtil.isTrue(status, NOT_EXIST_ROLE));
        // add role members.
        List<Long> memberIds = iRoleMemberService.addRoleMembers(roleId, data.getUnitList());
        // send the message being added to the role to the members.
        // ps: it no filter the role exist teams' member. so member may be notified repeatedly.
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(memberIds).bodyExtras(
                Dict.create().set(ROLE_NAME, iRoleService.getRoleNameByRoleId(roleId))).build());
        return ResponseData.success();
    }

    @PostResource(path = "/roles/{roleId}/members", method = RequestMethod.DELETE, name = "remove role members", tags = "REMOVE_ROLE_MEMBER")
    @ApiOperation(value = "remove role members", notes = "remove role members", produces = MediaType.APPLICATION_JSON_VALUE)
    @Notification(templateId = NotificationTemplateId.REMOVED_FROM_ROLE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<Void> removeRoleMembers(@PathVariable("roleId") Long roleId, @RequestBody @Valid DeleteRoleMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // check if space has the role.
        iRoleService.checkRoleExistBySpaceIdAndRoleId(spaceId, roleId,
                status -> ExceptionUtil.isTrue(status, NOT_EXIST_ROLE));
        // remove role members.
        List<Long> memberIds = iRoleMemberService.removeByRoleIdAndRoleMemberIds(roleId, data.getUnitIds());
        // send the message being removed to the role to the members.
        // ps: it no filter the role exist teams' member. so member may be notified repeatedly.
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().playerIds(memberIds).bodyExtras(
                Dict.create().set(ROLE_NAME, iRoleService.getRoleNameByRoleId(roleId))).build());
        return ResponseData.success();
    }

    @PostResource(path = "/roles/{roleId}", method = RequestMethod.DELETE, name = "delete role", tags = "DELETE_ROLE")
    @ApiOperation(value = "delete role", notes = "delete role", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
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

    @PostResource(path = "/roles/init", name = "create init role", tags = "CREATE_ROLE")
    @ApiOperation(value = "create init role", notes = "create init role", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
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
