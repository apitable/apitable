package com.vikadata.api.modular.social.event.dingtalk;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.modular.social.service.IDingTalkIsvEventService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.integration.rabbitmq.RabbitSenderService;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppRemoveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppRestoreEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppScopeUpdateEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppStopEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgRemoveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteAuthEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteChangeEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteRelieveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgUpdateEvent;

import org.springframework.beans.factory.annotation.Autowired;

import static com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig.DING_TALK_ISV_HIGH_TOPIC;
import static com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig.DING_TALK_TOPIC_EXCHANGE_BUFFER;
import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * <p>
 * Event subscription - high priority data, application activation, etc
 * Event subscription -- common priority data, such as address book change
 * </p>
 */
@DingTalkEventHandler
@Slf4j
public class SyncHttpOrgEventHandler {
    @Resource
    private IDingTalkIsvEventService iDingTalkIsvEventService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISpaceService iSpaceService;

    @Autowired(required = false)
    private RabbitSenderService rabbitSenderService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    /**
     * Latest status of enterprise applications
     *
     * @param bizId Suite suite id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgSuiteAuthEvent(String bizId, OrgSuiteAuthEvent event) {
        log.info("Received ISV DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleOrgSuiteAuthEvent(bizId, event);
        TaskManager.me().execute(() -> iDingTalkIsvEventService.handleOrgSuiteChangeEvent(bizId, event));
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Indicates the scope of authorization for enterprise change
     *
     * @param bizId Suite suite id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgSuiteChangeEvent(String bizId, OrgSuiteChangeEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getCorpId();
        // Advance the logic to prevent other members of the space from being synchronized after the Ding Talk messages are scrambled
        if (!iSocialTenantService.isTenantExist(corpId, bizId)) {
            // Save the master administrator first
            iDingTalkIsvEventService.handleOrgSuiteAuthEvent(bizId, event);
            // Resynchronize other members
            TaskManager.me().execute(() -> iDingTalkIsvEventService.handleOrgSuiteChangeEvent(bizId, event));
        }
        else {
            String spaceId = iSocialTenantBindService.getTenantBindSpaceId(corpId, bizId);
            if (!iSpaceService.isContactSyncing(spaceId)) {
                iDingTalkIsvEventService.handleOrgSuiteChangeEvent(bizId, event);
            }
            else {
                // Put in delay queue
                rabbitSenderService.topicSend(DING_TALK_TOPIC_EXCHANGE_BUFFER, DING_TALK_ISV_HIGH_TOPIC, event,
                        Long.toString(120 * 1000));
            }
        }
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Enterprise de authorization
     *
     * @param bizId Suite suite id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onSuiteRelieveEvent(String bizId, OrgSuiteRelieveEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        // Deactivate Tenant
        iDingTalkIsvEventService.handleOrgSuiteRelieveEvent(bizId, event.getCorpId());
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Micro application enabling
     *
     * @param bizId Micro application id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgMicroAppRestoreEvent(String bizId, OrgMicroAppRestoreEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleOrgMicroAppRestoreEvent(event.getSuiteId(), event.getCorpId());
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Micro application deactivation
     *
     * @param bizId Micro application id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgMicroAppStopEvent(String bizId, OrgMicroAppStopEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleOrgMicroAppStopEvent(event.getSuiteId(), event.getCorpId());
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Delete the micro application and retain the authorization of the enterprise to the suite
     *
     * @param bizId Micro application id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgMicroAppRemoveEvent(String bizId, OrgMicroAppRemoveEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleOrgMicroAppStopEvent(event.getSuiteId(), event.getCorpId());
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Change of visible range of micro application
     *
     * @param bizId Micro application id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgMicroAppScopeUpdateEvent(String bizId, OrgMicroAppScopeUpdateEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        // No processing is required, because the third-party application cannot obtain the visible range of the authorized address book,
        // so it is processed at org suite change
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Change of an enterprise
     *
     * @param bizId Enterprise corp id
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgUpdatedEvent(String bizId, OrgUpdateEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo  Do not process enterprise information changes
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Enterprise deletion
     *
     * @param bizId Authorized enterprise ID
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onOrgRemoveEvent(String bizId, OrgRemoveEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

}
