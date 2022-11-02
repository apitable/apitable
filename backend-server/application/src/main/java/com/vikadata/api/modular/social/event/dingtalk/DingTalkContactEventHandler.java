package com.vikadata.api.modular.social.event.dingtalk;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.service.IDingTalkEventService;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.contact.OrgDeptCreateEvent;
import com.vikadata.social.dingtalk.event.contact.OrgDeptModifyEvent;
import com.vikadata.social.dingtalk.event.contact.OrgDeptRemoveEvent;
import com.vikadata.social.dingtalk.event.contact.UserActiveOrgEvent;
import com.vikadata.social.dingtalk.event.contact.UserAddOrgEvent;
import com.vikadata.social.dingtalk.event.contact.UserLeaveOrgEvent;
import com.vikadata.social.dingtalk.event.contact.UserModifyOrgEvent;

/**
 * <p>
 * DingTalk
 * Event subscription - address book event
 * </p>
 */
@DingTalkEventHandler
@Slf4j
public class DingTalkContactEventHandler {

    @Resource
    private IDingTalkEventService iDingTalkEventService;

    /**
     * User Activation
     *
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserActiveOrgEvent(String agentId, UserActiveOrgEvent event) {
        log.info("Nail received event [Employee Activation]: {}", JSONUtil.toJsonStr(event));
        if (event.getUserId() != null) {
            // The event push of nailing will not repeat
            event.getUserId().forEach(userId -> iDingTalkEventService.handleUserActiveOrg(agentId,
                    event.getCorpId(), userId));
        }
        return agentId;
    }

    /**
     * Employee joining the enterprise
     *
     * @param event Event content
     * @return Response content
     */
    @DingTalkEventListener
    public Object onUserAddOrgEvent(String agentId, UserAddOrgEvent event) {
        log.info("Ding Talk received the event [Employee joining the enterprise]:{}:{}", agentId, JSONUtil.toJsonStr(event));
        // The event push of nailing will not repeat
        event.getUserId().forEach(userId -> iDingTalkEventService.handleUserActiveOrg(agentId,
                event.getCorpId(), userId));
        return agentId;
    }

    /**
     * Employee Resignation
     *
     * @param event Employee resignation event content body
     * @return any
     */
    @DingTalkEventListener
    public Object onUserLeaveOrgEvent(String agentId, UserLeaveOrgEvent event) {
        log.info("DingTalk received the event [Employee Resignation] ：{}", JSONUtil.toJsonStr(event));
        event.getUserId().forEach(userId -> iDingTalkEventService.handUserLeaveOrg(agentId,
                event.getCorpId(), userId));
        return agentId;
    }

    /**
     * Employee information change
     *
     * @param event Address Book User Change
     * @return any
     */
    @DingTalkEventListener
    public Object onUserModifyOrgEvent(String agentId, UserModifyOrgEvent event) {
        log.info("DingTalk received event [Address Book User Change]:{}", JSONUtil.toJsonStr(event));
        event.getUserId().forEach(userId -> iDingTalkEventService.handleUserModifyOrg(agentId,
                event.getCorpId(), userId));
        return agentId;
    }

    /**
     * New Department
     *
     * @param event New Department Event Content Body
     * @return any
     */
    @DingTalkEventListener
    public Object onOrgDeptCreateEvent(String agentId, OrgDeptCreateEvent event) {
        log.info("DingTalk received event [New Department]:{}:{}", agentId, JSONUtil.toJsonStr(event));
        if (StrUtil.isBlank(agentId)) {
            return agentId;
        }
        event.getDeptId().forEach(deptId -> iDingTalkEventService.handleOrgDeptCreate(agentId,
                event.getCorpId(), Long.parseLong(deptId)));
        return agentId;
    }

    /**
     * Address book enterprise department modification
     *
     * @param event  Event content body
     * @return any
     */
    @DingTalkEventListener
    public Object OnOrgDeptModifyEvent(String agentId, OrgDeptModifyEvent event) {
        log.info("DingTalk received event [Edit Department] ：{}", JSONUtil.toJsonStr(event));
        event.getDeptId().forEach(deptId -> iDingTalkEventService.handleOrgDeptModify(agentId,
                event.getCorpId(), Long.parseLong(deptId)));
        return agentId;
    }

    /**
     * Address book enterprise department deletion
     *
     * @param event  Event content body
     * @return any
     */
    @DingTalkEventListener
    public Object OnOrgDeptRemoveEvent(String agentId, OrgDeptRemoveEvent event) {
        log.info("DingTalk received event [Delete Department]:{}:{}", agentId, JSONUtil.toJsonStr(event));
        if (StrUtil.isBlank(agentId)) {
            return agentId;
        }
        event.getDeptId().forEach(deptId -> iDingTalkEventService.handleOrgDeptRemove(agentId,
                event.getCorpId(), Long.parseLong(deptId)));
        return agentId;
    }
}
