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
 * 飞书自建应用配置接口
 * @author Shawn Deng
 * @date 2021-12-31 17:51:16
 */
@RestController
@ApiResource(name = "飞书自建应用配置接口", path = "/")
@Api(tags = "应用管理_飞书自建应用配置接口")
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
    @ApiOperation(value = "飞书自建应用事件回调", notes = "接收飞书应用身份自建回调", hidden = true)
    public Object larkEvent(@PathVariable("appInstanceId") String appInstanceId, HttpServletRequest request) {
        FeishuConfigStorage configStorage = iAppInstanceService.buildConfigStorageByInstanceId(appInstanceId);
        // 切换应用上下文
        iFeishuService.switchContextIfAbsent(configStorage);
        // 请求体
        String requestBody = ServletUtil.getRequestBody(request);
        // 解密
        Map<String, Object> jsonData = iFeishuService.decryptData(requestBody);
        // 获取事件类型
        if (jsonData.containsKey("schema")) {
            // 2.0版本事件推送，校验TOKEN
            Map<String, Object> header = MapUtil.get(jsonData, "header", new TypeReference<Map<String, Object>>() {});
            iFeishuService.checkVerificationToken(header);
            String contactType = (String) header.get("event_type");
            BaseV3ContactEvent event = iFeishuService.getV3EventParser().parseEvent(contactType, jsonData);
            event.setAppInstanceId(appInstanceId);
            iFeishuService.getEventListenerManager().fireV3ContactEventCallback(event);
        }
        else {
            // 1.0版本事件，校验TOKEN
            iFeishuService.checkVerificationToken(jsonData);
            String eventType = MapUtil.getStr(jsonData, "type");
            if (URL_VERIFICATION_EVENT.equals(eventType)) {
                // 验证回调地址,设置回调成功
                iFeishuInternalEventService.urlCheck(appInstanceId);
                // 按规定返回内容
                return JSONUtil.createObj().set("challenge", jsonData.get("challenge")).toString();
            }
            else if (EVENT_CALLBACK_EVENT.equals(eventType)) {
                // 事件推送
                log.info("飞书事件推送: {}", eventType);
                Map<String, Object> eventData = MapUtil.get(jsonData, "event", new TypeReference<Map<String, Object>>() {});
                if (log.isDebugEnabled()) {
                    log.debug("事件内容:{}", JSONUtil.toJsonPrettyStr(eventData));
                }
                String eventSubType = eventData.get("type").toString();
                BaseEvent event = iFeishuService.getEventParser().parseEvent(eventSubType, eventData);
                if (event == null) {
                    log.error("事件{}, 内容:{}, 不存在，无法处理", eventSubType, eventData);
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
                log.error("飞书自建应用的非法事件类型: {}", eventType);
            }
        }
        return "SUCCESS";
    }

    @GetResource(path = "/lark/idp/entry/{appInstanceId}", requiredLogin = false)
    @ApiOperation(value = "飞书自建应用身份应用入口", notes = "飞书Idp身份免登入口路由", hidden = true)
    public RedirectView larkIdpEntry(@PathVariable("appInstanceId") String appInstanceId,
            @RequestParam(name = "url", required = false) String url) {
        // 构造飞书授权登录
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
            log.error("飞书自建应用消息卡片路由进来报错, 实例ID:{}, 路径: {}", appInstanceId, url, e);
            return new RedirectView(getErrorPath());
        }
        finally {
            FeishuConfigStorageHolder.remove();
        }
    }

    @GetResource(path = "/lark/idp/login/{appInstanceId}", requiredLogin = false)
    @ApiOperation(value = "飞书应用身份验证回调服务", notes = "接收飞书Idp身份提供商回调临时授权码", hidden = true)
    public RedirectView larkIdpLogin(@PathVariable("appInstanceId") String appInstanceId,
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            @RequestParam(name = "url", required = false) String url) {
        log.info("自建应用回调参数[code:{}, state:{}]", code, state);
        // 查询应用实例的飞书配置
        AppInstanceEntity appInstanceEntity = iAppInstanceService.getByAppInstanceId(appInstanceId);
        if (appInstanceEntity == null) {
            // 实例不存在，路由到错误页面
            return new RedirectView(getErrorPath());
        }
        if (!appInstanceEntity.getIsEnabled()) {
            // 禁用状态下，路由到错误页面
            return new RedirectView(getErrorPath());
        }
        AppInstance appInstance = iAppInstanceService.buildInstance(appInstanceEntity);
        if (appInstance.getConfig().getType() != AppType.LARK) {
            // 不是飞书类型的实例
            return new RedirectView(getErrorPath());
        }
        LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) appInstance.getConfig().getProfile();
        if (StrUtil.isBlank(profile.getAppKey())
                || StrUtil.isBlank(profile.getAppSecret())
                || StrUtil.isBlank(profile.getEventVerificationToken())
                || !profile.isEventCheck()) {
            // 未完全基础配置的重定向页面
            return new RedirectView(constProperties.getServerDomain() + CONFIG_ERROR_URL);
        }
        // 切换应用上下文
        iFeishuService.switchContextIfAbsent(profile.buildConfigStorage());
        // 已完成所有配置
        if (!profile.isContactSyncDone()) {
            // 未同步完通讯录
            if (REDIRECT_STATE.equals(state)) {
                FeishuPassportUserInfo userInfo;
                try {
                    // 必须在应用可用授权范围内才能使用
                    FeishuPassportAccessToken accessToken = iFeishuService.getPassportAccessToken(code, profile.getRedirectUrl());
                    userInfo = iFeishuService.getPassportUserInfo(accessToken.getAccessToken());
                }
                catch (Exception exception) {
                    log.error("飞书应用实例租户入口授权失败", exception);
                    return new RedirectView(getErrorPath());
                }
                // 管理员扫码操作，新建异步任务执行同步通讯录
                iFeishuInternalEventService.syncContactFirst(userInfo, appInstance);
            }
            // 未同步完或者同步失败，重定向到等待页面
            return new RedirectView(constProperties.getServerDomain() + LarkConstants.formatContactSyncingUrl(appInstanceId));
        }
        else {
            // 已同步完通讯录，纯登录操作
            FeishuAccessToken accessToken;
            try {
                // 必须在应用可用授权范围内才能使用
                accessToken = iFeishuService.getUserAccessToken(code);
            }
            catch (Exception exception) {
                log.error("飞书应用实例租户入口授权失败", exception);
                return new RedirectView(getErrorPath());
            }
            // 自建应用，根据邮箱或手机查询是否存在此用户，如果没有，则新建
            Long userId = iSocialUserBindService.getUserIdByUnionId(accessToken.getUnionId());
            if (userId == null) {
                // 都不存在，创建用户
                userId = iUserService.createUser(new SocialUser(accessToken.getName(), accessToken.getAvatarUrl(),
                        StrUtil.subPre(accessToken.getMobile(), 3), StrUtil.subSuf(accessToken.getMobile(), 3), accessToken.getEmail(),
                        profile.getAppKey(), accessToken.getTenantKey(), accessToken.getOpenId(), accessToken.getUnionId(), SocialPlatformType.FEISHU));
                ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
                // 神策埋点 - 注册
                Long finalUserId = userId;
                TaskManager.me().execute(() -> sensorsService.track(finalUserId, TrackEventType.REGISTER, "飞书自建应用", origin));
            }
            iUserService.activeTenantSpace(userId, appInstance.getSpaceId(), accessToken.getOpenId());
            SessionContext.setUserId(userId);
            if (StrUtil.isNotBlank(url)) {
                // 重定向到提及通知地址
                return new RedirectView(url);
            }
            else {
                // 重定向指定页面
                return new RedirectView(constProperties.getServerDomain() + LarkConstants.formatSpaceWorkbenchUrl(appInstance.getSpaceId()));
            }
        }
    }

    @PostResource(path = "/lark/appInstance/{appInstanceId}/updateBaseConfig", method = RequestMethod.PUT, requiredPermission = false)
    @ApiOperation(value = "更新基础配置", notes = "更新应用实例的基础配置")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "应用实例ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-1jsjakd1")
    })
    public ResponseData<AppInstance> initConfig(@PathVariable("appInstanceId") String appInstanceId,
            @RequestBody @Valid FeishuAppConfigRo data) {
        String appKey = data.getAppKey();
        String appSecret = data.getAppSecret();
        return ResponseData.success(iLarkAppInstanceConfigService.updateLarkBaseConfig(appInstanceId, appKey, appSecret));
    }

    @PostResource(path = "/lark/appInstance/{appInstanceId}/updateEventConfig", method = RequestMethod.PUT, requiredPermission = false)
    @ApiOperation(value = "更新事件配置", notes = "更改应用实例的事件配置")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appInstanceId", value = "应用实例ID", required = true, dataTypeClass = String.class, paramType = "path", example = "ai-1jsjakd1")
    })
    public ResponseData<AppInstance> eventConfig(@PathVariable("appInstanceId") String appInstanceId,
            @RequestBody @Valid FeishuAppEventConfigRo data) {
        return ResponseData.success(iLarkAppInstanceConfigService.updateLarkEventConfig(appInstanceId, data.getEventEncryptKey(), data.getEventVerificationToken()));
    }
}
