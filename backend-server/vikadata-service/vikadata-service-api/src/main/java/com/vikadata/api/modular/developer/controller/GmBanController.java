package com.vikadata.api.modular.developer.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.constants.InternalConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.exception.UserException;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.UserEntity;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 封禁管理接口
 * </p>
 *
 * @author Chambers
 * @date 2022/5/20
 */
@Slf4j
@RestController
@ApiResource(path = "/gm")
@Api(tags = "Cli 总部封禁接口", hidden = true)
public class GmBanController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IUserService iUserService;

    @Resource
    private ISpaceService iSpaceService;

    @PostResource(path = "/ban/user/{userId}", requiredPermission = false)
    @ApiOperation(value = "封禁帐号", notes = "限制登录，强制登出", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> banUser(@PathVariable("userId") Long userId) {
        log.info("操作者「{}」对帐号「{}」进行封禁", SessionContext.getUserId(), userId);
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.ACCOUNT_BAN);
        // 查询用户是否存在
        UserEntity entity = iUserService.getById(userId);
        ExceptionUtil.isNotNull(entity, UserException.USER_NOT_EXIST);
        // 封禁帐号
        UserEntity user = new UserEntity();
        user.setId(userId);
        user.setRemark(InternalConstants.BAN_ACCOUNT_REMARK);
        iUserService.updateById(user);
        // 关闭帐号其他端登录会话
        iUserService.closeMultiSession(userId, false);
        return ResponseData.success();
    }

    @PostResource(path = "/ban/space/{spaceId}", requiredPermission = false)
    @ApiOperation(value = "封禁空间", notes = "限制功能", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> banSpace(@PathVariable("spaceId") String spaceId) {
        log.info("操作者「{}」对空间「{}」进行封禁", SessionContext.getUserId(), spaceId);
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SPACE_BAN);
        // 查询空间是否存在
        iSpaceService.getBySpaceId(spaceId);
        // 封禁空间
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().ban(true).build();
        iSpaceService.switchSpacePros(1L, spaceId, feature);
        return ResponseData.success();
    }

}
