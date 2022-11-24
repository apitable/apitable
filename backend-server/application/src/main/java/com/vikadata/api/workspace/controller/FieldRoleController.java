package com.vikadata.api.workspace.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.base.enums.ParameterException;
import com.vikadata.api.enterprise.control.infrastructure.ControlIdBuilder;
import com.vikadata.api.enterprise.control.infrastructure.ControlIdBuilder.ControlId;
import com.vikadata.api.enterprise.control.infrastructure.ControlTemplate;
import com.vikadata.api.enterprise.control.infrastructure.permission.NodePermission;
import com.vikadata.api.enterprise.control.model.FieldControlProp;
import com.vikadata.api.enterprise.control.service.IControlService;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.shared.holder.MemberHolder;
import com.vikadata.api.shared.holder.SpaceHolder;
import com.vikadata.api.shared.listener.event.FieldPermissionEvent;
import com.vikadata.api.shared.listener.event.FieldPermissionEvent.Arg;
import com.vikadata.api.shared.validator.NodeMatch;
import com.vikadata.api.space.enums.SpaceException;
import com.vikadata.api.workspace.enums.IdRulePrefixEnum;
import com.vikadata.api.workspace.enums.PermissionException;
import com.vikadata.api.workspace.ro.BatchFieldRoleDeleteRo;
import com.vikadata.api.workspace.ro.BatchFieldRoleEditRo;
import com.vikadata.api.workspace.ro.FieldRoleCreateRo;
import com.vikadata.api.workspace.ro.FieldRoleDeleteRo;
import com.vikadata.api.workspace.ro.FieldRoleEditRo;
import com.vikadata.api.workspace.ro.RoleControlOpenRo;
import com.vikadata.api.workspace.service.IFieldRoleService;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.api.workspace.service.INodeShareService;
import com.vikadata.api.workspace.vo.FieldCollaboratorVO;
import com.vikadata.api.workspace.vo.FieldPermissionInfo;
import com.vikadata.api.workspace.vo.FieldPermissionView;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SpringContextHolder;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_CHANGE;
import static com.vikadata.api.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_DISABLE;
import static com.vikadata.api.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_ENABLE;
import static com.vikadata.api.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_SETTING_CHANGE;

@RestController
@Api(tags = "Workbench - Field Role API")
@ApiResource
@Validated
public class FieldRoleController {

    @Resource
    private IFieldRoleService iFieldRoleService;

