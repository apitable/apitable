package com.vikadata.api.enterprise.social.event.dingtalk;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.social.service.IDingTalkIsvEventService;
import com.apitable.starter.social.dingtalk.autoconfigure.annotation.DingTalkEventHandler;
import com.apitable.starter.social.dingtalk.autoconfigure.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserActiveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserAddOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserDeptChangeEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserLeaveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserModifyOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserRoleChangeEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * <p>
 * Event subscription -- general priority data, which is the latest status of enterprise employees
 * </p>
 */
@DingTalkEventHandler
@Slf4j
public class SyncHttpOrgContactUserEventHandler {
    @Resource
    private IDingTalkIsvEventService iDingTalkIsvEventService;

    /**
     * Employee information after the enterprise adds an employee event
     *
     * @param userId Employee's userid
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserAddOrgEvent(String userId, SyncHttpUserAddOrgEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Employee information after an enterprise modifies an employee event
     *
     * @param userId Employee's userid
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserModifyOrgEvent(String userId, SyncHttpUserModifyOrgEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        // Re joining the space station will push user modification events
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Employee information after the event of modifying the employee's department
     *
     * @param userId Employee's userid
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserDeptChangeEvent(String userId, SyncHttpUserDeptChangeEvent event) {
        log.info("Received Ding]Talk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Employee information after the enterprise modifies the employee's role (including administrator change) event
     *
     * @param userId Employee's userid
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserRoleChangeEvent(String userId, SyncHttpUserRoleChangeEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * The activation information after the user joins the enterprise. If the active field is true, it means it has been activated
     *
     * @param userId Employee's userid
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserActiveOrgEvent(String userId, SyncHttpUserActiveOrgEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        // The user activates the enterprise, which is equivalent to joining the enterprise, because when joining the enterprise, it is judged whether the user is activated
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * The activation information after the user joins the enterprise. If the active field is true, it means it has been activated
     *
     * @param userId Employee's userid
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserLeaveOrgEvent(String userId, SyncHttpUserLeaveOrgEvent event) {
        log.info("Received DingTalk push event:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleUserLeaveOrgEvent(userId, event);
        // The event push of DingTalk will not repeat
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
