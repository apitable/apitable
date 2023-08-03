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

import static com.apitable.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_CHANGE;
import static com.apitable.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_DISABLE;
import static com.apitable.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_ENABLE;
import static com.apitable.shared.listener.enums.FieldPermissionChangeEvent.FIELD_PERMISSION_SETTING_CHANGE;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlIdBuilder;
import com.apitable.control.infrastructure.ControlIdBuilder.ControlId;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.service.IControlService;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.MemberHolder;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.listener.event.FieldPermissionEvent;
import com.apitable.shared.listener.event.FieldPermissionEvent.Arg;
import com.apitable.shared.validator.NodeMatch;
import com.apitable.space.enums.SpaceException;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.ro.BatchFieldRoleDeleteRo;
import com.apitable.workspace.ro.BatchFieldRoleEditRo;
import com.apitable.workspace.ro.FieldControlProp;
import com.apitable.workspace.ro.FieldRoleCreateRo;
import com.apitable.workspace.ro.FieldRoleDeleteRo;
import com.apitable.workspace.ro.FieldRoleEditRo;
import com.apitable.workspace.ro.RoleControlOpenRo;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareService;
import com.apitable.workspace.vo.FieldCollaboratorVO;
import com.apitable.workspace.vo.FieldPermissionInfo;
import com.apitable.workspace.vo.FieldPermissionView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import javax.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Field Role API.
 */
