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
 * Lark Self built Application Event Processing Service
 */
public interface IFeishuInternalEventService {

    /**
     * Application check
     *
     * @param appInstanceId Application instance ID
     */
    void urlCheck(String appInstanceId);

    /**
     * Synchronize contacts
     *
     * @param userInfo Installer User Information
     * @param appInstance Lark application example
     */
    void syncContactFirst(FeishuPassportUserInfo userInfo, AppInstance appInstance);

    /**
     * Handle the change of address book authorization scope
     *
     * @param event Event
     */
    void handleContactScopeChangeEvent(ContactScopeUpdateEvent event);

    /**
     * Refresh the identity of the space station where the tenant is located
     *
     * @param appId Application ID
     * @param spaceId Space ID
     * @param tenantKey Tenant ID
     * @param installer Installer OPEN ID
     * @param contactMap Tenant Address Book Structure
     */
    void handleTenantContactData(String appId, String spaceId, String tenantKey, String installer, MultiValueMap<FeishuDeptObject, FeishuUserObject> contactMap);

    /**
     * Processing employee resignation events
     *
     * @param event Event content
     */
    void handleUserLeaveEvent(ContactUserDeleteEvent event);

    /**
     * Handling employee information change events
     *
     * @param event Event content
     */
    void handleUserUpdateEvent(ContactUserUpdateEvent event);

    /**
     * Processing department creation event
     *
     * @param event Event content
     */
    void handleDeptCreateEvent(ContactDeptCreateEvent event);

    /**
     * Handle department update events
     *
     * @param event Event content
     */
    void handleDeptUpdateEvent(ContactDeptUpdateEvent event);

    /**
     * Processing department deletion event
     *
     * @param event Event content
     */
    void handleDeptDeleteEvent(ContactDeptDeleteEvent event);

    /**
     * The session of processing user and robot is created for the first time
     *
     * @param event Event
     */
    void handleP2pChatCreateEvent(P2pChatCreateEvent event);

    /**
     * Handle the event when a robot is invited to join a group chat
     *
     * @param event Event
     */
    void handleAddBotEvent(AddBotEvent event);

    /**
     * Handle the event of receiving robot message
     *
     * @param event Event
     */
    <E extends BaseMessageEvent> void handleMessageEvent(E event);
}
