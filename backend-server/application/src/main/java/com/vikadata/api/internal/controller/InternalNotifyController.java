package com.vikadata.api.internal.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.player.service.IPlayerNotificationService;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Notification Interface
 */
@RestController
@ApiResource(path = "/internal/notification")
@Api(tags = "Internal Service - Notification Interface")
public class InternalNotifyController {

    @Resource
    private IPlayerNotificationService playerNotificationService;

    @PostResource(name = "send a message", path = "/create", requiredLogin = false)
    @ApiOperation(value = "send a message", notes = "send a message", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> create(@Valid @RequestBody List<NotificationCreateRo> notificationCreateRoList) {
        boolean bool = playerNotificationService.batchCreateNotify(notificationCreateRoList);
        if (bool) {
            return ResponseData.success();
        }
        else {
            throw new BusinessException("insert error");
        }
    }

}
