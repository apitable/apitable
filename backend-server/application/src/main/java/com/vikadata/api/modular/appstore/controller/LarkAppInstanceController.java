package com.vikadata.api.modular.appstore.controller;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.TypeReference;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.FeishuAppProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfig;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.appstore.service.ILarkAppInstanceConfigService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.social.constants.LarkConstants;
import com.vikadata.api.modular.social.model.FeishuAppConfigRo;
import com.vikadata.api.modular.social.model.FeishuAppEventConfigRo;
import com.vikadata.api.modular.social.service.IFeishuInternalEventService;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.boot.autoconfigure.social.ServletUtil;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.AppInstanceEntity;
import com.vikadata.social.feishu.FeishuConfigStorageHolder;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;
import com.vikadata.social.feishu.model.FeishuAccessToken;
import com.vikadata.social.feishu.model.FeishuPassportAccessToken;
import com.vikadata.social.feishu.model.FeishuPassportUserInfo;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import static com.vikadata.api.modular.social.constants.LarkConstants.CONFIG_ERROR_URL;
import static com.vikadata.social.feishu.FeishuServiceProvider.EVENT_CALLBACK_EVENT;
import static com.vikadata.social.feishu.FeishuServiceProvider.URL_VERIFICATION_EVENT;

/**
 * LarkSelf built application configuration interface
 */
@RestController
@ApiResource(name = "Lark self built application configuration interface", path = "/")
@Api(tags = "Application management_Lark self built application configuration interface")
@Slf4j
public class LarkAppInstanceController {

    @Resource
    private ConstProperties constProperties;

    @Resource
    private FeishuAppProperties feishuAppProperties;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private ILarkAppInstanceConfigService iLarkAppInstanceConfigService;

    @Resource
    private IFeishuInternalEventService iFeishuInternalEventService;

    @Resource
    private IFeishuService iFeishuService;

    @Resource
    private IUserService iUserService;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    private static final String REDIRECT_STATE = "adminScan";

    private String getErrorPath() {
        return StrUtil.format(constProperties.getServerDomain() + feishuAppProperties.getErrorUri(), "auth_fail");
    }

    @PostResource(path = "/lark/event/{appInstanceId}", requiredLogin = false)
    @ApiOperation(value = "Lark Self built Application Event Callback", notes = "Receive self built callback of Lark application identity", hidden = true)
    public Object larkEvent(@PathVariable("appInstanceId") String appInstanceId, HttpServletRequest request) {
        FeishuConfigStorage configStorage = iAppInstanceService.buildConfigStorageByInstanceId(appInstanceId);
        // Switch application context
        iFeishuService.switchContextIfAbsent(configStorage);
        String requestBody = ServletUtil.getRequestBody(request);
        // Decrypt
        Map<String, Object> jsonData = iFeishuService.decryptData(requestBody);
        // Get event type
        if (jsonData.containsKey("schema")) {
            // 2.0Version event push, verify TOKEN
            Map<String, Object> header = MapUtil.get(jsonData, "header", new TypeReference<Map<String, Object>>() {});
            iFeishuService.checkVerificationToken(header);
            String contactType = (String) header.get("event_type");
            BaseV3ContactEvent event = iFeishuService.getV3EventParser().parseEvent(contactType, jsonData);
            event.setAppInstanceId(appInstanceId);
            iFeishuService.getEventListenerManager().fireV3ContactEventCallback(event);
        }
        else {
            // Version 1.0 event, verify TOKEN
            iFeishuService.checkVerificationToken(jsonData);
            String eventType = MapUtil.getStr(jsonData, "type");
            if (URL_VERIFICATION_EVENT.equals(eventType)) {
                // Verify the callback address and set the callback successfully
                iFeishuInternalEventService.urlCheck(appInstanceId);
                // Return content as required
                return JSONUtil.createObj().set("challenge", jsonData.get("challenge")).toString();
            }
            else if (EVENT_CALLBACK_EVENT.equals(eventType)) {
                // Event Push
                log.info("Lark event push: {}", eventType);
                Map<String, Object> eventData = MapUtil.get(jsonData, "event", new TypeReference<Map<String, Object>>() {});
                if (log.isDebugEnabled()) {
                    log.debug("Event content:{}", JSONUtil.toJsonPrettyStr(eventData));
                }
                String eventSubType = eventData.get("type").toString();
                BaseEvent event = iFeishuService.getEventParser().parseEvent(eventSubType, eventData);
                if (event == null) {
                    log.error("Event{}, Content:{}, does not exist and cannot be processed", eventSubType, eventData);
                    return "SUCCESS";
                }
                event.setAppInstanceId(appInstanceId);
                BaseEvent.Meta meta = new BaseEvent.Meta();
                meta.setUuid(MapUtil.getStr(jsonData, "uuid"));
                meta.setTs(MapUtil.getStr(jsonData, "ts"));
                event.setMeta(meta);
                iFeishuService.getEventListenerManager().fireEventCallback(event);
            }
            else {
                log.error("Illegal event type of Lark self built application: {}", eventType);
            }
        }
        return "SUCCESS";
    }

