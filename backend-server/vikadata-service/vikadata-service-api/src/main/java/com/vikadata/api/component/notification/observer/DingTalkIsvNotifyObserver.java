package com.vikadata.api.component.notification.observer;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.notification.SocialTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 通知观察者--钉钉第三方
 * </p>
 * @author zoe zheng
 * @date 2022/3/15 18:30
 */
@Slf4j
@Component
@ConditionalOnProperty(value = "vikadata-starter.social.dingtalk.enabled", havingValue = "true")
public class DingTalkIsvNotifyObserver extends SocialNotifyObserver<SocialTemplate, SocialNotifyContext> {

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Override
    public boolean isNotify(SocialNotifyContext context) {
        return SocialAppType.ISV.equals(context.getAppType()) && SocialPlatformType.DINGTALK.equals(context.getPlatform());
    }

    @Override
    public SocialTemplate getTemplate(String templateId) {
        Map<String, SocialTemplate> socialTemplates = SystemConfigManager.getConfig().getNotifications().getSocialTemplates();
        for (Entry<String, SocialTemplate> templateEntry : socialTemplates.entrySet()) {
            SocialTemplate template = templateEntry.getValue();
            if (StrUtil.isNotBlank(template.getAppId())) {
                IsvAppProperty isvApp = iDingTalkInternalIsvService.getIsvAppConfig(template.getAppId());
                if (isvApp != null && template.getAppId().equals(isvApp.getSuiteId()) && templateId.equals(template.getNotificationTemplateId())) {
                    return template;
                }
            }
        }
        log.warn("钉钉商店应用未配置通知模版ID:{}", templateId);
        return null;
    }

    @Override
    public HashMap<String, String> renderTemplate(SocialNotifyContext context, NotificationCreateRo ro) {
        SocialTemplate template = getTemplate(ro.getTemplateId());
        if (template == null) {
            return null;
        }
        Map<String, Object> renderMap = bindingMap(ro);
        HashMap<String, String> dataMap = new HashMap<>();
        renderMap.forEach((k, v) -> dataMap.put(k, v.toString()));
        dataMap.put("corpId", context.getTenantId());
        dataMap.put("suiteId", context.getAppId());
        dataMap.put("appId", context.getAgentId());
        // 去掉https开头,兼容之前的卡片 todo 迁移完成之后可去掉
        dataMap.put("domain", URLUtil.url(constProperties.getServerDomain()).getHost());
        // 构建跳转链接
        String reference = constProperties.getServerDomain().concat(CharSequenceUtil.prependIfMissingIgnoreCase(StrUtil.format(StrUtil.blankToDefault(template.getUrl(), ""), renderMap), "/"));
        String redirectUrl = StrUtil.format(context.getEntryUrl(), constProperties.getServerDomain(),
                context.getTenantId(), context.getAppId()).concat("&reference" + "=").concat(reference);
        dataMap.put("reference", URLUtil.encodeAll(reference));
        dataMap.put("redirectUrl", URLUtil.encodeAll(redirectUrl));
        return dataMap;
    }

    @Override
    public void notify(SocialNotifyContext context, NotificationCreateRo ro) {
        SocialTemplate template = getTemplate(ro.getTemplateId());
        if (template == null) {
            log.warn("钉钉ISV通知模版未配置:{}", ro.getTemplateId());
            return;
        }
        HashMap<String, String> renderMap = renderTemplate(context, ro);
        iDingTalkInternalIsvService.sendMessageToUserByTemplateId(context.getAppId(), context.getTenantId(),
                VikaStrings.t(template.getTemplateString()), renderMap, toUser(ro));

    }
}
