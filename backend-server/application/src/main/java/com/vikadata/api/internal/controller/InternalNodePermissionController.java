package com.vikadata.api.internal.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.internal.model.InternalPermissionRo;
import com.vikadata.api.internal.service.IPermissionService;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.workspace.vo.DatasheetPermissionView;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-01 19:41:14
 */
@RestController
@ApiResource(path = "/internal")
@Api(tags = "内部服务-节点权限接口")
public class InternalNodePermissionController {

    @Resource
    private IPermissionService iPermissionService;

    @Resource
    private INodeService iNodeService;

    @GetResource(path = "/node/{nodeId}/permission", requiredPermission = false)
    @ApiOperation(value = "获取节点的权限", notes = "获取节点的权限")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "shareId", value = "分享ID", dataTypeClass = String.class, paramType = "query", example = "shrFPXT8qnyFJglX6elJi")
    })
    public ResponseData<DatasheetPermissionView> getNodePermission(@PathVariable("nodeId") String nodeId,
            @RequestParam(value = "shareId", required = false) String shareId) {
        Long userId = SessionContext.getUserId();
        List<DatasheetPermissionView> views = iPermissionService.getDatasheetPermissionView(userId, Collections.singletonList(nodeId), shareId);
        return ResponseData.success(views.stream().findFirst().orElse(null));
    }

    @PostResource(path = "/node/permission", requiredPermission = false)
    @ApiOperation(value = "Get permission set for multiple nodes")
    public ResponseData<List<DatasheetPermissionView>> getMultiNodePermissions(@RequestBody @Valid InternalPermissionRo data) {
        Long userId = SessionContext.getUserId();
        // Filter non-existing nodes to prevent subsequent exceptions from being thrown
        List<String> existNodeIds = iNodeService.getExistNodeIdsBySelf(data.getNodeIds());
        if (existNodeIds.isEmpty()) {
            return ResponseData.success(new ArrayList<>());
        }
        return ResponseData.success(iPermissionService.getDatasheetPermissionView(userId, existNodeIds, data.getShareId()));
    }

}
