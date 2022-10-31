package com.vikadata.api.modular.dingtalk.controller;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.helper.RedisLockHelper;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.model.UserInfo;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;


/**
 * DingTalk related interface <p>
 */
@RestController
@Api(tags = "DingTalk service interface")
@ApiResource(path = "/dingtalk")
@Slf4j
public class DingTalkController {

    @Resource
    private IDingTalkService dingTalkService;

    @Resource
    private IAuthService iAuthService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private SensorsService sensorsService;

    @GetResource(path = "/login/callback", requiredLogin = false)
    @ApiOperation(value = "DingTalk scan code login callback")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "Type (0: scan code to log in; 1: account binding;)", dataTypeClass = Integer.class, paramType = "query", example = "0"),
            @ApiImplicitParam(name = "code", value = "coding. JS gets the login Tmp Code, redirects and returns after jumping to the specified connection", dataTypeClass = String.class, required = true, paramType = "query", example = "ABC123"),
            @ApiImplicitParam(name = "state", value = "declare value. Used to prevent replay attacks", dataTypeClass = String.class, required = true, paramType = "query", example = "STATE")
    })
    public ResponseData<String> callback(@RequestParam(value = "type", required = false, defaultValue = "0") Integer type,
            @RequestParam(name = "code") String code, @RequestParam(name = "state") String state) {
        // prevent duplicate requests
        RedisLockHelper.me().preventDuplicateRequests(StrUtil.format(GENERAL_LOCKED, "dingtalk:code", code));
        log.info("DingTalk scan code login callback, type:{},code:{},state:{}", type, code, state);
        UserInfo userInfo;
        // get personal information of authorized users through temporary authorization codes
        try {
            userInfo = dingTalkService.getUserInfoByCode(code);
        }
        catch (DingTalkApiException e) {
            log.info("Failed to get user information through temporary authorization code Code, code:{},msg:{}",
                    e.getCode(), e.getMessage());
            throw new BusinessException(INCORRECT_ARG);
        }
        // Account binding processing
        if (type == 1) {
            Long userId = SessionContext.getUserId();
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setUnionId(userInfo.getUnionid());
            authInfo.setOpenId(userInfo.getOpenid());
            authInfo.setNickName(userInfo.getNick());
            iUserLinkService.createUserLink(userId, authInfo, true, LinkType.DINGTALK.getType());
            return ResponseData.success(null);
        }
        // Query whether the account is associated
        Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(userInfo.getUnionid(), LinkType.DINGTALK.getType());
        if (linkUserId == null) {
            // When the associated account cannot be found, save the information in the cache authorized by the user, complete the association and log in after completing the user information on the PC side
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setType(LinkType.DINGTALK.getType());
            authInfo.setUnionId(userInfo.getUnionid());
            authInfo.setOpenId(userInfo.getOpenid());
            authInfo.setNickName(userInfo.getNick());
            return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
        }
        // Successful login, save session
        SessionContext.setUserId(linkUserId);
        // Sensor - Login
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "钉钉扫码", origin));
        return ResponseData.success(null);
    }

}
