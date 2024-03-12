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

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.player.ro.NotificationCreateRo;
import com.apitable.player.service.impl.PlayerNotificationServiceImpl;
import com.apitable.shared.cache.service.LoginUserCacheService;
import com.apitable.shared.component.notification.observer.MessagingCenterNotifyObserver;
import com.apitable.shared.component.notification.subject.CenterNotifySubject;
import com.apitable.shared.constants.NotificationConstants;
import com.apitable.starter.socketio.core.SocketClientTemplate;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * notification manager.
 */
@Slf4j
@Component
public class NotificationManager {

    @Resource
    private INotificationFactory notificationFactory;

    @Resource
    private PlayerNotificationServiceImpl playerNotificationService;

    @Resource
    private SocketClientTemplate socketClientTemplate;

    @Resource
    private LoginUserCacheService loginUserCacheService;

    @Resource
    private MessagingCenterNotifyObserver messagingCenterNotifyObserver;

    public static NotificationManager me() {
        return SpringContextHolder.getBean(NotificationManager.class);
    }

    /**
     * send message.
     *
     * @param templateId  template id
     * @param toPlayerIds target
     * @param fromUserId  from
     * @param spaceId     space id
     * @param bodyExtras  extra
     */
    public void playerNotify(BaseTemplateId templateId, List<Long> toPlayerIds, Long fromUserId,
                             String spaceId, Map<String, Object> bodyExtras) {
        NotificationCreateRo ro = new NotificationCreateRo();
        ro.setTemplateId(templateId.getValue());
        ro.setFromUserId(fromUserId.toString());
        ro.setSpaceId(spaceId);
        NotificationToTag toTag = notificationFactory.getToUserTagByTemplateId(templateId);
        if (ObjectUtil.isNotNull(toPlayerIds)) {
            if (NotificationToTag.toUserTag(toTag)
                || NotificationTemplateId.spaceDeleteNotify(templateId)) {
                ro.setToUserId(ListUtil.toList(Convert.toStrArray(toPlayerIds)));
            } else {
                ro.setToMemberId(ListUtil.toList(Convert.toStrArray(toPlayerIds)));
            }
        }
        if (ObjectUtil.isNotNull(bodyExtras)) {
            ro.setBody(JSONUtil.createObj().putOnce(NotificationConstants.BODY_EXTRAS, bodyExtras));
        }
        playerNotificationService.batchCreateNotify(ListUtil.toList(ro));
    }

    /**
     * space notification.
     *
     * @param requestStorage request parameter map
     * @param templateId     notification template id
     * @param userId         user id
     * @param spaceId        space id
     * @param result         response
     */
    public void spaceNotify(RequestStorage requestStorage,
                            NotificationTemplateId templateId, Long userId, String spaceId,
                            Object result) {
        Object nodeId = NotificationHelper.resolveNodeId(requestStorage, result);
        if (ObjectUtil.isNotNull(nodeId)) {
            String nodeIdStr = nodeId.toString();
            SpaceNotificationInfo.NodeInfo nodeInfoVo;
            if (templateId == NotificationTemplateId.NODE_CREATE) {
                nodeInfoVo = NotificationHelper.resolveNodeInfoFromResponse(result);
                if (nodeInfoVo.getParentId() == null) {
                    nodeInfoVo.setParentId(notificationFactory.getNodeParentId(nodeIdStr));
                }
            } else {
                nodeInfoVo = notificationFactory.getNodeInfo(nodeIdStr);
            }
            if (templateId == NotificationTemplateId.NODE_UPDATE_ROLE) {
                nodeInfoVo.setParentId(notificationFactory.getNodeParentId(nodeIdStr));
            }
            nodeInfoVo.setNodeId(nodeIdStr);
            SpaceNotificationInfo info = SpaceNotificationInfo.builder().spaceId(spaceId)
                .type(StrUtil.toCamelCase(templateId.getValue()))
                .data(nodeInfoVo).socketId(NotificationHelper.resolvePlayerSocketId(requestStorage))
                .build();
            if (templateId == NotificationTemplateId.NODE_FAVORITE) {
                info.setUuid(loginUserCacheService.getLoginUser(userId).getUuid());
            }
            socketClientTemplate.emit(EventType.NODE_CHANGE.name(), JSONUtil.parseObj(info));
        } else {
            log.debug("spaceNotify:null:templateId:{}:result:{}", templateId, result.toString());
        }
    }

    /**
     * user notification center message.
     *
     * @param ro notification create param
     */
    public void centerNotify(NotificationCreateRo ro) {
        CenterNotifySubject centerSub = new CenterNotifySubject();
        centerSub.addObserver(messagingCenterNotifyObserver);
        centerSub.send(ro);
    }
}
