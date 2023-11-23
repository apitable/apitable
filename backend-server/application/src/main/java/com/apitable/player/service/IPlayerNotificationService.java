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

package com.apitable.player.service;

import cn.hutool.core.lang.Dict;
import com.apitable.player.dto.NotificationModelDTO;
import com.apitable.player.entity.PlayerNotificationEntity;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.ro.NotificationListRo;
import com.apitable.player.ro.NotificationPageRo;
import com.apitable.player.ro.NotificationRevokeRo;
import com.apitable.player.vo.NotificationDetailVo;
import com.apitable.player.vo.NotificationStatisticsVo;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.component.notification.NotificationToTag;
import com.apitable.shared.sysconfig.notification.NotificationTemplate;
import com.baomidou.mybatisplus.extension.service.IService;
import java.io.IOException;
import java.util.List;

/**
 * <p>
 * Player Notification Service.
 * </p>
 */
public interface IPlayerNotificationService extends IService<PlayerNotificationEntity> {

    /**
     * Batch create notification records, send notifications.
     */
    boolean batchCreateNotify(List<NotificationCreateRo> roList);

    /**
     * Create notification records, send notifications.
     */
    void createNotify(NotificationCreateRo ro);

    /**
     * Create notification records, send notifications.
     */
    void createUserNotify(NotificationTemplate template, NotificationCreateRo ro);

    /**
     * Create notification records, send notifications.
     */
    void createMemberNotify(NotificationTemplate template, NotificationCreateRo ro,
                            NotificationToTag toTag);

    /**
     * Create a member mention notification.
     */
    void createMemberMentionedNotify(List<Long> toUserIds,
                                     NotificationTemplate template,
                                     NotificationCreateRo ro);

    /**
     * Create system notifications.
     */
    void createAllUserNotify(NotificationTemplate template, NotificationCreateRo ro)
        throws IOException;

    /**
     * Create records and send notifications without any data validation.
     */
    void createNotifyWithoutVerify(List<Long> userIds, NotificationTemplate template,
                                   NotificationCreateRo ro);

    /**
     * Get notification page list.
     */
    List<NotificationDetailVo> pageList(NotificationPageRo notificationPageRo, LoginUserDto toUser);

    /**
     * Assemble the data returned to the client.
     */
    List<NotificationDetailVo> formatDetailVos(List<NotificationModelDTO> notificationModelDTOList,
                                               String uuid);

    /**
     * Set notification read.
     */
    boolean setNotificationIsRead(String[] ids, Boolean isAll);

    /**
     * User message statistics.
     */
    NotificationStatisticsVo statistic(Long userId);

    /**
     * Delete message.
     */
    boolean setDeletedIsTrue(String[] ids);

    /**
     * Bulk create messages.
     */
    boolean createBatch(List<PlayerNotificationEntity> notifyEntities,
                        List<PlayerNotificationEntity> createEntities);

    /**
     * Bulk create messages.
     */
    boolean createBatch(List<PlayerNotificationEntity> notifyEntities);

    /**
     * Get user notification list.
     */
    List<NotificationDetailVo> list(NotificationListRo notificationListRo,
                                    LoginUserDto toUser);

    /**
     * Get user notification list.
     */
    List<NotificationModelDTO> getUserNotificationByTypeAndIsRead(Long toUser, Boolean isRead);

    /**
     * Revoke notification.
     */
    boolean revokeNotification(NotificationRevokeRo ro);

    /**
     * Revoke all user notification.
     */
    boolean revokeAllUserNotification(NotificationTemplate template,
                                      NotificationRevokeRo ro);

    /**
     * Batch send mail notification.
     * To specify user
     */
    void sendMailNotifyBatch(NotificationTemplate template, List<Long> userIds, Dict dict);
}
