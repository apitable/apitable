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
 * <p>
 * 事件订阅 -- 高优先级数据，激活应用等
 * 事件订阅 -- 普通优先级数据，例如通讯录变更
 * </p>
 * @author zoe zheng
 * @date 2021/9/2 4:13 下午
 */
@DingTalkEventHandler
@Slf4j
public class OrgEventHandler {
    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private IDingTalkService iDingTalkService;

    /**
     * 企业微应用的最新状态
     *
     * @param bizId 套件suiteid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgSuiteAuthEvent(String bizId, OrgSuiteAuthEvent event) {
        log.info("收到ISV钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getAuthCorpInfo().getCorpid();
        // 获取授权企业信息，ticket会抛出IllegalStateException异常,在获取的
        DingTalkServerAuthInfoResponse authCorpInfo = iDingTalkService.getAuthCorpInfo(bizId, corpId);
        if (authCorpInfo != null) {
            // 重新授权的时候需要强制刷新授权企业的access_token，不然会报错
            iDingTalkService.refreshAccessToken(bizId, corpId);
            // 矫正agentId，钉钉会存在agentId异常的情况
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
        // 激活应用
        iDingTalkService.activeSuite(bizId, corpId, event.getPermanentCode());
        iSocialTenantService.createTenant(SocialAppType.ISV, bizId, 1, event);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 表示企业变更授权范围
     *
     * @param bizId 套件suiteid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onSuiteChangeEvent(String bizId, OrgSuiteChangeEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getAuthCorpInfo().getCorpid();
        if (!iSocialTenantService.isTenantAppExist(corpId, bizId)) {
            // 激活应用
            iDingTalkService.activeSuite(bizId, corpId, event.getPermanentCode());
            iSocialTenantService.createTenant(SocialAppType.ISV, bizId, 1, event);
        }
        else {
            iSocialTenantService.updateTenantAuthInfo(event.getCorpId(), bizId, event);
        }
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业解除授权
     *
     * @param bizId 套件suiteid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onSuiteRelieveEvent(String bizId, OrgSuiteRelieveEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // 删除租户
        iSocialTenantService.updateTenantIsDeleteStatus(event.getCorpId(), bizId, true);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 微应用启用
     *
     * @param bizId 微应用的appid。
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgMicroAppRestoreEvent(String bizId, OrgMicroAppRestoreEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        iSocialTenantService.updateTenantStatus(event.getCorpId(), event.getSuiteId(), true);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 微应用停用
     *
     * @param bizId 微应用的appid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgMicroAppStopEvent(String bizId, OrgMicroAppStopEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        iSocialTenantService.updateTenantStatus(event.getCorpId(), event.getSuiteId(), false);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 微应用删除，保留企业对套件的授权
     *
     * @param bizId 微应用的appid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgMicroAppRemoveEvent(String bizId, OrgMicroAppRemoveEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        iSocialTenantService.updateTenantStatus(event.getCorpId(), event.getSuiteId(), false);
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 微应用可见范围变更
     *
     * @param bizId 微应用的appid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgMicroAppScopeUpdateEvent(String bizId, OrgMicroAppScopeUpdateEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业变更
     *
     * @param bizId 授权企业ID
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgUpdatedEvent(String bizId, OrgUpdateEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业删除
     *
     * @param bizId 授权企业ID
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgRemoveEvent(String bizId, OrgRemoveEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }
}
