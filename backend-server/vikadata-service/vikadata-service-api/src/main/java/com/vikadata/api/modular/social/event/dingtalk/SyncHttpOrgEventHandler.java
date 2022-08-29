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
 * 事件订阅 -- 高优先级数据，激活应用等
 * 事件订阅 -- 普通优先级数据，例如通讯录变更
 * </p>
 * @author zoe zheng
 * @date 2021/9/2 4:13 下午
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
     * 企业微应用的最新状态
     *
     * @param bizId 套件suiteid
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgSuiteAuthEvent(String bizId, OrgSuiteAuthEvent event) {
        log.info("收到ISV钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        iDingTalkIsvEventService.handleOrgSuiteAuthEvent(bizId, event);
        TaskManager.me().execute(() -> iDingTalkIsvEventService.handleOrgSuiteChangeEvent(bizId, event));
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
    public Object onOrgSuiteChangeEvent(String bizId, OrgSuiteChangeEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        String corpId = event.getCorpId();
        // 把逻辑提前，防止钉钉消息错乱之后，无法同步空间的其他成员
        if (!iSocialTenantService.isTenantExist(corpId, bizId)) {
            // 先保存主管理员
            iDingTalkIsvEventService.handleOrgSuiteAuthEvent(bizId, event);
            // 再同步其他成员
            TaskManager.me().execute(() -> iDingTalkIsvEventService.handleOrgSuiteChangeEvent(bizId, event));
        }
        else {
            String spaceId = iSocialTenantBindService.getTenantBindSpaceId(corpId, bizId);
            if (!iSpaceService.isContactSyncing(spaceId)) {
                iDingTalkIsvEventService.handleOrgSuiteChangeEvent(bizId, event);
            }
            else {
                // 放入延迟队列
                rabbitSenderService.topicSend(DING_TALK_TOPIC_EXCHANGE_BUFFER, DING_TALK_ISV_HIGH_TOPIC, event,
                        Long.toString(120 * 1000));
            }
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
        // 停用租户
        iDingTalkIsvEventService.handleOrgSuiteRelieveEvent(bizId, event.getCorpId());
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
        iDingTalkIsvEventService.handleOrgMicroAppRestoreEvent(event.getSuiteId(), event.getCorpId());
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
        iDingTalkIsvEventService.handleOrgMicroAppStopEvent(event.getSuiteId(), event.getCorpId());
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
        iDingTalkIsvEventService.handleOrgMicroAppStopEvent(event.getSuiteId(), event.getCorpId());
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
        // 无需处理，因为这里第三方应用无法获取授权通讯录的可见范围，所以在org_suite_change那里进行处理
        // 钉钉的事件推送不会重复
        return DING_TALK_CALLBACK_SUCCESS;
    }

    /**
     * 企业变更
     *
     * @param bizId 企业的corpid。
     * @param event 事件内容
     * @return 响应内容
     */
    @DingTalkEventListener
    public Object onOrgUpdatedEvent(String bizId, OrgUpdateEvent event) {
        log.info("收到钉钉推送事件:[{}:{}]", event.getEventType(), event.getSyncAction());
        // todo  不处理企业信息变更
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
