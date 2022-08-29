package com.vikadata.api.component.notification.observer;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 通知观察者--飞书ISV应用
 * </p>
 * @author zoe zheng
 * @date 2022/3/15 18:30
 */
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
        // 切换上下文
        iFeishuService.switchDefaultContext();
        try {
            BatchSendChatMessageResult result = iFeishuService.batchSendCardMessage(context.getTenantId(), toUser(ro),
                    message);
            log.info("[飞书ISV通知]-飞书ISV消息ID: {}", result.getMessageId());
            log.warn("[飞书ISV通知]-飞书无法送到的用户: {}", result.getInvalidOpenIds());
        }
        catch (Exception e) {
            log.error("[飞书ISV通知]-发送消息卡片失败", e);
        }
    }
}
