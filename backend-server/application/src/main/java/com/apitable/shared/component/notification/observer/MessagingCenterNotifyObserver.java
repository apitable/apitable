/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.component.notification.observer;

import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.service.IPlayerNotificationService;
import com.apitable.shared.sysconfig.notification.NotificationConfigLoader;
import com.apitable.shared.sysconfig.notification.NotificationTemplate;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * <p>
 * self notify observer.
 * </p>
 *
 * @author zoe zheng
 */
@Component
public class MessagingCenterNotifyObserver
    extends AbstractNotifyObserver<NotificationTemplate, String> {

    @Resource
    private IPlayerNotificationService iPlayerNotificationService;

    @Override
    public NotificationTemplate getTemplate(String templateId) {
        return NotificationConfigLoader.getConfig().getTemplates().get(templateId);
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
