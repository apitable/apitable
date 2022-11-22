package com.vikadata.api.shared.component.notification.observer;

import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;

import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.vikadata.api.shared.util.VikaStrings;
import com.vikadata.social.dingtalk.message.ActionCardMessage;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.message.element.SingleActionCard;
import com.vikadata.api.shared.sysconfig.SystemConfigManager;
import com.vikadata.api.shared.sysconfig.notification.SocialTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static com.vikadata.api.enterprise.social.event.dingtalk.DingTalkCardFactory.DINGTALK_OA_OPEN;

@Component
@ConditionalOnProperty(value = "vikadata-starter.social.dingtalk.enabled", havingValue = "true")
public class DingTalkNotifyObserver extends SocialNotifyObserver<SocialTemplate, SocialNotifyContext> {
    public static String DINGTALK_PLATFORM = "dingtalk";

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IDingTalkService iDingTalkService;

    @Override
    public boolean isNotify(SocialNotifyContext context) {
        return SocialAppType.INTERNAL.equals(context.getAppType()) && SocialPlatformType.DINGTALK.equals(context.getPlatform());
    }

    @Override
    public SocialTemplate getTemplate(String templateId) {
        Map<String, SocialTemplate> socialTemplates =
                SystemConfigManager.getConfig().getNotifications().getSocialTemplates();
        for (Entry<String, SocialTemplate> template : socialTemplates.entrySet()) {
            if (templateId.equals(template.getValue().getNotificationTemplateId()) && DINGTALK_PLATFORM.equals(template.getValue().getPlatform())) {
                return template.getValue();
            }
        }
        return null;
    }

    @Override
    public Message renderTemplate(SocialNotifyContext context, NotificationCreateRo ro) {
        SocialTemplate template = getTemplate(ro.getTemplateId());
        if (template == null) {
            return null;
        }
        Map<String, Object> renderMap = bindingMap(ro);
        String description = StrUtil.format(VikaStrings.t(template.getTemplateString()), renderMap);
        String title = VikaStrings.t(template.getTitle());
        // entry url：https://{domain}/user/dingtalk_callback?corpId={}&agentId={}
        String callbackUrl = StrUtil.format(context.getEntryUrl(), constProperties.getServerDomain(),
                        context.getTenantId(), context.getAgentId())
                .concat("&reference=").concat(constProperties.getServerDomain())
                .concat(CharSequenceUtil.prependIfMissingIgnoreCase(StrUtil.format(StrUtil.blankToDefault(template.getUrl(), ""), renderMap), "/"));
        // build url
        String url = StrUtil.format(DINGTALK_OA_OPEN, context.getTenantId(), context.getAgentId(), URLUtil.encodeAll(callbackUrl));
        if (ActionCardMessage.ACTION_CARD_MSG_TYPE.equals(template.getMessageType())) {
            // Single link card message
            if (StrUtil.isBlank(template.getPicUrl())) {
                SingleActionCard singleActionCard = new SingleActionCard();
                singleActionCard.setTitle(title);
                singleActionCard.setSingleUrl(url);
                singleActionCard.setSingleTitle(VikaStrings.t(template.getUrlTitle()));
                singleActionCard.setMarkdown(description);
                return new ActionCardMessage(singleActionCard);
            }
            // todo Multilink Type
            return null;
        }
        // todo Other types
        return null;

    }

    @Override
    public void notify(SocialNotifyContext context, NotificationCreateRo ro) {
        Message message = renderTemplate(context, ro);
        if (message == null) {
            return;
        }
        iDingTalkService.asyncSendCardMessageToUserPrivate(context.getAgentId(), renderTemplate(context, ro),
                toUser(ro));
    }
}
