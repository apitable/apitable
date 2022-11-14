package com.vikadata.api.workspace.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.notification.annotation.Notification;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.shared.component.notification.NotificationTemplateId;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.enterprise.control.infrastructure.ControlTemplate;
import com.vikadata.api.enterprise.control.infrastructure.permission.NodePermission;
import com.vikadata.api.enterprise.control.infrastructure.role.ControlRoleManager;
import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Node;
import com.vikadata.api.space.enums.AuditSpaceAction;
import com.vikadata.api.shared.listener.event.AuditSpaceEvent;
import com.vikadata.api.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.workspace.ro.NodeRecoverRo;
import com.vikadata.api.workspace.vo.NodeInfoVo;
import com.vikadata.api.workspace.vo.RubbishNodeVo;
import com.vikadata.api.workspace.service.INodeRubbishService;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.api.workspace.enums.PermissionException;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "Workbench - Node Rubbish Api")
@ApiResource(path = "/node/rubbish")
public class NodeRubbishController {

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeRubbishService iNodeRubbishService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @GetResource(path = "/list")
    @ApiOperation(value = "Get node in rubbish", notes = "If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "isOverLimit", value = "whether to request an overrun node（default FALSE）", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
            @ApiImplicitParam(name = "size", value = "expected load quantity（May be because the total number or permissions are not enough）", dataTypeClass = Integer.class, paramType = "query", example = "15"),
            @ApiImplicitParam(name = "lastNodeId", value = "id of the last node in the loaded list", dataTypeClass = String.class, paramType = "query", example = "dstM5qG7")
    })
    public ResponseData<List<RubbishNodeVo>> list(@RequestParam(value = "size", defaultValue = "20") @Valid @Min(5) @Max(100) Integer size,
            @RequestParam(value = "isOverLimit", defaultValue = "false") Boolean isOverLimit,
            @RequestParam(value = "lastNodeId", required = false) String lastNodeId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<RubbishNodeVo> nodeVos = iNodeRubbishService.getRubbishNodeList(spaceId, memberId, size, lastNodeId, isOverLimit);
        return ResponseData.success(nodeVos);
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/recover")
    @ApiOperation(value = "Recover node")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<NodeInfoVo> recover(@RequestBody @Valid NodeRecoverRo ro) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        // Check whether the recycle bin node exists and whether the members have permissions.
        iNodeRubbishService.checkRubbishNode(spaceId, memberId, ro.getNodeId());
        String parentId = ro.getParentId();
        if (StrUtil.isNotBlank(parentId)) {
            // check if the node exists
            iNodeService.checkNodeIfExist(spaceId, parentId);
            // Verify that the parent node has the specified operation permissions
            controlTemplate.checkNodePermission(memberId, ro.getParentId(), NodePermission.CREATE_NODE,
                    status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        }
        else {
            parentId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        }
        Long userId = SessionContext.getUserId();
        iNodeRubbishService.recoverRubbishNode(userId, ro.getNodeId(), parentId);
        // delete space capacity cache
        spaceCapacityCacheService.del(spaceId);
        // publish space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.RECOVER_RUBBISH_NODE).userId(userId).nodeId(ro.getNodeId()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, ro.getNodeId(), ControlRoleManager.parseNodeRole(Node.MANAGER)));
    }

    @PostResource(path = "/delete/{nodeId}", method = { RequestMethod.DELETE, RequestMethod.POST })
    @ApiOperation(value = "Delete node in rubbish")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "fod8mXUeiXyVo")
    })
    public ResponseData<Void> delete(@PathVariable("nodeId") String nodeId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        // Check whether the recycle bin node exists and whether the members have permissions.
        iNodeRubbishService.checkRubbishNode(spaceId, memberId, nodeId);
        // Delete node in rubbish
        Long userId = SessionContext.getUserId();
        iNodeRubbishService.delRubbishNode(userId, nodeId);
        // delete space capacity cache
        spaceCapacityCacheService.del(spaceId);
        // publish space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_RUBBISH_NODE).userId(userId).nodeId(nodeId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

}
