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
 * 钉钉
 * 事件订阅 - 通讯录事件
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 4:36 下午
 */
@DingTalkEventHandler
@Slf4j
public class DingTalkContactEventHandler {

    @Resource
    private IDingTalkEventService iDingTalkEventService;

    /**
     * 用户激活
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserActiveOrgEvent(String agentId, UserActiveOrgEvent event) {
        log.info("钉钉收到事件 [员工激活] ：{}", JSONUtil.toJsonStr(event));
        if (event.getUserId() != null) {
            // 钉钉的事件推送不会重复
            event.getUserId().forEach(userId -> iDingTalkEventService.handleUserActiveOrg(agentId,
                    event.getCorpId(), userId));
        }
        return agentId;
    }

    /**
     * 员工加入企业
     *
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onUserAddOrgEvent(String agentId, UserAddOrgEvent event) {
        log.info("钉钉收到事件[员工加入企业]:{}:{}", agentId, JSONUtil.toJsonStr(event));
        // 钉钉的事件推送不会重复
        event.getUserId().forEach(userId -> iDingTalkEventService.handleUserActiveOrg(agentId,
                event.getCorpId(), userId));
        return agentId;
    }

    /**
     * 员工离职
     *
     * @param event 员工离职 事件内容体
     * @return any
     */
    @DingTalkEventListener
    public Object onUserLeaveOrgEvent(String agentId, UserLeaveOrgEvent event) {
        log.info("钉钉收到事件 [员工离职] ：{}", JSONUtil.toJsonStr(event));
        event.getUserId().forEach(userId -> iDingTalkEventService.handUserLeaveOrg(agentId,
                event.getCorpId(), userId));
        return agentId;
    }

    /**
     * 员工信息更改
     *
     * @param event 通讯录用户更改
     * @return any
     */
    @DingTalkEventListener
    public Object onUserModifyOrgEvent(String agentId, UserModifyOrgEvent event) {
        log.info("钉钉收到事件 [通讯录用户更改]:{}", JSONUtil.toJsonStr(event));
        event.getUserId().forEach(userId -> iDingTalkEventService.handleUserModifyOrg(agentId,
                event.getCorpId(), userId));
        return agentId;
    }

    /**
     * 新建部门
     *
     * @param event 新建部门 事件内容体
     * @return any
     */
    @DingTalkEventListener
    public Object onOrgDeptCreateEvent(String agentId, OrgDeptCreateEvent event) {
        log.info("钉钉收到事件[新建部门]:{}:{}", agentId, JSONUtil.toJsonStr(event));
        if (StrUtil.isBlank(agentId)) {
            return agentId;
        }
        event.getDeptId().forEach(deptId -> iDingTalkEventService.handleOrgDeptCreate(agentId,
                event.getCorpId(), Long.parseLong(deptId)));
        return agentId;
    }

    /**
     * 通讯录企业部门修改
     *
     * @param event  事件内容体
     * @return any
     */
    @DingTalkEventListener
    public Object OnOrgDeptModifyEvent(String agentId, OrgDeptModifyEvent event) {
        log.info("钉钉收到事件 [修改部门] ：{}", JSONUtil.toJsonStr(event));
        event.getDeptId().forEach(deptId -> iDingTalkEventService.handleOrgDeptModify(agentId,
                event.getCorpId(), Long.parseLong(deptId)));
        return agentId;
    }

    /**
     * 通讯录企业部门删除
     *
     * @param event  事件内容体
     * @return any
     */
    @DingTalkEventListener
    public Object OnOrgDeptRemoveEvent(String agentId, OrgDeptRemoveEvent event) {
        log.info("钉钉收到事件 [删除部门]:{}:{}", agentId, JSONUtil.toJsonStr(event));
        if (StrUtil.isBlank(agentId)) {
            return agentId;
        }
        event.getDeptId().forEach(deptId -> iDingTalkEventService.handleOrgDeptRemove(agentId,
                event.getCorpId(), Long.parseLong(deptId)));
        return agentId;
    }
}
