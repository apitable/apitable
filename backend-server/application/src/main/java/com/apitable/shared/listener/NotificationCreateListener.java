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

package com.apitable.shared.listener;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.util.StrUtil;
import com.apitable.player.dto.NotificationModelDTO;
import com.apitable.player.entity.PlayerNotificationEntity;
import com.apitable.player.service.IPlayerNotificationService;
import com.apitable.player.vo.NotificationDetailVo;
import com.apitable.shared.component.notification.EventType;
import com.apitable.shared.component.notification.INotificationFactory;
import com.apitable.shared.listener.event.NotificationCreateEvent;
import com.apitable.starter.socketio.core.SocketClientTemplate;
import com.apitable.user.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * <p>
 * notification creation listener
 * </p>
 *
 * @author zoe zheng
 */
@Slf4j
@Component
public class NotificationCreateListener implements ApplicationListener<NotificationCreateEvent> {

    @Resource
    private IPlayerNotificationService notificationService;

    @Resource
    private SocketClientTemplate socketClientTemplate;

    @Resource
    private UserMapper userMapper;

    @Resource
    private INotificationFactory notificationFactory;

    @Async
    @Override
    public void onApplicationEvent(NotificationCreateEvent event) {
        List<PlayerNotificationEntity> entityList = event.getEntityList();
        entityList.forEach(entity -> {
            String uuid = userMapper.selectUuidById(entity.getToUser());
            if (StrUtil.isNotBlank(uuid)) {
                NotificationModelDTO dto =
                        BeanUtil.fillBeanWithMapIgnoreCase(BeanUtil.beanToMap(entity), new NotificationModelDTO(), false);
                NotificationDetailVo detailVo = notificationService.formatDetailVos(ListUtil.toList(dto), uuid).get(0);
                detailVo.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
                detailVo.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN)));
                detailVo.setIsRead(0);
                socketClientTemplate.emit(EventType.NOTIFY.name(), notificationFactory.getJsonObject(detailVo));
            }
        });
    }
}
