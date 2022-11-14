package com.vikadata.api.shared.component.notification.observer;

import java.util.Map;
import java.util.Map.Entry;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.api.WxConsts.KefuMsgType;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.shared.util.VikaStrings;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.notification.SocialTemplate;

/**
 * <p>
 * base wecom notify observer
 * </p>
 * @author zoe zheng
 */
@Slf4j
public abstract class AbstractWecomNotifyObserver extends SocialNotifyObserver<SocialTemplate, SocialNotifyContext> {
    public static String WECOM_PLATFORM = "wecom";

    @Override
    public SocialTemplate getTemplate(String templateId) {
        Map<String, SocialTemplate> socialTemplates =
                SystemConfigManager.getConfig().getNotifications().getSocialTemplates();
        for (Entry<String, SocialTemplate> template : socialTemplates.entrySet()) {
            if (templateId.equals(template.getValue().getNotificationTemplateId()) && WECOM_PLATFORM.equals(template.getValue().getPlatform())) {
                return template.getValue();
            }
        }
        return null;
    }


    @Override
    public WxCpMessage renderTemplate(SocialNotifyContext context, NotificationCreateRo ro) {
        if (!isNotify(context)) {
            return null;
        }
        SocialTemplate template = getTemplate(ro.getTemplateId());
        if (template == null) {
            return null;
        }
        Integer agentId = Integer.parseInt(StrUtil.blankToDefault(context.getAgentId(), context.getAppId()));
        Map<String, Object> renderMap = bindingMap(ro);
        String description = StrUtil.format(VikaStrings.t(template.getTemplateString()), renderMap);
        String title = VikaStrings.t(template.getTitle());
        String callbackUrl = context.getEntryUrl()
                .concat("&reference={https_enp_domain}");
        if (StrUtil.isNotBlank(template.getUrl())) {
            callbackUrl =
                    callbackUrl.concat(URLUtil.encodeAll(CharSequenceUtil.prependIfMissingIgnoreCase(StrUtil.format(template.getUrl(), renderMap), "/")));
        }
        if (KefuMsgType.TEXTCARD.equals(template.getMessageType())) {
            return WxCpMessage.TEXTCARD().agentId(agentId).title(title).description(description)
                    .url(callbackUrl).build();
        }
        if (KefuMsgType.NEWS.equals(template.getMessageType())) {
            return WxCpMessage.TEXTCARD().agentId(agentId).title(title).description(description)
                    .url(callbackUrl)
                    .build();
        }
        return null;
    }
}
