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

import cn.hutool.core.util.StrUtil;
import com.apitable.automation.model.ActionVO;
import com.apitable.automation.model.AutomationSimpleVO;
import com.apitable.automation.model.AutomationTaskSimpleVO;
import com.apitable.automation.model.AutomationVO;
import com.apitable.automation.model.CreateActionRO;
import com.apitable.automation.model.CreateTriggerRO;
import com.apitable.automation.model.TriggerVO;
import com.apitable.automation.model.UpdateActionRO;
import com.apitable.automation.model.UpdateRobotRO;
import com.apitable.automation.model.UpdateTriggerRO;
import com.apitable.automation.service.IAutomationActionService;
import com.apitable.automation.service.IAutomationRobotService;
import com.apitable.automation.service.IAutomationRunHistoryService;
import com.apitable.automation.service.IAutomationTriggerService;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.internal.service.IPermissionService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.NodeDescMapper;
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
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
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
@Tag(name = "Automation")
@ApiResource(path = {"/automation"})
@Slf4j
public class AutomationRobotController {

    @Resource
    private IAutomationRobotService iAutomationRobotService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IAutomationRunHistoryService iAutomationRunHistoryService;

    @Resource
    private IAutomationTriggerService iAutomationTriggerService;

    @Resource
    private IPermissionService iPermissionService;

    @Resource
    private IAutomationActionService iAutomationActionService;

    @Resource
    private NodeDescMapper nodeDescMapper;

