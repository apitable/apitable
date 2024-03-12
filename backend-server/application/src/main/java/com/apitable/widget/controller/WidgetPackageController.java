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

import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.util.page.PageObjectParam;
import com.apitable.widget.ro.WidgetPackageCreateRo;
import com.apitable.widget.ro.WidgetPackageReleaseV2Ro;
import com.apitable.widget.ro.WidgetPackageRollbackRo;
import com.apitable.widget.ro.WidgetPackageSubmitV2Ro;
import com.apitable.widget.ro.WidgetPackageUnpublishRo;
import com.apitable.widget.ro.WidgetTransferOwnerRo;
import com.apitable.widget.service.IWidgetPackageService;
import com.apitable.widget.vo.WidgetPackageInfoVo;
import com.apitable.widget.vo.WidgetReleaseCreateVo;
import com.apitable.widget.vo.WidgetReleaseListVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Widget SDK - Package Api.
 */
@RestController
@Tag(name = "Widget SDK - Package Api")
@ApiResource(path = "/widget/package")
public class WidgetPackageController {

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    /**
     * Create widget.
     */
    @PostResource(path = "/create", requiredPermission = false)
    @Operation(summary = "Create widget",
        description = "widget-cli initialization create widget")
    @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
        description = "developer token", required = true,
        schema = @Schema(type = "string"), example = "Bearer uskaoeiu")
    public ResponseData<WidgetReleaseCreateVo> createWidget(
        @RequestBody @Valid WidgetPackageCreateRo widget) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(iWidgetPackageService.createWidget(userId, widget));
    }

    /**
     * Get widget release history.
     */
    @GetResource(path = "/release/history/{packageId}", requiredPermission = false)
    @Operation(summary = "Get widget release history")
    @Parameters({
        @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
            description = "developer token", required = true,
            schema = @Schema(type = "string"), example = "Bearer uskaoeiu"),
        @Parameter(name = "packageId", in = ParameterIn.PATH,
            description = "widget package id", required = true,
            schema = @Schema(type = "integer"), example = "wpkAbc"),
        @Parameter(name = PAGE_PARAM, in = ParameterIn.QUERY, description = "page",
            schema = @Schema(type = "string"), example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({"rawtypes", "unchecked"})
    public ResponseData<List<WidgetReleaseListVo>> releaseListWidget(
        @PathVariable(name = "packageId") String packageId,
        @PageObjectParam(required = false) Page page) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(
            iWidgetPackageService.releaseListWidget(userId, packageId, page));
    }

    /**
     * Rollback widget.
     */
    @PostResource(path = "/rollback", requiredPermission = false)
    @Operation(summary = "Rollback widget")
    @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
        description = "developer token", required = true,
        schema = @Schema(type = "string"), example = "Bearer uskaoeiu")
    public ResponseData<Void> rollbackWidget(@RequestBody @Valid WidgetPackageRollbackRo widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.rollbackWidget(userId, widget);
        return ResponseData.success();
    }

    /**
     * Unpublish widget.
     */
    @PostResource(path = "/unpublish", requiredPermission = false)
    @Operation(summary = "Unpublish widget")
    @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
        description = "developer token", required = true,
        schema = @Schema(type = "string"), example = "Bearer uskaoeiu")
    public ResponseData<Void> unpublishWidget(@RequestBody @Valid WidgetPackageUnpublishRo widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.unpublishWidget(userId, widget);
        return ResponseData.success();
    }

    /**
     * Get widget package info.
     */
    @GetResource(path = "/{packageId}", requiredPermission = false)
    @Operation(summary = "Get widget package info",
        description = "widget-cli get widget package info")
    @Parameters({
        @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
            description = "developer token", required = true,
            schema = @Schema(type = "string"), example = "Bearer uskaoeiu"),
        @Parameter(name = HttpHeaders.ACCEPT_LANGUAGE, in = ParameterIn.HEADER,
            description = "developer's language",
            schema = @Schema(type = "string"), example = "「en-US/zh-CN」")
    })
    public ResponseData<WidgetPackageInfoVo> getWidgetPackageInfo(
        @PathVariable("packageId") String packageId) {
        return ResponseData.success(iWidgetPackageService.getWidgetPackageInfo(packageId));
    }

    /**
     * Get widget store information.
     */
    @GetResource(path = "/store", requiredPermission = false)
    @Operation(summary = "Get widget store information",
        description = "widget-cli get widget store information")
    @Parameters({
        @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
            description = "developer token", required = true,
            schema = @Schema(type = "string"), example = "Bearer uskaoeiu"),
        @Parameter(name = HttpHeaders.ACCEPT_LANGUAGE, in = ParameterIn.HEADER,
            description = "developer's language",
            schema = @Schema(type = "string"), example = "「en-US/zh-CN」")
    })
    public ResponseData<List<WidgetPackageInfoVo>> getWidgetPackageListInfo(
        @RequestParam("spaceId") String spaceId) {
        return ResponseData.success(iWidgetPackageService.getWidgetPackageListInfo(spaceId));
    }

    /**
     * Transfer widget owner.
     */
    @PostResource(path = "/transfer/owner", requiredPermission = false)
    @Operation(summary = "Transfer widget owner",
        description = "widget-cli transfer widget owner")
    @Parameters({
        @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
            description = "developer token", required = true,
            schema = @Schema(type = "string"), example = "Bearer uskaoeiu"),
        @Parameter(name = HttpHeaders.ACCEPT_LANGUAGE, in = ParameterIn.HEADER,
            description = "developer's language",
            schema = @Schema(type = "string"), example = "「en-US/zh-CN」")
    })
    public ResponseData<Void> transferWidgetOwner(
        @RequestBody @Valid WidgetTransferOwnerRo transferOwnerRo) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.transferWidgetOwner(userId, transferOwnerRo);
        return ResponseData.success();
    }

    /**
     * release widget v2.
     */
    @PostResource(path = "/v2/release", requiredPermission = false)
    @Operation(summary = "release widget v2", description = "widget-cli release widget")
    @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
        description = "developer token", required = true,
        schema = @Schema(type = "string"), example = "Bearer uskaoeiu")
    public ResponseData<Void> releaseWidgetV2(@RequestBody @Valid WidgetPackageReleaseV2Ro widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.releaseWidget(userId, widget);
        return ResponseData.success();
    }

    /**
     * submit widget v2.
     */
    @PostResource(path = "/v2/submit", requiredPermission = false)
    @Operation(summary = "submit widget v2", description = "widget-cli submit widget")
    @Parameters({
        @Parameter(name = HttpHeaders.AUTHORIZATION, in = ParameterIn.HEADER,
            description = "developer token", required = true,
            schema = @Schema(type = "string"), example = "Bearer uskaoeiu"),
        @Parameter(name = HttpHeaders.ACCEPT_LANGUAGE, in = ParameterIn.HEADER,
            description = "developer's language",
            schema = @Schema(type = "string"), example = "「en-US/zh-CN」")
    })
    public ResponseData<Void> submitWidgetV2(@RequestBody @Valid WidgetPackageSubmitV2Ro widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.submitWidget(userId, widget);
        return ResponseData.success();
    }

}
