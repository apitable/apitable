package com.vikadata.api.modular.workspace.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

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

/**
 * <p>
 * 节点特性接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 13:56
 */
@RestController
@Api(tags = "工作台模块_节点分享接口")
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

    private static final String SHARE_PARAM_DESC = "stringObjectParams分享设置参数说明: <br/> " +
            "分享设置有三个选项参数，三者只能选择设置一个为true，不能同时设置两个以上为true。<br/>" +
            "onlyRead: 布尔型，是否设置分享仅给他人查看。<br/>" +
            "canBeEdited: 布尔型，是否设置分享给他人进行协作编辑。<br/>" +
            "canBeStored: 布尔型，是否设置分享给他人另存为副本。<br/>" +
            "示例：设置《分享仅给他人查看》，参数：{\"onlyRead\": true}";

    @GetResource(path = "/shareSettings/{nodeId}", requiredPermission = false)
    @ApiOperation(value = "获取节点分享设置", notes = "获取节点分享设置")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9")
    })
    public ResponseData<NodeShareSettingInfoVO> nodeShareInfo(@PathVariable("nodeId") String nodeId) {
        // 获取操作者的信息
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 校验权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        NodeShareSettingInfoVO settingsVO = iNodeShareService.getNodeShareSettings(nodeId);
        return ResponseData.success(settingsVO);
    }

    @Notification(templateId = NotificationTemplateId.NODE_SHARE)
    @PostResource(path = "/updateShare/{nodeId}", requiredPermission = false, requiredAccessDomain = true)
    @ApiOperation(value = "更改节点分享设置", notes = "更改节点分享设置 \n" + SHARE_PARAM_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9"),
    })
    public ResponseData<ShareBaseInfoVo> updateNodeShare(@PathVariable("nodeId") String nodeId, @RequestBody @Valid UpdateNodeShareSettingRo body) {
        // 获取操作者的信息
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 校验权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        ExceptionUtil.isTrue(JSONUtil.isJson(body.getProps()), ParameterException.INCORRECT_ARG);
        NodeSharePropsDTO propsDTO;
        try {
            propsDTO = JSONUtil.toBean(body.getProps(), NodeSharePropsDTO.class);
        }
        catch (Exception e) {
            // 转换异常
            throw new BusinessException(ParameterException.INCORRECT_ARG);
        }
        String shareId = iNodeShareService.updateShareSetting(userId, nodeId, propsDTO);
        return ResponseData.success(ShareBaseInfoVo.builder().shareId(shareId).build());
    }

    @Notification(templateId = NotificationTemplateId.NODE_SHARE)
    @PostResource(path = "/disableShare/{nodeId}", requiredPermission = false)
    @ApiOperation(value = "关闭节点分享", notes = "关闭节点分享设置")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "nodRTGSy43DJ9")
    })
    public ResponseData<Void> disableShare(@PathVariable("nodeId") String nodeId) {
        // 获取操作者的信息
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 校验权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.SHARE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iNodeShareService.disableNodeShare(userId, nodeId);
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/storeShareData", requiredPermission = false)
    @ApiOperation(value = "转存分享节点", notes = "转存分享节点")
    @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    public ResponseData<StoreNodeInfoVO> storeShareData(@RequestBody @Valid StoreShareNodeRo params) {
        Long userId = SessionContext.getUserId();
        String spaceId = params.getSpaceId();
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        iNodeService.checkEnableOperateRootNodeBySpaceFeature(memberId, spaceId);
        String newNodeId = iNodeShareService.storeShareData(userId, params.getSpaceId(), params.getShareId());
        StoreNodeInfoVO infoVO = new StoreNodeInfoVO();
        infoVO.setNodeId(newNodeId);
        // 通知需要字段
        NotificationRenderFieldHolder.set(NotificationRenderField.builder().spaceId(params.getSpaceId()).build());
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.STORE_SHARE_NODE).userId(userId).nodeId(newNodeId)
                .info(JSONUtil.createObj().set(AuditConstants.SHARE_ID, params.getShareId())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(infoVO);
    }

    @GetResource(path = "/readShareInfo/{shareId}", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取分享节点信息", notes = "根据shareId获取分享内容")
    @ApiImplicitParam(name = "shareId", value = "分享ID", required = true, dataTypeClass = String.class, paramType = "path", example = "shrRTGSy43DJ9")
    public ResponseData<NodeShareInfoVO> readShareInfo(@PathVariable("shareId") String shareId) {
        NodeShareInfoVO nodeShareInfoVo = iNodeShareService.getNodeShareInfo(shareId);
        return ResponseData.success(nodeShareInfoVo);
    }
}