    /**
     * Get automation robots.
     *
     * @param resourceId resource id
     * @return {@link ResponseData}
     */
    @GetResource(path = "/robots", requiredPermission = false, requiredLogin = false)
    @Operation(summary = "Get automation robots")
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "aut****"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****")
    })
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<List<AutomationSimpleVO>> getResourceRobots(
        @RequestParam(name = "resourceId") String resourceId,
        @RequestParam(name = "shareId", required = false) String shareId) {
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        List<AutomationSimpleVO> result = iAutomationRobotService.getRobotsByResourceId(resourceId);
        return ResponseData.success(result);
    }

    /**
     * get automation detail.
     *
     * @param robotId    robot id
     * @param resourceId node id
     * @return AutomationVO
     */
    @GetResource(path = "/{resourceId}/robots/{robotId}", requiredPermission = false, requiredLogin = false)
    @Operation(summary = "Get node automation detail. ")
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "robotId", description = "robot id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "arb****"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****"),
    })
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<AutomationVO> getNodeRobot(
        @PathVariable String resourceId,
        @PathVariable String robotId,
        @RequestParam(name = "shareId", required = false) String shareId) {
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        AutomationVO vo = iAutomationRobotService.getRobotByRobotId(robotId);
        if (resourceId.startsWith(IdRulePrefixEnum.AUTOMATION.getIdRulePrefixEnum())) {
            vo.setDescription(nodeDescMapper.selectDescriptionByNodeId(resourceId));
            return ResponseData.success(vo);
        }
        return ResponseData.success(vo);
    }

    /**
     * Update automation.
     *
     * @param resourceId resource id
     * @param robotId    robot id
     * @param data       update data
     */
    @PostResource(path = "/{resourceId}/robots/{robotId}", method = RequestMethod.PATCH, requiredPermission = false)
    @Operation(summary = "Update automation info.")
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "robotId", description = "robot id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "arb****"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****"),
    })
    public ResponseData<Void> modifyRobot(
        @PathVariable String resourceId,
        @PathVariable String robotId,
        @RequestBody UpdateRobotRO data,
        @RequestParam(name = "shareId", required = false) String shareId
    ) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        boolean result = iAutomationRobotService.update(robotId, userId, data);
        if (result && StrUtil.isNotBlank(data.getName())
            && resourceId.startsWith(IdRulePrefixEnum.AUTOMATION.getIdRulePrefixEnum())) {
            NodeUpdateOpRo ro = new NodeUpdateOpRo();
            ro.setNodeName(data.getName());
            iNodeService.edit(userId, resourceId, ro);
        }
        return ResponseData.success();
    }

    /**
     * Delete automation robot.
     *
     * @param resourceId resource id
     * @param robotId    robot id
     * @return {@link ResponseData}
     */
    @PostResource(path = "/{resourceId}/robots/{robotId}", requiredPermission = false, method = RequestMethod.DELETE)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "robotId", description = "robot id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "arb****"),
    })
    @Operation(summary = "Delete automation robot")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<Void> deleteRobot(@PathVariable String resourceId,
                                          @PathVariable String robotId
    ) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, null,
            NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        iAutomationRobotService.deleteRobot(robotId, userId);
        if (resourceId.startsWith(IdRulePrefixEnum.AUTOMATION.getIdRulePrefixEnum())) {
            String spaceId = iNodeService.getSpaceIdByNodeId(resourceId);
            Long memberId = LoginContext.me().getMemberId(userId, spaceId);
            iNodeService.deleteById(spaceId, memberId, resourceId);
        }
        return ResponseData.success();
    }

    /**
     * Get automation run history.
     *
     * @param pageSize   page query parameter
     * @param pageNum    page query parameter
     * @param resourceId resource id
     * @param robotId    robot id
     * @return {@link ResponseData}
     */
    @GetResource(path = "/{resourceId}/roots/{robotId}/run-history", requiredPermission = false, requiredLogin = false)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "robotId", description = "robot id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "arb****"),
        @Parameter(name = "pageNum", description = "Current page number, default: 1", required = true, schema = @Schema(type = "integer"), in = ParameterIn.QUERY, example = "1"),
        @Parameter(name = "pageSize", description = "Page size, default: 20", schema = @Schema(type = "integer"), in = ParameterIn.QUERY, example = "20"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****"),
    })
    @Operation(summary = "Get automation run history")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<List<AutomationTaskSimpleVO>> getRunHistory(
        @RequestParam(name = "pageSize", defaultValue = "20")
        @Valid @Min(1) @Max(200) Integer pageSize,
        @RequestParam(name = "pageNum", defaultValue = "20") @Valid @Min(1) Integer pageNum,
        @RequestParam(name = "shareId", required = false) String shareId,
        @PathVariable String resourceId,
        @PathVariable String robotId) {
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        return ResponseData.success(
            iAutomationRunHistoryService.getRobotRunHistory(robotId, pageSize, pageNum));
    }

    /**
     * Create automation robot trigger.
     *
     * @param data       request data
     * @param resourceId resource id
     * @return {@link ResponseData}
     */
    @PostResource(path = "/{resourceId}/triggers", requiredPermission = false)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****"),
    })
    @Operation(summary = "Create automation robot trigger")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<List<TriggerVO>> createTrigger(
        @PathVariable String resourceId,
        @RequestBody @Valid CreateTriggerRO data,
        @RequestParam(name = "shareId", required = false) String shareId
    ) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        String spaceId = iNodeService.getSpaceIdByNodeId(resourceId);
        return ResponseData.success(iAutomationTriggerService.create(userId, spaceId, data));
    }

    /**
     * Update automation trigger.
     *
     * @param data       request data
     * @param resourceId resource id
     * @return {@link ResponseData}
     */
    @PostResource(path = "/{resourceId}/triggers/{triggerId}", requiredPermission = false, method = RequestMethod.PATCH)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "triggerId", description = "trigger id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "atr****"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****"),
    })
    @Operation(summary = "Update automation robot trigger")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<List<TriggerVO>> updateTrigger(
        @PathVariable String resourceId,
        @PathVariable String triggerId,
        @RequestBody @Valid UpdateTriggerRO data,
        @RequestParam(name = "shareId", required = false) String shareId
    ) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        String spaceId = iNodeService.getSpaceIdByNodeId(resourceId);
        return ResponseData.success(
            iAutomationTriggerService.update(userId, triggerId, spaceId, data));
    }

    /**
     * Delete automation trigger.
     *
     * @param resourceId resource id
     * @param triggerId  trigger id
     * @param robotId    robot id
     * @return {@link ResponseData}
     */
    @PostResource(path = "/{resourceId}/triggers/{triggerId}", requiredPermission = false, method = RequestMethod.DELETE)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "triggerId", description = "trigger id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "atr****"),
        @Parameter(name = "robotId", description = "robot id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "arb****"),
    })
    @Operation(summary = "Delete automation trigger")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<Void> deleteTrigger(@PathVariable String resourceId,
                                            @PathVariable String triggerId,
                                            @RequestParam(name = "robotId") String robotId
    ) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, null,
            NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        iAutomationTriggerService.deleteByTriggerId(robotId, triggerId, userId);
        return ResponseData.success();
    }


    /**
     * Create automation robot action.
     *
     * @param data       request data
     * @param resourceId resource id
     * @return {@link ResponseData}
     */
    @PostResource(path = "/{resourceId}/actions", requiredPermission = false)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****"),
    })
    @Operation(summary = "Create automation action")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<List<ActionVO>> createAction(
        @PathVariable String resourceId,
        @RequestBody @Valid CreateActionRO data,
        @RequestParam(name = "shareId", required = false) String shareId
    ) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        return ResponseData.success(
            iAutomationActionService.createByDatabus(userId, data));

    }

    /**
     * Update automation action.
     *
     * @param data       request data
     * @param resourceId resource id
     * @return {@link ResponseData}
     */
    @PostResource(path = "/{resourceId}/actions/{actionId}", requiredPermission = false, method = RequestMethod.PATCH)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "actionId", description = "action id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "atr****"),
        @Parameter(name = "shareId", description = "share id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr****"),
    })
    @Operation(summary = "Update automation action")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<List<ActionVO>> updateAction(
        @PathVariable String resourceId,
        @PathVariable String actionId,
        @RequestBody UpdateActionRO data,
        @RequestParam(name = "shareId", required = false) String shareId
    ) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, shareId,
            NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        return ResponseData.success(
            iAutomationActionService.updateByDatabus(actionId, userId, data));
    }

    /**
     * Delete automation action.
     *
     * @param resourceId resource id
     * @param robotId    robot id
     * @param actionId   action id
     * @return {@link ResponseData}
     */
    @PostResource(path = "/{resourceId}/actions/{actionId}", requiredPermission = false, method = RequestMethod.DELETE)
    @Parameters({
        @Parameter(name = "resourceId", description = "node id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "aut****"),
        @Parameter(name = "actionId", description = "action id", required = true, schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "atr****"),
        @Parameter(name = "robotId", description = "robot id", required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "arb****"),
    })
    @Operation(summary = "Delete automation action")
    @ApiResponses(@ApiResponse(responseCode = "200", useReturnTypeSchema = true))
    public ResponseData<Void> deleteAction(@PathVariable String resourceId,
                                           @PathVariable String actionId,
                                           @RequestParam(name = "robotId") String robotId) {
        Long userId = SessionContext.getUserId();
        iPermissionService.checkPermissionBySessionOrShare(resourceId, null,
            NodePermission.EDIT_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        iAutomationActionService.deleteByDatabus(robotId, actionId, userId);
        return ResponseData.success();
    }
}
