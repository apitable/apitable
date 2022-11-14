package com.vikadata.api.enterprise.social.service.impl;

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

import com.apitable.starter.amqp.core.RabbitSenderService;
import com.apitable.starter.social.wecom.autoconfigure.WeComProperties;
import com.apitable.starter.social.wecom.autoconfigure.WeComProperties.IsvApp;
import com.vikadata.api.shared.component.notification.NotificationManager;
import com.vikadata.api.shared.component.rabbitmq.WeComRabbitConsumer;
import com.vikadata.api.shared.config.rabbitmq.TopicRabbitMqConfig;
import com.vikadata.api.enterprise.social.mapper.SocialWecomPermitDelayMapper;
import com.vikadata.api.player.ro.NotificationCreateRo;
import com.vikadata.api.enterprise.billing.service.ISocialWecomOrderService;
import com.vikadata.api.enterprise.social.enums.SocialCpIsvPermitDelayProcessStatus;
import com.vikadata.api.enterprise.social.enums.SocialCpIsvPermitDelayType;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialWecomPermitDelayService;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.entity.SocialWecomPermitDelayEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * WeCom service provider interface permission delay task processing information
 * </p>
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
        // If there is no delayed task of the same type to be processed in the enterprise, add a new delayed task
        // If it exists, it will not be added and will be handled by the existing task of the same type
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
        // Get all pending data in batches
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
                        // Interface license trial expiration notice
                        boolean isFinished = notifyBeforePermitTrialExpired(delayEntity, currentDateTime,
                                permitTrialDays, permitBuyNotifyBeforeDays, permitTrialExpiredTemplateId);
                        if (isFinished) {
                            toFinishedDelayIds.add(delayEntity.getId());
                        }
                    }
                    else if (delayEntity.getDelayType() == SocialCpIsvPermitDelayType.BUY_AFTER_SUBSCRIPTION_PAID.getValue()) {
                        // Paid enterprises purchase interface license
                        boolean isQueued = buyAfterSubscriptionPaid(delayEntity, currentDateTime, permitCompatibleDays);
                        if (isQueued) {
                            toQueuedDelayIds.add(delayEntity.getId());
                        }
                    }
                }
                skip += delayEntities.size();
            }
        } while (CollUtil.isNotEmpty(delayEntities));
        // Update sent to queue
        if (CollUtil.isNotEmpty(toQueuedDelayIds)) {
            List<SocialWecomPermitDelayEntity> updatedEntities = toQueuedDelayIds.stream()
                    .map(delayId -> SocialWecomPermitDelayEntity.builder()
                            .id(delayId)
                            .processStatus(SocialCpIsvPermitDelayProcessStatus.QUEUED.getValue())
                            .build())
                    .collect(Collectors.toList());
            updateBatchById(updatedEntities);
        }
        // Update completed
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
     * Send interface license trial expiration notice
     *
     * @param delayEntity Delay message
     * @param currentDateTime current time
     * @param permitTrialDays Time of interface license trial
     * @param permitBuyNotifyBeforeDays Days to send notifications in advance
     * @param permitTrialExpiredTemplateId Interface license free trial expiration space station notification template ID
     * @return Whether the delay message has ended
     */
    private boolean notifyBeforePermitTrialExpired(SocialWecomPermitDelayEntity delayEntity, LocalDateTime currentDateTime,
            Integer permitTrialDays, List<Integer> permitBuyNotifyBeforeDays, String permitTrialExpiredTemplateId) {
        // Trial days
        int daysPassed = (int) DateTimeUtil.between(delayEntity.getFirstAuthTime(), currentDateTime, ChronoField.EPOCH_DAY);
        // Number of days from the end of probation
        int daysToExpired = permitTrialDays - daysPassed;
        if (permitBuyNotifyBeforeDays.contains(daysToExpired)) {
            // If it is the number of days to send the notice and the payment has not been made, the notice will be sent
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
                    log.warn("Sending notification exception, notification data:" + JSONUtil.toJsonStr(notificationCreateRo), ex);
                }
            }
        }
        // After the trial, it is no longer necessary to send a notice, delaying the end of the task
        return daysToExpired <= 0;
    }

    private boolean buyAfterSubscriptionPaid(SocialWecomPermitDelayEntity delayEntity, LocalDateTime currentDateTime,
            Integer permitCompatibleDays) {
        // Trial days
        int daysPassed = (int) DateTimeUtil.between(delayEntity.getFirstAuthTime(), currentDateTime, ChronoField.EPOCH_DAY);
        if (daysPassed > permitCompatibleDays) {
            // When the specified time is reached, submit the delayed queue message
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
