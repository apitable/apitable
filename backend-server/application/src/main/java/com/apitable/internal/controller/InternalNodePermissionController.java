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

import static com.apitable.workspace.enums.PermissionException.NODE_ACCESS_DENIED;

import com.apitable.control.annotation.ThirdPartControl;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.internal.ro.InternalPermissionRo;
import com.apitable.internal.ro.InternalUserNodePermissionRo;
import com.apitable.internal.service.IPermissionService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.SessionContext;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.DatasheetPermissionView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Node Permission Interface.
 */
@RestController
@ApiResource(path = "/internal")
@Tag(name = "Internal")
public class InternalNodePermissionController {

    @Resource
    private IPermissionService iPermissionService;
    @Resource
    private INodeService iNodeService;

    @Resource
    private IUnitService iUnitService;


    /**
     * Get Node permission.
     */
    @GetResource(path = "/node/{nodeId}/permission", requiredPermission = false)
    @Operation(summary = "Get Node permission")
    @Parameters({
        @Parameter(name = "nodeId", description = "Node ID", required = true, schema = @Schema
            (type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "shareId", description = "Share ID", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "shrFPXT8qnyFJglX6elJi")
    })
    @ThirdPartControl
    public ResponseData<DatasheetPermissionView> getNodePermission(
        @PathVariable("nodeId") String nodeId,
        @RequestParam(value = "shareId", required = false) String shareId) {
        Long userId = SessionContext.getUserId();
        // check private
        if (!iNodeService.getIsTemplateByNodeIds(Collections.singletonList(nodeId))
            && !iNodeService.privateNodeOperation(userId, nodeId)) {
            throw new BusinessException(NODE_ACCESS_DENIED);
        }
        List<DatasheetPermissionView> views =
            iPermissionService.getDatasheetPermissionView(userId, Collections.singletonList(nodeId),
                shareId);
        DatasheetPermissionView view = views.stream().findFirst().orElse(null);
        return ResponseData.success(view);
    }

    /**
     * Get permission set for multiple nodes.
     */
    @PostResource(path = "/node/permission", requiredPermission = false)
    @Operation(summary = "Get permission set for multiple nodes")
    public ResponseData<List<DatasheetPermissionView>> getMultiNodePermissions(
        @RequestBody @Valid InternalPermissionRo data) {
        Long userId = SessionContext.getUserId();
        // Filter non-existing nodes to prevent subsequent exceptions from being thrown
        List<String> existNodeIds = iNodeService.getExistNodeIdsBySelf(data.getNodeIds());
        if (existNodeIds.isEmpty()) {
            return ResponseData.success(new ArrayList<>());
        }
        return ResponseData.success(
            iPermissionService.getDatasheetPermissionView(userId, existNodeIds, data.getShareId()));
    }

    /**
     * Get the space station id to which the node belongs.
     */
    @PostResource(name = "Get the node permissions of the specified users",
        path = "/nodes/{nodeId}/users/permissions", requiredPermission = false)
    @Operation(summary = "Get the node permissions of the specified users", description = "Get the node permissions of the specified users", hidden = true)
    public ResponseData<Map<String, DatasheetPermissionView>> getUsersPermissions(
        @RequestHeader(name = ParamsConstants.INTERNAL_REQUEST) String internalRequest,
        @PathVariable("nodeId") String nodeId,
        @RequestBody @Valid InternalUserNodePermissionRo data) {
        if (!"yes".equals(internalRequest)) {
            return ResponseData.success(null);
        }
        List<DatasheetPermissionView> permission = new ArrayList<>();
        data.getUserIds().forEach(userId -> permission.addAll(
            iPermissionService.getDatasheetPermissionView(Long.parseLong(userId),
                Collections.singletonList(nodeId),
                null)));
        Map<String, DatasheetPermissionView> permissionMap = permission.stream().collect(
            Collectors.toMap(key -> key.getUserId().toString(), dto -> dto, (k1, k2) -> k2));
        return ResponseData.success(permissionMap);
    }
}
