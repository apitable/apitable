package com.vikadata.api.enterprise.social.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.enterprise.social.service.IFeishuService;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

/**
 * <p>
 * Third party platform integration interface
 * </p>
 */
@RestController
@ApiResource(path = "/social")
@Api(tags = "Third party platform integration interface")
@Slf4j
public class SocialController {

    @Resource
    private ConstProperties constProperties;

    @Resource
    private ServerProperties serverProperties;

    @Resource
    private IFeishuService iFeishuService;

    @GetResource(path = "/feishu/workbench/callback", requiredLogin = false)
    @ApiOperation(value = "Lark configuration application callback", hidden = true)
    public void feishuWorkbenchCallback(@RequestParam(name = "url") String url,
            HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.info("Lark callback received: {}, parameter：{}", request.getRequestURI(), request.getQueryString());
        String redirectUri = constProperties.getServerDomain()
                + serverProperties.getServlet().getContextPath()
                + StrUtil.format("/social/feishu/entry?url={}", url);
        response.sendRedirect(redirectUri);
    }

    @Deprecated
    @GetResource(path = "/feishu/configure/callback", requiredLogin = false)
    @ApiOperation(value = "Lark configuration application callback", hidden = true)
    public void feishuConfigureCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.info("Lark callback received: {}, parameter：{}", request.getRequestURI(), request.getQueryString());
        // Redirect to the Getting Started portal
        String redirectUri = constProperties.getServerDomain()
                + serverProperties.getServlet().getContextPath()
                + "/social/feishu/admin";
        response.sendRedirect(redirectUri);
    }

    @GetResource(path = "/feishu/auth/callback", requiredLogin = false)
    @ApiOperation(value = "Lark authorized login", hidden = true)
    public RedirectView feishuAuthCallback() {
        iFeishuService.switchDefaultContext();
        String redirectUri;
        if (iFeishuService.isDefaultIsv()) {
            redirectUri = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() + "/social/feishu/entry/callback";
        }
        else {
            redirectUri = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() + "/social/feishu/login/callback";
        }
        return new RedirectView(iFeishuService.buildAuthUrl(redirectUri, String.valueOf(DateUtil.date().getTime())));
    }
}
