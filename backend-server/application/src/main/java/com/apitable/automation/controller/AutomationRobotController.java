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

package com.apitable.automation.controller;

import com.apitable.automation.model.AutomationSimpleVO;
import com.apitable.automation.model.AutomationVO;
import com.apitable.automation.model.UpdateRobotRO;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.ro.NodeUpdateOpRo;
import com.apitable.workspace.service.INodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Automation robots controller.
 */
@RestController
@Tag(name = "Automation robots")
@ApiResource(path = {"/automation/robots"})
@Slf4j
public class AutomationRobotController {

    @Resource
    private IAutomationRobotService iAutomationRobotService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private INodeService iNodeService;

    /**
     * Get automation robots.
     *
     * @param resourceId resource id
     * @return {@link ResponseData}
     */
    @GetResource(path = "", requiredPermission = false)
    @Operation(summary = "Get automation robots")
    @Parameter(name = "resourceId", description = "resource id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "dst****")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<List<AutomationSimpleVO>> getResourceRobots(
        @RequestParam(name = "resourceId") String resourceId) {
        Long userId = SessionContext.getUserId();
        String spaceId = iNodeService.getSpaceIdByNodeId(resourceId);
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check whether the node has the specified operation permission
        controlTemplate.checkNodePermission(memberId, resourceId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        List<AutomationSimpleVO> result = iAutomationRobotService.getRobotsByResourceId(resourceId);
        return ResponseData.success(result);
    }

    /**
     * get automation detail.
     *
     * @param resourceId resource id
     * @return AutomationVO
     */
    @GetResource(path = "/{resourceId}", requiredPermission = false)
    @Operation(summary = "Get node automation detail. ")
    @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<AutomationVO> getNodeRobot(@PathVariable String resourceId) {
        Long userId = SessionContext.getUserId();
        String spaceId = iNodeService.getSpaceIdByNodeId(resourceId);
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check whether the node has the specified operation permission
        controlTemplate.checkNodePermission(memberId, resourceId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        return ResponseData.success(iAutomationRobotService.getRobotByResourceId(resourceId));
    }

    /**
     * Update automation.
     *
     * @param resourceId resource id
     * @param robotId    robot id
     * @param data       update data
     */
    @PostResource(path = "/{resourceId}/modify/{robotId}", method = RequestMethod.PATCH, requiredPermission = false)
    @Operation(summary = "Update automation info.")
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "robotId", description = "robot id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "arb****"),
    })
    public ResponseData<Void> modifyRobot(@PathVariable String resourceId,
                                          @PathVariable String robotId,
                                          @RequestBody UpdateRobotRO data) {
        Long userId = SessionContext.getUserId();
        String spaceId = iNodeService.getSpaceIdByNodeId(resourceId);
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check whether the node has the specified operation permission
        controlTemplate.checkNodePermission(memberId, resourceId, NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        boolean result = iAutomationRobotService.update(robotId, data);
        if (result && data.getModifyNodeName()) {
            NodeUpdateOpRo ro = new NodeUpdateOpRo();
            ro.setNodeName(data.getName());
            iNodeService.edit(userId, resourceId, ro);
        }
        return ResponseData.success();
    }
}
