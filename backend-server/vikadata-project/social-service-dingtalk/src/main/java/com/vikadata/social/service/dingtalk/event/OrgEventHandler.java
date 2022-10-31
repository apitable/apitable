package com.vikadata.social.service.dingtalk.event;

import java.util.Collections;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent.Agent;
import com.vikadata.social.dingtalk.event.sync.http.BaseOrgSuiteEvent.AuthInfo;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppRemoveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppRestoreEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppScopeUpdateEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppStopEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgRemoveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteAuthEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteChangeEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteRelieveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgUpdateEvent;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.service.dingtalk.enums.SocialAppType;
import com.vikadata.social.service.dingtalk.service.IDingTalkService;
import com.vikadata.social.service.dingtalk.service.ISocialTenantService;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * Event subscriptions -- high-priority data, activation of apps, etc.
 * Event Subscriptions -- normal priority data, such as address book changes
 */
@DingTalkEventHandler
@Slf4j
public class OrgEventHandler {
    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private IDingTalkService iDingTalkService;

    /**
     * The latest state of enterprise microapps
     *
     * @param bizId suiteid
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onOrgSuiteAuthEvent(String bizId, OrgSuiteAuthEvent event) {
        log.info("Received ISV DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getAuthCorpInfo().getCorpid();
        // To obtain authorized enterprise information, the ticket will throw an Illegal State Exception exception.
        DingTalkServerAuthInfoResponse authCorpInfo = iDingTalkService.getAuthCorpInfo(bizId, corpId);
        if (authCorpInfo != null) {
            // When reauthorizing, you need to force refresh the access token of the authorized company, otherwise an error will be reported
            iDingTalkService.refreshAccessToken(bizId, corpId);
            // Correct the agent Id, DingTalk will have abnormal agent Id
            Long agentId = authCorpInfo.getAuthInfo().getAgent().get(0).getAgentid();
            AuthInfo authInfo = event.getAuthInfo();
            Agent agent = authInfo.getAgent().get(0);
            agent.setAgentid(agentId);
            authInfo.setAgent(Collections.singletonList(agent));
            event.setAuthInfo(authInfo);
        }
        if (iSocialTenantService.isTenantAppExist(corpId, bizId)) {
            iSocialTenantService.updateTenantIsDeleteStatus(event.getCorpId(), bizId, false);
            iSocialTenantService.updateTenantAuthInfo(event.getCorpId(), bizId, event);
            return DING_TALK_CALLBACK_SUCCESS;
        }
        // activate the app
        iDingTalkService.activeSuite(bizId, corpId, event.getPermanentCode());
        iSocialTenantService.createTenant(SocialAppType.ISV, bizId, 1, event);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Indicates that the enterprise changes the scope of authorization
     *
     * @param bizId suiteid
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onSuiteChangeEvent(String bizId, OrgSuiteChangeEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getAuthCorpInfo().getCorpid();
        if (!iSocialTenantService.isTenantAppExist(corpId, bizId)) {
            // activate the app
            iDingTalkService.activeSuite(bizId, corpId, event.getPermanentCode());
            iSocialTenantService.createTenant(SocialAppType.ISV, bizId, 1, event);
        }
        else {
            iSocialTenantService.updateTenantAuthInfo(event.getCorpId(), bizId, event);
        }
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Enterprise relieve
     *
     * @param bizId suiteid
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onSuiteRelieveEvent(String bizId, OrgSuiteRelieveEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        // delete tenant
        iSocialTenantService.updateTenantIsDeleteStatus(event.getCorpId(), bizId, true);
        return DING_TALK_CALLBACK_SUCCESS;
    }


    @DingTalkEventListener
    public Object onOrgMicroAppRestoreEvent(String bizId, OrgMicroAppRestoreEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        iSocialTenantService.updateTenantStatus(event.getCorpId(), event.getSuiteId(), true);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onOrgMicroAppStopEvent(String bizId, OrgMicroAppStopEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        iSocialTenantService.updateTenantStatus(event.getCorpId(), event.getSuiteId(), false);
        // DingTalk's event push will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onOrgMicroAppRemoveEvent(String bizId, OrgMicroAppRemoveEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        iSocialTenantService.updateTenantStatus(event.getCorpId(), event.getSuiteId(), false);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onOrgMicroAppScopeUpdateEvent(String bizId, OrgMicroAppScopeUpdateEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onOrgUpdatedEvent(String bizId, OrgUpdateEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onOrgRemoveEvent(String bizId, OrgRemoveEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
