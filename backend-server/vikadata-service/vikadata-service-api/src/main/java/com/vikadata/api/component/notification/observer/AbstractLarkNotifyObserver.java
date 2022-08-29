package com.vikadata.api.component.notification.observer;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Map.Entry;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
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
 * 通知观察者--钉钉自建应用
 * </p>
 * @author zoe zheng
 * @date 2022/3/15 18:30
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
            log.warn("飞书应用消息模版没有配置:{}", ro.getTemplateId());
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
        // 创建卡片 todo 兼容其他类型的消息
        Card card = new Card(new Config(false), header);
        Module[] modules = new Module[] { div };
        if (action != null) {
            modules = new Module[] { div, action };
        }
        // 设置内容元素
        card.setModules(Arrays.asList(modules));
        return new CardMessage(card.toObj());
    }
}
