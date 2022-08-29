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
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.lang.PageInfo;
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
 * 应用商城库接口
 * @author Shawn Deng
 * @date 2022-01-12 11:35:34
 */
@RestController
@Api(tags = "应用商城_应用商城相关服务接口")
@ApiResource(name = "应用商城库接口", path = "/appstores")
public class AppStoreController {

    @Resource
    private IFeishuService iFeishuService;

    @GetResource(path = "/apps", requiredPermission = false)
    @ApiOperation(value = "查询应用列表", notes = "分页查询，不传查询参数则代表使用默认查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "pageIndex", value = "页索引", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageSize", value = "每页数量", dataTypeClass = String.class, paramType = "query", example = "50"),
            @ApiImplicitParam(name = "orderBy", value = "排序字段", dataTypeClass = String.class, paramType = "query", example = "createdAt"),
            @ApiImplicitParam(name = "sortBy", value = "排序规则,asc=正序,desc=倒序", dataTypeClass = String.class, paramType = "query", example = "desc"),
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
