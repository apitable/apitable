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

import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.workspace.dto.NodeSharePropsDTO;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.ro.StoreShareNodeRo;
import com.apitable.workspace.ro.UpdateNodeShareSettingRo;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareService;
import com.apitable.workspace.vo.NodeShareInfoVO;
import com.apitable.workspace.vo.NodeShareSettingInfoVO;
import com.apitable.workspace.vo.ShareBaseInfoVo;
import com.apitable.workspace.vo.StoreNodeInfoVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Workbench - Node Share Api.
 */
@RestController
@Tag(name = "Workbench - Node Share Api")
@ApiResource(path = "/node")
public class NodeShareController {

    @Resource
    private INodeShareService iNodeShareService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    private static final String SHARE_PARAM_DESC =
        "stringObjectParams share setting parameter description: <br/> "
            + "There are three option parameters for sharing settings. Only one can be set true, "
            + "and more than two cannot be set to true at the same time.<br/>"
            + "onlyRead: Bool, whether to set sharing only for others to view.<br/>"
            + "canBeEdited: Bool, whether to set up sharing to others for collaborative editing"
            + ".<br/>"
            + "canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>"
            + "Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}";

    /**
     * Get node share info.
     */
    @GetResource(path = "/shareSettings/{nodeId}", requiredPermission = false)
    @Operation(summary = "Get node share info")
    @Parameter(name = "nodeId", description = "node id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "nodRTGSy43DJ9")
    public ResponseData<NodeShareSettingInfoVO> nodeShareInfo(
        @PathVariable("nodeId") String nodeId) {
        // get operator information
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        NodeShareSettingInfoVO settingsVO = iNodeShareService.getNodeShareSettings(nodeId);
        return ResponseData.success(settingsVO);
    }

    /**
     * Update node share setting.
     */
    @Notification(templateId = NotificationTemplateId.NODE_SHARE)
    @PostResource(path = "/updateShare/{nodeId}", requiredPermission = false,
        requiredAccessDomain = true)
    @Operation(summary = "Update node share setting",
        description = "Update node share setting \n" + SHARE_PARAM_DESC)
    @Parameter(name = "nodeId", description = "node id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "nodRTGSy43DJ9")
    public ResponseData<ShareBaseInfoVo> updateNodeShare(@PathVariable("nodeId") String nodeId,
                                                         @RequestBody
                                                         @Valid UpdateNodeShareSettingRo body) {
        // get operator information
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        ExceptionUtil.isTrue(JSONUtil.isTypeJSON(body.getProps()),
            ParameterException.INCORRECT_ARG);
        NodeSharePropsDTO propsDTO;
        try {
            propsDTO = JSONUtil.toBean(body.getProps(), NodeSharePropsDTO.class);
        } catch (Exception e) {
            throw new BusinessException(ParameterException.INCORRECT_ARG);
        }
        String shareId = iNodeShareService.updateShareSetting(userId, nodeId, propsDTO);
        return ResponseData.success(ShareBaseInfoVo.builder().shareId(shareId).build());
    }

    /**
     * Disable node sharing.
     */
    @Notification(templateId = NotificationTemplateId.NODE_SHARE)
    @PostResource(path = "/disableShare/{nodeId}", requiredPermission = false)
    @Operation(summary = "Disable node sharing")
    @Parameter(name = "nodeId", description = "node id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "nodRTGSy43DJ9")
    public ResponseData<Void> disableShare(@PathVariable("nodeId") String nodeId) {
        // get operator information
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        iNodeShareService.disableNodeShare(userId, nodeId);
        return ResponseData.success();
    }

    /**
     * Sotre share data.
     */
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/storeShareData", requiredPermission = false)
    @Operation(summary = "Sotre share data")
    @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl")
    public ResponseData<StoreNodeInfoVO> storeShareData(
        @RequestBody @Valid StoreShareNodeRo params) {
        Long userId = SessionContext.getUserId();
        String spaceId = params.getSpaceId();
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        iNodeService.checkEnableOperateRootNodeBySpaceFeature(memberId, spaceId);
        String newNodeId =
            iNodeShareService.storeShareData(userId, params.getSpaceId(), params.getShareId());
        StoreNodeInfoVO infoVO = new StoreNodeInfoVO();
        infoVO.setNodeId(newNodeId);
        NotificationRenderFieldHolder.set(
            NotificationRenderField.builder().spaceId(params.getSpaceId()).build());
        // publish space audit events
        ClientOriginInfo clientOriginInfo = InformationUtil
            .getClientOriginInfoInCurrentHttpContext(true, false);
        AuditSpaceArg arg =
            AuditSpaceArg.builder().action(AuditSpaceAction.STORE_SHARE_NODE).userId(userId)
                .nodeId(newNodeId)
                .requestIp(clientOriginInfo.getIp())
                .requestUserAgent(clientOriginInfo.getUserAgent())
                .info(JSONUtil.createObj().set(AuditConstants.SHARE_ID, params.getShareId()))
                .build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(infoVO);
    }

    /**
     * Get share node info.
     */
    @GetResource(path = "/readShareInfo/{shareId}", requiredLogin = false)
    @Operation(summary = "Get share node info",
        description = "get shared content according to share id")
    @Parameter(name = "shareId", description = "share id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "shrRTGSy43DJ9")
    public ResponseData<NodeShareInfoVO> readShareInfo(@PathVariable("shareId") String shareId) {
        NodeShareInfoVO nodeShareInfoVo = iNodeShareService.getNodeShareInfo(shareId);
        return ResponseData.success(nodeShareInfoVo);
    }
}
