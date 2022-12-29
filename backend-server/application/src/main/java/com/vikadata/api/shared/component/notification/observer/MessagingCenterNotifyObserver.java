package com.vikadata.api.shared.component.notification.observer;


import java.util.List;

import javax.annotation.Resource;

import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.player.service.IPlayerNotificationService;
import com.vikadata.api.shared.sysconfig.SystemConfigManager;
import com.vikadata.api.shared.sysconfig.notification.NotificationTemplate;

import org.springframework.stereotype.Component;

/**
 * <p>
 * self notify observer
 * </p>
 * @author zoe zheng
 */
@Component
public class MessagingCenterNotifyObserver extends AbstractNotifyObserver<NotificationTemplate, String> {

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
