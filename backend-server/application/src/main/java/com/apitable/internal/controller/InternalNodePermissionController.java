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
import com.apitable.core.support.ResponseData;
import com.apitable.internal.ro.InternalPermissionRo;
import com.apitable.internal.service.IPermissionService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.DatasheetPermissionView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
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
 * internal node permission controller.
 */
@RestController
@ApiResource(path = "/internal")
@Api(tags = "Internal Service - Node Permission Interface")
public class InternalNodePermissionController {

    @Resource
    private IPermissionService iPermissionService;
    @Resource
    private INodeService iNodeService;

    /**
     * node permission.
     *
     * @param nodeId  node id
     * @param shareId share id
     * @return {@link DatasheetPermissionView}
     */
    @GetResource(path = "/node/{nodeId}/permission", requiredPermission = false)
    @ApiOperation(value = "Get Node permission")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "nodeId", value = "Node ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "shareId", value = "Share ID", dataTypeClass = String.class, paramType = "query", example = "shrFPXT8qnyFJglX6elJi")
    })
    @ThirdPartControl()
    public ResponseData<DatasheetPermissionView> getNodePermission(
        @PathVariable("nodeId") String nodeId,
        @RequestParam(value = "shareId", required = false) String shareId) {
        Long userId = SessionContext.getUserId();
        List<DatasheetPermissionView> views =
            iPermissionService.getDatasheetPermissionView(userId, Collections.singletonList(nodeId),
                shareId);
        DatasheetPermissionView view = views.stream().findFirst().orElse(null);
        return ResponseData.success(view);
    }

    /**
     * query multi node permissions.
     *
     * @param data data
     * @return list of {@link DatasheetPermissionView}
     */
    @PostResource(path = "/node/permission", requiredPermission = false)
    @ApiOperation(value = "Get permission set for multiple nodes")
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
