package com.vikadata.api.enterprise.automation.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.enterprise.automation.model.ActionTypeCreateRO;
import com.vikadata.api.enterprise.automation.model.ActionTypeEditRO;
import com.vikadata.api.enterprise.gm.enums.GmAction;
import com.vikadata.api.enterprise.automation.service.IAutomationActionTypeService;
import com.vikadata.api.enterprise.gm.service.IGmService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Automation Action Type API
 * </p>
 */
@RestController
@ApiResource(path = "/automation/actionType")
@Api(tags = "Automation Action Type API", hidden = true)
public class ActionTypeController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IAutomationActionTypeService iAutomationActionTypeService;

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "Create Action Type")
    public ResponseData<String> create(@RequestBody @Valid ActionTypeCreateRO ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        return ResponseData.success(iAutomationActionTypeService.create(userId, ro));
    }

    @PostResource(path = "/edit/{actionTypeId}", requiredPermission = false)
    @ApiOperation(value = "Edit Action Type")
    public ResponseData<Void> edit(@PathVariable("actionTypeId") String actionTypeId, @RequestBody ActionTypeEditRO ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        iAutomationActionTypeService.edit(userId, actionTypeId, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{actionTypeId}", requiredPermission = false)
    @ApiOperation(value = "Delete Action Type")
    public ResponseData<Void> delete(@PathVariable("actionTypeId") String actionTypeId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.AUTOMATION_MANAGE);
        iAutomationActionTypeService.delete(userId, actionTypeId);
        return ResponseData.success();
    }

}
