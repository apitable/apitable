package com.vikadata.api.modular.appstore.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.api.modular.appstore.model.CreateAppInstance;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 应用管理库接口
 * @author Shawn Deng
 * @date 2022-01-12 10:27:47
 */
@RestController
@Api(tags = "应用管理_应用管理相关服务接口")
@ApiResource(name = "应用管理库接口", path = "/")
public class AppInstanceController {

    @Resource
    private IAppInstanceService iAppInstanceService;

    @GetResource(path = "/appInstances", requiredPermission = false)
    @ApiOperation(value = "查询应用实例列表", notes = "目前接口是全量查询, 后面会提供分页查询功能，可以不用传递分页参数")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "空间ID", required = true, dataTypeClass = String.class, paramType = "path", example = "spc123456"),
            @ApiImplicitParam(name = "pageIndex", value = "页索引", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageSize", value = "每页数量", dataTypeClass = String.class, paramType = "query", example = "50"),
            @ApiImplicitParam(name = "orderBy", value = "排序字段", dataTypeClass = String.class, paramType = "query", example = "createdAt"),
            @ApiImplicitParam(name = "sortBy", value = "排序规则,asc=正序,desc=倒序", dataTypeClass = String.class, paramType = "query", example = "desc")
    })
    public ResponseData<PageInfo<AppInstance>> fetchAppInstances(@RequestParam("spaceId") String spaceId,
            @RequestParam(name = "pageIndex", required = false, defaultValue = "1") Integer pageIndex,
            @RequestParam(name = "pageSize", required = false, defaultValue = "50") Integer pageSize,
            @RequestParam(name = "orderBy", required = false, defaultValue = "createdAt") String orderBy,
            @RequestParam(name = "sortBy", required = false, defaultValue = "desc") String sortBy) {
        // 同步应用市场的数据
        iAppInstanceService.compatibleMarketPlace(spaceId);
        List<AppInstance> appInstances = iAppInstanceService.getAppInstancesBySpaceId(spaceId);
        return ResponseData.success(PageHelper.build(pageIndex, pageSize, appInstances.size(), appInstances));
    }

    @GetResource(path = "/appInstances/{appInstanceId}", requiredPermission = false)
    @ApiOperation(value = "获取单个应用实例配置", notes = "根据应用实例ID获取配置")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "应用实例标识", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<AppInstance> getAppInstance(@PathVariable("appInstanceId") String appInstanceId) {
        return ResponseData.success(iAppInstanceService.getAppInstance(appInstanceId));
    }

    @PostResource(path = "/appInstances", requiredPermission = false)
    @ApiOperation(value = "创建应用实例", notes = "开通应用实例")
    public ResponseData<AppInstance> createAppInstance(@RequestBody @Valid CreateAppInstance data) {
        return ResponseData.success(iAppInstanceService.createInstance(data.getSpaceId(), data.getAppId()));
    }

    @PostResource(path = "/appInstances/{appInstanceId}/enable", requiredPermission = false)
    @ApiOperation(value = "启用应用", notes = "应用实例是被停用状态下，空间站重新启用应用", hidden = true)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "应用实例标识", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<Void> enable(@PathVariable("appInstanceId") String appInstanceId) {
        iAppInstanceService.updateAppInstanceStatus(appInstanceId, true);
        return ResponseData.success();
    }

    @PostResource(path = "/appInstances/{appInstanceId}/disable", requiredPermission = false)
    @ApiOperation(value = "停用应用", notes = "空间站主动停用应用", hidden = true)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "应用实例标识", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<Void> disable(@PathVariable("appInstanceId") String appInstanceId) {
        iAppInstanceService.updateAppInstanceStatus(appInstanceId, false);
        return ResponseData.success();
    }

    @PostResource(path = "/appInstances/{appInstanceId}", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "删除应用", notes = "空间站主动删除应用")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "应用实例标识", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<Void> delete(@PathVariable("appInstanceId") String appInstanceId) {
        Long userId = SessionContext.getUserId();
        iAppInstanceService.deleteAppInstance(userId, appInstanceId);
        return ResponseData.success();
    }
}
