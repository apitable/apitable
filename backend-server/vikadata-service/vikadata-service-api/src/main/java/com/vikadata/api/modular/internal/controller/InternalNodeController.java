package com.vikadata.api.modular.internal.controller;

import java.sql.Timestamp;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.Notification;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.model.ro.node.CreateDatasheetRo;
import com.vikadata.api.model.vo.node.CreateDatasheetVo;
import com.vikadata.api.model.vo.node.NodeFromSpaceVo;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.NodeEntity;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

@RestController
@ApiResource(path = "/internal")
@Api(tags = "内部服务-用户接口")
public class InternalNodeController {

    @Resource
    private INodeService nodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @PostResource(name = "创建数表节点", path = "/spaces/{spaceId}/datasheets", requiredPermission = false)
    @ApiOperation(value = "创建数表节点", notes = "创建数表节点", produces = MediaType.APPLICATION_JSON_VALUE)
    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    public ResponseData<CreateDatasheetVo> createDatasheet(@PathVariable("spaceId") String spaceId, @RequestBody CreateDatasheetRo ro) {
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验父级节点下是否有指定操作权限
        String parentId = ro.getFolderId();
        // 如果未设置上一级节点，则默认为根节点
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

    @PostResource(name = "删除节点", path = "/spaces/{spaceId}/nodes/{nodeId}/delete", requiredPermission = false)
    @ApiOperation(value = "删除节点", notes = "删除节点", produces = MediaType.APPLICATION_JSON_VALUE)
    @Notification(templateId = NotificationTemplateId.NODE_DELETE)
    public ResponseData<Void> deleteNode(@PathVariable("spaceId") String spaceId
            , @PathVariable("nodeId") String nodeId) {
        SpaceHolder.set(spaceId);
        Long userId = SessionContext.getUserId();
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验节点下是否有指定操作权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.REMOVE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 不可以删除根节点
        String rootNodeId = nodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(nodeId.equals(rootNodeId), NODE_OPERATION_DENIED);
        nodeService.deleteById(spaceId, memberId, nodeId);
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
        return ResponseData.success();
    }

    @GetResource(name = "获取节点属于的空间站Id", path = "/spaces/nodes/{nodeId}/belongSpace", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取节点属于的空间站Id", notes = "获取节点属于的空间站Id", hidden = true)
    public ResponseData<NodeFromSpaceVo> nodeFromSpace(@RequestHeader(name = ParamsConstants.INTERNAL_REQUEST) String internalRequest, @PathVariable("nodeId") String nodeId) {
        if (!"yes".equals(internalRequest)) {
            return ResponseData.success(null);
        }
        return ResponseData.success(nodeService.nodeFromSpace(nodeId));
    }

}
