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

package com.apitable.internal.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.apitable.control.infrastructure.ControlIdBuilder;
import com.apitable.control.infrastructure.ControlIdBuilder.ControlId;
import com.apitable.control.service.IControlService;
import com.apitable.internal.ro.InternalPermissionRo;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.component.SocketBroadcastFactory;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareSettingService;
import com.apitable.workspace.vo.FieldPermissionView;
import com.apitable.core.support.ResponseData;
import com.apitable.shared.validator.NodeMatch;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * field permission interface
 */
@RestController
@ApiResource(path = "/internal")
@Api(tags = "Internal service - data table field permission interface")
public class InternalFieldPermissionController {

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IControlService iControlService;

    @Resource
    private IFieldRoleService iFieldRoleService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeShareSettingService iNodeShareSettingService;

    @PostResource(path = "/datasheet/{dstId}/field/permission/disable", requiredPermission = false)
    @ApiOperation(value = "turn off multiple field permissions", notes = "room layer ot delete field operation call")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "table id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstGxznHFXf9pvF1LZ"),
            @ApiImplicitParam(name = "fieldIds", value = "list of field ids", required = true, dataTypeClass = String.class, paramType = "query", example = "fldB7uWmwYrQf,fldB7uWmwYrQf")
    })
    public ResponseData<Void> disableRoles(@PathVariable("dstId") @NodeMatch String dstId,
            @RequestParam("fieldIds") List<String> fieldIds) {
        ControlId controlId = ControlIdBuilder.fieldIds(dstId, fieldIds);
        // get the existing control unit id
        List<String> existedControlIds = iControlService.getExistedControlId(controlId.getControlIds());
        if (!existedControlIds.isEmpty()) {
            // turn off field permissions
            iControlService.removeControl(SessionContext.getUserId(), existedControlIds, true);
            // publish events call socket broadcast remotely
            String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
            String memberName = LoginContext.me().getUserSpaceDto(spaceId).getMemberName();
            TaskManager.me().execute(() -> SocketBroadcastFactory.me().fieldBroadcast(memberName, existedControlIds));
        }
        return ResponseData.success();
    }

    @GetResource(path = "/node/{nodeId}/field/permission", requiredLogin = false)
    @ApiOperation(value = "get field permissions")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "shareId", value = "share id", dataTypeClass = String.class, paramType = "query", example = "shrFPXT8qnyFJglX6elJi"),
            @ApiImplicitParam(name = "userId", value = "user id", required = true, dataTypeClass = String.class, paramType = "query", example = "123")
    })
    public ResponseData<FieldPermissionView> getFieldPermission(@PathVariable("nodeId") String nodeId,
            @RequestParam(value = "shareId", required = false) String shareId, @RequestParam(value = "userId", required = false) String userId) {
        // Get the space ID, the method includes judging whether the node exists
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // embedLink pass userid by room-server
        if (StrUtil.isBlank(userId)) {
            // When loading node permissions in sharing, the permissions of the last changer in the sharing settings shall prevail. The method includes judging whether the changer exists.
            userId = StrUtil.isNotBlank(shareId) ? StrUtil.toString(iNodeShareSettingService.getUpdatedByByShareId(shareId)) :
                    SessionContext.getUserId().toString();
        }
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(Long.parseLong(userId), spaceId);
        // permission to get all fields of the data table
        return ResponseData.success(iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId));
    }

    @PostResource(path = "/node/field/permission", requiredLogin = false)
    @ApiOperation(value = "get field permission set for multiple nodes")
    public ResponseData<List<FieldPermissionView>> getMultiFieldPermissionViews(@RequestBody @Valid InternalPermissionRo data) {
        // Filter non-existing nodes to prevent subsequent exceptions from being thrown
        List<String> existNodeIds = iNodeService.getExistNodeIdsBySelf(data.getNodeIds());
        if (existNodeIds.isEmpty()) {
            return ResponseData.success(new ArrayList<>());
        }
        String shareId = data.getShareId();
        // get space id
        String spaceId = iNodeService.getSpaceIdByNodeIds(existNodeIds);
        String userId = data.getUserId();
        // When loading node permissions in sharing, the permissions of the last changer in the sharing settings shall prevail. The method includes judging whether the changer exists.
        if (StrUtil.isBlank(userId)) {
            // When loading node permissions in sharing, the permissions of the last changer in the sharing settings shall prevail. The method includes judging whether the changer exists.
            userId = StrUtil.isNotBlank(shareId) ? StrUtil.toString(iNodeShareSettingService.getUpdatedByByShareId(shareId)) :
                    SessionContext.getUserId().toString();
        }
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(Long.parseLong(userId), spaceId);
        // get field permissions for all nodes
        List<FieldPermissionView> views = new ArrayList<>();
        for (String nodeId : existNodeIds) {
            FieldPermissionView view = iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId);
            if (view != null) {
                views.add(view);
            }
        }
        return ResponseData.success(views);
    }
}
