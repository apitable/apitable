package com.vikadata.api.modular.social.event.feishu.v2;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.service.IFeishuEventService;
import com.vikadata.api.modular.social.service.IFeishuInternalEventService;
import com.vikadata.api.modular.social.service.ISocialFeishuEventLogService;
import com.apitable.starter.social.feishu.autoconfigure.annotation.FeishuEventHandler;
import com.apitable.starter.social.feishu.autoconfigure.annotation.FeishuEventListener;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactScopeUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserUpdateEvent;

/**
 * Lark
 * Event subscription - new address book event
 */
@Slf4j
@FeishuEventHandler
public class FeishuV3ContactEventHandler {

    @Resource
    private ISocialFeishuEventLogService iSocialFeishuEventLogService;

    @Resource
    private IFeishuEventService iFeishuEventService;

    @Resource
    private IFeishuInternalEventService iFeishuInternalEventService;

    @FeishuEventListener
    public Object onContactScopeChangeEvent(ContactScopeUpdateEvent event) {
        iSocialFeishuEventLogService.createV3ContactEventLog(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleContactScopeChangeEvent(event);
        }
        else {
            iFeishuEventService.handleContactScopeChangeEvent(event);
        }
        return "";
    }

    @FeishuEventListener
    public Object onUserDeleteEvent(ContactUserDeleteEvent event) {
        iSocialFeishuEventLogService.createV3ContactEventLog(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleUserLeaveEvent(event);
        }
        else {
            iFeishuEventService.handleUserLeaveEvent(event);
        }
        return "";
    }

    @FeishuEventListener
    public Object onUserUpdateEvent(ContactUserUpdateEvent event) {
        iSocialFeishuEventLogService.createV3ContactEventLog(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleUserUpdateEvent(event);
        }
        else {
            iFeishuEventService.handleUserUpdateEvent(event);
        }
        return "";
    }

    @FeishuEventListener
    public Object onDeptCreateEvent(ContactDeptCreateEvent event) {
        iSocialFeishuEventLogService.createV3ContactEventLog(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleDeptCreateEvent(event);
        }
        else {
            iFeishuEventService.handleDeptCreateEvent(event);
        }
        return "";
    }

    @FeishuEventListener
    public Object onDeptDeleteEvent(ContactDeptDeleteEvent event) {
        iSocialFeishuEventLogService.createV3ContactEventLog(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleDeptDeleteEvent(event);
        }
        else {
            iFeishuEventService.handleDeptDeleteEvent(event);
        }
        return "";
    }

    @FeishuEventListener
    public Object onDeptUpdateEvent(ContactDeptUpdateEvent event) {
        iSocialFeishuEventLogService.createV3ContactEventLog(event);
        if (event.getAppInstanceId() != null) {
            iFeishuInternalEventService.handleDeptUpdateEvent(event);
        }
        else {
            iFeishuEventService.handleDeptUpdateEvent(event);
        }
        return "";
    }
}
