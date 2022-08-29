package com.vikadata.api.modular.developer.controller;

import java.util.Optional;

import javax.annotation.Resource;

import com.google.common.util.concurrent.RateLimiter;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.modular.developer.model.WidgetInfoVo;
import com.vikadata.api.modular.workspace.service.IWidgetPackageService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.WidgetPackageEntity;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 开放型接口，一般用于不重要且不明感的数据
 * </p>
 *
 * @author Pengap
 * @date 2022/5/6 11:09:14
 */
@RestController
@Api(tags = "OpenApi接口", hidden = true)
@ApiResource(path = "/openapi")
public class OpenApiController {

    // 开放接口简单使用单机限流方式
    private static final RateLimiter RATE_LIMITER = RateLimiter.create(5);

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    @GetResource(path = "/widgetInfo/{widgetId}", requiredPermission = false)
    @ApiOperation(value = "获取小程序可以公开的信息", notes = "获取小程序可以公开的信息")
    public ResponseData<WidgetInfoVo> validateApiKey(@PathVariable("widgetId") String widgetId) {
        if (RATE_LIMITER.tryAcquire()) {
            WidgetPackageEntity widget = iWidgetPackageService.getByPackageId(widgetId);
            return ResponseData.success(this.widgetInfoVoWrapper(widget));
        }
        else {
            throw new BusinessException("接口繁忙请稍后再试...");
        }
    }

    private WidgetInfoVo widgetInfoVoWrapper(WidgetPackageEntity origin) {
        return Optional.ofNullable(origin).map(widget -> {
            WidgetInfoVo widgetInfoVo = new WidgetInfoVo();
            widgetInfoVo.setWidgetName(widget.getI18nName());
            widgetInfoVo.setWidgetDescription(widget.getI18nDescription());
            return widgetInfoVo;
        }).orElse(null);
    }
}
