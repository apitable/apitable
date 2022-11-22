package com.vikadata.api.shared.component.notification;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.socketio.core.SocketClientTemplate;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.player.service.impl.PlayerNotificationServiceImpl;
import com.vikadata.api.shared.cache.service.LoginUserService;
import com.vikadata.api.shared.component.notification.observer.CenterNotifyObserver;
import com.vikadata.api.shared.component.notification.observer.DingTalkIsvNotifyObserver;
import com.vikadata.api.shared.component.notification.observer.DingTalkNotifyObserver;
import com.vikadata.api.shared.component.notification.observer.LarkIsvNotifyObserver;
import com.vikadata.api.shared.component.notification.observer.LarkNotifyObserver;
import com.vikadata.api.shared.component.notification.observer.WecomIsvNotifyObserver;
import com.vikadata.api.shared.component.notification.observer.WecomNotifyObserver;
import com.vikadata.api.shared.component.notification.subject.CenterNotifySubject;
import com.vikadata.api.shared.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.shared.component.notification.subject.SocialNotifySubject;
import com.vikadata.api.shared.constants.NotificationConstants;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.core.util.SpringContextHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

import static com.vikadata.api.shared.constants.NotificationConstants.EXPIRE_AT;
import static com.vikadata.api.shared.constants.NotificationConstants.PAY_FEE;
import static com.vikadata.api.shared.constants.NotificationConstants.PLAN_NAME;

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
    private CenterNotifyObserver centerNotifyObserver;

    @Autowired(required = false)
    private WecomNotifyObserver wecomNotifyObserver;

    @Autowired(required = false)
    private WecomIsvNotifyObserver wecomIsvNotifyObserver;

    @Autowired(required = false)
    private DingTalkNotifyObserver dingTalkNotifyObserver;

    @Autowired(required = false)
    private DingTalkIsvNotifyObserver dingTalkIsvNotifyObserver;

    @Autowired(required = false)
    private LarkNotifyObserver larkNotifyObserver;

    @Autowired(required = false)
    private LarkIsvNotifyObserver larkIsvNotifyObserver;

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

    /**
     * send node share notification
     *
     * @param spaceId space id
     * @param nodeIds node is list
     * @param nodeShared whether node is shared
     */
    public void nodeShareNotify(String spaceId, List<String> nodeIds, boolean nodeShared) {
        HttpServletRequest request = HttpContextUtil.getRequest();
        ContentCachingRequestWrapper requestWrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (requestWrapper == null) {
            log.error("Space Notify Request Wrapper is null");
            return;
        }
        nodeIds.forEach(nodeId -> {
            SpaceNotificationInfo.NodeInfo nodeInfo = new SpaceNotificationInfo.NodeInfo();
            nodeInfo.setNodeId(nodeId);
            nodeInfo.setNodeShared(nodeShared);
            SpaceNotificationInfo info = SpaceNotificationInfo.builder().spaceId(spaceId)
                    .type(StrUtil.toCamelCase(NotificationTemplateId.NODE_SHARE.getValue()))
                    .data(nodeInfo)
                    .socketId(NotificationHelper.resolvePlayerSocketId(requestWrapper))
                    .build();
            socketClientTemplate.emit(EventType.NODE_CHANGE.name(), JSONUtil.parseObj(info));
        });
    }

    public void centerNotify(NotificationCreateRo ro) {
        CenterNotifySubject centerSub = new CenterNotifySubject();
        centerSub.addObserver(centerNotifyObserver);
        centerSub.send(ro);
    }

    public void socialNotify(NotificationCreateRo ro, SocialNotifyContext context) {
        if (context == null) {
            return;
        }
        SocialNotifySubject imSub = new SocialNotifySubject();
        if (wecomNotifyObserver != null || wecomIsvNotifyObserver != null) {
            imSub.addObserver(wecomNotifyObserver);
            imSub.addObserver(wecomIsvNotifyObserver);
        }
        if (dingTalkNotifyObserver != null || dingTalkIsvNotifyObserver != null) {
            imSub.addObserver(dingTalkNotifyObserver);
            imSub.addObserver(dingTalkIsvNotifyObserver);
        }
        if (larkIsvNotifyObserver != null || larkNotifyObserver != null) {
            imSub.addObserver(larkIsvNotifyObserver);
            imSub.addObserver(larkNotifyObserver);
        }
        imSub.setContext(context);
        imSub.send(ro);
    }

    /**
     * send billing notification
     * @param spaceId space id
     * @param fromUserId from
     * @param expireAt billing expired at
     * @param planTitle billing plan name
     * @param amount billing paid price
     */
    public void sendSubscribeNotify(String spaceId, Long fromUserId, Long expireAt, String planTitle, Integer amount, String orderType) {
        Dict paidExtra = Dict.create().set(PLAN_NAME, planTitle)
                .set(EXPIRE_AT, expireAt.toString())
                .set(PAY_FEE, String.format("¥%.2f", amount.doubleValue() / 100))
                .set("orderType", orderType);
        playerNotify(NotificationTemplateId.SPACE_VIKA_PAID_NOTIFY,
                Collections.singletonList(fromUserId), 0L, spaceId, paidExtra);
    }

    /**
     * send billing notification in social platform
     * @param planTitle billing plan name
     * @param amount billing paid price
     */
    public void sendSocialSubscribeNotify(String spaceId, Long toUserId, LocalDate expireAt, String planTitle,
            Long amount) {
        if (toUserId != null && amount > 0) {
            Dict paidExtra = Dict.create().set(PLAN_NAME, planTitle)
                    .set(EXPIRE_AT, String.valueOf(LocalDateTimeUtil.toEpochMilli(expireAt)))
                    .set(PAY_FEE, String.format("¥%.2f", amount.doubleValue() / 100));
            NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_PAID_NOTIFY,
                    Collections.singletonList(toUserId), 0L, spaceId, paidExtra);
        }
        Dict subscriptionExtra = Dict.create().set(PLAN_NAME, planTitle)
                .set(EXPIRE_AT, String.valueOf(LocalDateTimeUtil.toEpochMilli(expireAt)));
        NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_SUBSCRIPTION_NOTIFY,
                null, 0L, spaceId, subscriptionExtra);
    }
}
