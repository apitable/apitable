package com.vikadata.api.modular.developer.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.vika.core.model.GlobalWidgetInfo;
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

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

/**
 * <p>
 * Used for GM command in vika-cli command line tool.(the global widget)
 * </p>
 */
@RestController
@Api(tags = "GM Widget API", hidden = true)
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
    @ApiOperation(value = "Gets a list of global widget stores")
    public ResponseData<List<GlobalWidgetInfo>> globalWidgetList(@RequestBody @Valid GlobalWidgetListRo globalWidgetRo) {
        Long userId = SessionContext.getUserId();
        String nodeId = globalWidgetRo.getNodeId();
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // Verify whether the user exist the space.
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // Check whether the user have permission to view the information
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        return ResponseData.success(iWidgetPackageService.getGlobalWidgetPackageConfiguration(nodeId));
    }

    @PostResource(path = "/widget/global/refresh/db", requiredPermission = false)
    @ApiOperation(value = "Refresh the global component DB data")
    public ResponseData<Void> globalWidgetDbDataRefresh(@RequestBody @Valid GlobalWidgetListRo globalWidgetRo) {
        Long userId = SessionContext.getUserId();
        String nodeId = globalWidgetRo.getNodeId();
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // Verify whether the user exist the space.
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // Check whether the user have permission to view the information
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iWidgetPackageService.globalWidgetDbDataRefresh(nodeId);
        return ResponseData.success();
    }

    @PostResource(path = "/widget/global/refresh/single", requiredPermission = false)
    @ApiOperation(value = "Refresh the data of a single widget(the robot calls)", hidden = true)
    public ResponseData<Void> singleGlobalWidgetRefresh(@RequestBody @Valid SingleGlobalWidgetRo body) {
        Long userId = SessionContext.getUserId();
        String nodeId = body.getNodeId();
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        SpaceHolder.set(spaceId);
        // Verify whether the user exist the space.
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        // Check whether the user have permission to view the information
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        iWidgetPackageService.singleGlobalWidgetRefresh(body);
        return ResponseData.success();
    }

}
