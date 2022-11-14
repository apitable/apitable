package com.vikadata.api.shared.component.notification.observer;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.service.IFeishuService;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@ConditionalOnProperty(value = "vikadata-starter.social.feishu.enabled", havingValue = "true")
public class LarkIsvNotifyObserver extends AbstractLarkNotifyObserver {

    @Resource
    private IFeishuService iFeishuService;

    @Override
    public boolean isNotify(SocialNotifyContext context) {
        return SocialAppType.ISV.equals(context.getAppType()) && SocialPlatformType.FEISHU.equals(context.getPlatform());
    }

    @Override
    public void notify(SocialNotifyContext context, NotificationCreateRo ro) {
        Message message = renderTemplate(context, ro);
        if (message == null) {
            return;
        }
        // switch context
        iFeishuService.switchDefaultContext();
        try {
            BatchSendChatMessageResult result = iFeishuService.batchSendCardMessage(context.getTenantId(), toUser(ro),
                    message);
        }
        catch (Exception e) {
            log.error("Failed to send message card", e);
        }
    }
}
