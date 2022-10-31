package com.vikadata.api.modular.player.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserLinkInfoService;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.model.ro.player.ActivityStatusRo;
import com.vikadata.api.modular.player.service.IPlayerActivityService;
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
