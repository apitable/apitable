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
 * Activity，动态，包括Comment和Op
 * </p>
 *
 * @author Kelly Chen
 * @date 2020/4/7 14:55
 */
@RestController
@Api(tags = "Player模块_活动接口")
@ApiResource(path = "/player/activity")
public class ActivityController {

    @Resource
    private IPlayerActivityService iPlayerActivityService;

    @Resource
    private UserLinkInfoService userLinkInfoService;

    @PostResource(path = "/triggerWizard", requiredPermission = false)
    @ApiOperation(value = "触发引导", notes = "场景：触发引导的点击事件后，修改状态或者累计次数")
    public ResponseData<Void> triggerWizard(@RequestBody @Valid ActivityStatusRo ro) {
        Long userId = SessionContext.getUserId();
        iPlayerActivityService.changeStatus(userId, ro.getWizardId());
        // 删除缓存
        userLinkInfoService.delete(userId);
        return ResponseData.success();
    }
}
