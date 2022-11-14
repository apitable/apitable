package com.vikadata.api.base.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.base.ro.ConfigRo;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.enterprise.gm.enums.GmAction;
import com.vikadata.api.base.service.IConfigService;
import com.vikadata.api.enterprise.gm.service.IGmService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * configuration interface
 */
@RestController
@Api(tags = "Configuration related interfaces")
@ApiResource(path = "/config")
public class ConfigController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IConfigService iConfigService;

    @GetResource(path = "/get", requiredLogin = false)
    @ApiOperation(value = "Get configuration information")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "Type: 1. Newbie guide announcement", required = true, dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "lang", value = "language", dataTypeClass = String.class, paramType = "query", example = "zh_CN")
    })
    public ResponseData<Object> get(@RequestParam(value = "type") Integer type,
            @RequestParam(value = "lang", required = false, defaultValue = "zh_CN") String lang) {
        return ResponseData.success(iConfigService.getWizardConfig(lang));
    }

    @PostResource(path = "/general", requiredPermission = false)
    @ApiOperation(value = "General configuration", notes = "Scenario: novice guidance, announcement")
    public ResponseData<Void> general(@RequestBody @Valid ConfigRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WIZARD_CONFIG);
        iConfigService.generateWizardConfig(userId, ro);
        return ResponseData.success();
    }

}
