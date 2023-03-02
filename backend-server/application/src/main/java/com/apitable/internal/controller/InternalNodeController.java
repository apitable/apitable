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

import static com.apitable.workspace.enums.PermissionException.NODE_OPERATION_DENIED;

import cn.hutool.core.util.StrUtil;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.ro.CreateDatasheetRo;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.CreateDatasheetVo;
import com.apitable.workspace.vo.NodeFromSpaceVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.sql.Timestamp;
import javax.annotation.Resource;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Node Interface.
 */
@RestController
@ApiResource(path = "/internal")
@Tag(name = "Internal Service - Node Interface")
public class InternalNodeController {

    @Resource
    private INodeService nodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    /**
     * Create a table node.
     */
    @PostResource(name = "create a table node", path = "/spaces/{spaceId}/datasheets",
        requiredPermission = false)
    @Operation(summary = "create a table node", description = "create a table node")
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    public ResponseData<CreateDatasheetVo> createDatasheet(@PathVariable("spaceId") String spaceId,
        @RequestBody CreateDatasheetRo ro) {
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

    /**
     * Delete node.
     */
    @PostResource(name = "delete node", path = "/spaces/{spaceId}/nodes/{nodeId}/delete",
        requiredPermission = false)
    @Operation(summary = "delete node", description = "delete node")
    @Notification(templateId = NotificationTemplateId.NODE_DELETE)
    public ResponseData<Void> deleteNode(@PathVariable("spaceId") String spaceId,
        @PathVariable("nodeId") String nodeId) {
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

    /**
     * Get the space station id to which the node belongs.
     */
    @GetResource(name = "get the space station id to which the node belongs", path = "/spaces"
        + "/nodes/{nodeId}/belongSpace", requiredLogin = false, requiredPermission = false)
    @Operation(summary = "get the space station id to which the node belongs", description = "get"
        + " the space station id to which the node belongs", hidden = true)
    public ResponseData<NodeFromSpaceVo> nodeFromSpace(
        @RequestHeader(name = ParamsConstants.INTERNAL_REQUEST) String internalRequest,
        @PathVariable("nodeId") String nodeId) {
        if (!"yes".equals(internalRequest)) {
            return ResponseData.success(null);
        }
        return ResponseData.success(nodeService.nodeFromSpace(nodeId));
    }

}