@RestController
@Tag(name = "Workbench - Field Role API")
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

    /**
     * Enable field role.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/permission/enable",
        requiredPermission = false)
    @Operation(summary = "Enable field role")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> enableRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId,
        @RequestBody(required = false) RoleControlOpenRo roleControlOpenRo) {
        // column operation permission pre-check
        iFieldRoleService.checkFieldPermissionBeforeEnable(dstId, fieldId);
        // The permissions at the node must be above manageable.
        controlTemplate.checkNodePermission(MemberHolder.get(), dstId, NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, PermissionException.NODE_OPERATION_DENIED));
        // Whether the field is enabled to prevent repeated operations.
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        iControlService.checkControlStatus(controlId.toString(),
            status -> ExceptionUtil.isFalse(status,
                PermissionException.FIELD_PERMISSION_HAS_ENABLE));
        // enable role
        // Determine whether the user's open field permission inherits the default
        boolean includeExtend = ObjectUtil.isNotNull(roleControlOpenRo)
            && BooleanUtil.isTrue(roleControlOpenRo.getIncludeExtend());
        iFieldRoleService.enableFieldRole(SessionContext.getUserId(), dstId, fieldId,
            includeExtend);
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_ENABLE).datasheetId(dstId).fieldId(fieldId)
            .uuid(LoginContext.me().getLoginUser().getUuid()).includeExtend(includeExtend)
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext()
            .publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Disable field role.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/permission/disable",
        requiredPermission = false)
    @Operation(summary = "Disable field role")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> disableRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId) {
        // Whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator
        // and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // disable role
        iControlService.removeControl(SessionContext.getUserId(), controlId.getControlIds(), true);
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_DISABLE).datasheetId(dstId).fieldId(fieldId)
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext()
            .publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Gets the field role infos in datasheet.
     */
    @GetResource(path = "/datasheet/{dstId}/field/{fieldId}/listRole", requiredPermission = false)
    @Operation(summary = "Gets the field role infos in datasheet.")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG")
    })
    public ResponseData<FieldCollaboratorVO> listRole(
        @PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId) {
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(dstId, fieldId);
        return ResponseData.success(fieldCollaboratorVO);
    }

    /**
     * Add field role.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/addRole", requiredPermission = false)
    @Operation(summary = "Add field role")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> addRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId,
        @Valid @RequestBody FieldRoleCreateRo data) {
        // whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // check whether the operator can operate the field role change, only the administrator
        // and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // add field role
        iFieldRoleService.addFieldRole(SessionContext.getUserId(), controlId.toString(),
            data.getUnitIds(), data.getRole());
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
            .role(data.getRole()).changedUnitIds(data.getUnitIds())
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext()
            .publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Edit field role.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/editRole", requiredPermission = false)
    @Operation(summary = "Edit field role")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG")
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

    /**
     * Batch edit field role.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/batchEditRole", requiredPermission =
        false)
    @Operation(summary = "Batch edit field role")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> batchEditRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId,
        @RequestBody @Valid BatchFieldRoleEditRo data) {
        // Whether the field permission is already closed to prevent operation errors
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator
        // and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // Check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // edit role
        iFieldRoleService.editFieldRole(SessionContext.getUserId(), controlId.toString(),
            data.getUnitIds(), data.getRole());
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
            .role(data.getRole()).changedUnitIds(data.getUnitIds())
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext()
            .publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Delete field role.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/deleteRole", method =
        RequestMethod.DELETE, requiredPermission = false)
    @Operation(summary = "Delete field role")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG"),
    })
    public ResponseData<Void> deleteRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId,
        @RequestBody @Valid FieldRoleDeleteRo data) {
        // whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // check whether the operator can operate the field role change, only the administrator
        // and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), Collections.singletonList(data.getUnitId()));
        // deletes the role of the specified unit
        String role =
            iFieldRoleService.deleteFieldRole(controlId.toString(), dstId, data.getUnitId());
        // Publish events, remotely call socket broadcast
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
            .delUnitIds(CollUtil.newArrayList(data.getUnitId()))
            .role(role)
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext()
            .publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Batch delete role.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/batchDeleteRole", method =
        RequestMethod.DELETE, requiredPermission = false)
    @Operation(summary = "Batch delete role")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG"),
    })
    public ResponseData<Void> batchDeleteRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId,
        @RequestBody @Valid BatchFieldRoleDeleteRo data) {
        // Whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator
        // and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // check whether the added organizational unit id has the current space
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // deletes the role of the specified unit
        Map<String, List<Long>> roleToUnitIds =
            iFieldRoleService.deleteFieldRoles(controlId.toString(), data.getUnitIds());
        roleToUnitIds.forEach((role, unitIds) -> {
            // publish events, remotely call socket broadcast
            Arg arg =
                Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
                    .delUnitIds(unitIds)
                    .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName())
                    .build();
            SpringContextHolder.getApplicationContext()
                .publishEvent(new FieldPermissionEvent(this, arg));
        });
        return ResponseData.success();
    }

    /**
     * Update field role setting.
     */
    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/updateRoleSetting",
        requiredPermission = false)
    @Operation(summary = "Update field role setting")
    @Parameters({
        @Parameter(name = "dstId", description = "datasheet id", required = true, schema
            = @Schema(type = "string"), in = ParameterIn.PATH, example = "dstCgcfixAKyeeNsaP"),
        @Parameter(name = "fieldId", description = "field id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> updateRoleSetting(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") String fieldId,
        @RequestBody @Valid FieldControlProp prop) {
        // Whether the field is already closed to prevent repeated operations
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // Check whether the operator can operate the field role change, only the administrator
        // and creator can
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // update settings
        iFieldRoleService.updateFieldRoleProp(SessionContext.getUserId(), controlId.toString(),
            prop);
        // Publish events, remotely call socket broadcast
        Arg arg =
            Arg.builder().event(FIELD_PERMISSION_SETTING_CHANGE).datasheetId(dstId).fieldId(fieldId)
                .setting(prop)
                .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName())
                .build();
        SpringContextHolder.getApplicationContext()
            .publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    /**
     * Get multi datasheet field permission.
     */
    @GetResource(path = "/datasheet/field/permission", requiredLogin = false)
    @Operation(summary = "Get multi datasheet field permission")
    @Parameters({
        @Parameter(name = "dstIds", description = "datasheet id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "dstCgcfixAKyeeNsaP,"
            + "dstGxznHFXf9pvF1LZ"),
        @Parameter(name = "shareId", description = "share id", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "shrFPXT8qnyFJglX6elJi")
    })
    public ResponseData<List<FieldPermissionView>> getMultiDatasheetFieldPermission(
        @RequestParam("dstIds") List<String> dstIds,
        @RequestParam(value = "shareId", required = false) String shareId) {
        Long memberId = null;
        if (StrUtil.isBlank(shareId)) {
            // inside the station
            String spaceId = iNodeService.getSpaceIdByNodeId(dstIds.stream().findFirst()
                .orElseThrow(() -> new BusinessException(ParameterException.NO_ARG)));
            memberId =
                iMemberService.getMemberIdByUserIdAndSpaceId(SessionContext.getUserId(), spaceId);
            ExceptionUtil.isNotNull(memberId, SpaceException.NOT_IN_SPACE);
        } else {
            // off site sharing
            if (shareId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
                iNodeShareService.checkShareIfExist(shareId);
            }
        }
        List<FieldPermissionView> views = new ArrayList<>(dstIds.size());
        for (String dstId : dstIds) {
            // get permissions for all fields in datasheet
            Map<String, FieldPermissionInfo> fieldPermissionMap =
                iFieldRoleService.getFieldPermissionMap(memberId, dstId, shareId);
            if (MapUtil.isNotEmpty(fieldPermissionMap)) {
                views.add(new FieldPermissionView(dstId, dstId, fieldPermissionMap));
            }
        }
        return ResponseData.success(views);
    }
}
