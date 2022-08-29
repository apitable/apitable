package com.vikadata.api.modular.player.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.constants.PageConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.model.ro.player.NotificationListRo;
import com.vikadata.api.model.ro.player.NotificationPageRo;
import com.vikadata.api.model.ro.player.NotificationReadRo;
import com.vikadata.api.model.vo.player.NotificationDetailVo;
import com.vikadata.api.model.vo.player.NotificationStatisticsVo;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 通知系统
 * </p>
 *
 * @author Kelly Chen
 * @date 2020/4/7 14:57
 */
@Slf4j
@Api(tags = "Player模块_通知中心")
@ApiResource(path = "/player/notification")
@RestController
public class NotificationController {

    @Resource
    private IPlayerNotificationService playerNotificationService;

    @GetResource(path = "/page", requiredPermission = false)
    @ApiOperation(value = "用户分页通知列表", notes = PageConstants.PAGE_DESC)
    public ResponseData<List<NotificationDetailVo>> page(@Valid NotificationPageRo notificationPageRo) {
        List<NotificationDetailVo> pageInfo =
            playerNotificationService.pageList(notificationPageRo, LoginContext.me().getLoginUser());
        return ResponseData.success(pageInfo);
    }

    @PostResource(path = "/read", requiredPermission = false)
    @ApiOperation(value = "标记通知已读", notes = "标记通知已读")
    public ResponseData<Boolean> read(@RequestBody NotificationReadRo notificationReadRo) {
        return ResponseData.success(
            playerNotificationService.setNotificationIsRead(notificationReadRo.getId(), notificationReadRo.getIsAll()));
    }

    @PostResource(path = "/delete", requiredPermission = false)
    @ApiOperation(value = "删除通知", notes = "删除通知")
    public ResponseData<Boolean> delete(@RequestBody NotificationReadRo notificationReadRo) {
        return ResponseData.success(playerNotificationService.setDeletedIsTrue(notificationReadRo.getId()));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "建立通知", notes = "建立通知")
    public ResponseData<Void> create(@Valid @RequestBody List<NotificationCreateRo> notificationCreateRoList) {
        boolean bool = playerNotificationService.batchCreateNotify(notificationCreateRoList);
        if (bool) {
            return ResponseData.success();
        } else {
            throw new BusinessException("insert error");
        }
    }

    @GetResource(path = "/statistics", requiredPermission = false)
    @ApiOperation(value = "消息统计", notes = "消息统计")
    public ResponseData<NotificationStatisticsVo> statistics() {
        return ResponseData.success(playerNotificationService.statistic(SessionContext.getUserId()));
    }

    @GetResource(path = "/list", requiredPermission = false)
    @ApiOperation(value = "用户通知列表", notes = "用户通知列表，默认为系统通知")
    public ResponseData<List<NotificationDetailVo>> list(@Valid NotificationListRo notificationListRo) {
        return ResponseData.success(playerNotificationService.list(notificationListRo, LoginContext.me().getLoginUser()));
    }
}
