package com.vikadata.api.modular.social.service;

import com.vikadata.api.modular.social.service.impl.FeishuEventServiceImpl.SpaceContext;
import com.vikadata.social.feishu.event.app.AppOpenEvent;
import com.vikadata.social.feishu.event.app.AppStatusChangeEvent;
import com.vikadata.social.feishu.event.app.AppUninstalledEvent;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;
import com.vikadata.social.feishu.event.bot.AddBotEvent;
import com.vikadata.social.feishu.event.bot.BaseMessageEvent;
import com.vikadata.social.feishu.event.bot.P2pChatCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactScopeUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserUpdateEvent;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import org.springframework.util.MultiValueMap;

/**
 * 飞书事件处理服务
 * @author Shawn Deng
 * @date 2021-07-22 09:55:44
 */
public interface IFeishuEventService {

    /**
     * 处理首次开通应用
     * @param event 事件
     */
    void handleAppOpenEvent(AppOpenEvent event);

    /**
     * 处理应用停启用事件
     * @param event 事件
     */
    void handleAppStopEvent(AppStatusChangeEvent event);

    /**
     * 处理应用停启用事件
     * @param event 事件
     */
    void handleAppRestartEvent(AppStatusChangeEvent event);

    /**
     * 处理应用卸载
     * @param event 事件
     */
    void handleAppUninstalledEvent(AppUninstalledEvent event);

    /**
     * 处理通讯录授权范围变更
     * @param event 事件
     */
    void handleContactScopeChangeEvent(ContactScopeUpdateEvent event);

    /**
     * 处理租户通讯录数据
     * @param appId 应用ID
     * @param tenantKey 租户标识
     * @param spaceId 空间ID，也许为空
     * @param contactMap 租户通讯录数据结构
     * @return SpaceContext
     */
    SpaceContext handleTenantContactData(String appId, String tenantKey, String spaceId, MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap);

    /**
     * 处理员工离职事件
     * @param event 事件
     */
    void handleUserLeaveEvent(ContactUserDeleteEvent event);

    /**
     * 处理员工信息变化事件
     * @param event 事件
     */
    void handleUserUpdateEvent(ContactUserUpdateEvent event);

    /**
     * 处理部门新建
     * @param event 事件
     */
    void handleDeptCreateEvent(ContactDeptCreateEvent event);

    /**
     * 处理部门被删除
     * @param event 事件
     */
    void handleDeptDeleteEvent(ContactDeptDeleteEvent event);

    /**
     * 处理 部门信息变化
     * @param event 事件
     */
    void handleDeptUpdateEvent(ContactDeptUpdateEvent event);

    /**
     * 处理 用户和机器人的会话首次被创建
     * @param event 事件
     */
    void handleP2pChatCreateEvent(P2pChatCreateEvent event);

    /**
     * 处理 机器人被邀请加入群聊时事件
     * @param event 事件
     */
    void handleAddBotEvent(AddBotEvent event);

    /**
     * 处理 接收机器人消息事件
     * @param event 事件
     */
    <E extends BaseMessageEvent> void handleMessageEvent(E event);

    /**
     * 处理 订单支付事件
     * @param event 事件
     */
    void handleOrderPaidEvent(OrderPaidEvent event);

    /**
     * 处理飞书租户订单
     * @param tenantKey 租户标识
     * @param appId 应用ID
     */
    void handleTenantOrders(String tenantKey, String appId);
}
