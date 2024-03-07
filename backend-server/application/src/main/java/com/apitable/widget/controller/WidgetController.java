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

import static com.apitable.base.enums.ParameterException.NO_ARG;
import static com.apitable.workspace.enums.PermissionException.NODE_OPERATION_DENIED;

import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.ParameterException;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.util.IdUtil;
import com.apitable.space.service.ISpaceService;
import com.apitable.widget.enums.WidgetException;
import com.apitable.widget.mapper.WidgetMapper;
import com.apitable.widget.mapper.WidgetPackageMapper;
import com.apitable.widget.ro.WidgetCopyRo;
import com.apitable.widget.ro.WidgetCreateRo;
import com.apitable.widget.ro.WidgetStoreListRo;
import com.apitable.widget.service.IWidgetService;
import com.apitable.widget.vo.WidgetInfo;
import com.apitable.widget.vo.WidgetPack;
import com.apitable.widget.vo.WidgetStoreListInfo;
import com.apitable.widget.vo.WidgetTemplatePackageInfo;
import com.apitable.workspace.service.INodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * WidgetController.
 */
@RestController
@Tag(name = "Widget SDK - Widget Api")
@ApiResource
public class WidgetController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private WidgetPackageMapper widgetPackageMapper;

    @Resource
    private WidgetMapper widgetMapper;

    @Resource
    private IMemberService iMemberService;

    /**
     * Get widget store.
     */
    @PostResource(path = "/widget/package/store/list",
        requiredPermission = false)
    @Operation(summary = "Get widget store")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id",
        required = true, schema = @Schema(type = "string"), in = ParameterIn.HEADER,
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
     */
    @GetResource(path = "/space/{spaceId}/widget", requiredPermission = false)
    @Operation(summary = "Get the space widgets",
        description = "get the widgets under the entire space")
    @Parameters({
        @Parameter(name = "spaceId", description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH,
            example = "spczJrh2i3tLW"),
        @Parameter(name = "count", description = "load quantity",
            schema = @Schema(type = "integer"), in = ParameterIn.QUERY, example = "10"),
        @Parameter(name = "unitType", description = "unitType, 3: member(private), 1: team",
            schema = @Schema(type = "integer"), example = "3", in = ParameterIn.QUERY)
    })
    public ResponseData<List<WidgetInfo>> findWidgetInfoBySpaceId(
        @PathVariable("spaceId") final String spaceId,
        @RequestParam(value = "count", required = false, defaultValue = "10") final Integer count,
        @RequestParam(name = "unitType", required = false) Integer unitType) {
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        List<WidgetInfo> infos = iWidgetService.getWidgetInfoList(spaceId,
            memberId, count);
        if (UnitType.MEMBER.getType().equals(unitType)) {
            infos = infos.stream().filter(WidgetInfo::getNodePrivate).toList();
        }
        if (UnitType.TEAM.getType().equals(unitType)) {
            infos = infos.stream().filter(i -> !i.getNodePrivate()).toList();
        }
        return ResponseData.success(infos);
    }

    /**
     * get the widget information of the node.
     */
    @GetResource(path = "/node/{nodeId}/widget", requiredPermission = false)
    @Operation(summary = "get the widget information of the node")
    @Parameter(name = "nodeId", description = "node id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.PATH,
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
     */
    @GetResource(path = "/node/{nodeId}/widgetPack", requiredLogin = false)
    @Operation(summary = "Get the node widget package",
        description = "Node types are limited to dashboards and datasheet")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER,
            example = "spczJrh2i3tLW"),
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH,
            example = "dstJ2oRZxsh2yld4MA"),
        @Parameter(name = "linkId",
            description = "association id：node share id、template id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY,
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
     */
    @GetResource(path = "/widget/get", requiredLogin = false)
    @Operation(summary = "Get widget info",
        description = "get widget info by widget id")
    @Parameters({
        @Parameter(name = "widgetIds", description = "widget ids",
            required = true, schema = @Schema(type = "string"), in = ParameterIn.QUERY,
            example = "wdtlMDweJzTsbSJAFY,wdt923ZpvvRhD8kVLs"),
        @Parameter(name = "linkId",
            description = "Association ID: node sharing ID and template ID",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY,
            example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<List<WidgetPack>> findWidgetPackByWidgetIds(
        @RequestParam("widgetIds") final List<String> widgetIds,
        @RequestParam(value = "linkId", required = false) final String linkId) {
        ExceptionUtil.isNotEmpty(widgetIds, ParameterException.INCORRECT_ARG);
        String widgetSpaceId = iWidgetService.checkByWidgetIds(widgetIds);
        if (StrUtil.isBlank(linkId)) {
            Long userId = SessionContext.getUserIdWithoutException();
            if (null != userId) {
                // prevent access to unadded spaces
                iMemberService.checkUserIfInSpace(SessionContext.getUserId(), widgetSpaceId);
            }
        } else {
            if (!IdUtil.isEmbed(linkId)) {
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
     */
    @PostResource(path = "/widget/create", requiredPermission = false)
    @Operation(summary = "Create widget",
        description = "Scenario:1、dashboard new applet "
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
        // Check the number of running installations
        iSpaceService.checkWidgetOverLimit(spaceId);
        // create widget
        String widgetId = iWidgetService.create(userId, spaceId, widget);
        return ResponseData.success(iWidgetService.getWidgetPack(widgetId));
    }

    /**
     * Copy widget.
     */
    @PostResource(path = "/widget/copy", requiredPermission = false)
    @Operation(summary = "Copy widget",
        description = "Scenario: 1、dashboard import widget"
            + "2:the widget panel sends applets to the dashboard; 3:copy widget")
    public ResponseData<List<WidgetPack>> copyWidget(
        @RequestBody @Valid final WidgetCopyRo widgetRo) {
        Long userId = SessionContext.getUserId();
        String nodeId = widgetRo.getNodeId();
        ExceptionUtil.isNotBlank(nodeId, NO_ARG);
        // The method includes determining whether a node exists.
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // The method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // check permission
        controlTemplate.checkNodePermission(memberId, nodeId,
            NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // Check the number of running installations
        iSpaceService.checkWidgetOverLimit(spaceId);
        // copy widget
        Collection<String> widgetIds = iWidgetService.copyWidget(userId,
            spaceId, nodeId, widgetRo.getWidgetIds());
        return ResponseData.success(
            iWidgetService.getWidgetPackList(widgetIds));
    }

    /**
     * Get package teamplates.
     */
    @GetResource(path = "/widget/template/package/list",
        requiredPermission = false)
    @Operation(summary = "Get package teamplates")
    public ResponseData<List<WidgetTemplatePackageInfo>> findTemplatePackageList() {
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        List<WidgetTemplatePackageInfo> data =
            widgetPackageMapper.selectWidgetTemplatePackageList(userLocale);
        return ResponseData.success(data);
    }

}
