package com.vikadata.api.modular.marketplace.controller;

import java.util.List;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.model.vo.marketplace.MarketplaceSpaceAppVo;
import com.vikadata.api.modular.marketplace.service.IMarketplaceAppService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Application Market - Application API
 * </p>
 */
@RestController
@Api(tags = "Application Market - Application API")
@ApiResource(name = "Application Market API", path = "/marketplace/integration")
public class MarketplaceAppController {

    @Resource
    private IMarketplaceAppService iMarketplaceAppService;

    @GetResource(path = "/space/{spaceId}/apps", requiredLogin = false)
    @ApiOperation(value = "Query Built-in Integrated Applications")
    @Deprecated
    public ResponseData<List<MarketplaceSpaceAppVo>> getSpaceAppList(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iMarketplaceAppService.getSpaceAppList(spaceId));
    }

    @PostResource(path = "/space/{spaceId}/app/{appId}/open", requiredPermission = false)
    @ApiOperation(value = "Open Application")
    @Deprecated
    public ResponseData<Void> openSpaceApp(@PathVariable("spaceId") String spaceId, @PathVariable(name = "appId") String appId) {
        iMarketplaceAppService.openSpaceApp(spaceId, appId);
        return ResponseData.success();
    }

    @PostResource(path = "/space/{spaceId}/app/{appId}/stop", requiredPermission = false)
    @ApiOperation(value = "Block Application")
    @Deprecated
    public ResponseData<Void> blockSpaceApp(@PathVariable("spaceId") String spaceId, @PathVariable(name = "appId") String appId) {
        iMarketplaceAppService.stopSpaceApp(spaceId, appId);
        return ResponseData.success();
    }
}
