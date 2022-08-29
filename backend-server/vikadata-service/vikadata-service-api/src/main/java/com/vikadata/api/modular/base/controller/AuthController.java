package com.vikadata.api.modular.base.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.AuditAction;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.auth.ConnectorTemplate;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.CookieProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.LoginType;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.dto.user.UserLoginResult;
import com.vikadata.api.model.ro.user.LoginRo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.modular.base.model.LogoutVO;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.finance.service.IBlackListService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.service.ISocialTenantDomainService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.security.afs.AfsCheckService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.boot.autoconfigure.auth0.Auth0Template;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.AuthConstants.AUTH_DESC;

/**
 * <p>
 * 授权接口
 * </p>
 *
 * @author Shawn Deng
 */
@RestController
@Api(tags = "授权相关接口")
@ApiResource(path = "/")
@Slf4j
public class AuthController {

    @Resource
    private IAuthService iAuthService;

    @Resource
    private IUserService iUserService;

    @Resource
    private ConnectorTemplate connectorTemplate;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISocialTenantDomainService iSocialTenantDomainService;

    @Resource
    private IBlackListService iBlackListService;

    @Resource
    private AfsCheckService afsCheckService;

    @Resource
    private CookieProperties cookieProperties;

    @Resource
    private ConstProperties constProperties;

    @Autowired(required = false)
    private Auth0Template auth0Template;

