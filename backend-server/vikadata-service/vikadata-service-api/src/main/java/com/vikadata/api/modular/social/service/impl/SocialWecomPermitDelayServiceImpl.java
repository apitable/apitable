package com.vikadata.api.modular.social.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.rabbitmq.WeComRabbitConsumer;
import com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig;
import com.vikadata.api.model.ro.player.NotificationCreateRo;
import com.vikadata.api.modular.finance.service.ISocialWecomOrderService;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayProcessStatus;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayType;
import com.vikadata.api.modular.social.mapper.SocialWecomPermitDelayMapper;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitDelayService;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties.IsvApp;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.entity.SocialWecomPermitDelayEntity;
import com.vikadata.integration.rabbitmq.RabbitSenderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 企微服务商接口许可延时任务处理信息
 * </p>
 *
 * @author 刘斌华
 * @date 2022-07-19 09:51:38
 */
@Slf4j
@Service
public class SocialWecomPermitDelayServiceImpl extends ServiceImpl<SocialWecomPermitDelayMapper, SocialWecomPermitDelayEntity> implements ISocialWecomPermitDelayService {

    @Autowired(required = false)
    private WeComProperties weComProperties;

    @Autowired(required = false)
    private RabbitSenderService rabbitSenderService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialWecomOrderService socialWecomOrderService;

    @Override
    public SocialWecomPermitDelayEntity addAuthCorp(String suiteId, String authCorpId,
            LocalDateTime firstAuthTime, Integer delayType, Integer processStatus) {
        List<SocialWecomPermitDelayEntity> delayEntities = getByProcessStatuses(suiteId, authCorpId, delayType,
                Collections.singletonList(SocialCpIsvPermitDelayProcessStatus.PENDING.getValue()));
        // 如果企业不存在待处理的同类型延时任务，则新增延时任务
        // 如果存在则不添加，交由已存在的同类型任务处理
        if (CollUtil.isEmpty(delayEntities)) {
            SocialWecomPermitDelayEntity delayEntity = SocialWecomPermitDelayEntity.builder()
                    .suiteId(suiteId)
                    .authCorpId(authCorpId)
                    .firstAuthTime(firstAuthTime)
                    .delayType(delayType)
                    .processStatus(processStatus)
                    .build();
            save(delayEntity);
            return delayEntity;
        }
        return null;
    }

    @Override
    public List<SocialWecomPermitDelayEntity> getByProcessStatuses(String suiteId, String authCorpId, Integer delayType, List<Integer> processStatuses) {
        return getBaseMapper().selectByProcessStatuses(suiteId, authCorpId, delayType, processStatuses);
    }

    @Override
    public List<SocialWecomPermitDelayEntity> getBySuiteIdAndProcessStatus(String suiteId, Integer processStatus, Integer skip, Integer limit) {
        return getBaseMapper().selectBySuiteIdAndProcessStatus(suiteId, processStatus, skip, limit);
    }

    @Override
    public void batchProcessPending(String suiteId) {
        LocalDateTime currentDateTime = DateTimeUtil.localDateTimeNow(8);
        Integer permitTrialDays = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                .findFirst()
                .map(IsvApp::getPermitTrialDays)
                .orElse(null);
        List<Integer> permitBuyNotifyBeforeDays = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                .findFirst()
                .map(isvApp -> CharSequenceUtil.split(isvApp.getPermitBuyNotifyBeforeDays(), ',').stream()
                        .map(Integer::parseInt)
                        .collect(Collectors.toList()))
                .orElse(null);
        Integer permitCompatibleDays = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                .findFirst()
                .map(IsvApp::getPermitCompatibleDays)
                .orElse(null);
        String permitTrialExpiredTemplateId = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                .findFirst()
                .map(IsvApp::getPermitTrialExpiredTemplateId)
                .orElse(null);
        // 分批次取出所有待处理数据
        int processStatus = SocialCpIsvPermitDelayProcessStatus.PENDING.getValue();
        int skip = 0;
        int limit = 1000;
        List<SocialWecomPermitDelayEntity> delayEntities;
        List<Long> toQueuedDelayIds = Lists.newArrayList();
        List<Long> toFinishedDelayIds = Lists.newArrayList();
        do {
            delayEntities = getBySuiteIdAndProcessStatus(suiteId, processStatus, skip, limit);
            if (CollUtil.isNotEmpty(delayEntities)) {
                for (SocialWecomPermitDelayEntity delayEntity : delayEntities) {
                    if (delayEntity.getDelayType() == SocialCpIsvPermitDelayType.NOTIFY_BEFORE_TRIAL_EXPIRED.getValue()) {
                        // 接口许可试用过期通知
                        boolean isFinished = notifyBeforePermitTrialExpired(delayEntity, currentDateTime,
                                permitTrialDays, permitBuyNotifyBeforeDays, permitTrialExpiredTemplateId);
                        if (isFinished) {
                            toFinishedDelayIds.add(delayEntity.getId());
                        }
                    }
                    else if (delayEntity.getDelayType() == SocialCpIsvPermitDelayType.BUY_AFTER_SUBSCRIPTION_PAID.getValue()) {
                        // 付费企业购买接口许可
                        boolean isQueued = buyAfterSubscriptionPaid(delayEntity, currentDateTime, permitCompatibleDays);
                        if (isQueued) {
                            toQueuedDelayIds.add(delayEntity.getId());
                        }
                    }
                }
                skip += delayEntities.size();
            }
        } while (CollUtil.isNotEmpty(delayEntities));
        // 更新已发送到队列
        if (CollUtil.isNotEmpty(toQueuedDelayIds)) {
            List<SocialWecomPermitDelayEntity> updatedEntities = toQueuedDelayIds.stream()
                    .map(delayId -> SocialWecomPermitDelayEntity.builder()
                            .id(delayId)
                            .processStatus(SocialCpIsvPermitDelayProcessStatus.QUEUED.getValue())
                            .build())
                    .collect(Collectors.toList());
            updateBatchById(updatedEntities);
        }
        // 更新已完成
        if (CollUtil.isNotEmpty(toFinishedDelayIds)) {
            List<SocialWecomPermitDelayEntity> updatedEntities = toFinishedDelayIds.stream()
                    .map(delayId -> SocialWecomPermitDelayEntity.builder()
                            .id(delayId)
                            .processStatus(SocialCpIsvPermitDelayProcessStatus.FINISHED.getValue())
                            .build())
                    .collect(Collectors.toList());
            updateBatchById(updatedEntities);
        }
    }

