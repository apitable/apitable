package com.vikadata.api.modular.internal.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.constants.SessionAttrConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.exception.UserClosingException;
import com.vikadata.api.enums.exception.UserException;
import com.vikadata.api.enums.user.UserOperationType;
import com.vikadata.api.model.vo.user.UserBaseInfoVo;
import com.vikadata.api.modular.user.service.IUserHistoryService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.define.dtos.PausedUserHistoryDto;
import com.vikadata.define.dtos.UserInPausedDto;
import com.vikadata.define.ros.PausedUserHistoryRo;
import com.vikadata.entity.UserEntity;

import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * 内部服务-用户接口
 * @author Shawn Deng
 * @date 2021-04-01 19:40:10
 */
@RestController
@ApiResource(path = "/internal")
@Api(tags = "内部服务-用户接口")
public class InternalUserController {

    @Resource
    private IUserService userService;

    @Resource
    private IUserHistoryService userHistoryService;

    @GetResource(name = "查询是否已登录", path = "/user/session", requiredLogin = false)
    @ApiOperation(value = "查询是否已登录", notes = "获取自己必要信息", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Boolean> meSession() {
        HttpSession session = HttpContextUtil.getSession(false);
        return ResponseData.success(session != null && session.getAttribute(SessionAttrConstants.LOGIN_USER_ID) != null);
    }

    @GetResource(name = "获取自己必要信息", path = "/user/get/me", requiredPermission = false)
    @ApiOperation(value = "获取自己必要信息", notes = "获取自己必要信息", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<UserBaseInfoVo> userBaseInfo() {
        Long userId = SessionContext.getUserId();
        //查询用户基本信息
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        UserBaseInfoVo baseInfo = UserBaseInfoVo.builder()
                .userId(userId)
                .uuid(loginUserDto.getUuid())
                .build();
        return ResponseData.success(baseInfo);
    }

    @GetResource(name = "获取冷静期用户", path = "/users/paused", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "获取冷静期用户", notes = "获取冷静期用户", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<List<UserInPausedDto>> getPausedUsers() {
        List<UserInPausedDto> pausedUserDtos = userService.getPausedUserDtos(null);
        return ResponseData.success(pausedUserDtos);
    }

    @PostResource(name = "获取冷静期用户操作记录", path = "/getUserHistories", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "获取冷静期用户操作记录", notes = "获取冷静期用户操作记录", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<List<PausedUserHistoryDto>> getUserHistoryDtos(@RequestBody PausedUserHistoryRo userHistoryRo) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime createdBefore = now.minusDays(30 + userHistoryRo.getLimitDays());
        // LocalDateTime createdAfter = now.minusDays(lastDays);
        // 获取指定冷静期天数再往前30天内，有过注销申请的操作.
        List<PausedUserHistoryDto> userHistoryDtos = userHistoryService
                .selectUserHistoryDtos(createdBefore, now, UserOperationType.APPLY_FOR_CLOSING);
        // 找出仍处在冷静期的账号.
        List<Long> userIds = userHistoryDtos.stream().map(PausedUserHistoryDto::getUserId).collect(Collectors.toList());
        if (CollectionUtils.isEmpty(userIds)) {
            return ResponseData.success(Lists.newArrayList());
        }
        List<UserInPausedDto> userDtos = userService.getPausedUserDtos(userIds);
        if (CollectionUtils.isEmpty(userDtos)) {
            return ResponseData.success(Lists.newArrayList());
        }
        List<Long> pausedUserIds = userDtos.stream().map(UserInPausedDto::getUserId).collect(Collectors.toList());
        // 过滤掉非冷静期账号(已注销/已取消注销).
        List<PausedUserHistoryDto> pausedUserHistoryDtos = userHistoryDtos
                .stream().filter(historyDto -> pausedUserIds.contains(historyDto.getUserId())).collect(Collectors.toList());
        return ResponseData.success(pausedUserHistoryDtos);
    }

    @PostResource(name = "关闭注销冷静期用户账号", path = "/users/{userId}/close", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "关闭注销冷静期用户账号", notes = "关闭注销冷静期用户账号", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Boolean> closePausedUserAccount(@PathVariable("userId") Long userId) {
        UserEntity user = userService.getById(userId);
        ExceptionUtil.isNotNull(user, UserException.USER_NOT_EXIST);
        ExceptionUtil.isTrue(user.getIsPaused(), UserClosingException.USER_NOT_ALLOWED_TO_CLOSE);
        userService.closeAccount(user);
        return ResponseData.success(true);
    }
}
