package com.vikadata.api.shared.component.notification.observer;

import java.util.List;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.service.IWeComService;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@ConditionalOnProperty(value = "vikadata-starter.social.wecom.enabled", havingValue = "true")
public class WecomNotifyObserver extends AbstractWecomNotifyObserver {

    @Resource
    private IWeComService iWeComService;

    @Override
    public boolean isNotify(SocialNotifyContext context) {
        return SocialAppType.INTERNAL.equals(context.getAppType()) && SocialPlatformType.WECOM.equals(context.getPlatform());
    }

    @Override
    public void notify(SocialNotifyContext context, NotificationCreateRo ro) {
        WxCpMessage wxCpMessage = renderTemplate(context, ro);
        if (wxCpMessage == null) {
            return;
        }
        List<String> toUsers = toUser(ro);
        if (toUsers.isEmpty()) {
            return;
        }
        iWeComService.sendMessageToUserPrivate(context.getTenantId(), Integer.valueOf(context.getAppId()), ro.getSpaceId(), toUsers, wxCpMessage);
    }
}
