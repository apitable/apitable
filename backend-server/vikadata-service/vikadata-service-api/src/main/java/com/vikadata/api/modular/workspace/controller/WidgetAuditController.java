package com.vikadata.api.modular.workspace.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.FieldPermission;
import com.vikadata.api.model.ro.widget.WidgetAuditGlobalIdRo;
import com.vikadata.api.model.ro.widget.WidgetAuditSubmitDataRo;
import com.vikadata.api.model.vo.widget.WidgetIssuedGlobalIdVo;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.IWidgetAuditService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

/**
 * <p>
 * 小程序审核模块_小程序管理接口
 * </p>
 *
 * @author Pengap
 * @date 2021/7/7
 */
@RestController
@Api(tags = "小程序审核模块_小程序管理接口")
@ApiResource(path = "/widget/audit")
public class WidgetAuditController {

    @Resource
    private IWidgetAuditService iWidgetAuditService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ControlTemplate controlTemplate;

    @PostResource(path = "/issued/globalId", requiredPermission = false)
    @ApiOperation(value = "发行全局ID", notes = "发行全局ID")
    public ResponseData<WidgetIssuedGlobalIdVo> issuedGlobalId(@RequestBody @Valid WidgetAuditGlobalIdRo body) {
        Long userId = SessionContext.getUserId();
        String dstId = body.getDstId();
        String fieldId = body.getFieldId();

        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
        // 校验用户是否在此空间
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        controlTemplate.checkFieldPermission(memberId, dstId, fieldId, FieldPermission.EDIT_FIELD_DATA,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));

        WidgetIssuedGlobalIdVo result = new WidgetIssuedGlobalIdVo();
        result.setIssuedGlobalId(iWidgetAuditService.issuedGlobalId(userId, body));
        return ResponseData.success(result);
    }

    @PostResource(path = "/submit/data", requiredPermission = false)
    @ApiOperation(value = "审核全局小组件submit数据", notes = "审核全局小组件submit数据")
    public ResponseData<Void> auditSubmitData(@RequestBody @Valid WidgetAuditSubmitDataRo body) {
        Long userId = SessionContext.getUserId();
        String dstId = body.getDstId();
        String fieldId = body.getFieldId();

        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
        // 校验用户是否在此空间
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        controlTemplate.checkFieldPermission(memberId, dstId, fieldId, FieldPermission.EDIT_FIELD_DATA,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));

        iWidgetAuditService.auditSubmitData(userId, body);
        return ResponseData.success();
    }
}
