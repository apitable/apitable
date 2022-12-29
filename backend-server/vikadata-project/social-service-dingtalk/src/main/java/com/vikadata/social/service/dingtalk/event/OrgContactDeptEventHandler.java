package com.vikadata.social.service.dingtalk.event;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.social.dingtalk.autoconfigure.annotation.DingTalkEventHandler;
import com.apitable.starter.social.dingtalk.autoconfigure.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.sync.http.contact.OrgDeptCreateEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.OrgDeptModifyEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.OrgDeptRemoveEvent;

import org.springframework.data.redis.core.RedisTemplate;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * Event Subscriptions -- general priority data, the latest status of the corporate sector
 */
@DingTalkEventHandler
@Slf4j
public class OrgContactDeptEventHandler {
    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @DingTalkEventListener
    public Object onOrgDeptCreateEvent(String deptId, OrgDeptCreateEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onOrgDeptModifyEvent(String deptId, OrgDeptModifyEvent event) {
        log.info("Received DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }

    @DingTalkEventListener
    public Object onOrgDeptRemoveEvent(String deptId, OrgDeptRemoveEvent event) {
        log.info("Receive DingTalk push event: [{}:{}]", event.getEventType(), event.getSyncAction());
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