    @Resource
    private IControlService iControlService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeShareService iNodeShareService;

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/permission/enable", requiredPermission = false)
    @ApiOperation(value = "Enable field role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> enableRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId,
            @RequestBody(required = false) RoleControlOpenRo roleControlOpenRo) {
        // column operation permission pre check
        iFieldRoleService.checkFieldPermissionBeforeEnable(dstId, fieldId);
        // The permissions at the node must be above manageable.
        controlTemplate.checkNodePermission(MemberHolder.get(), dstId, NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        // Whether the field is enabled to prevent repeated operations.
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        iControlService.checkControlStatus(controlId.toString(),
                status -> ExceptionUtil.isFalse(status, PermissionException.FIELD_PERMISSION_HAS_ENABLE));
        // enable role
        // Determine whether the user's open field permission inherits the default
        boolean includeExtend = ObjectUtil.isNotNull(roleControlOpenRo)
                && BooleanUtil.isTrue(roleControlOpenRo.getIncludeExtend());
        iFieldRoleService.enableFieldRole(SessionContext.getUserId(), dstId, fieldId, includeExtend);
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_ENABLE).datasheetId(dstId).fieldId(fieldId)
                .uuid(LoginContext.me().getLoginUser().getUuid()).includeExtend(includeExtend)
                .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/permission/disable", requiredPermission = false)
    @ApiOperation(value = "Disable field role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> disableRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId) {
        // Whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // disable role
        iControlService.removeControl(SessionContext.getUserId(), controlId.getControlIds(), true);
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_DISABLE).datasheetId(dstId).fieldId(fieldId)
                .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @GetResource(path = "/datasheet/{dstId}/field/{fieldId}/listRole", requiredPermission = false)
    @ApiOperation(value = "Gets the field role infos in datasheet.")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<FieldCollaboratorVO> listRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId) {
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(dstId, fieldId);
        return ResponseData.success(fieldCollaboratorVO);
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/addRole", requiredPermission = false)
    @ApiOperation(value = "Add field role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> addRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId,
            @Valid @RequestBody FieldRoleCreateRo data) {
        // whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // check whether the operator can operate the field role change, only the administrator and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // add field role
        iFieldRoleService.addFieldRole(SessionContext.getUserId(), controlId.toString(), data.getUnitIds(), data.getRole());
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
                .role(data.getRole()).changedUnitIds(data.getUnitIds())
                .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/editRole", requiredPermission = false)
    @ApiOperation(value = "Edit field role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    @Deprecated
    public ResponseData<Void> editRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId,
            @RequestBody @Valid FieldRoleEditRo data) {
        BatchFieldRoleEditRo ro = new BatchFieldRoleEditRo();
        ro.setUnitIds(CollUtil.newArrayList(data.getUnitId()));
        ro.setRole(data.getRole());
        return batchEditRole(dstId, fieldId, ro);
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/batchEditRole", requiredPermission = false)
    @ApiOperation(value = "Batch edit field role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> batchEditRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId,
            @RequestBody @Valid BatchFieldRoleEditRo data) {
        // Whether the field permission is already closed to prevent operation errors
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // Check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // edit role
        iFieldRoleService.editFieldRole(SessionContext.getUserId(), controlId.toString(), data.getUnitIds(), data.getRole());
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
                .role(data.getRole()).changedUnitIds(data.getUnitIds())
                .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/deleteRole", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "Delete field role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG"),
    })
    public ResponseData<Void> deleteRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId,
            @RequestBody @Valid FieldRoleDeleteRo data) {
        // whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // check whether the operator can operate the field role change, only the administrator and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), Collections.singletonList(data.getUnitId()));
        // deletes the role of the specified unit
        String role = iFieldRoleService.deleteFieldRole(controlId.toString(), dstId, data.getUnitId());
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId).delUnitIds(CollUtil.newArrayList(data.getUnitId()))
                .role(role).operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/batchDeleteRole", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "Batch delete role")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG"),
    })
    public ResponseData<Void> batchDeleteRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId,
            @RequestBody @Valid BatchFieldRoleDeleteRo data) {
        // Whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // deletes the role of the specified unit
        Map<String, List<Long>> roleToUnitIds = iFieldRoleService.deleteFieldRoles(controlId.toString(), data.getUnitIds());
        roleToUnitIds.forEach((role, unitIds) -> {
            // publish events, remotely call socket broadcast
            Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId).delUnitIds(unitIds)
                    .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
            SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        });
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/updateRoleSetting", requiredPermission = false)
    @ApiOperation(value = "Update field role setting")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "field id", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> updateRoleSetting(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") String fieldId,
            @RequestBody @Valid FieldControlProp prop) {
        // Whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // update settings
        iFieldRoleService.updateFieldRoleProp(SessionContext.getUserId(), controlId.toString(), prop);
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_SETTING_CHANGE).datasheetId(dstId).fieldId(fieldId).setting(prop)
                .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @GetResource(path = "/datasheet/field/permission", requiredLogin = false)
    @ApiOperation(value = "Get multi datasheet field permission")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstIds", value = "datasheet id", required = true, dataTypeClass = String.class, paramType = "query", example = "dstCgcfixAKyeeNsaP,dstGxznHFXf9pvF1LZ"),
            @ApiImplicitParam(name = "shareId", value = "share id", dataTypeClass = String.class, paramType = "query", example = "shrFPXT8qnyFJglX6elJi")
    })
    public ResponseData<List<FieldPermissionView>> getMultiDatasheetFieldPermission(@RequestParam("dstIds") List<String> dstIds,
            @RequestParam(value = "shareId", required = false) String shareId) {
        Long memberId = null;
        if (StrUtil.isBlank(shareId)) {
            // inside the station
            String spaceId = iNodeService.getSpaceIdByNodeId(dstIds.stream().findFirst().orElseThrow(() -> new BusinessException(ParameterException.NO_ARG)));
            memberId = iMemberService.getMemberIdByUserIdAndSpaceId(SessionContext.getUserId(), spaceId);
            ExceptionUtil.isNotNull(memberId, SpaceException.NOT_IN_SPACE);
        }
        else {
            // off site sharing
            if (shareId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
                iNodeShareService.checkShareIfExist(shareId);
            }
        }
        List<FieldPermissionView> views = new ArrayList<>(dstIds.size());
        for (String dstId : dstIds) {
            // get permissions for all fields in datasheet
            Map<String, FieldPermissionInfo> fieldPermissionMap = iFieldRoleService.getFieldPermissionMap(memberId, dstId, shareId);
            if (MapUtil.isNotEmpty(fieldPermissionMap)) {
                views.add(new FieldPermissionView(dstId, dstId, fieldPermissionMap));
            }
        }
        return ResponseData.success(views);
    }
}
