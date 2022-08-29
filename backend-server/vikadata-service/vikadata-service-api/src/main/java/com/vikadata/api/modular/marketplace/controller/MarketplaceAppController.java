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
 * 应用市场 应用接口
 * </p>
 *
 * @author Benson Cheung
 * @date 2021/03/31
 */
@RestController
@Api(tags = "应用市场模块_应用相关服务接口")
@ApiResource(name = "应用市场接口库", path = "/marketplace/integration")
public class MarketplaceAppController {

    @Resource
    private IMarketplaceAppService iMarketplaceAppService;

    @GetResource(path = "/space/{spaceId}/apps", requiredLogin = false)
    @ApiOperation(value = "查询内置集成应用列表")
    @Deprecated
    public ResponseData<List<MarketplaceSpaceAppVo>> getSpaceAppList(@PathVariable("spaceId") String spaceId) {
        return ResponseData.success(iMarketplaceAppService.getSpaceAppList(spaceId));
    }

    @PostResource(path = "/space/{spaceId}/app/{appId}/open", requiredPermission = false)
    @ApiOperation(value = "开启应用")
    @Deprecated
    public ResponseData<Void> openSpaceApp(@PathVariable("spaceId") String spaceId, @PathVariable(name = "appId") String appId) {
        iMarketplaceAppService.openSpaceApp(spaceId, appId);
        return ResponseData.success();
    }

    @PostResource(path = "/space/{spaceId}/app/{appId}/stop", requiredPermission = false)
    @ApiOperation(value = "停用应用")
    @Deprecated
    public ResponseData<Void> blockSpaceApp(@PathVariable("spaceId") String spaceId, @PathVariable(name = "appId") String appId) {
        iMarketplaceAppService.stopSpaceApp(spaceId, appId);
        return ResponseData.success();
    }
}
