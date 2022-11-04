package com.vikadata.api.modular.automation.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.modular.automation.model.AutomationServiceCreateRO;
import com.vikadata.api.modular.automation.model.AutomationServiceEditRO;
import com.vikadata.api.modular.automation.service.IAutomationService;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Automation API
 * </p>
 */
@RestController
@ApiResource(path = "/automation")
@Api(tags = "Automation API", hidden = true)
public class AutomationController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IAutomationService iAutomationService;

    @PostResource(path = "/service/create", requiredPermission = false)
    @ApiOperation(value = "Create Service")
    public ResponseData<String> create(@RequestBody @Valid AutomationServiceCreateRO ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        return ResponseData.success(iAutomationService.createService(userId, ro));
    }

    @PostResource(path = "/service/edit/{serviceId}", requiredPermission = false)
    @ApiOperation(value = "Edit Service")
    public ResponseData<Void> edit(@PathVariable("serviceId") String serviceId, @RequestBody AutomationServiceEditRO ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        iAutomationService.editService(userId, serviceId, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/service/delete/{serviceId}", requiredPermission = false)
    @ApiOperation(value = "Delete Service")
    public ResponseData<Void> delete(@PathVariable("serviceId") String serviceId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        iAutomationService.deleteService(userId, serviceId);
        return ResponseData.success();
    }

}
