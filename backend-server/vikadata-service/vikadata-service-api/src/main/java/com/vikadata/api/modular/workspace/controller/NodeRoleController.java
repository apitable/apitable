package com.vikadata.api.modular.workspace.controller;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONObject;
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
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.model.ro.datasheet.RoleControlOpenRo;
import com.vikadata.api.model.ro.node.AddNodeRoleRo;
import com.vikadata.api.model.ro.node.BatchDeleteNodeRoleRo;
import com.vikadata.api.model.ro.node.BatchModifyNodeRoleRo;
import com.vikadata.api.model.ro.node.DeleteNodeRoleRo;
import com.vikadata.api.model.ro.node.ModifyNodeRoleRo;
import com.vikadata.api.model.vo.node.NodeCollaboratorsVo;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.organization.service.IOrganizationService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;
import static com.vikadata.api.enums.exception.PermissionException.NODE_ROLE_HAS_DISABLE_EXTEND;
import static java.util.stream.Collectors.toList;

/**
 * <p>
 * 工作台模块-节点权限管理接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/19 00:09
 */
@Api(tags = "工作台模块_节点权限管理接口")
@RestController
@ApiResource(path = "/node")
public class NodeRoleController {

    @Resource
    private INodeService iNodeService;

    @Resource
    private IControlService iControlService;

    @Resource
    private INodeRoleService iNodeRoleService;

    @Resource
    private IOrganizationService iOrganizationService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private UserSpaceService userSpaceService;

