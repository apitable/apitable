package com.vikadata.api.client.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.text.StrBuilder;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.service.IConfigService;
import com.vikadata.api.client.model.ClientInfoVO;
import com.vikadata.api.client.service.IClientReleaseVersionService;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.config.FilterConfig;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.workspace.enums.IdRulePrefixEnum;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.shared.util.ClientUriUtil;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.user.vo.UserInfoVo;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.api.shared.sysconfig.i18n.I18nTypes;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.core.constants.RedisConstants.KONG_GATEWAY_GRAY_SPACE;

/**
 * <p>
 * Client Version Controller
 * </p>
 */
@RestController
@Api(tags = "Client interface")
@ApiResource(path = "/client")
@Slf4j
public class ClientController {

    @Resource
    private IUserService iUserService;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private IClientReleaseVersionService clientReleaseVersionService;

    @Resource
    private IConfigService iConfigService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @GetResource(name = "Get application version information", path = "/info", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "Get application version information", notes = "Get the application client version rendering information")
    @ApiImplicitParam(name = "pipeline", value = "Construction serial number", dataTypeClass = String.class, paramType = "query", example = "4818")
    public ClientInfoVO getTemplateInfo(@RequestHeader HttpHeaders headers, HttpServletRequest request,
            @RequestParam(name = "spaceId", required = false) String spaceId) {
        // If the Request Param is not empty, it will actively switch to the space
        this.userSwitchSpace(SessionContext.getUserIdWithoutException(), spaceId);
        ClientInfoVO info = new ClientInfoVO();
        UserInfoVo userInfoVo = this.getUserInfoFromSession();
        if (null != userInfoVo) {
            try {
                info.setUserInfo(objectMapper.writeValueAsString(userInfoVo));
            }
            catch (JsonProcessingException e) {
                log.error("Serialization of user information of application client failed", e);
                info.setUserInfo(StrUtil.NULL);
            }
            // Obtain the grayscale environment of the current space.
            // If you do not actively propose the space station ID to be obtained, use the space ID in User Me (the last active one)
            String spaceGrayEnv = this.getSpaceGrayEnv(StrUtil.blankToDefault(spaceId, userInfoVo.getSpaceId()));
            info.setSpaceGrayEnv(spaceGrayEnv);
        }
        else {
            info.setUserInfo(StrUtil.NULL);
        }
        info.setLocale(LocaleContextHolder.getLocale().toLanguageTag());
        info.setMetaContent(getMetaContent(headers));
        info.setWizards(StrUtil.toString(iConfigService.getWizardConfig(I18nTypes.ZH_CN.getName())));
        info.setRedirect(this.redirectByAccessRoot(request, userInfoVo));
        return info;
    }

    private UserInfoVo getUserInfoFromSession() {
        if (!HttpContextUtil.hasSession()) {
            return null;
        }
        UserInfoVo userInfoVo;
        try {
            userInfoVo = iUserService.getCurrentUserInfo(SessionContext.getUserId(), null, false);
        }
        catch (Exception e) {
            log.warn("Failed to get UserInfo from Session.", e);
            return null;
        }
        return userInfoVo;
    }

    private String redirectByAccessRoot(HttpServletRequest request, UserInfoVo userInfo) {
        // User access path
        String originalUrl = request.getHeader(FilterConfig.X_ORIGINAL_URI);

        if (null != userInfo && StrUtil.equalsAnyIgnoreCase(originalUrl, "/", "/workbench", "/workbench/")) {
            String activeNodeId = userInfo.getActiveNodeId();
            String activeViewId = userInfo.getActiveViewId();
            // Judge whether there is an active node
            if (StrUtil.isNotBlank(activeNodeId)) {
                StrBuilder redirectUrl = StrBuilder.create("/workbench/").append(activeNodeId);
                // Determine whether there is an active view
                if (StrUtil.isNotBlank(activeViewId)) {
                    redirectUrl.append("/").append(activeViewId);
                }
                return redirectUrl.toString();
            }
        }
        return null;
    }

    private String getSpaceGrayEnv(String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            return null;
        }
        return redisTemplate.execute((RedisCallback<String>) connection -> {
            byte[] bytes = connection.hGet(StrUtil.utf8Bytes(KONG_GATEWAY_GRAY_SPACE), StrUtil.utf8Bytes(spaceId));
            return StrUtil.str(bytes, CharsetUtil.CHARSET_UTF_8);
        });
    }

    private String getMetaContent(HttpHeaders headers) {
        // Nginx adds header to filter data after blank
        String originalUrl = headers.getFirst(FilterConfig.X_ORIGINAL_URI);
        String uri = ClientUriUtil.parseOriginUrlPath(originalUrl);
        return clientReleaseVersionService.getMetaContent(uri);
    }

    /**
     * User switching space station
     *
     * @param userId   User ID
     * @param spaceId  Switch the ID of the space station
     */
    private void userSwitchSpace(Long userId, String spaceId) {
        try {
            // User id is not equal to null, space id is not equal to null and not equal to 'undefined', space id must start with 'spc'
            boolean isPass = null != userId && StrUtil.isNotBlank(spaceId) &&
                    !StrUtil.isNullOrUndefined(spaceId) &&
                    StrUtil.startWithIgnoreEquals(spaceId, IdRulePrefixEnum.SPC.getIdRulePrefixEnum());
            if (isPass) {
                iSpaceService.switchSpace(userId, spaceId);
            }
        }
        catch (Exception e) {
            log.error("When rendering the template, the user switches the space station abnormally", e);
            // Do not cause the template to fail to render normally due to the abnormal switching of the space station
        }
    }
}