    @AuditAction(value = "user_login")
    @PostResource(name = "登入", path = "/signIn", requiredLogin = false)
    @ApiOperation(value = "登入", notes = AUTH_DESC, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<Void> login(@RequestBody @Valid LoginRo data, HttpServletRequest request) {
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(request, false, true);
        // 登录类型路由
        Map<LoginType, Function<LoginRo, Long>> loginActionFunc = new HashMap<>();
        // 密码登录
        loginActionFunc.put(LoginType.PASSWORD, loginRo -> {
            // 密码登录需要人机验证
            afsCheckService.noTraceCheck(loginRo.getData());
            // 登录处理
            Long userId = iAuthService.loginUsingPassword(loginRo);
            // 神策埋点 - 密码登录
            TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "帐号密码", origin));
            return userId;
        });
        // 短信验证码登录
        loginActionFunc.put(LoginType.SMS_CODE, loginRo -> {
            UserLoginResult result = iAuthService.loginUsingSmsCode(loginRo);
            // 神策埋点 - 登录 or 注册
            TrackEventType type = Boolean.TRUE.equals(result.getIsSignUp()) ? TrackEventType.REGISTER : TrackEventType.LOGIN;
            TaskManager.me().execute(() -> sensorsService.track(result.getUserId(), type, "手机号验证码", origin));
            return result.getUserId();
        });
        // 邮箱验证码登录
        loginActionFunc.put(LoginType.EMAIL_CODE, loginRo -> {
            UserLoginResult result = iAuthService.loginUsingEmailCode(loginRo);
            // 神策埋点 - 登录 or 注册
            TrackEventType type = Boolean.TRUE.equals(result.getIsSignUp()) ? TrackEventType.REGISTER : TrackEventType.LOGIN;
            TaskManager.me().execute(() -> sensorsService.track(result.getUserId(), type, "邮箱验证码", origin));
            return result.getUserId();
        });
        // SSO登录(私有化用户使用)
        loginActionFunc.put(LoginType.SSO_AUTH, loginRo -> connectorTemplate.loginBySso(data.getUsername(), data.getCredential()));
        // 处理登录逻辑
        Long userId = loginActionFunc.get(data.getType()).apply(data);
        // 封禁帐号校验
        iBlackListService.checkBlackUser(userId);
        // 保存会话
        SessionContext.setUserId(userId);
        return ResponseData.success();
    }

    @AuditAction(value = "user_logout")
    @PostResource(name = "退出登录", path = "/signOut", requiredPermission = false, method = { RequestMethod.GET, RequestMethod.POST })
    @ApiOperation(value = "退出登录", notes = "退出当前用户")
    public ResponseData<LogoutVO> logout(HttpServletRequest request, HttpServletResponse response) {
        SessionContext.cleanContext(request);
        SessionContext.removeCookie(response, cookieProperties.getI18nCookieName(), cookieProperties.getDomainName());
        LogoutVO logoutVO = new LogoutVO();
        if (auth0Template != null) {
            String logoutUrl = auth0Template.buildLogoutUrl(constProperties.getServerDomain());
            if (log.isDebugEnabled()) {
                log.debug("logout redirect url: {}", logoutUrl);
            }
            logoutVO.setNeedRedirect(true);
            logoutVO.setRedirectUri(logoutUrl);
        }
        return ResponseData.success(logoutVO);
    }

    @GetResource(name = "获取个人信息", path = "/user/me", requiredPermission = false)
    @ApiOperation(value = "获取个人信息", notes = "获取个人信息", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "空间ID", dataTypeClass = String.class, paramType = "query", example = "spc8mXUeiXyVo"),
            @ApiImplicitParam(name = "nodeId", value = "节点ID", dataTypeClass = String.class, paramType = "query", example = "dstS94qPZFXjC1LKns"),
            @ApiImplicitParam(name = "filter", value = "是否过滤空间相关信息", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query", example = "true")
    })
    public ResponseData<UserInfoVo> userInfo(@RequestParam(name = "spaceId", required = false) String spaceId,
            @RequestParam(name = "nodeId", required = false) String nodeId,
            @RequestParam(name = "filter", required = false, defaultValue = "false") Boolean filter,
            HttpServletRequest request) {
        Long userId = SessionContext.getUserId();

        // 尝试返回SpaceId
        spaceId = tryReturnSpaceId(nodeId, spaceId, userId, request);

        // 获取用户信息
        UserInfoVo userInfo = iUserService.getCurrentUserInfo(userId, spaceId, filter);

        // 返回空间站绑定的域名
        String spaceDomain = returnSpaceDomain(spaceId, userInfo.getSpaceId());
        userInfo.setSpaceDomain(spaceDomain);
        return ResponseData.success(userInfo);
    }

    // 获取用户信息之前，尝试先返回SpaceId
    private String tryReturnSpaceId(String nodeId, String spaceId, Long userId, HttpServletRequest request) {
        if (StrUtil.isNotBlank(nodeId)) {
            // 1.使用url - NodeId定位空间并且返回绑定域名
            return iNodeService.getSpaceIdByNodeIdIncludeDeleted(nodeId);
        }
        if (StrUtil.isBlank(spaceId)) {
            // 2.用户没有主动定位空间站行为 - 使用当前访问域名定位空间站
            String remoteHost = HttpContextUtil.getRemoteHost(request);
            String domainBindSpaceId = iSocialTenantDomainService.getSpaceIdByDomainName(remoteHost);
            if (StrUtil.isNotBlank(domainBindSpaceId)) {
                // 例外情况：登陆人使用专属域名，然后账号密码登陆;
                // 返回专属域名空间站当前登陆人没有操作空间权限;
                // 届时返回用户最后活跃的空间Id
                Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, domainBindSpaceId);
                if (ObjectUtil.isNull(memberId)) {
                    // 没有操作权限，获取活跃用户最后活跃节点
                    return userActiveSpaceService.getLastActiveSpace(userId);
                }
                else {
                    return domainBindSpaceId;
                }
            }
        }
        return spaceId;
    }

    // 返回空间站域名
    private String returnSpaceDomain(String spaceId, String userSpaceId) {
        // 返回域名信息，没有凭据获取 或者 查找的情况下返回公网域名
        if (StrUtil.isNotBlank(spaceId)) {
            // 3.前置条件spaceId不为空，直接返回绑定域名
            return iSocialTenantDomainService.getDomainNameBySpaceId(spaceId, false);
        }
        else {
            // 4.都没有的情况下根据最后活跃的空间操作
            if (StrUtil.isBlank(userSpaceId)) {
                return iSocialTenantDomainService.getSpaceDefaultDomainName();
            }
            else {
                return iSocialTenantDomainService.getDomainNameBySpaceId(userSpaceId, false);
            }
        }
    }
}
