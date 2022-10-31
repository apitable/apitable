package com.vikadata.api.modular.workspace.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.util.page.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.model.ro.widget.WidgetPackageAuthRo;
import com.vikadata.api.model.ro.widget.WidgetPackageBanRo;
import com.vikadata.api.model.ro.widget.WidgetPackageCreateRo;
import com.vikadata.api.model.ro.widget.WidgetPackageReleaseRo;
import com.vikadata.api.model.ro.widget.WidgetPackageReleaseV2Ro;
import com.vikadata.api.model.ro.widget.WidgetPackageRollbackRo;
import com.vikadata.api.model.ro.widget.WidgetPackageSubmitRo;
import com.vikadata.api.model.ro.widget.WidgetPackageSubmitV2Ro;
import com.vikadata.api.model.ro.widget.WidgetPackageUnpublishRo;
import com.vikadata.api.model.ro.widget.WidgetTransferOwnerRo;
import com.vikadata.api.model.vo.widget.WidgetPackageInfoVo;
import com.vikadata.api.model.vo.widget.WidgetReleaseCreateVo;
import com.vikadata.api.model.vo.widget.WidgetReleaseListVo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.workspace.service.IWidgetPackageService;
import com.vikadata.core.support.ResponseData;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

@RestController
@Api(tags = "Widget SDK - Pacakge Api")
@ApiResource(path = "/widget/package")
public class WidgetPackageController {

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    @Resource
    private IGmService iGmService;

