package com.vikadata.api.modular.base.controller;

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
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.model.ro.config.ConfigRo;
import com.vikadata.api.model.ro.config.TemplateConfigRo;
import com.vikadata.api.modular.base.service.IConfigService;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 配置接口
 * </p>
 *
 * @author Chambers
 * @date 2020/7/10
 */
@RestController
@Api(tags = "配置相关接口")
@ApiResource(path = "/config")
public class ConfigController {

    @Resource
    private ITemplateService iTemplateService;

    @Resource
    private IGmService iGmService;

    @Resource
    private IConfigService iConfigService;

    @GetResource(path = "/get", requiredLogin = false)
    @ApiOperation(value = "获取配置信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "类型：1、新手引导/公告", required = true, dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "lang", value = "语言", dataTypeClass = String.class, paramType = "query", example = "zh_CN")
    })
    public ResponseData<Object> get(@RequestParam(value = "type") Integer type,
            @RequestParam(value = "lang", required = false, defaultValue = "zh_CN") String lang) {
        return ResponseData.success(iConfigService.getWizardConfig(lang));
    }

    @PostResource(path = "/general", requiredPermission = false)
    @ApiOperation(value = "通用配置", notes = "场景：新手引导、公告")
    public ResponseData<Void> general(@RequestBody @Valid ConfigRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WIZARD_CONFIG);
        iConfigService.generateWizardConfig(userId, ro);
        return ResponseData.success();
    }

    @Deprecated
    @PostResource(path = "/template", requiredPermission = false)
    @ApiOperation(value = "模板配置", notes = "热门推荐、上架模板")
    public ResponseData<Void> template(@RequestBody @Valid TemplateConfigRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.TEMPLATE_CENTER_CONFIG);
        iTemplateService.config(userId, ro);
        return ResponseData.success();
    }
}