    @GetResource(path = "/lark/idp/entry/{appInstanceId}", requiredLogin = false)
    @ApiOperation(value = "Lark Self built Application Identity Application Portal", notes = "Lark Idp identity login free entry route", hidden = true)
    public RedirectView larkIdpEntry(@PathVariable("appInstanceId") String appInstanceId,
            @RequestParam(name = "url", required = false) String url) {
        // Construct Lark authorization login
        String redirectUri = constProperties.getServerDomain() + LarkConstants.formatInternalLoginUrl(appInstanceId);
        if (StrUtil.isNotBlank(url)) {
            redirectUri = StrUtil.format(redirectUri + "?url={}", url);
        }
        try {
            LarkInstanceConfig instanceConfig = iLarkAppInstanceConfigService.getLarkConfig(appInstanceId);
            LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
            iFeishuService.switchContextIfAbsent(profile.buildConfigStorage());
            String authUrl = iFeishuService.buildAuthUrl(redirectUri, String.valueOf(DateUtil.date().getTime()));
            return new RedirectView(authUrl);
        }
        catch (Exception e) {
            log.error("Lark self built application message card reported an error when routing in, instance ID:{}, path: {}", appInstanceId, url, e);
            return new RedirectView(getErrorPath());
        }
        finally {
            FeishuConfigStorageHolder.remove();
        }
    }

