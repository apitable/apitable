package com.vikadata.api.modular.appstore.controller;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.util.page.PageHelper;
import com.vikadata.api.util.page.PageInfo;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.model.AppInfo;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.core.support.ResponseData;
import com.vikadata.system.config.SystemConfig;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.app.AppStore;
import com.vikadata.system.config.app.AppStoreConfig;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Application store library interface
 */
@RestController
@Api(tags = "App Store_Relevant service interfaces of the application store")
@ApiResource(name = "Application store library interface", path = "/appstores")
public class AppStoreController {

    @Resource
    private IFeishuService iFeishuService;

    @GetResource(path = "/apps", requiredPermission = false)
    @ApiOperation(value = "Query application list", notes = "Pagination query. If no query parameter is transferred, the default query will be used")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pageIndex", value = "Page Index", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageSize", value = "Quantity per page", dataTypeClass = String.class, paramType = "query", example = "50"),
            @ApiImplicitParam(name = "orderBy", value = "Sort field", dataTypeClass = String.class, paramType = "query", example = "createdAt"),
            @ApiImplicitParam(name = "sortBy", value = "Collation,asc=positive sequence,desc=reverse order", dataTypeClass = String.class, paramType = "query", example = "desc"),
    })
    public ResponseData<PageInfo<AppInfo>> fetchAppStoreApps(@RequestParam(name = "pageIndex", required = false, defaultValue = "1") Integer pageIndex,
            @RequestParam(name = "pageSize", required = false, defaultValue = "50") Integer pageSize,
            @RequestParam(name = "orderBy", required = false, defaultValue = "createdAt") String orderBy,
            @RequestParam(name = "sortBy", required = false, defaultValue = "desc") String sortBy) {
        SystemConfig systemConfig = SystemConfigManager.getConfig();
        AppStoreConfig appStoreConfig = systemConfig.getAppStores();
        List<AppInfo> appInfoList = new ArrayList<>(appStoreConfig.size());
        appStoreConfig.entrySet().stream()
                .sorted(Comparator.comparing(o -> o.getValue().getDisplayOrder()))
                .forEachOrdered(entry -> {
                    AppStore appStore = entry.getValue();
                    AppInfo appInfo = new AppInfo();
                    appInfo.setAppId(entry.getKey());
                    appInfo.setName(VikaStrings.t(appStore.getAppName()));
                    appInfo.setType(appStore.getType());
                    appInfo.setAppType(appStore.getAppType());
                    appInfo.setStatus(appStore.getStatus());
                    appInfo.setIntro(VikaStrings.t(appStore.getIntro()));
                    appInfo.setHelpUrl(appStore.getHelpUrl());
                    appInfo.setDescription(VikaStrings.t(appStore.getDescription()));
                    appInfo.setDisplayImages(Collections.singletonList(appStore.getInlineImage().getUrl()));
                    appInfo.setNotice(VikaStrings.t(appStore.getNotice()));
                    appInfo.setLogoUrl(appStore.getLogo().getUrl());
                    appInfo.setNeedConfigured(appStore.isNeedConfigured());
                    appInfo.setConfigureUrl(appStore.getConfigureUrl());
                    appInfo.setNeedAuthorize(appStore.isNeedAuthorize());
                    AppType appType = AppType.of(appStore.getType());
                    if (appType == AppType.LARK_STORE && StrUtil.isNotBlank(appStore.getStopActionUrl())) {
                        String isvAppId = iFeishuService.getIsvAppId();
                        if (StrUtil.isNotBlank(isvAppId)) {
                            appInfo.setStopActionUrl(StrUtil.format(appStore.getStopActionUrl(), isvAppId));
                        }
                    }
                    appInfoList.add(appInfo);
                });
        return ResponseData.success(PageHelper.build(pageIndex, pageSize, appStoreConfig.size(), appInfoList));
    }
}
