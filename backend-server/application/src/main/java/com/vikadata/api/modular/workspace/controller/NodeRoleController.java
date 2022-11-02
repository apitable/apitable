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

@Api(tags = "Workbench - Node Role Api")
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
    @ApiOperation(value = "Get node roles")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9"),
        @ApiImplicitParam(name = "includeAdmin", value = "Whether to include the master administrator, can not be passed, the default includes", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
        @ApiImplicitParam(name = "includeSelf", value = "Whether to get userself, do not pass, the default contains", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
        @ApiImplicitParam(name = "includeExtend", value = "Contains superior inherited permissions. By default, it does not include", dataTypeClass = Boolean.class, paramType = "query", example = "false")
    })
    public ResponseData<NodeCollaboratorsVo> listRole(@RequestParam(name = "nodeId") String nodeId,
        @RequestParam(name = "includeAdmin", defaultValue = "true") Boolean includeAdmin,
        @RequestParam(name = "includeSelf", defaultValue = "true") Boolean includeSelf,
        @RequestParam(name = "includeExtend", defaultValue = "false") Boolean includeExtend) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // The method includes determining whether the user is in this space.
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // check whether you have permission to view
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        NodeCollaboratorsVo collaboratorsVo = new NodeCollaboratorsVo();
        // query the permission mode of the node
        iControlService.checkControlStatus(nodeId, status -> collaboratorsVo.setExtend(!status));
        if (includeAdmin) {
            // query node administrator view
            List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
            collaboratorsVo.setAdmins(iOrganizationService.findAdminsVo(admins, spaceId));
        }
        if (includeSelf) {
            // query user self
            List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(Collections.singletonList(memberId));
            collaboratorsVo.setSelf(CollUtil.isNotEmpty(unitMemberVos) ? CollUtil.getFirst(unitMemberVos) : null);
        }
        // query node role view
        if (includeExtend) {
            // check inherited roles
            String parentNodeId = iNodeRoleService.getNodeExtendNodeId(nodeId);
            if (parentNodeId == null) {
                // No parent node has enabled permissions, default workbench role, load root department information
                collaboratorsVo.setRoleUnits(Collections.singletonList(iNodeRoleService.getRootNodeRoleUnit(spaceId)));
                collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId));
            }
            else {
                // load parent node role
                collaboratorsVo.setOwner(iNodeRoleService.getNodeOwner(parentNodeId));
                collaboratorsVo.setRoleUnits(iNodeRoleService.getNodeRoleUnitList(parentNodeId));
                collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId, parentNodeId));
            }
        }
        else {
            // automatically query roles in node permission mode
            if (collaboratorsVo.getExtend()) {
                // query the role of inheritance mode
                String parentNodeId = iNodeRoleService.getNodeExtendNodeId(nodeId);
                if (parentNodeId == null) {
                    // there is no permission to inherit the parent node
                    collaboratorsVo.setRoleUnits(Collections.singletonList(iNodeRoleService.getRootNodeRoleUnit(spaceId)));
                    collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId));
                    collaboratorsVo.setExtendNodeName(spaceMapper.selectSpaceNameBySpaceId(spaceId));
                }
                else {
                    // load parent node role
                    collaboratorsVo.setOwner(iNodeRoleService.getNodeOwner(parentNodeId));
                    collaboratorsVo.setRoleUnits(iNodeRoleService.getNodeRoleUnitList(parentNodeId));
                    collaboratorsVo.setMembers(iNodeRoleService.getNodeRoleMembers(spaceId, parentNodeId));
                    collaboratorsVo.setExtendNodeName(iNodeService.getNodeNameByNodeId(parentNodeId));
                }
            }
            else {
                // query the node role in the specified mode
                // inquire the person in charge
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
    @ApiOperation(value = "Disable role extend")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> disableRoleExtend(@RequestParam(name = "nodeId") String nodeId,
            @RequestBody(required = false) RoleControlOpenRo roleControlOpenRo) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // the root node cannot be operated
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(nodeId), NODE_OPERATION_DENIED);
        // check whether user have permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // The permission mode of the check node must be inherited before it is turned off.
        iControlService.checkControlStatus(nodeId,
            status -> ExceptionUtil.isFalse(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // Enable whether node permissions inherit the default role organization unit list
        boolean includeExtend = ObjectUtil.isNotNull(roleControlOpenRo)
                && BooleanUtil.isTrue(roleControlOpenRo.getIncludeExtend());
        iNodeRoleService.enableNodeRole(userId, spaceId, nodeId, includeExtend);
        // publish space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.ENABLE_NODE_ROLE).userId(userId).nodeId(nodeId)
                .info(JSONUtil.createObj().set(AuditConstants.INCLUDE_EXTEND, BooleanUtil.isTrue(includeExtend))).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/enableRoleExtend")
    @ApiOperation(value = "Enable role extend")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "query", example = "nodRTGSy43DJ9"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> enableRoleExtend(@RequestParam(name = "nodeId") String nodeId) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // the root node cannot be operated
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(nodeId), NODE_OPERATION_DENIED);
        // check whether user have permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // The permission mode of the check node must be specified before it is turned off.
        iControlService.checkControlStatus(nodeId,
            status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // close the node to specify permissions
        iNodeRoleService.disableNodeRole(userId, memberId, nodeId);
        // publish space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DISABLE_NODE_ROLE).userId(userId).nodeId(nodeId).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/addRole")
    @ApiOperation(value = "Create node role", notes = "Add the organizational unit of the node specified role")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> createRole(@RequestBody @Valid AddNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // =The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // the root node cannot be operated
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // check whether user have permission
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // The permission mode of the check node, which must be the specified mode.
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // Check whether the added organizational unit ID has the current space
        iUnitService.checkInSpace(spaceId, data.getUnitIds());
        // add node role
        iNodeRoleService.addNodeRole(userId, data.getNodeId(), data.getRole(), data.getUnitIds());
        // publish space audit events
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.ADD_NODE_ROLE).userId(userId).nodeId(data.getNodeId())
                .info(JSONUtil.createObj().set(AuditConstants.UNIT_IDS, data.getUnitIds()).set(AuditConstants.ROLE, data.getRole())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/editRole")
    @ApiOperation(value = "Edit node role", notes = "Modify the role of the organizational unit of the node")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
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
    @ApiOperation(value = "Batch edit role", notes = "Batch modify the role of the organizational unit of the node")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> batchEditRole(@RequestBody @Valid BatchModifyNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // the root node cannot be operated
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // check whether user have permission
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // The permission mode of the check node, which must be the specified mode.
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // Check whether the added organizational unit ID has the current space
        iUnitService.checkInSpace(spaceId, data.getUnitIds());
        // modify role
        iNodeRoleService.updateNodeRole(userId, data.getNodeId(), data.getRole(), data.getUnitIds());
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/deleteRole", method = RequestMethod.DELETE)
    @ApiOperation(value = "Delete role")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> deleteRole(@RequestBody @Valid DeleteNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // the root node cannot be operated
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // check whether you have permission
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // The permission mode of the check node, which must be the specified mode.
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // Check whether the added organizational unit ID has the current space
        iUnitService.checkInSpace(spaceId, Collections.singletonList(data.getUnitId()));
        // Deletes the specified organizational unit of the node
        iNodeRoleService.deleteNodeRole(userId, data.getNodeId(), data.getUnitId());
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_UPDATE_ROLE)
    @PostResource(path = "/batchDeleteRole", method = RequestMethod.DELETE)
    @ApiOperation(value = "Batch delete node role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    })
    public ResponseData<Void> batchDeleteRole(@RequestBody @Valid BatchDeleteNodeRoleRo data) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getNodeId());
        SpaceHolder.set(spaceId);
        // The method includes determining whether the user is in this space.
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // the root node cannot be operated
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        ExceptionUtil.isFalse(rootNodeId.equals(data.getNodeId()), NODE_OPERATION_DENIED);
        // check whether you have permission
        controlTemplate.checkNodePermission(memberId, data.getNodeId(), NodePermission.ASSIGN_NODE_ROLE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // The permission mode of the check node, which must be the specified mode.
        iControlService.checkControlStatus(data.getNodeId(),
                status -> ExceptionUtil.isTrue(status, NODE_ROLE_HAS_DISABLE_EXTEND));
        // Check whether the added organizational unit ID has the current space
        iUnitService.checkInSpace(spaceId, data.getUnitIds());
        // Deletes the specified organizational unit of the node
        List<ControlRoleInfo> controlRoles = iNodeRoleService.deleteNodeRoles(data.getNodeId(), data.getUnitIds());
        // publish space audit events
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
