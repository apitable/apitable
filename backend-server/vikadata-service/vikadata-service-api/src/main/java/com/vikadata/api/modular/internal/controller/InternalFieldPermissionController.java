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
 * 字段权限接口
 * @author Shawn Deng
 * @date 2021-04-12 16:54:40
 */
@RestController
@ApiResource(path = "/internal")
@Api(tags = "内部服务-数表字段权限接口")
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
    @ApiOperation(value = "关闭多个字段权限", notes = "中间层 OT 删除字段操作调用")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstGxznHFXf9pvF1LZ"),
            @ApiImplicitParam(name = "fieldIds", value = "字段ID列表", required = true, dataTypeClass = String.class, paramType = "query", example = "fldB7uWmwYrQf,fldB7uWmwYrQf")
    })
    public ResponseData<Void> disableRoles(@PathVariable("dstId") @NodeMatch String dstId,
            @RequestParam("fieldIds") List<String> fieldIds) {
        ControlId controlId = ControlIdBuilder.fieldIds(dstId, fieldIds);
        // 获取存在的控制单元ID
        List<String> existedControlIds = iControlService.getExistedControlId(controlId.getControlIds());
        if (!existedControlIds.isEmpty()) {
            // 关闭字段权限
            iControlService.removeControl(SessionContext.getUserId(), existedControlIds, true);
            // 发布事件，远程调用 Socket 广播
            String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
            String memberName = LoginContext.me().getUserSpaceDto(spaceId).getMemberName();
            TaskManager.me().execute(() -> SocketBroadcastFactory.me().fieldBroadcast(memberName, existedControlIds));
        }
        return ResponseData.success();
    }

    @GetResource(path = "/node/{nodeId}/field/permission", requiredLogin = false)
    @ApiOperation(value = "获取字段权限")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "shareId", value = "分享ID", dataTypeClass = String.class, paramType = "query", example = "shrFPXT8qnyFJglX6elJi")
    })
    public ResponseData<FieldPermissionView> getFieldPermission(@PathVariable("nodeId") String nodeId,
            @RequestParam(value = "shareId", required = false) String shareId) {
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 在分享中加载节点权限时，以分享设置最后的变更人的权限为准，方法包含判断变更人是否存在
        Long userId = StrUtil.isNotBlank(shareId) ? iNodeShareSettingService.getUpdatedByByShareId(shareId) : SessionContext.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // 获取数表所有字段的权限
        return ResponseData.success(iFieldRoleService.getFieldPermissionView(memberId, nodeId, shareId));
    }

    @PostResource(path = "/node/field/permission", requiredLogin = false)
    @ApiOperation(value = "获取多个节点的字段权限集")
    public ResponseData<List<FieldPermissionView>> getMultiFieldPermissionViews(@RequestBody @Valid InternalPermissionRo data) {
        // 过滤不存在的节点，防止后续抛异常
        List<String> existNodeIds = iNodeService.getExistNodeIdsBySelf(data.getNodeIds());
        if (existNodeIds.isEmpty()) {
            return ResponseData.success(new ArrayList<>());
        }
        String shareId = data.getShareId();
        // 获取空间ID
        String spaceId = iNodeService.getSpaceIdByNodeIds(existNodeIds);
        // 在分享中加载节点权限时，以分享设置最后的变更人的权限为准，方法包含判断变更人是否存在
        Long userId = StrUtil.isNotBlank(shareId) ? iNodeShareSettingService.getUpdatedByByShareId(shareId) : SessionContext.getUserId();
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // 获取所有节点的字段权限
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
