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

package com.apitable.workspace.controller;

import cn.hutool.core.util.StrUtil;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.ro.NodeRecoverRo;
import com.apitable.workspace.service.INodeRubbishService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.workspace.vo.RubbishNodeVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Workbench - Node Rubbish Api.
 */
@RestController
@Tag(name = "Workbench - Node Rubbish Api")
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

    /**
     * Get node in rubbish.
     */
    @GetResource(path = "/list")
    @Operation(summary = "Get node in rubbish", description = "If the last node id is passed in, "
        + "the service status code 422 is returned.It means that the node is no longer in the "
        + "recovery compartment, the positioning fails, and the last node can be requested again.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW"),
        @Parameter(name = "size", in = ParameterIn.QUERY,
            description = "expected load quantity（May be because the total"
                + " number or permissions are not enough）",
            schema = @Schema(type = "integer"), example = "15"),
        @Parameter(name = "lastNodeId", description = "id of the last node in the loaded list",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "dstM5qG7")
    })
    public ResponseData<List<RubbishNodeVo>> list(
        @RequestParam(value = "size", defaultValue = "20") @Valid @Min(5) @Max(100) Integer size,
        @RequestParam(value = "lastNodeId", required = false) String lastNodeId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<RubbishNodeVo> nodeVos =
            iNodeRubbishService.getRubbishNodeList(spaceId, memberId, size, lastNodeId);
        return ResponseData.success(nodeVos);
    }

    /**
     * Recover node.
     */
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/recover")
    @Operation(summary = "Recover node")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
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
            controlTemplate.checkNodePermission(memberId, ro.getParentId(),
                NodePermission.CREATE_NODE,
                status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        } else {
            parentId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        }
        Long userId = SessionContext.getUserId();
        iNodeRubbishService.recoverRubbishNode(userId, ro.getNodeId(), parentId);
        // delete space capacity cache
        spaceCapacityCacheService.del(spaceId);
        // publish space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.RECOVER_RUBBISH_NODE).userId(userId)
                .nodeId(ro.getNodeId())
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, ro.getNodeId(),
            ControlRoleManager.parseNodeRole(Node.MANAGER)));
    }

    /**
     * Delete node in rubbish.
     */
    @PostResource(path = "/delete/{nodeId}", method = {RequestMethod.DELETE, RequestMethod.POST})
    @Operation(summary = "Delete node in rubbish")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW"),
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "fod8mXUeiXyVo")
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
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_RUBBISH_NODE).userId(userId)
                .nodeId(nodeId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

}
