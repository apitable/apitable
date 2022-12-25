/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.player.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.ro.NotificationListRo;
import com.apitable.player.ro.NotificationPageRo;
import com.apitable.player.ro.NotificationReadRo;
import com.apitable.player.service.IPlayerNotificationService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.PageConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.player.vo.NotificationDetailVo;
import com.apitable.player.vo.NotificationStatisticsVo;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Player System - Notification API
 * </p>
 */
@Slf4j
@RestController
@Api(tags = "Player System - Notification API")
@ApiResource(path = "/player/notification")
public class NotificationController {

    @Resource
    private IPlayerNotificationService playerNotificationService;

    @GetResource(path = "/page", requiredPermission = false)
    @ApiOperation(value = "Get Notification Page Info", notes = PageConstants.PAGE_DESC)
    public ResponseData<List<NotificationDetailVo>> page(@Valid NotificationPageRo notificationPageRo) {
        List<NotificationDetailVo> pageInfo =
                playerNotificationService.pageList(notificationPageRo, LoginContext.me().getLoginUser());
        return ResponseData.success(pageInfo);
    }

    @PostResource(path = "/read", requiredPermission = false)
    @ApiOperation(value = "Mark Notification Read")
    public ResponseData<Boolean> read(@RequestBody NotificationReadRo notificationReadRo) {
        return ResponseData.success(
                playerNotificationService.setNotificationIsRead(notificationReadRo.getId(), notificationReadRo.getIsAll()));
    }

    @PostResource(path = "/delete", requiredPermission = false)
    @ApiOperation(value = "Delete Notification")
    public ResponseData<Boolean> delete(@RequestBody NotificationReadRo notificationReadRo) {
        return ResponseData.success(playerNotificationService.setDeletedIsTrue(notificationReadRo.getId()));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "Create Notification")
    public ResponseData<Void> create(@Valid @RequestBody List<NotificationCreateRo> notificationCreateRoList) {
        boolean bool = playerNotificationService.batchCreateNotify(notificationCreateRoList);
        if (bool) {
            return ResponseData.success();
        }
        else {
            throw new BusinessException("insert error");
        }
    }

    @GetResource(path = "/statistics", requiredPermission = false)
    @ApiOperation(value = "Get Notification' Statistics")
    public ResponseData<NotificationStatisticsVo> statistics() {
        return ResponseData.success(playerNotificationService.statistic(SessionContext.getUserId()));
    }

    @GetResource(path = "/list", requiredPermission = false)
    @ApiOperation(value = "Get Notification Detail List", notes = "Default: System Notification")
    public ResponseData<List<NotificationDetailVo>> list(@Valid NotificationListRo notificationListRo) {
        return ResponseData.success(playerNotificationService.list(notificationListRo, LoginContext.me().getLoginUser()));
    }
}
