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
import com.vikadata.api.helper.RedisLockHelper;
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
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;

/**
 * <p>
 * 腾讯QQ相关服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/10/12
 */
@RestController
@Api(tags = "腾讯QQ模块_腾讯QQ相关服务接口")
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
    @ApiOperation(value = "网站应用回调", notes = "code、accessToken 至少传入一个")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "type", value = "类型(0:扫码登录;1:帐号绑定;)", dataTypeClass = Integer.class, paramType = "query", example = "0"),
        @ApiImplicitParam(name = "code", value = "编码（自己构建请求，回调该参数）", dataTypeClass = String.class, paramType = "query", example = "ABC123"),
        @ApiImplicitParam(name = "accessToken", value = "授权令牌（使用JS SDK 回调该参数）", dataTypeClass = String.class, paramType = "query", example = "05C5374834"),
        @ApiImplicitParam(name = "expiresIn", value = "access token的有效期", dataTypeClass = String.class, paramType = "query", example = "7776000")
    })
    public ResponseData<String> callback(@RequestParam(value = "type", required = false, defaultValue = "0") Integer type,
        @RequestParam(name = "code", required = false) String code,
        @RequestParam(name = "accessToken", required = false) String accessToken) throws QQException {
        log.info("QQ网站应用回调，type:{},code:{},accessToken:{}", type, code, accessToken);
        ExceptionUtil.isTrue(code != null || accessToken != null, INCORRECT_ARG);
        if (qqTemplate == null) {
            throw new BusinessException("未开通QQ连接服务");
        }
        if (code != null) {
            // 防止重复请求
            RedisLockHelper.me().preventDuplicateRequests(StrUtil.format(GENERAL_LOCKED, "qq:code", code));
            AccessTokenInfo tokenInfo = qqTemplate.authOperations().getAccessToken(code);
            ExceptionUtil.isNotNull(tokenInfo, AUTH_FAIL);
            accessToken = tokenInfo.getAccessToken();
        }
        WebAppAuthInfo webAppAuthInfo = qqTemplate.authOperations().getAuthInfo(accessToken);
        ExceptionUtil.isNotNull(webAppAuthInfo, AUTH_FAIL);
        // 查询该会员昵称
        String nickName = thirdPartyMemberMapper.selectNickNameByUnionIdAndType(webAppAuthInfo.getClientId(),
            webAppAuthInfo.getUnionId(), ThirdPartyMemberType.TENCENT.getType());
        // 若无记录，保存该会员信息
        if (nickName == null) {
            TencentUserInfo userInfo = qqTemplate.authOperations().getTencentUserInfo(accessToken, webAppAuthInfo.getClientId(), webAppAuthInfo.getOpenId());
            ExceptionUtil.isNotNull(userInfo, AUTH_FAIL);
            iThirdPartyMemberService.createTencentMember(webAppAuthInfo, userInfo);
            nickName = userInfo.getNickname();
        }
        // 帐号绑定处理
        if (type == 1) {
            Long userId = SessionContext.getUserId();
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setUnionId(webAppAuthInfo.getUnionId());
            authInfo.setOpenId(webAppAuthInfo.getOpenId());
            authInfo.setNickName(nickName);
            iUserLinkService.createUserLink(userId, authInfo, true, LinkType.TENCENT.getType());
            return ResponseData.success(null);
        }
        // 查询是否关联了维格账号
        Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(webAppAuthInfo.getUnionId(), LinkType.TENCENT.getType());
        if (linkUserId == null) {
            // 找不到关联维格帐号时，将信息保存到用户授权的缓存中，在PC 端完善用户信息后完成关联并登陆
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setType(LinkType.TENCENT.getType());
            authInfo.setUnionId(webAppAuthInfo.getUnionId());
            authInfo.setOpenId(webAppAuthInfo.getOpenId());
            authInfo.setNickName(nickName);
            return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
        }
        // 登录成功，保存session
        SessionContext.setUserId(linkUserId);
        // 神策埋点 - 登录
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "QQ扫码", origin));
        return ResponseData.success(null);
    }
}
