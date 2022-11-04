package com.vikadata.api.modular.automation.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.modular.automation.model.TriggerTypeCreateRO;
import com.vikadata.api.modular.automation.model.TriggerTypeEditRO;
import com.vikadata.api.modular.automation.service.IAutomationTriggerTypeService;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Automation Trigger Type API
 * </p>
 */
@RestController
@ApiResource(path = "/automation/triggerType")
@Api(tags = "Automation Trigger Type API", hidden = true)
public class TriggerTypeController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IAutomationTriggerTypeService iAutomationTriggerTypeService;

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "Create Trigger Type")
    public ResponseData<String> create(@RequestBody @Valid TriggerTypeCreateRO ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        return ResponseData.success(iAutomationTriggerTypeService.create(userId, ro));
    }

    @PostResource(path = "/edit/{triggerTypeId}", requiredPermission = false)
    @ApiOperation(value = "Edit Trigger Type")
    public ResponseData<Void> edit(@PathVariable("triggerTypeId") String triggerTypeId, @RequestBody TriggerTypeEditRO ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        iAutomationTriggerTypeService.edit(userId, triggerTypeId, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{triggerTypeId}", requiredPermission = false)
    @ApiOperation(value = "Delete Trigger Type")
    public ResponseData<Void> delete(@PathVariable("triggerTypeId") String triggerTypeId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        iAutomationTriggerTypeService.delete(userId, triggerTypeId);
        return ResponseData.success();
    }

}
