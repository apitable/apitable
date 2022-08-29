package com.vikadata.api.modular.social.event.dingtalk;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.service.IDingTalkIsvEventService;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventHandler;
import com.vikadata.boot.autoconfigure.social.dingtalk.annotation.DingTalkEventListener;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserActiveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserAddOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserDeptChangeEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserLeaveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserModifyOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserRoleChangeEvent;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * <p>
 * 事件订阅 -- 普通优先级数据，数据为企业员工的最新状态
 * </p>
 * @author zoe zheng
 * @date 2021/9/2 4:13 下午
 */
@DingTalkEventHandler
@Slf4j
public class SyncHttpOrgContactUserEventHandler {
    @Resource
    private IDingTalkIsvEventService iDingTalkIsvEventService;

    /**
     * 企业增加员工事件之后的员工信息
     *
     * @param userId 员工的userid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserAddOrgEvent(String userId, SyncHttpUserAddOrgEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业修改员工事件之后的员工信息
     *
     * @param userId 员工的userid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserModifyOrgEvent(String userId, SyncHttpUserModifyOrgEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // 重新加入空间站，会推送用户修改事件
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业修改员工所在部门事件之后的员工信息
     *
     * @param userId 员工的userid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserDeptChangeEvent(String userId, SyncHttpUserDeptChangeEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业修改员工所在角色(包括管理员变更)事件之后的员工信息
     *
     * @param userId 员工的userid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserRoleChangeEvent(String userId, SyncHttpUserRoleChangeEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 用户加入企业后的激活信息，active字段为true时表示已激活
     *
     * @param userId 员工的userid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserActiveOrgEvent(String userId, SyncHttpUserActiveOrgEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // 用户激活企业, 相当于加入企业，因为在加入企业的时候有判断用户是否激活
        iDingTalkIsvEventService.handleUserAddOrgEvent(userId, event);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 用户加入企业后的激活信息，active字段为true时表示已激活
     *
     * @param userId 员工的userid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserLeaveOrgEvent(String userId, SyncHttpUserLeaveOrgEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleUserLeaveOrgEvent(userId, event);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
