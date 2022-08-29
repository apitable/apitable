package com.vikadata.api.modular.workspace.controller;

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

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlIdBuilder;
import com.vikadata.api.control.ControlIdBuilder.ControlId;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.event.FieldPermissionEvent;
import com.vikadata.api.event.FieldPermissionEvent.Arg;
import com.vikadata.api.holder.MemberHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.model.ro.datasheet.BatchFieldRoleDeleteRo;
import com.vikadata.api.model.ro.datasheet.BatchFieldRoleEditRo;
import com.vikadata.api.model.ro.datasheet.FieldRoleCreateRo;
import com.vikadata.api.model.ro.datasheet.FieldRoleDeleteRo;
import com.vikadata.api.model.ro.datasheet.FieldRoleEditRo;
import com.vikadata.api.model.ro.datasheet.RoleControlOpenRo;
import com.vikadata.api.model.vo.datasheet.FieldCollaboratorVO;
import com.vikadata.api.model.vo.node.FieldPermissionInfo;
import com.vikadata.api.model.vo.node.FieldPermissionView;
import com.vikadata.api.modular.control.model.FieldControlProp;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareService;
import com.vikadata.api.validator.FieldMatch;
import com.vikadata.api.validator.NodeMatch;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.datasheet.FieldPermissionChangeEvent.FIELD_PERMISSION_CHANGE;
import static com.vikadata.api.enums.datasheet.FieldPermissionChangeEvent.FIELD_PERMISSION_DISABLE;
import static com.vikadata.api.enums.datasheet.FieldPermissionChangeEvent.FIELD_PERMISSION_ENABLE;
import static com.vikadata.api.enums.datasheet.FieldPermissionChangeEvent.FIELD_PERMISSION_SETTING_CHANGE;
import static com.vikadata.api.enums.exception.ParameterException.NO_ARG;
import static com.vikadata.api.enums.exception.PermissionException.FIELD_PERMISSION_HAS_ENABLE;
import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;
import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;

/**
 * <p>
 * 工作台模块-数表字段权限管理接口
 * </p>
 *
 * @author Chambers
 * @date 2021/3/29
 */
