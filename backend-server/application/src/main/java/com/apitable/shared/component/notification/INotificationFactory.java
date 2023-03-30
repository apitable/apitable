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

package com.apitable.shared.component.notification;

import cn.hutool.json.JSONObject;
import com.apitable.player.dto.NotificationModelDTO;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.vo.NotificationDetailVo;
import com.apitable.player.vo.PlayerBaseVo;
import com.apitable.shared.sysconfig.notification.NotificationTemplate;
import com.apitable.space.dto.BaseSpaceInfoDTO;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import java.util.List;
import java.util.Map;

/**
 * notification factory.
 */
public interface INotificationFactory {

    /**
     * get by template id.
     *
     * @param templateId template id
     * @return NotificationTemplate
     */
    NotificationTemplate getTemplateById(String templateId);

    /**
     * assemble sender.
     *
     * @param fromUserId sender
     * @param spaceId    space id
     * @param renderMap  render map
     * @return PlayerBaseVo
     */
    PlayerBaseVo formatFromUser(Long fromUserId, String spaceId, NotificationRenderMap renderMap);

    /**
     * assemble node info.
     *
     * @param node node DTO
     * @return node detail view
     */
    NotificationDetailVo.Node formatNode(NodeBaseInfoDTO node);

    /**
     * assemble space data.
     *
     * @param space space info
     * @return space detail
     */
    NotificationDetailVo.Space formatSpace(BaseSpaceInfoDTO space);

    /**
     * whether the locks that need to be counted for message sending exist.
     *
     * @param key            redis key
     * @param notificationId notification id
     * @return true | false
     */
    boolean delayLock(String key, Long notificationId);

    /**
     * Get the key to count the number of times the message is sent.
     *
     * @param toUserId recipient
     * @param ro       message request
     * @return redis lock key
     */
    String getDelayLockKey(String toUserId, NotificationCreateRo ro);

    /**
     * get notification id from redis.
     *
     * @param key cache key
     * @return notification id
     */
    Long getNotificationIdFromRedis(String key);

    /**
     * get all user id in space.
     *
     * @param spaceId space id
     * @return space id
     */
    List<Long> getSpaceAllUserId(String spaceId);

    /**
     * get user id.
     *
     * @param memberIds member id
     * @param spaceId   space id
     * @return user id
     */
    List<Long> getMemberUserId(List<Long> memberIds, String spaceId);

    /**
     * build extra.
     *
     * @param extras  extra json object
     * @param members member map
     * @return JSONObject
     */
    JSONObject formatExtra(JSONObject extras, Map<Long, PlayerBaseVo> members);

    /**
     * get render list.
     *
     * @param dtos notification model
     * @return render map
     */
    NotificationRenderMap getRenderList(List<NotificationModelDTO> dtos);

    /**
     * Get the userId corresponding to member Ids to remove the deleted member.
     *
     * @param memberIds member id list
     * @return user id
     */
    List<Long> getMemberUserIdExcludeDeleted(List<Long> memberIds);

    /**
     * get admin of space.
     *
     * @param spaceId space id
     * @return member id
     */
    Long getSpaceSuperAdmin(String spaceId);

    /**
     * get notification target.
     *
     * @param templateId template id
     * @return toUserTag
     */
    NotificationToTag getToUserTagByTemplateId(BaseTemplateId templateId);

    /**
     * get parent node id.
     *
     * @param nodeId node id
     * @return parent node id
     */
    String getNodeParentId(String nodeId);

    /**
     * get user payer map.
     *
     * @param memberIds member id
     * @param userIds   user id
     * @return user player map
     */
    Map<Long, PlayerBaseVo> getPlayerBaseInfo(List<Long> memberIds, List<Long> userIds);

    /**
     * check notification frequency.
     *
     * @param userId   user id
     * @param template template
     * @param nonce    random string
     * @return true | false
     */
    Boolean frequencyLimited(Long userId, NotificationTemplate template, String nonce);

    /**
     * Number of times the mark has been sent(users/every day).
     *
     * @param userId   user id
     * @param template template
     * @param nonce    random string
     */
    void addUserNotifyFrequency(Long userId, NotificationTemplate template, String nonce);

    /**
     * get notification node info.
     *
     * @param nodeId node id
     * @return {@link SpaceNotificationInfo.NodeInfo}
     */
    SpaceNotificationInfo.NodeInfo getNodeInfo(String nodeId);
}
