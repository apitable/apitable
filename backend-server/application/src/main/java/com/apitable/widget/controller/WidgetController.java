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

package com.apitable.widget.controller;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.widget.ro.WidgetStoreListRo;
import com.apitable.widget.vo.WidgetStoreListInfo;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.service.ISpaceService;
import com.apitable.widget.enums.WidgetException;
import com.apitable.widget.mapper.WidgetMapper;
import com.apitable.widget.mapper.WidgetPackageMapper;
import com.apitable.widget.ro.WidgetCopyRo;
import com.apitable.widget.ro.WidgetCreateRo;
import com.apitable.widget.service.IWidgetService;
import com.apitable.widget.vo.WidgetInfo;
import com.apitable.widget.vo.WidgetPack;
import com.apitable.widget.vo.WidgetTemplatePackageInfo;
import com.apitable.workspace.service.INodeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.apitable.workspace.enums.PermissionException.NODE_OPERATION_DENIED;

/**
 * WidgetController.
 */
@RestController
@Api(tags = "Widget SDK - Widget Api")
@ApiResource(path = "/")
public class WidgetController {

    /**
     *
     */
    @Resource
    private ISpaceService iSpaceService;
    /**
     *
     */
    @Resource
    private INodeService iNodeService;
    /**
     *
     */
    @Resource
    private ControlTemplate controlTemplate;
    /**
     *
     */
    @Resource
    private UserSpaceCacheService userSpaceCacheService;
    /**
     *
     */
    @Resource
    private IWidgetService iWidgetService;
    /**
     *
     */
    @Resource
    private WidgetPackageMapper widgetPackageMapper;
    /**
     *
     */
    @Resource
    private WidgetMapper widgetMapper;

