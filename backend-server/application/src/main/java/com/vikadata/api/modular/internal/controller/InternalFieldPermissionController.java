package com.vikadata.api.modular.internal.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.SocketBroadcastFactory;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlIdBuilder;
import com.vikadata.api.control.ControlIdBuilder.ControlId;
import com.vikadata.api.model.vo.node.FieldPermissionView;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.internal.model.InternalPermissionRo;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareSettingService;
import com.vikadata.api.validator.NodeMatch;
import com.vikadata.core.support.ResponseData;

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
            @ApiImplicitParam(name = "shareId", value = "share id", dataTypeClass = String.class, paramType = "query", example = "shrFPXT8qnyFJglX6elJi")
    })
    public ResponseData<FieldPermissionView> getFieldPermission(@PathVariable("nodeId") String nodeId,
            @RequestParam(value = "shareId", required = false) String shareId) {
        // Get the space ID, the method includes judging whether the node exists
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // When loading node permissions in sharing, the permissions of the last changer in the sharing settings shall prevail. The method includes judging whether the changer exists.
        Long userId = StrUtil.isNotBlank(shareId) ? iNodeShareSettingService.getUpdatedByByShareId(shareId) : SessionContext.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
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
        // When loading node permissions in sharing, the permissions of the last changer in the sharing settings shall prevail. The method includes judging whether the changer exists.
        Long userId = StrUtil.isNotBlank(shareId) ? iNodeShareSettingService.getUpdatedByByShareId(shareId) : SessionContext.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
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
