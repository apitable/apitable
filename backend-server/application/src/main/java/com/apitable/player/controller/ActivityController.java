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

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.apitable.player.ro.ActivityStatusRo;
import com.apitable.player.service.IPlayerActivityService;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.core.support.ResponseData;

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

    @PostResource(path = "/triggerWizard", requiredPermission = false)
    @ApiOperation(value = "Trigger Wizard", notes = "Scene: After triggering the guided click event, modify the state or the cumulative number of times.")
    public ResponseData<Void> triggerWizard(@RequestBody @Valid ActivityStatusRo ro) {
        Long userId = SessionContext.getUserId();
        iPlayerActivityService.changeStatus(userId, ro.getWizardId());
        return ResponseData.success();
    }
}
