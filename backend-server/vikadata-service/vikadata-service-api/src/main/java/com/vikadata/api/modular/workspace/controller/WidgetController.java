package com.vikadata.api.modular.workspace.controller;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.exception.WidgetException;
import com.vikadata.api.model.ro.widget.WidgetCopyRo;
import com.vikadata.api.model.ro.widget.WidgetCreateRo;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetInfo;
import com.vikadata.api.model.vo.widget.WidgetPack;
import com.vikadata.api.model.vo.widget.WidgetPackageInfo;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;
import com.vikadata.api.model.vo.widget.WidgetTemplatePackageInfo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.workspace.mapper.WidgetMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageMapper;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.IWidgetService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

@RestController
@Api(tags = "Widget SDK - Widget Api")
@ApiResource(path = "/")
public class WidgetController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private WidgetPackageMapper widgetPackageMapper;

    @Resource
    private WidgetMapper widgetMapper;

    @GetResource(path = "/widget/package/list", requiredPermission = false)
    @ApiOperation(value = "Get widget package - will abandoned", notes = "api can be deleted after upgrading version 0.8.2")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "filter", value = "whether to filter unpublished widgets", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query", example = "true")
    })
    @Deprecated
    public ResponseData<List<WidgetPackageInfo>> findPackageList(@RequestParam(name = "filter", required = false, defaultValue = "false") Boolean filter) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        List<WidgetPackageInfo> infos = widgetPackageMapper.selectWidgetPackageList(userId, spaceId, filter, userLocale);
        return ResponseData.success(infos);
    }

    @PostResource(path = "/widget/package/store/list", requiredPermission = false)
    @ApiOperation(value = "Get widget store")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<List<WidgetStoreListInfo>> widgetStoreList(@RequestBody @Valid WidgetStoreListRo storeListRo) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        storeListRo.setLanguage(Optional.ofNullable(storeListRo.getLanguage()).orElse(userLocale));
        List<WidgetStoreListInfo> infos = iWidgetService.widgetStoreList(userId, spaceId, storeListRo);
        return ResponseData.success(infos);
    }

    @GetResource(path = "/space/{spaceId}/widget", requiredPermission = false)
    @ApiOperation(value = "Get the space widgets", notes = "get the widgets under the entire space")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "count", value = "load quantity", dataTypeClass = Integer.class, paramType = "query", example = "10")
    })
    public ResponseData<List<WidgetInfo>> findWidgetInfoBySpaceId(@PathVariable("spaceId") String spaceId,
            @RequestParam(value = "count", required = false, defaultValue = "10") Integer count) {
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        List<WidgetInfo> infos = iWidgetService.getWidgetInfoList(spaceId, memberId, count);
        return ResponseData.success(infos);
    }

    @GetResource(path = "/node/{nodeId}/widget", requiredPermission = false)
    @ApiOperation(value = "get the widget information of the node")
    @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstJ2oRZxsh2yld4MA")
    public ResponseData<List<WidgetInfo>> findWidgetInfoByNodeId(@PathVariable("nodeId") String nodeId) {
        Long userId = SessionContext.getUserId();
        // Determine whether the node does not exist or cross-spatial access
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        List<WidgetInfo> infos = widgetMapper.selectInfoByNodeId(nodeId);
        return ResponseData.success(infos);
    }

    @GetResource(path = "/node/{nodeId}/widgetPack", requiredLogin = false)
    @ApiOperation(value = "Get the node widget package", notes = "Node types are limited to dashboards and datasheet")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "dstJ2oRZxsh2yld4MA"),
            @ApiImplicitParam(name = "linkId", value = "association id：node share id、template id", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<List<WidgetPack>> findWidgetPackByNodeId(@PathVariable("nodeId") String nodeId,
            @RequestParam(value = "linkId", required = false) String linkId) {
        // Determine whether the node does not exist or cross-spatial access
        String nodeSpaceId = iNodeService.checkNodeIfExist(null, nodeId);
        if (StrUtil.isBlank(linkId)) {
            // check permission
            Long userId = SessionContext.getUserId();
            Long memberId = userSpaceService.getMemberId(userId, nodeSpaceId);
            controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        }
        else {
            // out of station access
            String spaceId = iSpaceService.getSpaceIdByLinkId(linkId);
            ExceptionUtil.isTrue(nodeSpaceId.equals(spaceId), WidgetException.WIDGET_SPACE_ERROR);
        }
        // get all components under the node
        List<String> widgetIds = widgetMapper.selectWidgetIdsByNodeId(nodeId);
        return ResponseData.success(iWidgetService.getWidgetPackList(widgetIds));
    }

    @GetResource(path = "/widget/get", requiredLogin = false)
    @ApiOperation(value = "Get widget info", notes = "get widget info by widget id")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "widgetIds", value = "widget ids", required = true, dataTypeClass = String.class, paramType = "query", example = "wdtlMDweJzTsbSJAFY,wdt923ZpvvRhD8kVLs"),
            @ApiImplicitParam(name = "linkId", value = "Association ID: node sharing ID and template ID", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<List<WidgetPack>> findWidgetPackByWidgetIds(@RequestParam("widgetIds") List<String> widgetIds,
            @RequestParam(value = "linkId", required = false) String linkId) {
        ExceptionUtil.isNotEmpty(widgetIds, ParameterException.INCORRECT_ARG);
        String widgetSpaceId = iWidgetService.checkByWidgetIds(widgetIds);
        if (StrUtil.isBlank(linkId)) {
            Long userId = SessionContext.getUserId();
            // prevent access to unadded spaces
            userSpaceService.getMemberId(userId, widgetSpaceId);
        }
        else {
            // out of station access
            String spaceId = iSpaceService.getSpaceIdByLinkId(linkId);
            ExceptionUtil.isTrue(widgetSpaceId.equals(spaceId), WidgetException.WIDGET_SPACE_ERROR);
        }
        return ResponseData.success(iWidgetService.getWidgetPackList(widgetIds));
    }

    @PostResource(path = "/widget/create", requiredPermission = false)
    @ApiOperation(value = "Create widget", notes = "Scenario:1、dashboard new applet 2、datasheet widget panel new widget")
    public ResponseData<WidgetPack> createWidget(@RequestBody @Valid WidgetCreateRo widget) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(widget.getNodeId());
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, widget.getNodeId(), NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // create widget
        String widgetId = iWidgetService.create(userId, spaceId, widget);
        return ResponseData.success(iWidgetService.getWidgetPack(widgetId));
    }

    @PostResource(path = "/widget/copy", requiredPermission = false)
    @ApiOperation(value = "Copy widget", notes = "Scenario: 1、dashboard import widget 2、the widget panel sends applets to the dashboard")
    public ResponseData<List<WidgetPack>> copyWidget(@RequestBody @Valid WidgetCopyRo widgetRo) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(widgetRo.getDashboardId());
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, widgetRo.getDashboardId(), NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // copy widget
        Collection<String> widgetIds = iWidgetService.copyToDashboard(userId, spaceId, widgetRo.getDashboardId(), widgetRo.getWidgetIds());
        return ResponseData.success(iWidgetService.getWidgetPackList(widgetIds));
    }

    @GetResource(path = "/widget/template/package/list", requiredPermission = false)
    @ApiOperation(value = "Get package teamplates")
    public ResponseData<List<WidgetTemplatePackageInfo>> findTemplatePackageList() {
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        List<WidgetTemplatePackageInfo> data = widgetPackageMapper.selectWidgetTemplatePackageList(userLocale);
        return ResponseData.success(data);
    }

}
