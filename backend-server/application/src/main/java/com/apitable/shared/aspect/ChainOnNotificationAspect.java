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

package com.apitable.shared.aspect;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;

import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationHelper;
import com.apitable.shared.component.notification.NotificationManager;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.NotificationRenderFieldHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * <p>
 * notification aop
 * </p>
 *
 * @author zoe zheng
 */
@Aspect
@Component
@Slf4j
public class ChainOnNotificationAspect extends BaseAspectSupport {

    @Resource
    private NotificationManager notificationManager;

    @AfterReturning(pointcut = "@annotation(notification)", returning = "result")
    public void doAfterReturning(Notification notification, Object result) {
        try {
            NotificationRenderField renderField = NotificationRenderFieldHolder.get();

            HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
            boolean isNodeOperate = NotificationHelper.isNodeOperate(request.getServletPath());
            final String spaceId;
            final Long fromUserId;
            final List<Long> playerIds;
            final Map<String, Object> bodyExtras;
            if (renderField != null) {
                spaceId = StrUtil.isNotBlank(renderField.getSpaceId()) ? renderField.getSpaceId() : LoginContext.me().getSpaceId();
                fromUserId = ObjectUtil.isNotNull(renderField.getFromUserId()) ? renderField.getFromUserId() : SessionContext.getUserId();
                playerIds = renderField.getPlayerIds();
                bodyExtras = renderField.getBodyExtras();
            }
            else {
                spaceId = LoginContext.me().getSpaceId();
                fromUserId = SessionContext.getUserId();
                playerIds = null;
                bodyExtras = null;
            }
            for (NotificationTemplateId templateId : notification.templateId()) {
                if (isNodeOperate) {
                    TaskManager.me().execute(() -> notificationManager.spaceNotify(templateId, fromUserId, spaceId, result));
                }
                else {
                    TaskManager.me().execute(() -> notificationManager.playerNotify(templateId, playerIds, fromUserId, spaceId, bodyExtras));
                }
            }
        }
        catch (Exception e) {
            log.error("PlayerNotification:Error", e);
        }
    }
}
