package com.vikadata.api.modular.base.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.auth0.Tokens;
import com.auth0.exception.APIException;
import com.auth0.exception.Auth0Exception;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.security.Auth0UserProfile;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.boot.autoconfigure.auth0.Auth0Template;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

/**
 * @author Shawn Deng
 */
@RestController
@ApiResource(path = "/auth0")
@Api(tags = "Auth0 API")
@Slf4j
public class Auth0Controller {

    @Resource
    private IUserService iUserService;

    @Resource
    private ConstProperties constProperties;

    @Autowired(required = false)
    private Auth0Template auth0Template;

    private static final String UnAuthorizedError = "unauthorized";

    @GetResource(path = "/login", requiredLogin = false)
    public RedirectView login() {
        if (auth0Template == null) {
            return new RedirectView("/error/404", true);
        }
        String authorizeUrl = auth0Template.buildAuthorizeUrl();
        if (log.isDebugEnabled()) {
            log.debug("authorize redirect url is {}", authorizeUrl);
        }
        return new RedirectView(authorizeUrl);
    }

    @GetResource(path = "/callback", requiredLogin = false)
    public RedirectView callback(
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "error", required = false) String error,
            @RequestParam(name = "error_description", required = false) String errorDescription
    ) throws IOException {
        if (auth0Template == null) {
            return new RedirectView("/error/404", true);
        }
        if (StrUtil.isNotBlank(error) && StrUtil.isNotBlank(errorDescription)) {
            // error callback
            if (UnAuthorizedError.equals(error)) {
                // check if the verified email is expired,then send it again
                return new RedirectView("/email_verify", true);
            }
        }
        try {
            Tokens tokens = auth0Template.getVerifiedTokens(code, auth0Template.getRedirectUri());
            DecodedJWT idToken = JWT.decode(tokens.getIdToken());
            Auth0UserProfile profile = claimsAsJson(idToken);
            if (log.isDebugEnabled()) {
                log.debug("user info: {}", JSONUtil.toJsonPrettyStr(profile));
            }
            // save user if user is not exist
            Long userId = iUserService.createUserByAuth0IfNotExist(profile);
            // save session
            SessionContext.setUserId(userId);
            return new RedirectView(constProperties.getServerDomain() + constProperties.getWorkbenchUrl());
        }
        catch (APIException e) {
            log.error("Error Request Api", e);
            return new RedirectView("");
        }
        catch (Auth0Exception e) {
            log.error("Error trying to verify identity", e);
            return new RedirectView("/error", true);
        }
    }

    private Auth0UserProfile claimsAsJson(DecodedJWT decodedJWT) {
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule())
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        byte[] decodedBytes = Base64.getUrlDecoder().decode(decodedJWT.getPayload());
        String decoded = new String(decodedBytes, StandardCharsets.UTF_8);
        if (log.isDebugEnabled()) {
            log.debug("user raw json: {}", decoded);
        }
        try {
            return objectMapper.readValue(decoded, Auth0UserProfile.class);
        }
        catch (JsonProcessingException jpe) {
            log.error("Error parsing claims to JSON", jpe);
            throw new RuntimeException("error parse profile");
        }
    }

}
