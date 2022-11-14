package com.vikadata.api.shared.component.notification.observer;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Map.Entry;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.shared.util.VikaStrings;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.social.core.URIUtil;
import com.vikadata.social.feishu.card.Card;
import com.vikadata.social.feishu.card.CardMessage;
import com.vikadata.social.feishu.card.Config;
import com.vikadata.social.feishu.card.Header;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.card.element.Button;
import com.vikadata.social.feishu.card.module.Action;
import com.vikadata.social.feishu.card.module.Div;
import com.vikadata.social.feishu.card.module.Module;
import com.vikadata.social.feishu.card.objects.Text;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.notification.SocialTemplate;

/**
 * <p>
 * base lark notify observer
 * </p>
 * @author zoe zheng
 */
@Slf4j
public abstract class AbstractLarkNotifyObserver extends SocialNotifyObserver<SocialTemplate, SocialNotifyContext> {
    public static final String LARK_PLATFORM = "lark";

    private static final String LARK_WEB_OPEN = "https://applink.feishu.cn/client/web_app/open?appId={}&path={}";

    @Override
    public SocialTemplate getTemplate(String templateId) {
        Map<String, SocialTemplate> socialTemplates =
                SystemConfigManager.getConfig().getNotifications().getSocialTemplates();
        for (Entry<String, SocialTemplate> template : socialTemplates.entrySet()) {
            if (templateId.equals(template.getValue().getNotificationTemplateId()) && LARK_PLATFORM.equals(template.getValue().getPlatform())) {
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
        Map<String, Object> bindingMap = bindingMap(ro);
        Header header = new Header(new Text(Text.Mode.LARK_MD,
                StrUtil.format(StrUtil.blankToDefault(VikaStrings.t(template.getTitle()), ""), bindingMap)));
        String contentMd = StrUtil.format(VikaStrings.t(template.getTemplateString()), bindingMap(ro));
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        Div div = new Div(new Text(Text.Mode.LARK_MD, contentMd));
        Action action = null;
        if (!context.getEntryUrl().contains("lark")) {
            String callbackUrl =
                    URIUtil.encodeURIComponent(constProperties.getServerDomain().concat(CharSequenceUtil.prependIfMissingIgnoreCase(StrUtil.format(StrUtil.blankToDefault(template.getUrl(), ""), bindingMap), "/")));
            String path = context.getEntryUrl().concat("&url=").concat(callbackUrl);
            Button entryBtn = new Button(new Text(Text.Mode.LARK_MD, VikaStrings.t(template.getUrlTitle())))
                    .setUrl(StrUtil.format(LARK_WEB_OPEN, context.getAppId(), path))
                    .setType(Button.StyleType.PRIMARY);
            action = new Action(Collections.singletonList(entryBtn));
        }
        Card card = new Card(new Config(false), header);
        Module[] modules = new Module[] { div };
        if (action != null) {
            modules = new Module[] { div, action };
        }
        card.setModules(Arrays.asList(modules));
        return new CardMessage(card.toObj());
    }
}
