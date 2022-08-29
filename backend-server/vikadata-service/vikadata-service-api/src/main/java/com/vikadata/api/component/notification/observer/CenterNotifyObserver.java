package com.vikadata.api.component.notification.observer;


import java.util.List;

import javax.annotation.Resource;

import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.player.service.IPlayerNotificationService;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.notification.NotificationTemplate;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 通知观察者--通知中心
 * </p>
 * @author zoe zheng
 * @date 2022/3/15 18:30
 */
@Component
public class CenterNotifyObserver extends AbstractNotifyObserver<NotificationTemplate, String> {

    @Resource
    private IPlayerNotificationService iPlayerNotificationService;

    @Override
    public NotificationTemplate getTemplate(String templateId) {
        return SystemConfigManager.getConfig().getNotifications().getTemplates().get(templateId);
    }

    @Override
    public List<?> toUser(NotificationCreateRo ro) {
        return null;
    }

    @Override
    public String renderTemplate(String context, NotificationCreateRo ro) {
        return "";
    }

    @Override
    public void notify(String context, NotificationCreateRo ro) {
        if (getTemplate(ro.getTemplateId()) == null) {
            return;
        }
        iPlayerNotificationService.createNotify(ro);
    }

    @Override
    public void notify(String context, List<NotificationCreateRo> roList) {
        iPlayerNotificationService.batchCreateNotify(roList);
    }
}
