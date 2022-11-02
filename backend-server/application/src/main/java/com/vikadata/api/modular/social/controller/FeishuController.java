package com.vikadata.api.modular.social.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.FeishuAppProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.model.FeishuTenantDetailVO;
import com.vikadata.api.modular.social.model.FeishuTenantMainAdminChangeRo;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.ISocialService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.social.feishu.model.FeishuAccessToken;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Lark access interface
 */
@RestController
@ApiResource(path = "/")
@Api(tags = "Lark Interface")
@Slf4j
public class FeishuController {

    @Resource
    private ISocialService iSocialService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private FeishuAppProperties feishuAppProperties;

    @Resource
    private IFeishuService iFeishuService;

    @Resource
    private IUserService iUserService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ServerProperties serverProperties;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @GetResource(path = "/social/feishu/login/callback", requiredLogin = false)
    @ApiOperation(value = "vika integration Lark Portal login callback", notes = "The exclusive intranet version of the login free scenario will not be available online", hidden = true)
    public RedirectView loginCallback(@RequestParam("code") String code) {
        iFeishuService.switchDefaultContext();
        // User's of self built applications will call back the CODE here to ensure that there is only one call after logging in,
        FeishuAccessToken accessToken = iFeishuService.getUserAccessToken(code);
        // Query whether the user's mobile phone number exists. Note that the returned mobile phone number carries the area code
        String mobile = StrUtil.subSuf(accessToken.getMobile(), 3);
        Long userId = iUserService.getUserIdByMobile(mobile);
        if (userId == null) {
            return new RedirectView(constProperties.getServerDomain() + "/workbench");
        }
        SessionContext.setUserId(userId);
        return new RedirectView(constProperties.getServerDomain() + "/workbench");
    }

    @GetResource(path = "/social/feishu/admin/callback", requiredLogin = false)
    @ApiOperation(value = "Application management background authorization callback", notes = "Store app can only receive callback from Lark app", hidden = true)
    public RedirectView adminCallback(@RequestParam("code") String code) {
        try {
            iFeishuService.switchDefaultContext();
            // It can only be used within the scope of application available authorization
            FeishuAccessToken accessToken = iFeishuService.getUserAccessToken(code);
            boolean isTenantAdmin = iFeishuService.checkUserIsAdmin(accessToken.getTenantKey(), accessToken.getOpenId());
            if (!isTenantAdmin) {
                // Non application administrator, redirect to the error page
                return new RedirectView(getErrorPath("is_not_admin"));
            }
            // Create if no user exists
            Long userId = iUserService.createSocialUser(new SocialUser(accessToken.getName(), accessToken.getAvatarUrl(),
                    null, null, null, iFeishuService.getIsvAppId(),
                    accessToken.getTenantKey(), accessToken.getOpenId(), accessToken.getUnionId(), SocialPlatformType.FEISHU));
            SessionContext.setUserId(userId);
            // Redirect to the management page, encrypt the tenant information, and tell the page which tenant is the management page
            String redirectUri = constProperties.getServerDomain() + feishuAppProperties.getAdminUri();
            return new RedirectView(StrUtil.format(redirectUri, accessToken.getTenantKey()));
        }
        catch (Exception exception) {
            log.error("Lark tenant management portal authorization failed", exception);
            return new RedirectView(getErrorPath("auth_fail"));
        }
    }

    @GetResource(path = "/social/feishu/admin", requiredLogin = false)
    @ApiOperation(value = "Enter the application management background authorization callback", notes = "Only callback from Lark application can be received", hidden = true)
    public RedirectView adminManagePage() {
        // Only construct Lark authorization callback
        iFeishuService.switchDefaultContext();
        String redirectUri = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() + "/social/feishu/admin/callback";
        String authUrl = iFeishuService.buildAuthUrl(redirectUri, String.valueOf(DateUtil.date().getTime()));
        return new RedirectView(authUrl);
    }

