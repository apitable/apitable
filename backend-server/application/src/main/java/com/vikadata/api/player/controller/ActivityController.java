package com.vikadata.api.player.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.player.ro.ActivityStatusRo;
import com.vikadata.api.player.service.IPlayerActivityService;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.cache.service.UserLinkInfoService;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Player System - Activity API
 * </p>
 */
@RestController
@Api(tags = "Player System - Activity API")
@ApiResource(path = "/player/activity")
public class ActivityController {

    @Resource
    private IPlayerActivityService iPlayerActivityService;

    @Resource
    private UserLinkInfoService userLinkInfoService;

    @PostResource(path = "/triggerWizard", requiredPermission = false)
    @ApiOperation(value = "Trigger Wizard", notes = "Scene: After triggering the guided click event, modify the state or the cumulative number of times.")
    public ResponseData<Void> triggerWizard(@RequestBody @Valid ActivityStatusRo ro) {
        Long userId = SessionContext.getUserId();
        iPlayerActivityService.changeStatus(userId, ro.getWizardId());
        // delete cache
        userLinkInfoService.delete(userId);
        return ResponseData.success();
    }
}
