package com.vikadata.api.modular.social.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.auth.ConnectorTemplate;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "k11登录接口")
@ApiResource(path = "/k11")
@Slf4j
public class K11Controller {

    @Autowired
    private ConnectorTemplate connectorTemplate;

    @Resource
    private ConstProperties constProperties;

    @GetResource(path = "/oss/sync-login", requiredLogin = false)
    @ApiOperation(value = "k11采用token同步登录")
    public ResponseData<String> loginBySsoToken(@ApiParam(name = "token", required = true) String token, HttpServletResponse response) throws IOException {
        if (StrUtil.isEmptyIfStr(token)) {
            return ResponseData.success("SSO token不允许为空");
        }
        String defaultWorkUri = constProperties.getServerDomain() + "/workbench";
        HttpSession session = HttpContextUtil.getSession(false);
        if (session != null) {
            response.sendRedirect(defaultWorkUri);
            return ResponseData.success(null);
        }
        try {
            connectorTemplate.loginBySsoToken(token);
            response.sendRedirect(defaultWorkUri);
        }
        catch (Exception e) {
            return ResponseData.success(e.getMessage());
        }
        return ResponseData.success(null);
    }
}
