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

package com.apitable.internal.controller;

import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.internal.ro.PausedUserHistoryRo;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.clock.spring.ClockManager;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.SessionAttrConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.user.dto.PausedUserHistoryDto;
import com.apitable.user.dto.UserInPausedDto;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.enums.UserClosingException;
import com.apitable.user.enums.UserException;
import com.apitable.user.enums.UserOperationType;
import com.apitable.user.service.IUserHistoryService;
import com.apitable.user.service.IUserService;
import com.apitable.user.vo.UserBaseInfoVo;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Internal Service - User Interface
 */
@RestController
@ApiResource(path = "/internal")
@Api(tags = "Internal Service - User Interface")
public class InternalUserController {

    @Resource
    private IUserService userService;

    @Resource
    private IUserHistoryService userHistoryService;

    @GetResource(name = "check whether logged in", path = "/user/session", requiredLogin = false)
    @ApiOperation(value = "check whether logged in", notes = "get the necessary information", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Boolean> meSession() {
        HttpSession session = HttpContextUtil.getSession(false);
        return ResponseData.success(session != null && session.getAttribute(SessionAttrConstants.LOGIN_USER_ID) != null);
    }

    @GetResource(name = "get the necessary information", path = "/user/get/me", requiredPermission = false)
    @ApiOperation(value = "get the necessary information", notes = "get the necessary information", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<UserBaseInfoVo> userBaseInfo() {
        Long userId = SessionContext.getUserId();
        // query basic user information
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        UserBaseInfoVo baseInfo = UserBaseInfoVo.builder()
                .userId(userId)
                .uuid(loginUserDto.getUuid())
                .build();
        return ResponseData.success(baseInfo);
    }

    @GetResource(name = "get cooling off users", path = "/users/paused", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "get cooling off users", notes = "get cooling off users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<List<UserInPausedDto>> getPausedUsers() {
        List<UserInPausedDto> pausedUserDtos = userService.getPausedUserDtos(null);
        return ResponseData.success(pausedUserDtos);
    }

    @PostResource(name = "get the cooling-off period user operation record", path = "/getUserHistories", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "get the cooling-off period user operation record", notes = "get the cooling-off period user operation record", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<List<PausedUserHistoryDto>> getUserHistoryDtos(@RequestBody PausedUserHistoryRo userHistoryRo) {
        LocalDateTime now = ClockManager.me().getLocalDateTimeNow();
        LocalDateTime createdBefore = now.minusDays(30 + userHistoryRo.getLimitDays());
        // LocalDateTime createdAfter = now.minusDays(lastDays);
        // After obtaining the specified cooling-off period, there has been an operation to cancel the application within 30 days before.
        List<PausedUserHistoryDto> userHistoryDtos = userHistoryService
                .selectUserHistoryDtos(createdBefore, now, UserOperationType.APPLY_FOR_CLOSING);
        // Find out which accounts are still in the cooling-off period.
        List<Long> userIds = userHistoryDtos.stream().map(PausedUserHistoryDto::getUserId).collect(Collectors.toList());
        if (CollectionUtils.isEmpty(userIds)) {
            return ResponseData.success(Lists.newArrayList());
        }
        List<UserInPausedDto> userDtos = userService.getPausedUserDtos(userIds);
        if (CollectionUtils.isEmpty(userDtos)) {
            return ResponseData.success(Lists.newArrayList());
        }
        List<Long> pausedUserIds = userDtos.stream().map(UserInPausedDto::getUserId).collect(Collectors.toList());
        // Filter out non-cooling-off accounts (cancelled and cancelled).
        List<PausedUserHistoryDto> pausedUserHistoryDtos = userHistoryDtos
                .stream().filter(historyDto -> pausedUserIds.contains(historyDto.getUserId())).collect(Collectors.toList());
        return ResponseData.success(pausedUserHistoryDtos);
    }

    @PostResource(name = "Close and log off the cooling-off period user account", path = "/users/{userId}/close", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "Close and log off the cooling-off period user account", notes = "Close and log off the cooling-off period user account", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Boolean> closePausedUserAccount(@PathVariable("userId") Long userId) {
        UserEntity user = userService.getById(userId);
        ExceptionUtil.isNotNull(user, UserException.USER_NOT_EXIST);
        ExceptionUtil.isTrue(user.getIsPaused(), UserClosingException.USER_NOT_ALLOWED_TO_CLOSE);
        userService.closeAccount(user);
        return ResponseData.success(true);
    }
}
