package com.vikadata.api.modular.workspace.controller;

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
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.model.ro.node.NodeRecoverRo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.model.vo.node.RubbishNodeVo;
import com.vikadata.api.modular.workspace.service.INodeRubbishService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

/**
 * <p>
 * 工作台模块_节点回收站管理接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/15
 */
@RestController
@Api(tags = "工作台模块_节点回收站管理接口")
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
    @ApiOperation(value = "查询回收舱的节点列表", notes = "若传入末位节点ID，返回业务状态码422，代表该节点已不在回收舱，定位失效，可取上一个末位的节点重新请求")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "isOverLimit", value = "是否请求超限节点（默认FALSE）", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
            @ApiImplicitParam(name = "size", value = "期望加载数量（可能因为总数或权限不够数）", dataTypeClass = Integer.class, paramType = "query", example = "15"),
            @ApiImplicitParam(name = "lastNodeId", value = "已加载列表中最后一个节点的ID", dataTypeClass = String.class, paramType = "query", example = "dstM5qG7")
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
    @ApiOperation(value = "恢复节点")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<NodeInfoVo> recover(@RequestBody @Valid NodeRecoverRo ro) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        // 检查回收站节点是否存在、成员是否有权限
        iNodeRubbishService.checkRubbishNode(spaceId, memberId, ro.getNodeId());
        String parentId = ro.getParentId();
        if (StrUtil.isNotBlank(parentId)) {
            // 检查节点是否存在
            iNodeService.checkNodeIfExist(spaceId, parentId);
            // 校验父级节点是否有指定操作权限
            controlTemplate.checkNodePermission(memberId, ro.getParentId(), NodePermission.CREATE_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        }
        else {
            parentId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        }
        Long userId = SessionContext.getUserId();
        iNodeRubbishService.recoverRubbishNode(userId, ro.getNodeId(), parentId);
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.RECOVER_RUBBISH_NODE).userId(userId).nodeId(ro.getNodeId()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, ro.getNodeId(), ControlRoleManager.parseNodeRole(Node.MANAGER)));
    }

    @PostResource(path = "/delete/{nodeId}", method = { RequestMethod.DELETE, RequestMethod.POST })
    @ApiOperation(value = "删除回收站的节点")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fod8mXUeiXyVo")
    })
    public ResponseData<Void> delete(@PathVariable("nodeId") String nodeId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        // 检查回收站节点是否存在、成员是否有权限
        iNodeRubbishService.checkRubbishNode(spaceId, memberId, nodeId);
        // 删除回收站节点
        Long userId = SessionContext.getUserId();
        iNodeRubbishService.delRubbishNode(userId, nodeId);
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_RUBBISH_NODE).userId(userId).nodeId(nodeId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

}