    @GetResource(path = "/lark/idp/login/{appInstanceId}", requiredLogin = false)
    @ApiOperation(value = "Lark application authentication callback service", notes = "Receive Lark Idp identity provider callback temporary authorization code", hidden = true)
    public RedirectView larkIdpLogin(@PathVariable("appInstanceId") String appInstanceId,
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            @RequestParam(name = "url", required = false) String url) {
        log.info("Self built application callback parameters[code:{}, state:{}]", code, state);
        // Query Lark Configuration of an Application Instance
        AppInstanceEntity appInstanceEntity = iAppInstanceService.getByAppInstanceId(appInstanceId);
        if (appInstanceEntity == null) {
            // Instance does not exist, routing to error page
            return new RedirectView(getErrorPath());
        }
        if (!appInstanceEntity.getIsEnabled()) {
            // When disabled, route to the error page
            return new RedirectView(getErrorPath());
        }
        AppInstance appInstance = iAppInstanceService.buildInstance(appInstanceEntity);
        if (appInstance.getConfig().getType() != AppType.LARK) {
            // Not an instance of Lark type
            return new RedirectView(getErrorPath());
        }
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) appInstance.getConfig().getProfile();
        if (StrUtil.isBlank(profile.getAppKey())
                || StrUtil.isBlank(profile.getAppSecret())
                || StrUtil.isBlank(profile.getEventVerificationToken())
                || !profile.isEventCheck()) {
            // Redirect page with incomplete basic configuration
            return new RedirectView(constProperties.getServerDomain() + CONFIG_ERROR_URL);
        }
        // Switch application context
        iFeishuService.switchContextIfAbsent(profile.buildConfigStorage());
        // All configurations completed
        if (!profile.isContactSyncDone()) {
            // Address book not synchronized
            if (REDIRECT_STATE.equals(state)) {
                FeishuPassportUserInfo userInfo;
                try {
                    // It can only be used within the scope of application available authorization
                    FeishuPassportAccessToken accessToken = iFeishuService.getPassportAccessToken(code, profile.getRedirectUrl());
                    userInfo = iFeishuService.getPassportUserInfo(accessToken.getAccessToken());
                }
                catch (Exception exception) {
                    log.error("Lark application instance tenant entry authorization failed", exception);
                    return new RedirectView(getErrorPath());
                }
                // The administrator scans the code to create a new asynchronous task and execute the synchronous address book
                iFeishuInternalEventService.syncContactFirst(userInfo, appInstance);
            }
            // The synchronization is not completed or failed. Redirect to the waiting page
            return new RedirectView(constProperties.getServerDomain() + LarkConstants.formatContactSyncingUrl(appInstanceId));
        }
        else {
            // Synchronized address book, pure login operation
            FeishuAccessToken accessToken;
            try {
                // It can only be used within the scope of application available authorization
                accessToken = iFeishuService.getUserAccessToken(code);
            }
            catch (Exception exception) {
                log.error("Lark application instance tenant entry authorization failed", exception);
                return new RedirectView(getErrorPath());
            }
            // Self built application, query whether the user exists according to the email or mobile phone, if not, create a new one
            Long userId = iSocialUserBindService.getUserIdByUnionId(accessToken.getUnionId());
            if (userId == null) {
                // None exists, create user
                userId = iUserService.createUser(new SocialUser(accessToken.getName(), accessToken.getAvatarUrl(),
                        StrUtil.subPre(accessToken.getMobile(), 3), StrUtil.subSuf(accessToken.getMobile(), 3), accessToken.getEmail(),
                        profile.getAppKey(), accessToken.getTenantKey(), accessToken.getOpenId(), accessToken.getUnionId(), SocialPlatformType.FEISHU));
                ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
                // Shence burial site - registration
                Long finalUserId = userId;
                TaskManager.me().execute(() -> sensorsService.track(finalUserId, TrackEventType.REGISTER, "Lark self built application", origin));
            }
            iUserService.activeTenantSpace(userId, appInstance.getSpaceId(), accessToken.getOpenId());
            SessionContext.setUserId(userId);
            if (StrUtil.isNotBlank(url)) {
                // Redirect to mention notification address
                return new RedirectView(url);
            }
            else {
                // Redirect the specified page
                return new RedirectView(constProperties.getServerDomain() + LarkConstants.formatSpaceWorkbenchUrl(appInstance.getSpaceId()));
            }
        }
    }

    @PostResource(path = "/lark/appInstance/{appInstanceId}/updateBaseConfig", method = RequestMethod.PUT, requiredPermission = false)
    @ApiOperation(value = "Update basic configuration", notes = "Update the basic configuration of the application instance")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "Application instance ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-1jsjakd1")
    })
    public ResponseData<AppInstance> initConfig(@PathVariable("appInstanceId") String appInstanceId,
            @RequestBody @Valid FeishuAppConfigRo data) {
        String appKey = data.getAppKey();
        String appSecret = data.getAppSecret();
        return ResponseData.success(iLarkAppInstanceConfigService.updateLarkBaseConfig(appInstanceId, appKey, appSecret));
    }

    @PostResource(path = "/lark/appInstance/{appInstanceId}/updateEventConfig", method = RequestMethod.PUT, requiredPermission = false)
    @ApiOperation(value = "Update Event Configuration", notes = "Change the event configuration of an application instance")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "Application instance ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-1jsjakd1")
    })
    public ResponseData<AppInstance> eventConfig(@PathVariable("appInstanceId") String appInstanceId,
            @RequestBody @Valid FeishuAppEventConfigRo data) {
        return ResponseData.success(iLarkAppInstanceConfigService.updateLarkEventConfig(appInstanceId, data.getEventEncryptKey(), data.getEventVerificationToken()));
    }
}
