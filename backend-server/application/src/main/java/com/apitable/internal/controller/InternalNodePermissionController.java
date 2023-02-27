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

import com.apitable.control.annotation.ThirdPartControl;
import com.apitable.control.facede.ControlThirdPartServiceFacade;
import com.apitable.core.support.ResponseData;
import com.apitable.internal.ro.InternalPermissionRo;
import com.apitable.internal.service.IPermissionService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.DatasheetPermissionView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.annotation.Resource;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Node Permission Interface.
 */
@RestController
@ApiResource(path = "/internal")
@Tag(name = "Internal Service - Node Permission Interface")
public class InternalNodePermissionController {

    @Resource
    private IPermissionService iPermissionService;

    @Resource
    private ControlThirdPartServiceFacade controlThirdPartServiceFacade;

    @Resource
    private INodeService iNodeService;

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
    @ThirdPartControl()
    public ResponseData<DatasheetPermissionView> getNodePermission(
        @PathVariable("nodeId") String nodeId,
        @RequestParam(value = "shareId", required = false) String shareId) {
        Long userId = SessionContext.getUserId();
        List<DatasheetPermissionView> views =
            iPermissionService.getDatasheetPermissionView(userId, Collections.singletonList(nodeId),
                shareId);
        DatasheetPermissionView view =
            controlThirdPartServiceFacade.getNodePermission(views.stream().findFirst().orElse(null),
                nodeId, userId);
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

}
