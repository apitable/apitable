package com.vikadata.api.component.notification;

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

import com.vikadata.api.cache.service.LoginUserService;
import com.vikadata.api.component.notification.observer.CenterNotifyObserver;
import com.vikadata.api.component.notification.observer.DingTalkIsvNotifyObserver;
import com.vikadata.api.component.notification.observer.DingTalkNotifyObserver;
import com.vikadata.api.component.notification.observer.LarkIsvNotifyObserver;
import com.vikadata.api.component.notification.observer.LarkNotifyObserver;
import com.vikadata.api.component.notification.observer.WecomIsvNotifyObserver;
import com.vikadata.api.component.notification.observer.WecomNotifyObserver;
import com.vikadata.api.component.notification.subject.CenterNotifySubject;
import com.vikadata.api.component.notification.subject.SocialNotifyContext;
import com.vikadata.api.component.notification.subject.SocialNotifySubject;
import com.vikadata.api.config.task.AsyncTaskContextHolder;
import com.vikadata.api.constants.NotificationConstants;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.notification.EventType;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.player.service.impl.PlayerNotificationServiceImpl;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.integration.socketio.SocketClientTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

import static com.vikadata.api.constants.NotificationConstants.EXPIRE_AT;
import static com.vikadata.api.constants.NotificationConstants.PAY_FEE;
import static com.vikadata.api.constants.NotificationConstants.PLAN_NAME;

/**
 * <p>
 * 通知管理类，发送后端需要发送的通知
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/28 3:34 下午
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
     * 统一消息发送方法
     *
     * @param templateId  模版ID
     * @param toPlayerIds 消息触达的用户，memberId或者userId
     * @param fromUserId  消息来源的用户ID
     * @param spaceId     空间ID
     * @param bodyExtras  附加内容
     * @author zoe zheng
     * @date 2020/7/9 11:00 上午
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
        HttpServletRequest request = AsyncTaskContextHolder.getServletRequest();
        ContentCachingRequestWrapper requestWrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (requestWrapper == null) {
            log.error("Request Wrapper is null");
            return;
        }
        Object nodeId = NotificationHelper.resolveNodeId(requestWrapper, result);
        if (ObjectUtil.isNotNull(nodeId)) {
            String nodeIdStr = nodeId.toString();
            SpaceNotificationInfo.NodeInfo nodeInfoVo;
            // 创建节点
            if (templateId == NotificationTemplateId.NODE_CREATE) {
                nodeInfoVo = NotificationHelper.resolveNodeInfoFromResponse(result);
                // 保证node的parentId一定返回
                if (nodeInfoVo.getParentId() == null) {
                    nodeInfoVo.setParentId(notificationFactory.getNodeParentId(nodeIdStr));
                }
            }
            else {
                nodeInfoVo = NotificationHelper.resolveNodeInfoFromRequest(requestWrapper);
            }
            // 获取parentID
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
     * 发送节点分享消息
     *
     * @param spaceId 空间ID
     * @param nodeIds 节点ID列表
     * @param nodeShared 分享是否关闭
     * @author zoe zheng
     * @date 2021/3/9 11:26 上午
     */
    public void nodeShareNotify(String spaceId, List<String> nodeIds, boolean nodeShared) {
        HttpServletRequest request = AsyncTaskContextHolder.getServletRequest();
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
        // 通知中心消息
        CenterNotifySubject centerSub = new CenterNotifySubject();
        centerSub.addObserver(centerNotifyObserver);
        centerSub.send(ro);
    }

    public void socialNotify(NotificationCreateRo ro, SocialNotifyContext context) {
        if (context == null) {
            return;
        }
        // 通知中心消息
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
     * 订阅付费成功站内通知
     * @param spaceId 空间ID
     * @param fromUserId 发送者
     * @param expireAt 付费方案过期时间
     * @param planTitle 方案名称
     * @param amount 方案金额
     */
    public void sendSubscribeNotify(String spaceId, Long fromUserId, Long expireAt, String planTitle, Integer amount, OrderType orderType) {
        // 发送支付成功通知
        Dict paidExtra = Dict.create().set(PLAN_NAME, planTitle)
                .set(EXPIRE_AT, expireAt.toString())
                .set(PAY_FEE, String.format("¥%.2f", amount.doubleValue() / 100))
                .set("orderType", orderType != null ? orderType.name() : StrUtil.EMPTY);
        // 发送支付成功通知
        playerNotify(NotificationTemplateId.SPACE_VIKA_PAID_NOTIFY,
                Collections.singletonList(fromUserId), 0L, spaceId, paidExtra);
    }

    /**
     *  发送第三方通知
     * @param planTitle 计划名称
     * @param amount 支付金额 单位分
     * @author zoe zheng
     * @date 2022/6/7 16:40
     */
    public void sendSocialSubscribeNotify(String spaceId, Long toUserId, LocalDate expireAt, String planTitle,
            Long amount) {
        if (toUserId != null && amount > 0) {
            // 发送支付成功通知
            Dict paidExtra = Dict.create().set(PLAN_NAME, planTitle)
                    .set(EXPIRE_AT, String.valueOf(LocalDateTimeUtil.toEpochMilli(expireAt)))
                    .set(PAY_FEE, String.format("¥%.2f", amount.doubleValue() / 100));
            NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_PAID_NOTIFY,
                    Collections.singletonList(toUserId), 0L, spaceId, paidExtra);
        }
        // 发送订阅成功通知
        Dict subscriptionExtra = Dict.create().set(PLAN_NAME, planTitle)
                .set(EXPIRE_AT, String.valueOf(LocalDateTimeUtil.toEpochMilli(expireAt)));
        NotificationManager.me().playerNotify(NotificationTemplateId.SPACE_SUBSCRIPTION_NOTIFY,
                null, 0L, spaceId, subscriptionExtra);
    }
}