    /**
     * 发送接口许可试用到期通知
     *
     * @param delayEntity 延时消息
     * @param currentDateTime 当前时间
     * @param permitTrialDays 接口许可试用的时间
     * @param permitBuyNotifyBeforeDays 提前发送通知的天数
     * @param permitTrialExpiredTemplateId 接口许可免费试用到期空间站通知模板 ID
     * @return 延时消息是否已经结束
     * @author 刘斌华
     * @date 2022-08-12 10:56:45
     */
    private boolean notifyBeforePermitTrialExpired(SocialWecomPermitDelayEntity delayEntity, LocalDateTime currentDateTime,
            Integer permitTrialDays, List<Integer> permitBuyNotifyBeforeDays, String permitTrialExpiredTemplateId) {
        // 已试用的天数
        int daysPassed = (int) DateTimeUtil.between(delayEntity.getFirstAuthTime(), currentDateTime, ChronoField.EPOCH_DAY);
        // 距离试用结束相差的天数
        int daysToExpired = permitTrialDays - daysPassed;
        if (permitBuyNotifyBeforeDays.contains(daysToExpired)) {
            // 如果属于需要发送通知的距离天数，并且还未付费，则发送通知
            String suiteId = delayEntity.getSuiteId();
            String authCorpId = delayEntity.getAuthCorpId();
            SocialWecomOrderEntity lastPaidOrder = socialWecomOrderService.getLastPaidOrder(suiteId, authCorpId);
            if (Objects.isNull(lastPaidOrder)) {
                String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
                NotificationCreateRo notificationCreateRo = new NotificationCreateRo();
                notificationCreateRo.setSpaceId(spaceId);
                notificationCreateRo.setTemplateId(permitTrialExpiredTemplateId);
                JSONObject body = new JSONObject();
                JSONObject extras = new JSONObject();
                extras.set("number", daysToExpired);
                body.set("extras", extras);
                notificationCreateRo.setBody(body);
                try {
                    NotificationManager.me().centerNotify(notificationCreateRo);
                }
                catch (Exception ex) {
                    log.warn("发送通知异常，通知数据：" + JSONUtil.toJsonStr(notificationCreateRo), ex);
                }
            }
        }
        // 试用结束，不再需要发送通知，延时任务结束
        return daysToExpired <= 0;
    }

    private boolean buyAfterSubscriptionPaid(SocialWecomPermitDelayEntity delayEntity, LocalDateTime currentDateTime,
            Integer permitCompatibleDays) {
        // 已试用的天数
        int daysPassed = (int) DateTimeUtil.between(delayEntity.getFirstAuthTime(), currentDateTime, ChronoField.EPOCH_DAY);
        if (daysPassed > permitCompatibleDays) {
            // 到达指定时间，提交延时队列消息
            rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                    TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                    SocialWecomPermitDelayEntity.builder()
                            .id(delayEntity.getId())
                            .authCorpId(delayEntity.getAuthCorpId())
                            .build(),
                    WeComRabbitConsumer.DLX_MILLIS_ISV_PERMIT_DELAY);
            return true;
        }
        else {
            return false;
        }
    }

}
