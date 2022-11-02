package com.vikadata.api.modular.tencent.controller;

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
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.component.redis.RedisLockHelper;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.service.IThirdPartyMemberService;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.social.qq.QQException;
import com.vikadata.social.qq.QQTemplate;
import com.vikadata.social.qq.model.AccessTokenInfo;
import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static com.vikadata.api.enums.exception.UserException.AUTH_FAIL;
import static com.vikadata.core.constants.RedisConstants.GENERAL_LOCKED;

/**
 * <p>
 * Tencent QQ related service interface
 * </p>
 */
@RestController
@Api(tags = "Tencent QQ module_Tencent QQ related service interface")
@ApiResource(path = "/tencent")
@Slf4j
public class TencentController {

    @Autowired(required = false)
    private QQTemplate qqTemplate;

    @Resource
    private IAuthService iAuthService;

    @Resource
    private IThirdPartyMemberService iThirdPartyMemberService;

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private SensorsService sensorsService;

    @GetResource(path = "/web/callback", requiredLogin = false)
    @ApiOperation(value = "Website application callback", notes = "code、accessToken, At least one is passed in")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "type", value = "Type (0: Scan code for login; 1: Account binding;)", dataTypeClass = Integer.class, paramType = "query", example = "0"),
        @ApiImplicitParam(name = "code", value = "Code (build the request yourself and call back the parameter)", dataTypeClass = String.class, paramType = "query", example = "ABC123"),
        @ApiImplicitParam(name = "accessToken", value = "Authorization token (use the JS SDK to call back this parameter)", dataTypeClass = String.class, paramType = "query", example = "05C5374834"),
        @ApiImplicitParam(name = "expiresIn", value = "access token's TERM OF VALIDITY", dataTypeClass = String.class, paramType = "query", example = "7776000")
    })
    public ResponseData<String> callback(@RequestParam(value = "type", required = false, defaultValue = "0") Integer type,
        @RequestParam(name = "code", required = false) String code,
        @RequestParam(name = "accessToken", required = false) String accessToken) throws QQException {
        log.info("QQ Website application callback，type:{},code:{},accessToken:{}", type, code, accessToken);
        ExceptionUtil.isTrue(code != null || accessToken != null, INCORRECT_ARG);
        if (qqTemplate == null) {
            throw new BusinessException("QQ connection service is not opened");
        }
        if (code != null) {
            // Prevent duplicate requests
            RedisLockHelper.me().preventDuplicateRequests(StrUtil.format(GENERAL_LOCKED, "qq:code", code));
            AccessTokenInfo tokenInfo = qqTemplate.authOperations().getAccessToken(code);
            ExceptionUtil.isNotNull(tokenInfo, AUTH_FAIL);
            accessToken = tokenInfo.getAccessToken();
        }
        WebAppAuthInfo webAppAuthInfo = qqTemplate.authOperations().getAuthInfo(accessToken);
        ExceptionUtil.isNotNull(webAppAuthInfo, AUTH_FAIL);
        // Query the member's nickname
        String nickName = thirdPartyMemberMapper.selectNickNameByUnionIdAndType(webAppAuthInfo.getClientId(),
            webAppAuthInfo.getUnionId(), ThirdPartyMemberType.TENCENT.getType());
        // If there is no record, save the member information
        if (nickName == null) {
            TencentUserInfo userInfo = qqTemplate.authOperations().getTencentUserInfo(accessToken, webAppAuthInfo.getClientId(), webAppAuthInfo.getOpenId());
            ExceptionUtil.isNotNull(userInfo, AUTH_FAIL);
            iThirdPartyMemberService.createTencentMember(webAppAuthInfo, userInfo);
            nickName = userInfo.getNickname();
        }
        // Account binding processing
        if (type == 1) {
            Long userId = SessionContext.getUserId();
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setUnionId(webAppAuthInfo.getUnionId());
            authInfo.setOpenId(webAppAuthInfo.getOpenId());
            authInfo.setNickName(nickName);
            iUserLinkService.createUserLink(userId, authInfo, true, LinkType.TENCENT.getType());
            return ResponseData.success(null);
        }
        // Query whether the vika account is associated
        Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(webAppAuthInfo.getUnionId(), LinkType.TENCENT.getType());
        if (linkUserId == null) {
            // If the associated vika account cannot be found, the information will be saved in the cache authorized by the user,
            // and the association will be completed and logged in after the PC completes the user information
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setType(LinkType.TENCENT.getType());
            authInfo.setUnionId(webAppAuthInfo.getUnionId());
            authInfo.setOpenId(webAppAuthInfo.getOpenId());
            authInfo.setNickName(nickName);
            return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
        }
        // Login succeeded, save session
        SessionContext.setUserId(linkUserId);
        // Shence Burial Point - Login
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "QQ scanning code", origin));
        return ResponseData.success(null);
    }
}
