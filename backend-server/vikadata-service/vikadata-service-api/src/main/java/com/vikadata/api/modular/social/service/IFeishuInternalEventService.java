package com.vikadata.api.modular.social.service;

import com.vikadata.api.modular.appstore.model.AppInstance;
import com.vikadata.social.feishu.event.bot.AddBotEvent;
import com.vikadata.social.feishu.event.bot.BaseMessageEvent;
import com.vikadata.social.feishu.event.bot.P2pChatCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactScopeUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserUpdateEvent;
import com.vikadata.social.feishu.model.FeishuPassportUserInfo;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;

import org.springframework.util.MultiValueMap;

/**
 * 飞书自建应用事件处理服务
 * @author Shawn Deng
 * @date 2021-07-22 09:55:44
 */
public interface IFeishuInternalEventService {

    /**
     * 应用检查
     * @param appInstanceId 应用实例ID
     */
    void urlCheck(String appInstanceId);

    /**
     * 同步通讯录
     * @param userInfo 安装者用户信息
     * @param appInstance 飞书应用实例
     */
    void syncContactFirst(FeishuPassportUserInfo userInfo, AppInstance appInstance);

    /**
     * 处理通讯录授权范围变更
     * @param event 事件
     */
    void handleContactScopeChangeEvent(ContactScopeUpdateEvent event);

    /**
     * 刷新租户所在空间站所在标识
     * @param appId 应用标识
     * @param spaceId 空间标识
     * @param tenantKey 租户标识
     * @param installer 安装者OPEN_ID
     * @param contactMap 租户通讯录结构
     */
    void handleTenantContactData(String appId, String spaceId, String tenantKey, String installer, MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap);

    /**
     * 处理员工离职事件
     * @param event 事件内容
     */
    void handleUserLeaveEvent(ContactUserDeleteEvent event);

    /**
     * 处理员工信息变化事件
     * @param event 事件内容
     */
    void handleUserUpdateEvent(ContactUserUpdateEvent event);

    /**
     * 处理部门创建事件
     * @param event 事件内容
     */
    void handleDeptCreateEvent(ContactDeptCreateEvent event);

    /**
     * 处理部门更新事件
     * @param event 事件内容
     */
    void handleDeptUpdateEvent(ContactDeptUpdateEvent event);

    /**
     * 处理部门删除事件
     * @param event 事件内容
     */
    void handleDeptDeleteEvent(ContactDeptDeleteEvent event);

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
}
