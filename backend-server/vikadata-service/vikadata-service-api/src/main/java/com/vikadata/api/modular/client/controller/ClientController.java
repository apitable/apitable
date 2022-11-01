package com.vikadata.api.modular.client.controller;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.text.StrBuilder;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.ClientEntryTemplateConfig;
import com.vikadata.api.config.FilterConfig;
import com.vikadata.api.config.properties.ClientProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.model.ro.client.ClientBuildRo;
import com.vikadata.api.model.ro.client.ClientPublishRo;
import com.vikadata.api.model.vo.client.EntryVo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.modular.base.service.IConfigService;
import com.vikadata.api.modular.client.model.ClientInfoVO;
import com.vikadata.api.modular.client.service.IClientReleaseVersionService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.ClientUriUtil;
import com.vikadata.api.util.VikaVersion.Env;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.system.config.i18n.I18nTypes;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.define.constants.RedisConstants.DATASHEET_CLIENT_VERSION_KEY;
import static com.vikadata.define.constants.RedisConstants.KONG_GATEWAY_GRAY_SPACE;
import static com.vikadata.define.constants.RedisConstants.REDIS_ENV;

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
    private ClientProperties clientProperties;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private IClientReleaseVersionService clientReleaseVersionService;

    @Resource
    private ClientEntryTemplateConfig clientEntryTemplateConfig;

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
            @RequestParam(name = "pipeline", required = false) String pipelineId, @RequestParam(name = "spaceId", required = false) String spaceId) {
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

    /**
     * Client application version portal
     * The application version has different processing in different environments. The environment variable setting location is:ClientProperties.Datasheet.Env
     * SaaS: test(test)、integration(alpha)、staging(beta)、production(release)
     * @param pipelineId Optional parameter, ci serial number. When the environment variable is test or integration,
     *                   The application version of the specified pipeline ID can be obtained. The version number is feature.${pipelineId} generally
     * @return Web content of application version
     */
    @Deprecated
    @GetResource(name = "Application version entry", path = "/entry", requiredPermission = false, requiredLogin = false, produces = { MediaType.TEXT_HTML_VALUE })
    @ApiOperation(value = "Client application version portal", notes = "Client application version portal")
    @ApiImplicitParam(name = "pipeline", value = "Construction serial number", dataTypeClass = String.class, paramType = "query", example = "4818")
    public String entry(@RequestHeader HttpHeaders headers, @RequestParam(name = "pipeline", required = false) String pipelineId,
            HttpServletRequest request, HttpServletResponse response) {
        // The formal environment does not allow the pipeline entry to be loaded
        String envName = StrUtil.blankToDefault(clientProperties.getDatasheet().getEnv(), "other");
        String versionName = clientReleaseVersionService.getVersionOrDefault(Env.of(envName), pipelineId);
        if (StrUtil.isBlank(versionName)) {
            log.error("The client version does not exist, please check the publishing client");
            return "Error Rendering....";
        }

        EntryVo entryVo = EntryVo.builder().env(envName).version(versionName).build();
        UserInfoVo userInfoVo = getUserInfoFromSession();
        if (null != userInfoVo) {
            try {
                entryVo.setUserInfoVo(objectMapper.writeValueAsString(userInfoVo));
            }
            catch (JsonProcessingException e) {
                log.error("Serialization of user information of application client failed", e);
                entryVo.setUserInfoVo(StrUtil.NULL);
            }
            // Try to search the grayscale information of the space station
            this.tryFillSpaceEnvByGray(userInfoVo.getSpaceId(), entryVo);
        }
        else {
            // The front end does not accept null values, only "null"
            entryVo.setUserInfoVo(StrUtil.NULL);
        }

        // Write the user's global language in the entry page, and the language variable is automatically obtained in the cookies
        entryVo.setLocale(LocaleContextHolder.getLocale().toLanguageTag());
        String templateContent = versionName.contains("feature") ?
                clientReleaseVersionService.getHtmlContentByVersion(entryVo.getVersion())
                : clientReleaseVersionService.getHtmlContentCacheIfAbsent(entryVo.getVersion());
        if (StrUtil.isNotBlank(templateContent)) {
            // Loading guidance and announcement configuration
            entryVo.setWizards(StrUtil.toString(iConfigService.getWizardConfig(I18nTypes.ZH_CN.getName())));
            // Load the meta tag content in the header
            entryVo.setMetaContent(getMetaContent(headers));
            // If you directly access or workbench
            this.redirectByAccessRoot(request, response, userInfoVo);
            // Render
            return clientEntryTemplateConfig.render(templateContent, BeanUtil.beanToMap(entryVo));
        }
        return "Error Rendering....";
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

    /**
     * If you visit / or /workbench directly, Check whether redirection is required according to the user's active nodes
     *
     * Note that this is a backup. After the new cluster is stable, this method can be deleted
     *
     * @param userInfo User active node information
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     */
    @Deprecated
    @SneakyThrows
    private void redirectByAccessRoot(HttpServletRequest request, HttpServletResponse response, UserInfoVo userInfo) {
        // Domain name accessed by the user
        String scheme = HttpContextUtil.getScheme(request);
        String remoteHost = HttpContextUtil.getRemoteHost(request);
        // User access path
        String originalUrl = request.getHeader(FilterConfig.X_ORIGINAL_URI);

        if (null != userInfo && StrUtil.isNotBlank(remoteHost) && StrUtil.equalsAnyIgnoreCase(originalUrl, "/", "/workbench")) {
            String activeNodeId = userInfo.getActiveNodeId();
            String activeViewId = userInfo.getActiveViewId();
            // Judge whether there is an active node
            if (StrUtil.isNotBlank(activeNodeId)) {
                StrBuilder redirectUrl = StrBuilder.create("https".equals(scheme) ? "https" : "http")
                        .append("://")
                        .append(remoteHost)
                        .append("/workbench/").append(activeNodeId);
                // Determine whether there is an active view
                if (StrUtil.isNotBlank(activeViewId)) {
                    redirectUrl.append("/").append(activeViewId);
                }
                // Redirect
                response.sendRedirect(redirectUrl.toString());
            }
        }
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

    /**
     * Try to fill in grayscale information according to space station ID
     *
     * @param spaceId Space ID
     * @param entry   Version VO
     */
    private void tryFillSpaceEnvByGray(String spaceId, EntryVo entry) {
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        // Try to query whether the space station is in a grayscale environment
        String spaceGrayEnv = this.getSpaceGrayEnv(spaceId);
        if (StrUtil.isBlank(spaceGrayEnv)) {
            return;
        }
        /*
         * 1.Note that the magic variable mode of Redis serialization is broken and replaced before serialization
         * 2.Why is it in lower case?
         *  2.1 Because spaceGrayEnv is equal to the name of nginx config upstream
         *      For example: normal: upstream=backend; Backend of grayscale=backendTeamX
         *      In this way, the identifications can be distinguished in nginx. Space Gray Env needs to be cached in this way
         *  2.2 Team X is equal to spring.profiles.active
         *      For example: teamx spring.profiles.active = teamx
         *      All are converted to lowercase in order to query
         */
        spaceGrayEnv = StrUtil.toString(spaceGrayEnv).toLowerCase();
        Dict dict = Dict.create().set(REDIS_ENV, spaceGrayEnv);
        String cacheClientVersionKey = StrUtil.format(DATASHEET_CLIENT_VERSION_KEY, dict);

        // If the space station has a grayscale environment, get the latest version number in the cache
        String spaceGrayVersion = redisTemplate.opsForValue().get(cacheClientVersionKey);
        if (StrUtil.isBlank(spaceGrayVersion)) {
            return;
        }

        // Replace the version found before, and change it to the grayscale version number
        entry.setVersion(spaceGrayVersion);
        String grayEnv;
        Map<String, String> irregularEnv = clientProperties.getDatasheet().getIrregularEnv();
        if (MapUtil.isNotEmpty(irregularEnv) && StrUtil.isNotBlank(grayEnv = irregularEnv.get(spaceGrayEnv))) {
            entry.setEnv(grayEnv);
        }
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

    /**
     * Build (create) client application version
     *
     * @param clientBuildRo Request parameters
     * @return Responder
     */
    @Deprecated
    @PostResource(name = "Create client application version", path = "/build", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "Create client application version", notes = "Create client application version")
    public ResponseData<Void> build(@RequestBody @Valid ClientBuildRo clientBuildRo) {
        clientReleaseVersionService.createClientVersion(clientBuildRo);
        return ResponseData.success();
    }

    @Deprecated
    @PostResource(name = "Client releases application version", path = "/publish", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "Client releases application version", notes = "Client releases application version")
    public ResponseData<Void> publish(@RequestBody ClientPublishRo publishRo) {
        try {
            String versionName = publishRo.getVersion();
            redisTemplate.opsForValue().set(DATASHEET_CLIENT_VERSION_KEY, versionName, 30, TimeUnit.DAYS);
            // Refresh the content of the specified application version stored on the machine
            clientReleaseVersionService.refreshHtmlContent(versionName);
            return ResponseData.success();
        }
        catch (Exception e) {
            log.error("Failed to publish client version", e);
            throw new BusinessException("fail to publish client version");
        }
    }

}