    @PostResource(path = "/auth", requiredPermission = false)
    @ApiOperation(value = "Auth widget", notes = "widget-cli widget development authentication verification")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC")
    })
    public ResponseData<Void> widgetAuth(@RequestBody @Valid WidgetPackageAuthRo widget) {
        // There is a unified interceptor check in the upper layer.
        return ResponseData.success();
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "Create widget", notes = "widget-cli initialization create widget")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC")
    })
    public ResponseData<WidgetReleaseCreateVo> createWidget(@RequestBody @Valid WidgetPackageCreateRo widget) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(iWidgetPackageService.createWidget(userId, widget));
    }

    @PostResource(path = "/release", requiredPermission = false)
    @ApiOperation(value = "Release widget", notes = "widget-cli release widget", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC")
    })
    public ResponseData<Void> releaseWidget(@Valid WidgetPackageReleaseRo widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.releaseWidget(userId, widget);
        return ResponseData.success();
    }

    @GetResource(path = "/release/history/{packageId}", requiredPermission = false)
    @ApiOperation(value = "Get widget release history")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
            @ApiImplicitParam(name = "packageId", value = "widget id", required = true, dataTypeClass = Integer.class, paramType = "path", example = "wpkAbc"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "page", dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    public ResponseData<List<WidgetReleaseListVo>> releaseListWidget(@PathVariable(name = "packageId") String packageId, @PageObjectParam(required = false) Page page) {
        Long userId = SessionContext.getUserId();
        return ResponseData.success(iWidgetPackageService.releaseListWidget(userId, packageId, page));
    }

    @PostResource(path = "/rollback", requiredPermission = false)
    @ApiOperation(value = "Rollback widget")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<Void> rollbackWidget(@RequestBody @Valid WidgetPackageRollbackRo widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.rollbackWidget(userId, widget);
        return ResponseData.success();
    }

    @PostResource(path = "/unpublish", requiredPermission = false)
    @ApiOperation(value = "Unpublish widget")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<Void> unpublishWidget(@RequestBody @Valid WidgetPackageUnpublishRo widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.unpublishWidget(userId, widget);
        return ResponseData.success();
    }

    @PostResource(path = "/ban", requiredPermission = false)
    @ApiOperation(value = "Ban/Unban widget", notes = "widget-cli ban/unban widget")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<Void> banWidget(@RequestBody @Valid WidgetPackageBanRo widget) {
        Long userId = SessionContext.getUserId();
        // verify operation permissions
        iGmService.validPermission(userId, Boolean.TRUE.equals(widget.getUnban()) ? GmAction.WIDGET_UNBAN : GmAction.WIDGET_BAN);
        iWidgetPackageService.banWindget(userId, widget);
        return ResponseData.success();
    }

    @GetResource(path = "/{packageId}", requiredPermission = false)
    @ApiOperation(value = "Get widget package info", notes = "widget-cli get widget package info")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
            @ApiImplicitParam(name = HttpHeaders.ACCEPT_LANGUAGE, value = "developer's language", dataTypeClass = String.class, paramType = "header", example = "「en-US/zh-CN」")
    })
    public ResponseData<WidgetPackageInfoVo> getWidgetPackageInfo(@PathVariable("packageId") String packageId) {
        return ResponseData.success(iWidgetPackageService.getWidgetPackageInfo(packageId));
    }

    @GetResource(path = "/store", requiredPermission = false)
    @ApiOperation(value = "Get widget store information", notes = "widget-cli get widget store information")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
            @ApiImplicitParam(name = HttpHeaders.ACCEPT_LANGUAGE, value = "developer's language", dataTypeClass = String.class, paramType = "header", example = "「en-US/zh-CN」")
    })
    public ResponseData<List<WidgetPackageInfoVo>> getWidgetPackageListInfo(@RequestParam("spaceId") String spaceId) {
        return ResponseData.success(iWidgetPackageService.getWidgetPackageListInfo(spaceId));
    }

    @PostResource(path = "/transfer/owner", requiredPermission = false)
    @ApiOperation(value = "Transfer widget owner", notes = "widget-cli transfer widget owner")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
            @ApiImplicitParam(name = HttpHeaders.ACCEPT_LANGUAGE, value = "developer's language", dataTypeClass = String.class, paramType = "header", example = "「en-US/zh-CN」")
    })
    public ResponseData<Void> transferWidgetOwner(@RequestBody @Valid WidgetTransferOwnerRo transferOwnerRo) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.transferWidgetOwner(userId, transferOwnerRo);
        return ResponseData.success();
    }

    @PostResource(path = "/submit", requiredPermission = false)
    @ApiOperation(value = "Submit widget audit", notes = "widget-cli submit widget audit", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer token", required = false, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
            @ApiImplicitParam(name = HttpHeaders.ACCEPT_LANGUAGE, value = "developer's language", dataTypeClass = String.class, paramType = "header", example = "「en-US/zh-CN」")
    })
    public ResponseData<Void> submitWidget(@Valid WidgetPackageSubmitRo widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.submitWidget(userId, widget);
        return ResponseData.success();
    }

    @PostResource(path = "/v2/release", requiredPermission = false)
    @ApiOperation(value = "release widget v2", notes = "widget-cli release widget")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer's token", dataTypeClass = String.class, paramType = "header", example = "AABBCC")
    })
    public ResponseData<Void> releaseWidgetV2(@RequestBody @Valid WidgetPackageReleaseV2Ro widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.releaseWidget(userId, widget);
        return ResponseData.success();
    }

    @PostResource(path = "/v2/submit", requiredPermission = false)
    @ApiOperation(value = "submit widget v2", notes = "widget-cli submit widget")
    @ApiImplicitParams({
            @ApiImplicitParam(name = HttpHeaders.AUTHORIZATION, value = "developer's token", dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
            @ApiImplicitParam(name = HttpHeaders.ACCEPT_LANGUAGE, value = "developer's language", dataTypeClass = String.class, paramType = "header", example = "「en-US/zh-CN」")
    })
    public ResponseData<Void> submitWidgetV2(@RequestBody @Valid WidgetPackageSubmitV2Ro widget) {
        Long userId = SessionContext.getUserId();
        iWidgetPackageService.submitWidget(userId, widget);
        return ResponseData.success();
    }

}
