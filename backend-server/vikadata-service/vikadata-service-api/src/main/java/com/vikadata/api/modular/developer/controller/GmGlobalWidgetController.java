package com.vikadata.api.modular.developer.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.modular.developer.model.GlobalWidgetListRo;
import com.vikadata.api.modular.developer.model.SingleGlobalWidgetRo;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.IWidgetPackageService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.integration.vika.model.GlobalWidgetInfo;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

/**
 * <p>
 * 用于vika-cli命令行工具中的GM指令（全局小组件）
 * </p>
 *
 * @author Pengap
 * @date 2021/9/30 11:50:01
 */
@RestController
@Api(tags = "小组件接口", hidden = true)
@ApiResource(path = "/gm")
@Slf4j
public class GmGlobalWidgetController {

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ControlTemplate controlTemplate;

    @PostResource(path = "/widget/global/list", requiredPermission = false)
    @ApiOperation(value = "获取全局小组件商店列表")
    public ResponseData<List<GlobalWidgetInfo>> globalWidgetList(@RequestBody @Valid GlobalWidgetListRo globalWidgetRo) {
        Long userId = SessionContext.getUserId();
        String nodeId = globalWidgetRo.getNodeId();
        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 校验用户是否在此空间
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // 校验是否有权限查看
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        return ResponseData.success(iWidgetPackageService.getGlobalWidgetPackageConfiguration(nodeId));
    }

    @PostResource(path = "/widget/global/refresh/db", requiredPermission = false)
    @ApiOperation(value = "刷新全局小组件DB数据")
    public ResponseData<Void> globalWidgetDbDataRefresh(@RequestBody @Valid GlobalWidgetListRo globalWidgetRo) {
        Long userId = SessionContext.getUserId();
        String nodeId = globalWidgetRo.getNodeId();
        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 校验用户是否在此空间
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // 校验是否有权限查看
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iWidgetPackageService.globalWidgetDbDataRefresh(nodeId);
        return ResponseData.success();
    }

    @PostResource(path = "/widget/global/refresh/single", requiredPermission = false)
    @ApiOperation(value = "刷新单个小组件数据，机器人调用", hidden = true)
    public ResponseData<Void> singleGlobalWidgetRefresh(@RequestBody @Valid SingleGlobalWidgetRo body) {
        Long userId = SessionContext.getUserId();
        String nodeId = body.getNodeId();
        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // 校验用户是否在此空间
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // 校验是否有权限查看
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iWidgetPackageService.singleGlobalWidgetRefresh(body);
        return ResponseData.success();
    }

}
