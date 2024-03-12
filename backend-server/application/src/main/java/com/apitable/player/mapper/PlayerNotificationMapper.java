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

package com.apitable.player.mapper;

import com.apitable.player.dto.NotificationModelDTO;
import com.apitable.player.entity.PlayerNotificationEntity;
import com.apitable.player.ro.NotificationPageRo;
import com.apitable.player.ro.NotificationRevokeRo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Player Notification Mapper.
 * </p>
 */
public interface PlayerNotificationMapper extends BaseMapper<PlayerNotificationEntity> {

    /**
     * Get notification list.
     *
     * @param notificationPageRo request params
     * @param toUser             user id
     * @param totalCount         total count
     * @return NotificationModelDto List
     */
    List<NotificationModelDTO> selectPlayerNotificationPage(
        @Param("notificationPageRo") NotificationPageRo notificationPageRo,
        @Param("toUser") Long toUser, @Param("totalCount") Integer totalCount);

    /**
     * Batch insert.
     *
     * @param notificationEntities entities
     * @return number of execution results
     */
    int insertBatch(
        @Param("notificationEntities") List<PlayerNotificationEntity> notificationEntities);

    /**
     * Update read status.
     *
     * @param ids id list
     * @return execute result
     */
    boolean updateReadIsTrueByIds(@Param("ids") String[] ids);

    /**
     * Set all user's messages as read.
     *
     * @param toUser user id
     * @return execute result
     */
    boolean updateReadIsTrueByUserId(@Param("toUser") Long toUser);

    /**
     * Query the number of user notifications that have been read.
     *
     * @param toUser user id
     * @param isRead read status
     * @return count
     */
    Integer selectCountByUserIdAndIsRead(@Param("toUser") Long toUser,
                                         @Param("isRead") Integer isRead);

    /**
     * Query user notification count.
     *
     * @param toUser user id
     * @return count
     */
    Integer selectTotalCountByUserId(@Param("toUser") Long toUser);

    /**
     * Delete notification.
     *
     * @param ids id list
     * @return execute result
     */
    boolean deleteNotificationByIds(@Param("ids") String[] ids);

    /**
     * Query notification body.
     *
     * @param id ID
     * @return body
     */
    String selectNotifyBodyById(@Param("id") Long id);

    /**
     * Update notification body.
     *
     * @param id   ID
     * @param body notification body
     * @return execute result
     */
    boolean updateNotifyBodyById(@Param("id") Long id, @Param("body") String body);

    /**
     * Query total count by condition.
     *
     * @param notificationPageRo request params
     * @param toUser             user id
     * @return count
     */
    Integer selectTotalCountByRoAndToUser(
        @Param("notificationPageRo") NotificationPageRo notificationPageRo,
        @Param("toUser") Long toUser);

    /**
     * Modify the message body and replace the value corresponding to the specified key.
     *
     * @param id  ID
     * @param key key
     * @param val value
     * @return number of execution results
     */
    Integer updateNotifyBodyByIdAndKey(@Param("id") Long id, @Param("key") String key,
                                       @Param("val") Integer val);

    /**
     * Get notification list.
     *
     * @param isRead read status
     * @param toUser user id
     * @return List of NotificationModelDto
     */
    List<NotificationModelDTO> selectDtoByTypeAndIsRead(@Param("toUser") Long toUser,
                                                        @Param("isRead") Boolean isRead);

    /**
     * Batch delete by condition.
     *
     * @param userIds    user id
     * @param notifyType notification type
     * @param templateId tempalte id
     * @param revokeRo   extra params
     * @return int
     */
    int updateBatchByUserIdsAndTemplateId(@Param("userIds") List<Long> userIds,
                                          @Param("notifyType") String notifyType,
                                          @Param("templateId") String templateId,
                                          @Param("revokeRo") NotificationRevokeRo revokeRo);
}
