package com.vikadata.api.modular.workspace.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.binarywang.wx.miniapp.constant.WxMaApiUrlConstants.Share;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.Notification;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.notification.NotificationRenderField;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.holder.NotificationRenderFieldHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.model.ro.node.StoreShareNodeRo;
import com.vikadata.api.model.ro.node.UpdateNodeShareSettingRo;
import com.vikadata.api.model.vo.node.NodeShareInfoVO;
import com.vikadata.api.model.vo.node.NodeShareSettingInfoVO;
import com.vikadata.api.model.vo.node.ShareBaseInfoVo;
import com.vikadata.api.model.vo.node.StoreNodeInfoVO;
import com.vikadata.api.modular.workspace.model.NodeSharePropsDTO;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareService;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

@RestController
@Api(tags = "Workbench - Node Share Api")
@ApiResource(path = "/node")
public class NodeShareController {

    @Resource
    private INodeShareService iNodeShareService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private UserSpaceService userSpaceService;

    private static final String SHARE_PARAM_DESC = "stringObjectParams share setting parameter description: <br/> " +
            "There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>" +
            "onlyRead: Bool, whether to set sharing only for others to view.<br/>" +
            "canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>" +
            "canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>" +
            "Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}";

    @GetResource(path = "/shareSettings/{nodeId}", requiredPermission = false)
    @ApiOperation(value = "Get node share info")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9")
    })
    public ResponseData<NodeShareSettingInfoVO> nodeShareInfo(@PathVariable("nodeId") String nodeId) {
        // get operator information
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        NodeShareSettingInfoVO settingsVO = iNodeShareService.getNodeShareSettings(nodeId);
        return ResponseData.success(settingsVO);
    }

    @Notification(templateId = NotificationTemplateId.NODE_SHARE)
    @PostResource(path = "/updateShare/{nodeId}", requiredPermission = false, requiredAccessDomain = true)
    @ApiOperation(value = "Update node share setting", notes = "Update node share setting \n" + SHARE_PARAM_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9"),
    })
    public ResponseData<ShareBaseInfoVo> updateNodeShare(@PathVariable("nodeId") String nodeId, @RequestBody @Valid UpdateNodeShareSettingRo body) {
        // get operator information
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        ExceptionUtil.isTrue(JSONUtil.isJson(body.getProps()), ParameterException.INCORRECT_ARG);
        NodeSharePropsDTO propsDTO;
        try {
            propsDTO = JSONUtil.toBean(body.getProps(), NodeSharePropsDTO.class);
        }
        catch (Exception e) {
            throw new BusinessException(ParameterException.INCORRECT_ARG);
        }
        String shareId = iNodeShareService.updateShareSetting(userId, nodeId, propsDTO);
        return ResponseData.success(ShareBaseInfoVo.builder().shareId(shareId).build());
    }

    @Notification(templateId = NotificationTemplateId.NODE_SHARE)
    @PostResource(path = "/disableShare/{nodeId}", requiredPermission = false)
    @ApiOperation(value = "Disable node sharing")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9")
    })
    public ResponseData<Void> disableShare(@PathVariable("nodeId") String nodeId) {
        // get operator information
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iNodeShareService.disableNodeShare(userId, nodeId);
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/storeShareData", requiredPermission = false)
    @ApiOperation(value = "Sotre share data")
    @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    public ResponseData<StoreNodeInfoVO> storeShareData(@RequestBody @Valid StoreShareNodeRo params) {
        Long userId = SessionContext.getUserId();
        String spaceId = params.getSpaceId();
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        iNodeService.checkEnableOperateRootNodeBySpaceFeature(memberId, spaceId);
        String newNodeId = iNodeShareService.storeShareData(userId, params.getSpaceId(), params.getShareId());
        StoreNodeInfoVO infoVO = new StoreNodeInfoVO();
        infoVO.setNodeId(newNodeId);
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().spaceId(params.getSpaceId()).build());
        // publish space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.STORE_SHARE_NODE).userId(userId).nodeId(newNodeId)
                .info(JSONUtil.createObj().set(AuditConstants.SHARE_ID, params.getShareId())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(infoVO);
    }

    @GetResource(path = "/readShareInfo/{shareId}", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "Get share node info", notes = "get shared content according to share id")
    @ApiImplicitParam(name = "shareId", value = "share id", required = true, dataTypeClass = String.class, paramType = "path", example = "shrRTGSy43DJ9")
    public ResponseData<NodeShareInfoVO> readShareInfo(@PathVariable("shareId") String shareId) {
        NodeShareInfoVO nodeShareInfoVo = iNodeShareService.getNodeShareInfo(shareId);
        return ResponseData.success(nodeShareInfoVo);
    }
}
