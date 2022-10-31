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
 * Application management library interface
 */
@RestController
@Api(tags = "Application management_Application management related service interface")
@ApiResource(name = "Application management library interface", path = "/")
public class AppInstanceController {

    @Resource
    private IAppInstanceService iAppInstanceService;

    @GetResource(path = "/appInstances", requiredPermission = false)
    @ApiOperation(value = "Query the application instance list", notes = "At present, the interface is full query, and the paging query function will be provided later, so you don't need to pass paging parameters")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "Space ID", required = true, dataTypeClass = String.class, paramType = "path", example = "spc123456"),
            @ApiImplicitParam(name = "pageIndex", value = "Page Index", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageSize", value = "Quantity per page", dataTypeClass = String.class, paramType = "query", example = "50"),
            @ApiImplicitParam(name = "orderBy", value = "Sort field", dataTypeClass = String.class, paramType = "query", example = "createdAt"),
            @ApiImplicitParam(name = "sortBy", value = "Collation,asc=positive sequence,desc=Reverse order", dataTypeClass = String.class, paramType = "query", example = "desc")
    })
    public ResponseData<PageInfo<AppInstance>> fetchAppInstances(@RequestParam("spaceId") String spaceId,
            @RequestParam(name = "pageIndex", required = false, defaultValue = "1") Integer pageIndex,
            @RequestParam(name = "pageSize", required = false, defaultValue = "50") Integer pageSize,
            @RequestParam(name = "orderBy", required = false, defaultValue = "createdAt") String orderBy,
            @RequestParam(name = "sortBy", required = false, defaultValue = "desc") String sortBy) {
        // Synchronize application market data
        iAppInstanceService.compatibleMarketPlace(spaceId);
        List<AppInstance> appInstances = iAppInstanceService.getAppInstancesBySpaceId(spaceId);
        return ResponseData.success(PageHelper.build(pageIndex, pageSize, appInstances.size(), appInstances));
    }

    @GetResource(path = "/appInstances/{appInstanceId}", requiredPermission = false)
    @ApiOperation(value = "Get the configuration of a single application instance", notes = "Get the configuration according to the application instance ID")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "Application instance ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<AppInstance> getAppInstance(@PathVariable("appInstanceId") String appInstanceId) {
        return ResponseData.success(iAppInstanceService.getAppInstance(appInstanceId));
    }

    @PostResource(path = "/appInstances", requiredPermission = false)
    @ApiOperation(value = "Create an application instance", notes = "Opening an application instance")
    public ResponseData<AppInstance> createAppInstance(@RequestBody @Valid CreateAppInstance data) {
        return ResponseData.success(iAppInstanceService.createInstance(data.getSpaceId(), data.getAppId()));
    }

    @PostResource(path = "/appInstances/{appInstanceId}/enable", requiredPermission = false)
    @ApiOperation(value = "Enable apps", notes = "When the application instance is disabled, the space station re enables the application", hidden = true)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "Application instance ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<Void> enable(@PathVariable("appInstanceId") String appInstanceId) {
        iAppInstanceService.updateAppInstanceStatus(appInstanceId, true);
        return ResponseData.success();
    }

    @PostResource(path = "/appInstances/{appInstanceId}/disable", requiredPermission = false)
    @ApiOperation(value = "Deactivate app", notes = "The space station actively deactivates the application", hidden = true)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "Application instance ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<Void> disable(@PathVariable("appInstanceId") String appInstanceId) {
        iAppInstanceService.updateAppInstanceStatus(appInstanceId, false);
        return ResponseData.success();
    }

    @PostResource(path = "/appInstances/{appInstanceId}", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "Delete app", notes = "The space actively deletes applications")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "Application instance ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-xxxxx"),
    })
    public ResponseData<Void> delete(@PathVariable("appInstanceId") String appInstanceId) {
        Long userId = SessionContext.getUserId();
        iAppInstanceService.deleteAppInstance(userId, appInstanceId);
        return ResponseData.success();
    }
}
