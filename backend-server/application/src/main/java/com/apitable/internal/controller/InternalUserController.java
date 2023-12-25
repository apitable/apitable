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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - User Interface.
 */
@RestController
@ApiResource(path = "/internal")
@Tag(name = "Internal")
public class InternalUserController {

    @Resource
    private IUserService userService;

    @Resource
    private IUserHistoryService userHistoryService;

    /**
     * Check whether logged in.
     */
    @GetResource(name = "check whether logged in", path = "/user/session", requiredLogin = false)
    @Operation(summary = "check whether logged in", description = "get the necessary information")
    public ResponseData<Boolean> meSession() {
        HttpSession session = HttpContextUtil.getSession(false);
        return ResponseData.success(
            session != null && session.getAttribute(SessionAttrConstants.LOGIN_USER_ID) != null);
    }

    /**
     * Get the necessary information.
     */
    @GetResource(name = "get the necessary information", path = "/user/get/me",
        requiredPermission = false)
    @Operation(summary = "get the necessary information", description = "get the necessary "
        + "information")
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

    /**
     * Get cooling off users.
     */
    @GetResource(name = "get cooling off users", path = "/users/paused", requiredPermission =
        false, requiredLogin = false)
    @Operation(summary = "get cooling off users", description = "get cooling off users")
    public ResponseData<List<UserInPausedDto>> getPausedUsers() {
        List<UserInPausedDto> pausedUsers = userService.getPausedUserDtos(null);
        return ResponseData.success(pausedUsers);
    }

    /**
     * Get the cooling-off period user operation record.
     */
    @PostResource(name = "get the cooling-off period user operation record", path =
        "/getUserHistories", requiredPermission = false, requiredLogin = false)
    @Operation(summary = "get the cooling-off period user operation record", description = "get "
        + "the cooling-off period user operation record")
    public ResponseData<List<PausedUserHistoryDto>> getUserHistories(
        @RequestBody PausedUserHistoryRo userHistoryRo) {
        LocalDateTime now = ClockManager.me().getLocalDateTimeNow();
        LocalDateTime createdBefore = now.minusDays(30 + userHistoryRo.getLimitDays());
        // LocalDateTime createdAfter = now.minusDays(lastDays);
        // After obtaining the specified cooling-off period, there has been an operation to
        // cancel the application within 30 days before.
        List<PausedUserHistoryDto> userHistoryDtos = userHistoryService
            .getUserHistoryDtos(createdBefore, now, UserOperationType.APPLY_FOR_CLOSING);
        // Find out which accounts are still in the cooling-off period.
        List<Long> userIds = userHistoryDtos.stream().map(PausedUserHistoryDto::getUserId)
            .collect(Collectors.toList());
        if (CollectionUtils.isEmpty(userIds)) {
            return ResponseData.success(Lists.newArrayList());
        }
        List<UserInPausedDto> userDtos = userService.getPausedUserDtos(userIds);
        if (CollectionUtils.isEmpty(userDtos)) {
            return ResponseData.success(Lists.newArrayList());
        }
        List<Long> pausedUserIds =
            userDtos.stream().map(UserInPausedDto::getUserId).toList();
        // Filter out non-cooling-off accounts (cancelled and cancelled).
        List<PausedUserHistoryDto> pausedUserHistoryDtos = userHistoryDtos
            .stream().filter(historyDto -> pausedUserIds.contains(historyDto.getUserId()))
            .collect(Collectors.toList());
        return ResponseData.success(pausedUserHistoryDtos);
    }

    /**
     * Close and log off the cooling-off period user account.
     */
    @PostResource(name = "Close and log off the cooling-off period user account", path = "/users"
        + "/{userId}/close", requiredPermission = false, requiredLogin = false)
    @Operation(summary = "Close and log off the cooling-off period user account", description =
        "Close and log off the cooling-off period user account")
    public ResponseData<Boolean> closePausedUserAccount(@PathVariable("userId") Long userId) {
        UserEntity user = userService.getById(userId);
        ExceptionUtil.isNotNull(user, UserException.USER_NOT_EXIST);
        ExceptionUtil.isTrue(user.getIsPaused(), UserClosingException.USER_NOT_ALLOWED_TO_CLOSE);
        userService.closeAccount(user);
        return ResponseData.success(true);
    }
}