    @GetResource(path = "/listRole")
    @ApiOperation(value = "查询节点角色列表", notes = "根据节点查询节点角色列表")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9"),
        @ApiImplicitParam(name = "includeAdmin", value = "是否包含主管理员，可不传递，默认包含", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
        @ApiImplicitParam(name = "includeSelf", value = "是否获取自己，可不传递，默认包含", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
        @ApiImplicitParam(name = "includeExtend", value = "包含上级继承权限，默认不包含", dataTypeClass = Boolean.class, paramType = "query", example = "false")
    })
    public ResponseData<NodeCollaboratorsVo> listRole(@RequestParam(name = "nodeId") String nodeId,
        @RequestParam(name = "includeAdmin", defaultValue = "true") Boolean includeAdmin,
        @RequestParam(name = "includeSelf", defaultValue = "true") Boolean includeSelf,
        @RequestParam(name = "includeExtend", defaultValue = "false") Boolean includeExtend) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 校验是否有权限查看
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        NodeCollaboratorsVo collaboratorsVo = new NodeCollaboratorsVo();
        // 查询节点的权限模式
        iControlService.checkControlStatus(nodeId, status -> collaboratorsVo.setExtend(!status));
        if (includeAdmin) {
            //查询节点管理员视图
            List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
            collaboratorsVo.setAdmins(iOrganizationService.findAdminsVo(admins, spaceId));
        }
        if (includeSelf) {
            // 查询自己
            List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(Collections.singletonList(memberId));
            collaboratorsVo.setSelf(CollUtil.isNotEmpty(unitMemberVos) ? CollUtil.getFirst(unitMemberVos) : null);
        }
        //查询节点角色视图
        if (includeExtend) {
            // 查继承角色
            String parentNodeId = iNodeRoleService.getNodeExtendNodeId(nodeId);
            if (parentNodeId == null) {
                // 没有父节点开启了权限，默认工作台角色，加载根部门信息
                collaboratorsVo.setRoleUnits(Collections.singletonList(iNodeRoleService.getRootNodeRoleUnit(spaceId)));
                collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId));
            }
            else {
                // 加载父节点角色
                collaboratorsVo.setOwner(iNodeRoleService.getNodeOwner(parentNodeId));
                collaboratorsVo.setRoleUnits(iNodeRoleService.getNodeRoleUnitList(parentNodeId));
                collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId, parentNodeId));
            }
        }
        else {
            // 自动查询节点权限模式下的角色
            if (collaboratorsVo.getExtend()) {
                // 查询继承模式的角色
                String parentNodeId = iNodeRoleService.getNodeExtendNodeId(nodeId);
                if (parentNodeId == null) {
                    // 没有继承父节点的权限
                    collaboratorsVo.setRoleUnits(Collections.singletonList(iNodeRoleService.getRootNodeRoleUnit(spaceId)));
                    collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId));
                    collaboratorsVo.setExtendNodeName(spaceMapper.selectSpaceNameBySpaceId(spaceId));
                }
                else {
                    // 加载父节点角色
                    collaboratorsVo.setOwner(iNodeRoleService.getNodeOwner(parentNodeId));
                    collaboratorsVo.setRoleUnits(iNodeRoleService.getNodeRoleUnitList(parentNodeId));
                    collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId, parentNodeId));
                    collaboratorsVo.setExtendNodeName(iNodeService.getNodeNameByNodeId(parentNodeId));
                }
            }
            else {
                // 查询指定模式的节点角色
                // 查询负责人
                collaboratorsVo.setOwner(iNodeRoleService.getNodeOwner(nodeId));
                collaboratorsVo.setRoleUnits(iNodeRoleService.getNodeRoleUnitList(nodeId));
                collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId, nodeId));
            }
        }
        collaboratorsVo.setBelongRootFolder(iNodeService.isNodeBelongRootFolder(spaceId, nodeId));
        return ResponseData.success(collaboratorsVo);
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/disableRoleExtend")
    @ApiOperation(value = "关闭节点继承模式", notes = "关闭节点继承模式")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> disableRoleExtend(@RequestParam(name = "nodeId") String nodeId,
            @RequestBody(required = false) RoleControlOpenRo roleControlOpenRo) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 不能操作根节点
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(nodeId), NODE_OPERATION_DENIED);
        // 校验是否有权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验节点的权限模式，关闭之前必须是继承模式
        iControlService.checkControlStatus(nodeId,
            status -> ExceptionUtil.isFalse(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // 开启节点权限是否继承默认角色组织单元列表
        boolean includeExtend = ObjectUtil.isNotNull(roleControlOpenRo)
                && BooleanUtil.isTrue(roleControlOpenRo.getIncludeExtend());
        iNodeRoleService.enableNodeRole(userId, spaceId, nodeId, includeExtend);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.ENABLE_NODE_ROLE).userId(userId).nodeId(nodeId)
                .info(JSONUtil.createObj().set(AuditConstants.INCLUDE_EXTEND, BooleanUtil.isTrue(includeExtend))).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/enableRoleExtend")
    @ApiOperation(value = "开启节点继承模式", notes = "开启节点继承模式")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> enableRoleExtend(@RequestParam(name = "nodeId") String nodeId) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 不能操作根节点
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(nodeId), NODE_OPERATION_DENIED);
        // 校验是否有权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验节点的权限模式，关闭之前必须是指定模式
        iControlService.checkControlStatus(nodeId,
            status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // 关闭节点指定权限
        iNodeRoleService.disableNodeRole(userId, memberId, nodeId);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DISABLE_NODE_ROLE).userId(userId).nodeId(nodeId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/addRole")
    @ApiOperation(value = "添加节点指定角色的组织单元", notes = "添加节点指定角色的组织单元")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> createRole(@RequestBody @Valid AddNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 不能操作根节点
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // 校验是否有权限
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验节点的权限模式，必须是指定模式
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(spaceId, data.getUnitIds());
        // 添加角色
        iNodeRoleService.addNodeRole(userId, data.getNodeId(), data.getRole(), data.getUnitIds());
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.ADD_NODE_ROLE).userId(userId).nodeId(data.getNodeId())
                .info(JSONUtil.createObj().set(AuditConstants.UNIT_IDS, data.getUnitIds()).set(AuditConstants.ROLE, data.getRole())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/editRole")
    @ApiOperation(value = "修改节点的组织单元所属角色", notes = "修改节点的组织单元所属角色")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    @Deprecated
    public ResponseData<Void> editRole(@RequestBody @Valid ModifyNodeRoleRo data) {
        BatchModifyNodeRoleRo ro = new BatchModifyNodeRoleRo();
        ro.setNodeId(data.getNodeId());
        ro.setUnitIds(CollUtil.newArrayList(data.getUnitId()));
        ro.setRole(data.getRole());
        return batchEditRole(ro);
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/batchEditRole")
    @ApiOperation(value = "批量修改节点的组织单元所属角色", notes = "修改节点的组织单元所属角色")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> batchEditRole(@RequestBody @Valid BatchModifyNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 不能操作根节点
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // 校验是否有权限
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验节点的权限模式，必须是指定模式
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(spaceId, data.getUnitIds());
        // 修改角色
        iNodeRoleService.updateNodeRole(userId, data.getNodeId(), data.getRole(), data.getUnitIds());
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/deleteRole", method = RequestMethod.DELETE)
    @ApiOperation(value = "删除节点角色", notes = "删除节点角色")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> deleteRole(@RequestBody @Valid DeleteNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 不能操作根节点
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // 校验是否有权限
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验节点的权限模式，必须是指定模式
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(spaceId, Collections.singletonList(data.getUnitId()));
        // 删除节点的指定组织单元
        iNodeRoleService.deleteNodeRole(userId, data.getNodeId(), data.getUnitId());
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/batchDeleteRole", method = RequestMethod.DELETE)
    @ApiOperation(value = "删除节点角色", notes = "删除节点角色")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> batchDeleteRole(@RequestBody @Valid BatchDeleteNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 不能操作根节点
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // 校验是否有权限
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验节点的权限模式，必须是指定模式
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(spaceId, data.getUnitIds());
        // 删除节点的指定组织单元
        List<ControlRoleInfo> controlRoles = iNodeRoleService.deleteNodeRoles(data.getNodeId(), data.getUnitIds());
        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        List<Long> unitIds = controlRoles.stream().map(ControlRoleInfo::getUnitId).collect(toList());
        List<String> oldRoles = controlRoles.stream().map(ControlRoleInfo::getRole).collect(toList());
        info.set(AuditConstants.UNIT_IDS, unitIds);
        info.set(AuditConstants.OLD_ROLES, oldRoles);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_NODE_ROLE).userId(userId).nodeId(data.getNodeId()).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }
}