@RestController
@Api(tags = "工作台模块_字段权限管理接口")
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
    @ApiOperation(value = "开启字段权限")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> enableRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") @FieldMatch String fieldId,
        @RequestBody(required = false) RoleControlOpenRo roleControlOpenRo) {
        // 列操作权限前置检查
        iFieldRoleService.checkFieldPermissionBeforeEnable(dstId, fieldId);
        // 在节点的权限必须是可管理以上
        controlTemplate.checkNodePermission(MemberHolder.get(), dstId, NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 字段是否已经开启，预防重复操作
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        iControlService.checkControlStatus(controlId.toString(),
            status -> ExceptionUtil.isFalse(status, FIELD_PERMISSION_HAS_ENABLE));
        // 开启权限
        // 判断用户开启字段权限事是否继承默认
        boolean includeExtend = ObjectUtil.isNotNull(roleControlOpenRo)
                && BooleanUtil.isTrue(roleControlOpenRo.getIncludeExtend());
        iFieldRoleService.enableFieldRole(SessionContext.getUserId(), dstId, fieldId, includeExtend);
        // 发布事件，远程调用 Socket 广播
        Arg arg = Arg.builder().event(FIELD_PERMISSION_ENABLE).datasheetId(dstId).fieldId(fieldId)
            .uuid(LoginContext.me().getLoginUser().getUuid()).includeExtend(includeExtend)
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/permission/disable", requiredPermission = false)
    @ApiOperation(value = "关闭字段权限")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> disableRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") @FieldMatch String fieldId) {
        // 字段是否已经是关闭，预防重复操作
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // 检查操作者是否可以操作字段角色变更，只有管理员和创建者可以
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // 关闭字段权限
        iControlService.removeControl(SessionContext.getUserId(), controlId.getControlIds(), true);
        // 发布事件，远程调用 Socket 广播
        Arg arg = Arg.builder().event(FIELD_PERMISSION_DISABLE).datasheetId(dstId).fieldId(fieldId)
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @GetResource(path = "/datasheet/{dstId}/field/{fieldId}/listRole", requiredPermission = false)
    @ApiOperation(value = "获取数表指定字段角色信息", notes = "根据指定的数表中字段的角色信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<FieldCollaboratorVO> listRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") @FieldMatch String fieldId) {
        // 获取数表的所有字段权限
        FieldCollaboratorVO fieldCollaboratorVO = iFieldRoleService.getFieldRoles(dstId, fieldId);
        return ResponseData.success(fieldCollaboratorVO);
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/addRole", requiredPermission = false)
    @ApiOperation(value = "新增字段角色")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> addRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") @FieldMatch String fieldId,
        @Valid @RequestBody FieldRoleCreateRo data) {
        // 字段是否已经是关闭，预防重复操作
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // 检查操作者是否可以操作字段角色变更，只有管理员和创建者可以
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // 添加角色
        iFieldRoleService.addFieldRole(SessionContext.getUserId(), controlId.toString(), data.getUnitIds(), data.getRole());
        // 发布事件，远程调用 Socket 广播
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
            .role(data.getRole()).changedUnitIds(data.getUnitIds())
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/editRole", requiredPermission = false)
    @ApiOperation(value = "修改字段角色")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    @Deprecated
    public ResponseData<Void> editRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") @FieldMatch String fieldId,
            @RequestBody @Valid FieldRoleEditRo data) {
        BatchFieldRoleEditRo ro = new BatchFieldRoleEditRo();
        ro.setUnitIds(CollUtil.newArrayList(data.getUnitId()));
        ro.setRole(data.getRole());
        return batchEditRole(dstId, fieldId, ro);
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/batchEditRole", requiredPermission = false)
    @ApiOperation(value = "批量修改字段角色")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> batchEditRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") @FieldMatch String fieldId,
        @RequestBody @Valid BatchFieldRoleEditRo data) {
        // 字段权限是否已经是关闭，预防操作错误
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // 检查操作者是否可以操作字段角色变更，只有管理员和创建者可以
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // 编辑角色
        iFieldRoleService.editFieldRole(SessionContext.getUserId(), controlId.toString(), data.getUnitIds(), data.getRole());
        // 发布事件，远程调用 Socket 广播
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId)
            .role(data.getRole()).changedUnitIds(data.getUnitIds())
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/deleteRole", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "删除字段角色")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG"),
    })
    public ResponseData<Void> deleteRole(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") @FieldMatch String fieldId,
        @RequestBody @Valid FieldRoleDeleteRo data) {
        // 字段是否已经是关闭，预防重复操作
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // 检查操作者是否可以操作字段角色变更，只有管理员和创建者可以
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(SpaceHolder.get(), Collections.singletonList(data.getUnitId()));
        // 删除指定单元的角色
        String role = iFieldRoleService.deleteFieldRole(controlId.toString(), dstId, data.getUnitId());
        // 发布事件，远程调用 Socket 广播
        Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId).delUnitIds(CollUtil.newArrayList(data.getUnitId()))
            .role(role).operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/batchDeleteRole", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "批量删除字段角色")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
            @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG"),
    })
    public ResponseData<Void> batchDeleteRole(@PathVariable("dstId") @NodeMatch String dstId,
            @PathVariable("fieldId") @FieldMatch String fieldId,
            @RequestBody @Valid BatchFieldRoleDeleteRo data) {
        // 字段是否已经是关闭，预防重复操作
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // 检查操作者是否可以操作字段角色变更，只有管理员和创建者可以
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // 检查添加的组织单元ID是否存在当前空间
        iUnitService.checkInSpace(SpaceHolder.get(), data.getUnitIds());
        // 删除指定单元的角色
        Map<String, List<Long>> roleToUnitIds = iFieldRoleService.deleteFieldRoles(controlId.toString(), data.getUnitIds());
        roleToUnitIds.forEach((role, unitIds) -> {
            // 发布事件，远程调用 Socket 广播
            Arg arg = Arg.builder().event(FIELD_PERMISSION_CHANGE).datasheetId(dstId).fieldId(fieldId).delUnitIds(unitIds)
                    .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
            SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        });
        return ResponseData.success();
    }

    @PostResource(path = "/datasheet/{dstId}/field/{fieldId}/updateRoleSetting", requiredPermission = false)
    @ApiOperation(value = "更新字段角色设置")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstCgcfixAKyeeNsaP"),
        @ApiImplicitParam(name = "fieldId", value = "字段ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fldRg1cGlAFWG")
    })
    public ResponseData<Void> updateRoleSetting(@PathVariable("dstId") @NodeMatch String dstId,
        @PathVariable("fieldId") @FieldMatch String fieldId,
        @RequestBody @Valid FieldControlProp prop) {
        // 字段是否已经是关闭，预防重复操作
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        // 检查操作者是否可以操作字段角色变更，只有管理员和创建者可以
        iFieldRoleService.checkFieldHasOperation(controlId.toString(), MemberHolder.get());
        // 更新设置
        iFieldRoleService.updateFieldRoleProp(SessionContext.getUserId(), controlId.toString(), prop);
        // 发布事件，远程调用 Socket 广播
        Arg arg = Arg.builder().event(FIELD_PERMISSION_SETTING_CHANGE).datasheetId(dstId).fieldId(fieldId).setting(prop)
            .operator(LoginContext.me().getUserSpaceDto(SpaceHolder.get()).getMemberName()).build();
        SpringContextHolder.getApplicationContext().publishEvent(new FieldPermissionEvent(this, arg));
        return ResponseData.success();
    }

    @GetResource(path = "/datasheet/field/permission", requiredLogin = false)
    @ApiOperation(value = "获取多个数表的字段权限集")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "dstIds", value = "数表ID列表", required = true, dataTypeClass = String.class, paramType = "query", example = "dstCgcfixAKyeeNsaP,dstGxznHFXf9pvF1LZ"),
        @ApiImplicitParam(name = "shareId", value = "分享ID", dataTypeClass = String.class, paramType = "query", example = "shrFPXT8qnyFJglX6elJi")
    })
    public ResponseData<List<FieldPermissionView>> getMultiDatasheetFieldPermission(@RequestParam("dstIds") List<String> dstIds,
        @RequestParam(value = "shareId", required = false) String shareId) {
        Long memberId = null;
        if (StrUtil.isBlank(shareId)) {
            // 站内
            String spaceId = iNodeService.getSpaceIdByNodeId(dstIds.stream().findFirst().orElseThrow(() -> new BusinessException(NO_ARG)));
            memberId = iMemberService.getMemberIdByUserIdAndSpaceId(SessionContext.getUserId(), spaceId);
            ExceptionUtil.isNotNull(memberId, NOT_IN_SPACE);
        }
        else {
            // 站外分享
            iNodeShareService.checkShareIfExist(shareId);
        }
        List<FieldPermissionView> views = new ArrayList<>(dstIds.size());
        for (String dstId : dstIds) {
            // 获取数表所有字段的权限
            Map<String, FieldPermissionInfo> fieldPermissionMap = iFieldRoleService.getFieldPermissionMap(memberId, dstId, shareId);
            if (MapUtil.isNotEmpty(fieldPermissionMap)) {
                views.add(new FieldPermissionView(dstId, dstId, fieldPermissionMap));
            }
        }
        return ResponseData.success(views);
    }
}
