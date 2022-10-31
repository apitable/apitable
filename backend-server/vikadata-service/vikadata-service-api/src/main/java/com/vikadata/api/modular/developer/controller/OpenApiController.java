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
 * An open interface, typically used for unimportant and ambiguous data.
 * </p>
 */
@RestController
@Api(tags = "Open Api", hidden = true)
@ApiResource(path = "/openapi")
public class OpenApiController {

    // Open api Use single machine current limiting mode.
    private static final RateLimiter RATE_LIMITER = RateLimiter.create(5);

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    @GetResource(path = "/widgetInfo/{widgetId}", requiredPermission = false)
    @ApiOperation(value = "Get information that the applet can expose", notes = "Get information that the applet can expose")
    public ResponseData<WidgetInfoVo> validateApiKey(@PathVariable("widgetId") String widgetId) {
        if (RATE_LIMITER.tryAcquire()) {
            WidgetPackageEntity widget = iWidgetPackageService.getByPackageId(widgetId);
            return ResponseData.success(this.widgetInfoVoWrapper(widget));
        }
        else {
            throw new BusinessException("The interface is busy. Please try again later...");
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