    /**
     * Get widget store.
     *
     * @param storeListRo {@link WidgetStoreListRo}
     * @return {@link WidgetStoreListInfo}
     */
    @PostResource(path = "/widget/package/store/list",
        requiredPermission = false)
    @ApiOperation(value = "Get widget store")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id",
        required = true, dataTypeClass = String.class, paramType = "header",
        example = "spczJrh2i3tLW")
    public ResponseData<List<WidgetStoreListInfo>> widgetStoreList(
        @RequestBody @Valid final WidgetStoreListRo storeListRo) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        storeListRo.setLanguage(
            Optional.ofNullable(storeListRo.getLanguage()).orElse(userLocale));
        List<WidgetStoreListInfo> infos = iWidgetService.widgetStoreList(userId,
            spaceId, storeListRo);
        return ResponseData.success(infos);
    }

    /**
     * Get the space widgets.
     *
     * @param spaceId space id
     * @param count   count
     * @return {@link WidgetInfo}
     */
    @GetResource(path = "/space/{spaceId}/widget", requiredPermission = false)
    @ApiOperation(value = "Get the space widgets",
        notes = "get the widgets under the entire space")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "spaceId", value = "space id", required = true,
            dataTypeClass = String.class, paramType = "path",
            example = "spczJrh2i3tLW"),
        @ApiImplicitParam(name = "count", value = "load quantity",
            dataTypeClass = Integer.class, paramType = "query", example = "10")
    })
    public ResponseData<List<WidgetInfo>> findWidgetInfoBySpaceId(
        @PathVariable("spaceId") final String spaceId,
        @RequestParam(value = "count", required = false, defaultValue = "10")
        final Integer count) {
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        List<WidgetInfo> infos = iWidgetService.getWidgetInfoList(spaceId,
            memberId, count);
        return ResponseData.success(infos);
    }

    /**
     * get the widget information of the node.
     *
     * @param nodeId node id
     * @return {@link WidgetInfo}
     */
    @GetResource(path = "/node/{nodeId}/widget", requiredPermission = false)
    @ApiOperation(value = "get the widget information of the node")
    @ApiImplicitParam(name = "nodeId", value = "node id", required = true,
        dataTypeClass = String.class, paramType = "path",
        example = "dstJ2oRZxsh2yld4MA")
    public ResponseData<List<WidgetInfo>> findWidgetInfoByNodeId(
        @PathVariable("nodeId") final String nodeId) {
        Long userId = SessionContext.getUserId();
        // Determine whether the node does not exist or cross-spatial access
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId,
            NodePermission.READ_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        List<WidgetInfo> infos = widgetMapper.selectInfoByNodeId(nodeId);
        return ResponseData.success(infos);
    }

    /**
     * Get the node widget package.
     *
     * @param nodeId node id
     * @param linkId link id
     * @return {@link WidgetPack}
     */
    @GetResource(path = "/node/{nodeId}/widgetPack", requiredLogin = false)
    @ApiOperation(value = "Get the node widget package",
        notes = "Node types are limited to dashboards and datasheet")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id",
            dataTypeClass = String.class, paramType = "header",
            example = "spczJrh2i3tLW"),
        @ApiImplicitParam(name = "nodeId", value = "node id", required = true,
            dataTypeClass = String.class, paramType = "path",
            example = "dstJ2oRZxsh2yld4MA"),
        @ApiImplicitParam(name = "linkId",
            value = "association id：node share id、template id",
            dataTypeClass = String.class, paramType = "query",
            example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<List<WidgetPack>> findWidgetPackByNodeId(
        @PathVariable("nodeId") final String nodeId,
        @RequestParam(value = "linkId", required = false) final String linkId) {
        // Determine whether the node does not exist or cross-spatial access
        String nodeSpaceId =
            iNodeService.checkNodeIfExist(null, nodeId);
        if (StrUtil.isBlank(linkId)) {
            // check permission
            Long userId = SessionContext.getUserId();
            Long memberId = userSpaceCacheService.getMemberId(userId,
                nodeSpaceId);
            controlTemplate.checkNodePermission(memberId, nodeId,
                NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        } else {
            // out of station access
            String spaceId = iSpaceService.getSpaceIdByLinkId(linkId);
            ExceptionUtil.isTrue(nodeSpaceId.equals(spaceId),
                WidgetException.WIDGET_SPACE_ERROR);
        }
        // get all components under the node
        List<String> widgetIds = widgetMapper.selectWidgetIdsByNodeId(nodeId);
        return ResponseData.success(
            iWidgetService.getWidgetPackList(widgetIds));
    }

    /**
     * get widget info by widget id.
     *
     * @param widgetIds widget id list
     * @param linkId    link id
     * @param userId    user id
     * @return {@link WidgetPack}
     */
    @GetResource(path = "/widget/get", requiredLogin = false)
    @ApiOperation(value = "Get widget info",
        notes = "get widget info by widget id")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "widgetIds", value = "widget ids",
            required = true, dataTypeClass = String.class, paramType = "query",
            example = "wdtlMDweJzTsbSJAFY,wdt923ZpvvRhD8kVLs"),
        @ApiImplicitParam(name = "linkId",
            value = "Association ID: node sharing ID and template ID",
            dataTypeClass = String.class, paramType = "query",
            example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<List<WidgetPack>> findWidgetPackByWidgetIds(
        @RequestParam("widgetIds") final List<String> widgetIds,
        @RequestParam(value = "linkId", required = false) final String linkId,
        @RequestParam(value = "userId", required = false) final String userId) {
        ExceptionUtil.isNotEmpty(widgetIds, ParameterException.INCORRECT_ARG);
        String widgetSpaceId = iWidgetService.checkByWidgetIds(widgetIds);
        if (StrUtil.isBlank(linkId)) {
            // prevent access to unadded spaces
            userSpaceCacheService.getMemberId(SessionContext.getUserId(),
                widgetSpaceId);
        } else {
            if (StrUtil.isBlank(userId)) {
                // out of station access
                String spaceId = iSpaceService.getSpaceIdByLinkId(linkId);
                ExceptionUtil.isTrue(widgetSpaceId.equals(spaceId),
                    WidgetException.WIDGET_SPACE_ERROR);
            }
        }
        return ResponseData.success(
            iWidgetService.getWidgetPackList(widgetIds));
    }

    /**
     * Create widget.
     *
     * @param widget {@link WidgetCreateRo}
     * @return {@link WidgetPack>}
     */
    @PostResource(path = "/widget/create", requiredPermission = false)
    @ApiOperation(value = "Create widget",
        notes = "Scenario:1、dashboard new applet "
            + "2、datasheet widget panel new widget")
    public ResponseData<WidgetPack> createWidget(
        @RequestBody @Valid final WidgetCreateRo widget) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(widget.getNodeId());
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, widget.getNodeId(),
            NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // create widget
        String widgetId = iWidgetService.create(userId, spaceId, widget);
        return ResponseData.success(iWidgetService.getWidgetPack(widgetId));
    }

    /**
     * Copy widget.
     *
     * @param widgetRo {@link WidgetCopyRo}
     * @return {@link WidgetPack}
     */
    @PostResource(path = "/widget/copy", requiredPermission = false)
    @ApiOperation(value = "Copy widget",
        notes = "Scenario: 1、dashboard import widget"
            + " 2、the widget panel sends applets to the dashboard")
    public ResponseData<List<WidgetPack>> copyWidget(
        @RequestBody @Valid final WidgetCopyRo widgetRo) {
        Long userId = SessionContext.getUserId();
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(
            widgetRo.getDashboardId());
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, widgetRo.getDashboardId(),
            NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // copy widget
        Collection<String> widgetIds = iWidgetService.copyToDashboard(userId,
            spaceId, widgetRo.getDashboardId(), widgetRo.getWidgetIds());
        return ResponseData.success(
            iWidgetService.getWidgetPackList(widgetIds));
    }

    /**
     * Get package teamplates.
     *
     * @return {@link WidgetTemplatePackageInfo}
     */
    @GetResource(path = "/widget/template/package/list",
        requiredPermission = false)
    @ApiOperation(value = "Get package teamplates")
    public ResponseData<List<WidgetTemplatePackageInfo>>
    findTemplatePackageList() {
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        List<WidgetTemplatePackageInfo> data =
            widgetPackageMapper.selectWidgetTemplatePackageList(userLocale);
        return ResponseData.success(data);
    }

}