    @GetResource(path = "/social/feishu/entry/callback", requiredLogin = false)
    @ApiOperation(value = "Lark starts using the entrance", notes = "Only callback from Lark application can be received", hidden = true)
    public RedirectView feishuEntryCallback(@RequestParam(name = "code") String code,
            @RequestParam(name = "url", required = false) String url,
            HttpServletRequest request) {
        log.info("Lark callback received: {}, parameter：{}", request.getRequestURI(), request.getQueryString());
        try {
            iFeishuService.switchDefaultContext();
            FeishuAccessToken accessToken = iFeishuService.getUserAccessToken(code);
            // Check whether you have logged in. If not, automatically create an account and set the current user to log in
            Long userId = iUserService.createSocialUser(new SocialUser(accessToken.getName(), accessToken.getAvatarUrl(),
                    null, null, null, iFeishuService.getIsvAppId(),
                    accessToken.getTenantKey(), accessToken.getOpenId(), accessToken.getUnionId(), SocialPlatformType.FEISHU));
            SessionContext.setUserId(userId);
            if (StrUtil.isNotBlank(url)) {
                // Mention notification entry
                return new RedirectView(url);
            }
            else {
                List<String> spaceIds = iSocialTenantBindService.getSpaceIdsByTenantIdAndAppId(accessToken.getTenantKey(), iFeishuService.getIsvAppId());
                String openId = iSocialTenantUserService.getOpenIdByTenantIdAndUserId(iFeishuService.getIsvAppId(), accessToken.getTenantKey(), userId);
                if (StrUtil.isBlank(openId)) {
                    // Jump to the default workbench
                    return new RedirectView(constProperties.getServerDomain() + "/workbench");
                }
                else {
                    if (CollUtil.isEmpty(spaceIds)) {
                        return new RedirectView(constProperties.getServerDomain() + "/workbench");
                    }
                    else {
                        // Query whether all members of the space have been synchronized
                        String spaceId = CollUtil.getFirst(spaceIds);
                        int memberCount = iMemberService.getTotalMemberCountBySpaceId(spaceId);
                        if (memberCount > 0) {
                            // Jump to the designated space station
                            return new RedirectView(StrUtil.format(constProperties.getServerDomain() + "/space/{}/workbench", spaceId));
                        }
                        else {
                            return new RedirectView(constProperties.getServerDomain() + "/user/social/syncing");
                        }
                    }
                }
            }
        }
        catch (Exception exception) {
            log.error("Lark application portal authorization failed", exception);
            return new RedirectView(getErrorPath("auth_fail"));
        }
    }

    @GetResource(path = "/social/feishu/entry", requiredLogin = false)
    @ApiOperation(value = "Application portal", notes = "Can only receive clicks from Lark app", hidden = true)
    public RedirectView feishuEntry(@RequestParam(name = "url", required = false) String url) {
        // Construct Lark authorization login
        String redirectUri = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() + "/social/feishu/entry/callback";
        if (StrUtil.isNotBlank(url)) {
            redirectUri = StrUtil.format(redirectUri + "?url={}", url);
        }
        iFeishuService.switchDefaultContext();
        String authUrl = iFeishuService.buildAuthUrl(redirectUri, String.valueOf(DateUtil.date().getTime()));
        return new RedirectView(authUrl);
    }

    @GetResource(path = "/social/feishu/tenant/{tenantKey}", requiredPermission = false)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "tenantKey", value = "Lark Tenant ID", required = true,
                    dataTypeClass = String.class, paramType = "path", example = "18823789")
    })
    @ApiOperation(value = "Get tenant binding information", notes = "Get the space information bound by the tenant")
    public ResponseData<FeishuTenantDetailVO> getTenantInfo(@PathVariable("tenantKey") String tenantKey) {
        Long userId = SessionContext.getUserId();
        iFeishuService.switchDefaultContext();
        // Verify whether the current user is in the tenant
        iSocialService.checkUserIfInTenant(userId, iFeishuService.getIsvAppId(), tenantKey);
        return ResponseData.success(iSocialService.getFeishuTenantInfo(iFeishuService.getIsvAppId(), tenantKey));
    }

    @PostResource(path = "/social/feishu/changeAdmin", requiredPermission = false)
    @ApiOperation(value = "Tenant space replacement master administrator", notes = "Replace the master administrator")
    public ResponseData<Void> changeAdmin(@RequestBody @Valid FeishuTenantMainAdminChangeRo opRo) {
        Long userId = SessionContext.getUserId();
        String tenantKey = opRo.getTenantKey();
        // Verify whether the current user is in the tenant
        iFeishuService.switchDefaultContext();
        iSocialService.checkUserIfInTenant(userId, iFeishuService.getIsvAppId(), tenantKey);
        iSocialService.changeMainAdmin(opRo.getSpaceId(), opRo.getMemberId());
        return ResponseData.success();
    }

    private String getErrorPath(String errorKey) {
        String uri = constProperties.getServerDomain() + feishuAppProperties.getErrorUri();
        return StrUtil.format(uri, errorKey);
    }
}
