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
 * 飞书接入接口
 * @author Shawn Deng
 * @date 2021-07-21 10:03:22
 */
@RestController
@ApiResource(path = "/")
@Api(tags = "飞书接口")
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
    @ApiOperation(value = "维格内网飞书入口登录回调", notes = "专属内网版本免登场景，线上不会提供", hidden = true)
    public RedirectView loginCallback(@RequestParam("code") String code) {
        iFeishuService.switchDefaultContext();
        // 自建应用飞书用户登录后，回调CODE到这里，保证只有一次调用
        FeishuAccessToken accessToken = iFeishuService.getUserAccessToken(code);
        // 查询用户的手机号是否存在, 注意返回的手机号是带着区号的
        String mobile = StrUtil.subSuf(accessToken.getMobile(), 3);
        Long userId = iUserService.getUserIdByMobile(mobile);
        if (userId == null) {
            return new RedirectView(constProperties.getServerDomain() + "/workbench");
        }
        SessionContext.setUserId(userId);
        return new RedirectView(constProperties.getServerDomain() + "/workbench");
    }

    @GetResource(path = "/social/feishu/admin/callback", requiredLogin = false)
    @ApiOperation(value = "应用管理后台授权回调", notes = "商店应用，只能接收从飞书应用回调", hidden = true)
    public RedirectView adminCallback(@RequestParam("code") String code) {
        try {
            iFeishuService.switchDefaultContext();
            // 必须在应用可用授权范围内才能使用
            FeishuAccessToken accessToken = iFeishuService.getUserAccessToken(code);
            boolean isTenantAdmin = iFeishuService.checkUserIsAdmin(accessToken.getTenantKey(), accessToken.getOpenId());
            if (!isTenantAdmin) {
                // 非应用管理员，重定向到错误页面
                return new RedirectView(getErrorPath("is_not_admin"));
            }
            // 不存在用户则创建
            Long userId = iUserService.createSocialUser(new SocialUser(accessToken.getName(), accessToken.getAvatarUrl(),
                    null, null, null, iFeishuService.getIsvAppId(),
                    accessToken.getTenantKey(), accessToken.getOpenId(), accessToken.getUnionId(), SocialPlatformType.FEISHU));
            SessionContext.setUserId(userId);
            // 重定向到管理页面，加密租户信息，并传递告诉页面这是哪个租户的管理页面
            String redirectUri = constProperties.getServerDomain() + feishuAppProperties.getAdminUri();
            return new RedirectView(StrUtil.format(redirectUri, accessToken.getTenantKey()));
        }
        catch (Exception exception) {
            log.error("飞书租户管理入口授权失败", exception);
            return new RedirectView(getErrorPath("auth_fail"));
        }
    }

    @GetResource(path = "/social/feishu/admin", requiredLogin = false)
    @ApiOperation(value = "进入应用管理后台授权回调", notes = "只能接收从飞书应用回调", hidden = true)
    public RedirectView adminManagePage() {
        // 只做构造飞书授权回调
        iFeishuService.switchDefaultContext();
        String redirectUri = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() + "/social/feishu/admin/callback";
        String authUrl = iFeishuService.buildAuthUrl(redirectUri, String.valueOf(DateUtil.date().getTime()));
        return new RedirectView(authUrl);
    }

    @GetResource(path = "/social/feishu/entry/callback", requiredLogin = false)
    @ApiOperation(value = "飞书开始使用入口", notes = "只能接收从飞书应用回调", hidden = true)
    public RedirectView feishuEntryCallback(@RequestParam(name = "code") String code,
            @RequestParam(name = "url", required = false) String url,
            HttpServletRequest request) {
        log.info("收到飞书回调: {}, 参数：{}", request.getRequestURI(), request.getQueryString());
        try {
            iFeishuService.switchDefaultContext();
            FeishuAccessToken accessToken = iFeishuService.getUserAccessToken(code);
            // 检查是否已登陆，如果未注册，自动创建账户并设置当前用户登录
            Long userId = iUserService.createSocialUser(new SocialUser(accessToken.getName(), accessToken.getAvatarUrl(),
                    null, null, null, iFeishuService.getIsvAppId(),
                    accessToken.getTenantKey(), accessToken.getOpenId(), accessToken.getUnionId(), SocialPlatformType.FEISHU));
            SessionContext.setUserId(userId);
            if (StrUtil.isNotBlank(url)) {
                // 提及通知入口
                return new RedirectView(url);
            }
            else {
                List<String> spaceIds = iSocialTenantBindService.getSpaceIdsByTenantIdAndAppId(accessToken.getTenantKey(), iFeishuService.getIsvAppId());
                String openId = iSocialTenantUserService.getOpenIdByTenantIdAndUserId(iFeishuService.getIsvAppId(), accessToken.getTenantKey(), userId);
                if (StrUtil.isBlank(openId)) {
                    // 跳转默认工作台
                    return new RedirectView(constProperties.getServerDomain() + "/workbench");
                }
                else {
                    if (CollUtil.isEmpty(spaceIds)) {
                        return new RedirectView(constProperties.getServerDomain() + "/workbench");
                    }
                    else {
                        // 查询空间是否已经同步完所有成员
                        String spaceId = CollUtil.getFirst(spaceIds);
                        int memberCount = iMemberService.getTotalMemberCountBySpaceId(spaceId);
                        if (memberCount > 0) {
                            // 跳转到指定空间站
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
            log.error("飞书应用入口授权失败", exception);
            return new RedirectView(getErrorPath("auth_fail"));
        }
    }

    @GetResource(path = "/social/feishu/entry", requiredLogin = false)
    @ApiOperation(value = "应用入口", notes = "只能接收从飞书应用点击", hidden = true)
    public RedirectView feishuEntry(@RequestParam(name = "url", required = false) String url) {
        // 构造飞书授权登录
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
            @ApiImplicitParam(name = "tenantKey", value = "飞书租户标识", required = true,
                    dataTypeClass = String.class, paramType = "path", example = "18823789")
    })
    @ApiOperation(value = "获取租户绑定的信息", notes = "获取租户绑定的空间信息")
    public ResponseData<FeishuTenantDetailVO> getTenantInfo(@PathVariable("tenantKey") String tenantKey) {
        Long userId = SessionContext.getUserId();
        iFeishuService.switchDefaultContext();
        // 校验当前操作的用户是否在租户内
        iSocialService.checkUserIfInTenant(userId, iFeishuService.getIsvAppId(), tenantKey);
        return ResponseData.success(iSocialService.getFeishuTenantInfo(iFeishuService.getIsvAppId(), tenantKey));
    }

    @PostResource(path = "/social/feishu/changeAdmin", requiredPermission = false)
    @ApiOperation(value = "租户空间更换主管理员", notes = "更换主管理员")
    public ResponseData<Void> changeAdmin(@RequestBody @Valid FeishuTenantMainAdminChangeRo opRo) {
        Long userId = SessionContext.getUserId();
        String tenantKey = opRo.getTenantKey();
        // 校验当前操作的用户是否在租户内
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
