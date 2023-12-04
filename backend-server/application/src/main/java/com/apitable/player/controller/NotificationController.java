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

import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.ResponseData;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.ro.NotificationListRo;
import com.apitable.player.ro.NotificationPageRo;
import com.apitable.player.ro.NotificationReadRo;
import com.apitable.player.service.IPlayerNotificationService;
import com.apitable.player.vo.NotificationDetailVo;
import com.apitable.player.vo.NotificationStatisticsVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.PageConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Player System - Notification API.
 */
@Slf4j
@RestController
@Tag(name = "Player System - Notification API")
@ApiResource(path = "/player/notification")
public class NotificationController {

    @Resource
    private IPlayerNotificationService playerNotificationService;

    /**
     * Get Notification Page Info.
     */
    @GetResource(path = "/page", requiredPermission = false)
    @Operation(summary = "Get Notification Page Info", description = PageConstants.PAGE_DESC)
    public ResponseData<List<NotificationDetailVo>> page(
        @Valid NotificationPageRo notificationPageRo) {
        List<NotificationDetailVo> pageInfo =
            playerNotificationService.pageList(notificationPageRo,
                LoginContext.me().getLoginUser());
        return ResponseData.success(pageInfo);
    }

    /**
     * Mark Notification Rea.
     */
    @PostResource(path = "/read", requiredPermission = false)
    @Operation(summary = "Mark Notification Read")
    public ResponseData<Boolean> read(@RequestBody NotificationReadRo notificationReadRo) {
        return ResponseData.success(
            playerNotificationService.setNotificationIsRead(notificationReadRo.getId(),
                notificationReadRo.getIsAll()));
    }

    /**
     * Delete Notification.
     */
    @PostResource(path = "/delete", requiredPermission = false)
    @Operation(summary = "Delete Notification")
    public ResponseData<Boolean> delete(@RequestBody NotificationReadRo notificationReadRo) {
        return ResponseData.success(
            playerNotificationService.setDeletedIsTrue(notificationReadRo.getId()));
    }

    /**
     * Create Notification.
     */
    @PostResource(path = "/create", requiredPermission = false)
    @Operation(summary = "Create Notification")
    public ResponseData<Void> create(
        @Valid @RequestBody List<NotificationCreateRo> notificationCreateRoList) {
        boolean bool = playerNotificationService.batchCreateNotify(notificationCreateRoList);
        if (bool) {
            return ResponseData.success();
        } else {
            throw new BusinessException("insert error");
        }
    }

    /**
     * Get Notification' Statistics.
     */
    @GetResource(path = "/statistics", requiredPermission = false)
    @Operation(summary = "Get Notification' Statistics")
    public ResponseData<NotificationStatisticsVo> statistics() {
        return ResponseData.success(
            playerNotificationService.statistic(SessionContext.getUserId()));
    }

    /**
     * Get Notification Detail List.
     */
    @GetResource(path = "/list", requiredPermission = false)
    @Operation(summary = "Get Notification Detail List",
        description = "Default: System Notification")
    public ResponseData<List<NotificationDetailVo>> list(
        @Valid NotificationListRo notificationListRo) {
        return ResponseData.success(
            playerNotificationService.list(notificationListRo, LoginContext.me().getLoginUser()));
    }
}
