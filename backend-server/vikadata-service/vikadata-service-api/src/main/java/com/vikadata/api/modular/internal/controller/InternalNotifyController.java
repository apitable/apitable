package com.vikadata.api.modular.internal.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** 
* <p> 
* 内部服务-通知接口
* </p> 
* @author zoe zheng 
* @date 2022/2/22 15:38
*/
@RestController
@ApiResource(path = "/internal/notification")
@Api(tags = "内部服务-通知接口")
public class InternalNotifyController {

    @Resource
    private IPlayerNotificationService playerNotificationService;

    @PostResource(name = "发送消息", path = "/create", requiredLogin = false)
    @ApiOperation(value = "发送消息", notes = "发送消息", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void>  create(@Valid @RequestBody List<NotificationCreateRo> notificationCreateRoList) {
        boolean bool = playerNotificationService.batchCreateNotify(notificationCreateRoList);
        if (bool) {
            return ResponseData.success();
        } else {
            throw new BusinessException("insert error");
        }
    }


}
