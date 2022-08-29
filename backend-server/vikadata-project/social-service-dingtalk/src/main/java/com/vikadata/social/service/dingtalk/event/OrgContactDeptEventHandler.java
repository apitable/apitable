package com.vikadata.social.service.dingtalk.event;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.sync.http.contact.OrgDeptCreateEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.OrgDeptModifyEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.OrgDeptRemoveEvent;

import org.springframework.data.redis.core.RedisTemplate;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * <p>
 * 事件订阅 -- 普通优先级数据，企业部门的最新状态
 * </p>
 * @author zoe zheng
 * @date 2021/9/2 4:13 下午
 */
@DingTalkEventHandler
@Slf4j
public class OrgContactDeptEventHandler {
    @Resource
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 创建部门
     *
     * @param deptId 部门ID
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgDeptCreateEvent(String deptId, OrgDeptCreateEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 修改部门
     *
     * @param deptId 部门ID
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgDeptModifyEvent(String deptId, OrgDeptModifyEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业删除部门
     *
     * @param deptId 部门ID
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgDeptRemoveEvent(String deptId, OrgDeptRemoveEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
