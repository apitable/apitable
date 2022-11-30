package com.vikadata.api.shared.component.notification;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.socketio.core.SocketClientTemplate;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.player.service.impl.PlayerNotificationServiceImpl;
import com.vikadata.api.shared.cache.service.LoginUserService;
import com.vikadata.api.shared.component.notification.observer.MessagingCenterNotifyObserver;
import com.vikadata.api.shared.component.notification.subject.CenterNotifySubject;
import com.vikadata.api.shared.constants.NotificationConstants;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.core.util.SpringContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

/**
 * <p>
 * notification manager
 * </p>
 *
 * @author zoe zheng
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
    private LoginUserService loginUserService;

    @Resource
    private MessagingCenterNotifyObserver messagingCenterNotifyObserver;

    public static NotificationManager me() {
        return SpringContextHolder.getBean(NotificationManager.class);
    }

    /**
     * send message
     *
     * @param templateId  template id
     * @param toPlayerIds target
     * @param fromUserId  from
     * @param spaceId     space id
     * @param bodyExtras  extra
     */
    public void playerNotify(NotificationTemplateId templateId, List<Long> toPlayerIds, Long fromUserId, String spaceId, Map<String, Object> bodyExtras) {
        NotificationCreateRo ro = new NotificationCreateRo();
        ro.setTemplateId(templateId.getValue());
        ro.setFromUserId(fromUserId.toString());
        ro.setSpaceId(spaceId);
        NotificationToTag toTag = notificationFactory.getToUserTagByTemplateId(templateId);
        if (ObjectUtil.isNotNull(toPlayerIds)) {
            if (NotificationToTag.toUserTag(toTag) || NotificationTemplateId.spaceDeleteNotify(templateId)) {
                ro.setToUserId(ListUtil.toList(Convert.toStrArray(toPlayerIds)));
            }
            else {
                ro.setToMemberId(ListUtil.toList(Convert.toStrArray(toPlayerIds)));
            }
        }
        if (ObjectUtil.isNotNull(bodyExtras)) {
            ro.setBody(JSONUtil.createObj().putOnce(NotificationConstants.BODY_EXTRAS, bodyExtras));
        }
        playerNotificationService.batchCreateNotify(ListUtil.toList(ro));
    }

    public void spaceNotify(NotificationTemplateId templateId, Long userId, String spaceId, Object result) {
        HttpServletRequest request = HttpContextUtil.getRequest();
        ContentCachingRequestWrapper requestWrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (requestWrapper == null) {
            log.error("Request Wrapper is null");
            return;
        }
        Object nodeId = NotificationHelper.resolveNodeId(requestWrapper, result);
        if (ObjectUtil.isNotNull(nodeId)) {
            String nodeIdStr = nodeId.toString();
            SpaceNotificationInfo.NodeInfo nodeInfoVo;
            if (templateId == NotificationTemplateId.NODE_CREATE) {
                nodeInfoVo = NotificationHelper.resolveNodeInfoFromResponse(result);
                if (nodeInfoVo.getParentId() == null) {
                    nodeInfoVo.setParentId(notificationFactory.getNodeParentId(nodeIdStr));
                }
            }
            else {
                nodeInfoVo = NotificationHelper.resolveNodeInfoFromRequest(requestWrapper);
            }
            if (templateId == NotificationTemplateId.NODE_UPDATE_ROLE) {
                nodeInfoVo.setParentId(notificationFactory.getNodeParentId(nodeIdStr));
            }
            nodeInfoVo.setNodeId(nodeIdStr);
            SpaceNotificationInfo info = SpaceNotificationInfo.builder().spaceId(spaceId).type(StrUtil.toCamelCase(templateId.getValue()))
                    .data(nodeInfoVo).socketId(NotificationHelper.resolvePlayerSocketId(requestWrapper)).build();
            if (templateId == NotificationTemplateId.NODE_FAVORITE) {
                info.setUuid(loginUserService.getLoginUser(userId).getUuid());
            }
            socketClientTemplate.emit(EventType.NODE_CHANGE.name(), JSONUtil.parseObj(info));
        }
        else {
            log.debug("spaceNotify:null:templateId:{}:result:{}", templateId, result.toString());
        }
    }

    public void centerNotify(NotificationCreateRo ro) {
        CenterNotifySubject centerSub = new CenterNotifySubject();
        centerSub.addObserver(messagingCenterNotifyObserver);
        centerSub.send(ro);
    }
}
