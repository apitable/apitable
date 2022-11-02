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
 *  Api for banned management
 * </p>
 *
 */
@Slf4j
@RestController
@ApiResource(path = "/gm")
@Api(tags = "Cli Office Ban API", hidden = true)
public class GmBanController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IUserService iUserService;

    @Resource
    private ISpaceService iSpaceService;

    @PostResource(path = "/ban/user/{userId}", requiredPermission = false)
    @ApiOperation(value = "Ban account", notes = "Restrict login and force logout.", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> banUser(@PathVariable("userId") Long userId) {
        log.info("The operator「{}」ban the account「{}」", SessionContext.getUserId(), userId);
        // Check permissions.
        iGmService.validPermission(SessionContext.getUserId(), GmAction.ACCOUNT_BAN);
        // Query whether the user exist.
        UserEntity entity = iUserService.getById(userId);
        ExceptionUtil.isNotNull(entity, UserException.USER_NOT_EXIST);
        // Ban account.
        UserEntity user = new UserEntity();
        user.setId(userId);
        user.setRemark(InternalConstants.BAN_ACCOUNT_REMARK);
        iUserService.updateById(user);
        // Close other login session of account.
        iUserService.closeMultiSession(userId, false);
        return ResponseData.success();
    }

    @PostResource(path = "/ban/space/{spaceId}", requiredPermission = false)
    @ApiOperation(value = "Ban space", notes = "limit function.", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> banSpace(@PathVariable("spaceId") String spaceId) {
        log.info("The operator「{}」ban the space「{}」", SessionContext.getUserId(), spaceId);
        // Check permissions.
        iGmService.validPermission(SessionContext.getUserId(), GmAction.SPACE_BAN);
        // Query whether the space exist.
        iSpaceService.getBySpaceId(spaceId);
        // Ban space.
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().ban(true).build();
        iSpaceService.switchSpacePros(1L, spaceId, feature);
        return ResponseData.success();
    }

}
