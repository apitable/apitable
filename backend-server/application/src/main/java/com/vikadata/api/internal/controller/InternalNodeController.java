package com.vikadata.api.internal.controller;

import java.sql.Timestamp;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
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
import com.vikadata.api.enterprise.control.infrastructure.role.ControlRole;
import com.vikadata.api.shared.holder.SpaceHolder;
import com.vikadata.api.workspace.ro.CreateDatasheetRo;
import com.vikadata.api.workspace.vo.CreateDatasheetVo;
import com.vikadata.api.workspace.vo.NodeFromSpaceVo;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.NodeEntity;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.workspace.enums.PermissionException.NODE_OPERATION_DENIED;

@RestController
@ApiResource(path = "/internal")
@Api(tags = "Internal Service - Node Interface")
public class InternalNodeController {

    @Resource
    private INodeService nodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @PostResource(name = "create a table node", path = "/spaces/{spaceId}/datasheets", requiredPermission = false)
    @ApiOperation(value = "create a table node", notes = "create a table node", produces = MediaType.APPLICATION_JSON_VALUE)
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    public ResponseData<CreateDatasheetVo> createDatasheet(@PathVariable("spaceId") String spaceId, @RequestBody CreateDatasheetRo ro) {
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        // Get the member ID, the method includes judging whether the user is in this space
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // Check whether the parent node has the specified operation permission
        String parentId = ro.getFolderId();
        // If the parent node is not set, it defaults to the root node
        if (StrUtil.isEmpty(parentId)) {
            parentId = nodeService.getRootNodeIdBySpaceId(spaceId);
            ro.setFolderId(parentId);
        }
        ControlRole role = controlTemplate.fetchNodeRole(memberId, parentId);
        ExceptionUtil.isTrue(role.hasPermission(NodePermission.CREATE_NODE), NODE_OPERATION_DENIED);

        String nodeId = nodeService.createDatasheetWithDesc(spaceId, userId, ro);

        NodeEntity nodeEntity = nodeService.getByNodeId(nodeId);
        long createdAt = Timestamp.valueOf(nodeEntity.getCreatedAt()).getTime();
        CreateDatasheetVo vo = CreateDatasheetVo.builder()
                .nodeId(nodeId)
                .parentId(nodeEntity.getParentId())
                .datasheetId(nodeId)
                .createdAt(createdAt)
                .preNodeId(nodeEntity.getPreNodeId())
                .folderId(nodeEntity.getParentId()).build();
        return ResponseData.success(vo);
    }

    @PostResource(name = "delete node", path = "/spaces/{spaceId}/nodes/{nodeId}/delete", requiredPermission = false)
    @ApiOperation(value = "delete node", notes = "delete node", produces = MediaType.APPLICATION_JSON_VALUE)
    @Notification(templateId = NotificationTemplateId.NODE_DELETE)
    public ResponseData<Void> deleteNode(@PathVariable("spaceId") String spaceId
            , @PathVariable("nodeId") String nodeId) {
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        // Get the member ID, the method includes judging whether the user is in this space
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // Check whether there is specified operation permission under the node
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.REMOVE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // root node cannot be deleted
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(nodeId.equals(rootNodeId), NODE_OPERATION_DENIED);
        nodeService.deleteById(spaceId, memberId, nodeId);
        // delete space capacity cache
        spaceCapacityCacheService.del(spaceId);
        return ResponseData.success();
    }

    @GetResource(name = "get the space station id to which the node belongs", path = "/spaces/nodes/{nodeId}/belongSpace", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "get the space station id to which the node belongs", notes = "get the space station id to which the node belongs", hidden = true)
    public ResponseData<NodeFromSpaceVo> nodeFromSpace(@RequestHeader(name = ParamsConstants.INTERNAL_REQUEST) String internalRequest, @PathVariable("nodeId") String nodeId) {
        if (!"yes".equals(internalRequest)) {
            return ResponseData.success(null);
        }
        return ResponseData.success(nodeService.nodeFromSpace(nodeId));
    }

}
