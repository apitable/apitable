package com.vikadata.api.shared.component.notification.observer;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.social.dingtalk.autoconfigure.DingTalkProperties.IsvAppProperty;
import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.shared.util.VikaStrings;
import com.vikadata.api.shared.sysconfig.SystemConfigManager;
import com.vikadata.api.shared.sysconfig.notification.SocialTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

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
        // Remove the beginning of https and be compatible with the previous card
        // todo It can be removed after migration
        dataMap.put("domain", URLUtil.url(constProperties.getServerDomain()).getHost());
        // Build Links
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
            return;
        }
        HashMap<String, String> renderMap = renderTemplate(context, ro);
        iDingTalkInternalIsvService.sendMessageToUserByTemplateId(context.getAppId(), context.getTenantId(),
                VikaStrings.t(template.getTemplateString()), renderMap, toUser(ro));

    }
}
