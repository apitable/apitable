package com.vikadata.social.service.dingtalk.event;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserActiveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserAddOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserDeptChangeEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserLeaveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserModifyOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserRoleChangeEvent;
import com.vikadata.social.service.dingtalk.service.IDingTalkService;
import com.vikadata.social.service.dingtalk.service.ISocialTenantUserService;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * Event subscription -- common priority data, the data is the latest status of enterprise employees
 */
@DingTalkEventHandler
@Slf4j
public class OrgContactUserEventHandler {
    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private IDingTalkService iDingTalkService;

    /**
     * Employee information after the company adds employee events
     *
     * @param userId employee's userid
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onUserAddOrgEvent(String userId, SyncHttpUserAddOrgEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getCorpId();
        if (!iSocialTenantUserService.isTenantUserOpenIdExist(corpId, userId)) {
            iSocialTenantUserService.create(corpId, userId, event.getUnionid());
        }
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onUserModifyOrgEvent(String userId, SyncHttpUserModifyOrgEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getCorpId();
        if (StrUtil.isBlank(event.getUnionid())) {
            log.info("[Normal] - [User has no unionId] User '{}' is not visible", JSONUtil.toJsonStr(event));
        }
        else {
            if (!iSocialTenantUserService.isTenantUserOpenIdExist(corpId, userId)) {
                iSocialTenantUserService.create(corpId, userId, event.getUnionid());
            }
        }
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onUserDeptChangeEvent(String userId, SyncHttpUserDeptChangeEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Employee information after the company modifies the role of the employee (including administrator change)
     *
     * @param userId employee's userid
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onUserRoleChangeEvent(String userId, SyncHttpUserRoleChangeEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Activation information after the user joins the enterprise. When the active field is true, it means it has been activated.
     *
     * @param userId employee's userid
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onUserActiveOrgEvent(String userId, SyncHttpUserActiveOrgEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getCorpId();
        if (!iSocialTenantUserService.isTenantUserOpenIdExist(corpId, userId)) {
            iSocialTenantUserService.create(corpId, userId, event.getUnionid());
        }
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * Activation information after the user joins the enterprise. When the active field is true, it means it has been activated.
     *
     * @param userId employee's userid
     * @param event event content
     * @return response content
     */
    @DingTalkEventListener
    public Object onUserLeaveOrgEvent(String userId, SyncHttpUserLeaveOrgEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        iSocialTenantUserService.deleteByTenantIdAndOpenId(event.getCorpId(), userId);
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
