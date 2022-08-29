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
 * <p>
 * 事件订阅 -- 普通优先级数据，数据为企业员工的最新状态
 * </p>
 * @author zoe zheng
 * @date 2021/9/2 4:13 下午
 */
@DingTalkEventHandler
@Slf4j
public class OrgContactUserEventHandler {
    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private IDingTalkService iDingTalkService;

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
        String corpId = event.getCorpId();
        if (!iSocialTenantUserService.isTenantUserOpenIdExist(corpId, userId)) {
            iSocialTenantUserService.create(corpId, userId, event.getUnionid());
        }
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
        String corpId = event.getCorpId();
        if (StrUtil.isBlank(event.getUnionid())) {
            log.info("[正常] - [用户没有unionId]用户「{}」不在可见范围", JSONUtil.toJsonStr(event));
        }
        else {
            if (!iSocialTenantUserService.isTenantUserOpenIdExist(corpId, userId)) {
                iSocialTenantUserService.create(corpId, userId, event.getUnionid());
            }
        }
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
        // todo
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
        String corpId = event.getCorpId();
        if (!iSocialTenantUserService.isTenantUserOpenIdExist(corpId, userId)) {
            iSocialTenantUserService.create(corpId, userId, event.getUnionid());
        }
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
        iSocialTenantUserService.deleteByTenantIdAndOpenId(event.getCorpId(), userId);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
