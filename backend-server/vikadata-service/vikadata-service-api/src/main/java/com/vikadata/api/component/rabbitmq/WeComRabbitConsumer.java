package com.vikadata.api.component.rabbitmq;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoField;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.rabbitmq.client.Channel;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayProcessStatus;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitDelayService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitOrderService;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties.IsvApp;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialWecomPermitDelayEntity;
import com.vikadata.entity.SocialWecomPermitOrderEntity;
import com.vikadata.integration.rabbitmq.RabbitSenderService;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 企业微信 MQ 消费者
 * </p>
 *
 * @author 刘斌华
 * @date 2022-02-24 10:45:15
 */
@Component
@Slf4j
public class WeComRabbitConsumer extends AbstractSocialRabbitConsumer {

    /**
     * 企微服务商事件延时消费时间，1s
     */
    public static final String DLX_MILLIS_ISV_MESSAGE = Integer.toString(1000);

    /**
     * 企微服务商接口许可延时消费时间，1h
     */
    public static final String DLX_MILLIS_ISV_PERMIT_DELAY = Integer.toString(60 * 60 * 1000);

    private static final String LOCK_PREFIX_ISV_MESSAGE = "isv_message_";

    private static final String LOCK_PREFIX_ISV_PERMIT_DELAY = "isv_permit_delay_";

    @Autowired(required = false)
    private WeComProperties weComProperties;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Autowired(required = false)
    private RabbitSenderService rabbitSenderService;

    @Resource
    private IBundleService bundleService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialCpIsvPermitService socialCpIsvPermitService;

    @Resource
    private ISocialWecomPermitDelayService socialWecomPermitDelayService;

    @Resource
    private ISocialWecomPermitOrderService socialWecomPermitOrderService;

    @Resource
    private ISocialCpIsvMessageService iSocialCpIsvMessageService;

    @RabbitListener(queues = TopicRabbitMqConfig.WECOM_ISV_EVENT_TOPIC_QUEUE_DEAD)
    @Deprecated
    public void isvMessageProcess(SocialCpIsvMessageEntity mqMessage, Message message, Channel channel)
            throws IOException {
        Long id = mqMessage.getId();
        String authCorpId = mqMessage.getAuthCorpId();
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        log.info("{} received message: {}, and delivery tag: {}",
                TopicRabbitMqConfig.WECOM_ISV_EVENT_TOPIC_QUEUE_DEAD, JSONUtil.toJsonStr(mqMessage), deliveryTag);
        try {
            Lock lock = redisLockRegistry.obtain(LOCK_PREFIX_ISV_MESSAGE + authCorpId);
            if (lock.tryLock(WAIT_LOCK_MILLIS, TimeUnit.MILLISECONDS)) {
                try {
                    SocialCpIsvMessageEntity unprocessedInfo = socialCpIsvMessageService.getById(id);
                    socialCpIsvMessageService.doUnprocessedInfo(unprocessedInfo);
                }
                finally {
                    lock.unlock();
                }
            }
            else {
                // 获取锁失败，重新放入缓冲队列等待执行
                rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                        TopicRabbitMqConfig.WECOM_ISV_EVENT_TOPIC_ROUTING_KEY,
                        mqMessage, DLX_MILLIS_ISV_MESSAGE);
            }
        }
        catch (InterruptedException ex) {
            log.error("[" + authCorpId + "]租户锁操作失败", ex);
            // 将消息改成处理失败状态
            socialCpIsvMessageService.updateById(SocialCpIsvMessageEntity.builder()
                    .id(id)
                    .processStatus(SocialCpIsvMessageProcessStatus.REJECT_TEMPORARILY.getValue())
                    .build());
        }
        catch (Exception ex) {
            log.error(String.format("租户[%s]处理事件[%s]失败,火速解决", authCorpId, mqMessage.getInfoType()), ex);
            // 将消息改成处理失败状态
            socialCpIsvMessageService.updateById(SocialCpIsvMessageEntity.builder()
                    .id(id)
                    .processStatus(SocialCpIsvMessageProcessStatus.REJECT_TEMPORARILY.getValue())
                    .build());
        }
        finally {
            channel.basicAck(deliveryTag, false);
        }
    }

    @RabbitListener(queues = TopicRabbitMqConfig.WECOM_ISV_EVENT_QUEUE)
    public void handleIsvMessage(SocialCpIsvMessageEntity mqMessage, Message message, Channel channel) throws IOException {
        Long id = mqMessage.getId();
        String authCorpId = mqMessage.getAuthCorpId();
        String appId = mqMessage.getSuiteId();
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        log.info("wecom isv received message:{}:{}", authCorpId, message.getMessageProperties().getMessageId());
        // ack first in order not to block the queue
        channel.basicAck(deliveryTag, false);
        Lock lock = getTenantEventLock(authCorpId, mqMessage.getSuiteId());
        boolean locked = false;
        try {
            // prevent execution time from exceeding the lock's execution time
            if (!tenantEventOnProcessing(authCorpId, appId) && (locked = lock.tryLock(WAIT_LOCK_MILLIS,
                    TimeUnit.MILLISECONDS))) {
                setTenantEventOnProcessing(authCorpId, appId, id.toString());
                // handing
                SocialCpIsvMessageEntity unprocessedInfo = socialCpIsvMessageService.getById(id);
                socialCpIsvMessageService.doUnprocessedInfo(unprocessedInfo);
                // handle success
                socialCpIsvMessageService.updateStatusById(id, SocialCpIsvMessageProcessStatus.SUCCESS);
                setTenantEventOnProcessed(authCorpId, appId);
                log.info("wecom isv event handle done:{}:{}", authCorpId, id);
            }
            else {
                // tenant event is handing
                String preMessageId = getTenantEventOnProcessingId(authCorpId, appId);
                log.warn("wecom isv event handle busy:{}:{}:{}", authCorpId, preMessageId, id);
                iSocialCpIsvMessageService.sendToMq(id, mqMessage.getInfoType(), mqMessage.getAuthCorpId(),
                        mqMessage.getSuiteId());
                socialCpIsvMessageService.updateStatusById(id, SocialCpIsvMessageProcessStatus.REJECT_TEMPORARILY);
            }
        }
        catch (Exception ex) {
            log.error("wecom isv event handle error:{}:{}", authCorpId, id, ex);
            // handle error
            socialCpIsvMessageService.updateStatusById(id, SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY);
            setTenantEventOnProcessed(authCorpId, appId);
        }
        finally {
            // must be the last line because it may be throw exception
            if (locked) {
                try {
                    lock.unlock();
                }
                catch (Exception e) {
                    log.warn("wecom isv unlock error:{}:{}", authCorpId, id, e);
                }
            }
        }
    }

    @RabbitListener(queues = TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_QUEUE_DEAD)
    @Deprecated
    public void isvPermitDelayProcess(SocialWecomPermitDelayEntity mqMessage, Message message, Channel channel)
            throws IOException {
        Long id = mqMessage.getId();
        String authCorpId = mqMessage.getAuthCorpId();
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        log.info("{} received message: {}, and delivery tag: {}",
                TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_QUEUE_DEAD, JSONUtil.toJsonStr(mqMessage), deliveryTag);

        try {
            Lock lock = redisLockRegistry.obtain(LOCK_PREFIX_ISV_PERMIT_DELAY + authCorpId);
            if (lock.tryLock(WAIT_LOCK_MILLIS, TimeUnit.MILLISECONDS)) {
                try {
                    SocialWecomPermitDelayEntity delayEntity = socialWecomPermitDelayService.getById(id);
                    if (Objects.isNull(delayEntity)) {
                        log.warn(String.format("企微服务商接口许可延时任务不存在，企业 ID：%s，任务 ID：%s", authCorpId, id));
                        // 延时任务不存在，直接结束
                        socialWecomPermitDelayService.updateById(SocialWecomPermitDelayEntity.builder()
                                .id(id)
                                .processStatus(SocialCpIsvPermitDelayProcessStatus.FINISHED.getValue())
                                .build());
                    }
                    else {
                        SocialCpIsvPermitDelayProcessStatus processStatus = SocialCpIsvPermitDelayProcessStatus.fromStatusValue(delayEntity.getProcessStatus());
                        switch (processStatus) {
                            case PENDING:
                            case QUEUED:
                                // 待处理
                                isvPermitDelayPending(delayEntity);
                                break;
                            case ORDER_CREATED:
                                // 已下单
                                isvPermitDelayOrderCreated(delayEntity);
                                break;
                            case FINISHED:
                                // 已完成，无需做任何处理
                                break;
                            default:
                                log.error(String.format("企微服务商接口许可延时任务状态异常，企业 ID：%s，任务 ID：%s，状态：%s", authCorpId, id, processStatus));
                        }
                    }
                }
                finally {
                    lock.unlock();
                }
            }
            else {
                // 获取锁失败，重新放入缓冲队列等待执行
                rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                        TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                        mqMessage, DLX_MILLIS_ISV_PERMIT_DELAY);
            }
        }
        catch (Exception ex) {
            log.error(String.format("企微服务商接口许可延时任务处理失败，企业 ID：%s，任务 ID：%s", authCorpId, id), ex);
            // 失败返回延时队列等待重试
            rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                    TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                    SocialWecomPermitDelayEntity.builder()
                            .id(id)
                            .authCorpId(authCorpId)
                            .build(),
                    DLX_MILLIS_ISV_PERMIT_DELAY);
        }
        finally {
            channel.basicAck(deliveryTag, false);
        }
    }

    private void isvPermitDelayPending(SocialWecomPermitDelayEntity delayEntity) {
        String suiteId = delayEntity.getSuiteId();
        String authCorpId = delayEntity.getAuthCorpId();
        int permitCompatibleDays = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                .findFirst()
                .map(IsvApp::getPermitCompatibleDays)
                .orElse(0);
        LocalDateTime currentDateTime = DateTimeUtil.localDateTimeNow(8);
        if (DateTimeUtil.between(delayEntity.getFirstAuthTime(), currentDateTime, ChronoField.EPOCH_DAY) <= permitCompatibleDays) {
            // 还未到接口许可下单时间，返回延时队列
            rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                    TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                    SocialWecomPermitDelayEntity.builder()
                            .id(delayEntity.getId())
                            .authCorpId(authCorpId)
                            .build(),
                    DLX_MILLIS_ISV_PERMIT_DELAY);
        }
        else {
            // 下单购买接口许可
            String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
            Bundle activeBundle = bundleService.getActivatedBundleBySpaceId(spaceId);
            if (Objects.isNull(activeBundle) || activeBundle.getBaseSubscription().getPhase() != SubscriptionPhase.FIXEDTERM) {
                // 非付费订阅，延时任务结束
                socialWecomPermitDelayService.updateById(SocialWecomPermitDelayEntity.builder()
                        .id(delayEntity.getId())
                        .processStatus(SocialCpIsvPermitDelayProcessStatus.FINISHED.getValue())
                        .build());
            }
            else {
                List<SocialWecomPermitOrderEntity> orderEntities = socialWecomPermitOrderService
                        .getByOrderStatuses(suiteId, authCorpId, Collections.singletonList(0));
                if (CollUtil.isNotEmpty(orderEntities)) {
                    // 存在待支付的订单，返回延时队列
                    rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                            TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                            SocialWecomPermitDelayEntity.builder()
                                    .id(delayEntity.getId())
                                    .authCorpId(authCorpId)
                                    .build(),
                            DLX_MILLIS_ISV_PERMIT_DELAY);
                }
                else {
                    boolean isNeedNewOrRenewal = socialCpIsvPermitService.createPermitOrder(suiteId, authCorpId, spaceId,
                            activeBundle.getBaseSubscription().getExpireDate());
                    if (isNeedNewOrRenewal) {
                        // 更改状态为已下单，并返回延时队列
                        socialWecomPermitDelayService.updateById(SocialWecomPermitDelayEntity.builder()
                                .id(delayEntity.getId())
                                .processStatus(SocialCpIsvPermitDelayProcessStatus.ORDER_CREATED.getValue())
                                .build());
                        rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                                TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                                SocialWecomPermitDelayEntity.builder()
                                        .id(delayEntity.getId())
                                        .authCorpId(authCorpId)
                                        .build(),
                                DLX_MILLIS_ISV_PERMIT_DELAY);
                    }
                    else {
                        // 没有需要新购和续费的账号，延时任务结束
                        socialWecomPermitDelayService.updateById(SocialWecomPermitDelayEntity.builder()
                                .id(delayEntity.getId())
                                .processStatus(SocialCpIsvPermitDelayProcessStatus.FINISHED.getValue())
                                .build());
                    }
                }
            }
        }
    }

    private void isvPermitDelayOrderCreated(SocialWecomPermitDelayEntity delayEntity) {
        // 1 获取所有企业所有待支付的订单
        Long delayId = delayEntity.getId();
        String suiteId = delayEntity.getSuiteId();
        String authCorpId = delayEntity.getAuthCorpId();
        List<SocialWecomPermitOrderEntity> orderEntities = socialWecomPermitOrderService
                .getByOrderStatuses(suiteId, authCorpId, Collections.singletonList(0));
        if (CollUtil.isEmpty(orderEntities)) {
            // 订单不存在，延时任务结束
            socialWecomPermitDelayService.updateById(SocialWecomPermitDelayEntity.builder()
                    .id(delayId)
                    .processStatus(SocialCpIsvPermitDelayProcessStatus.FINISHED.getValue())
                    .build());
            return;
        }
        // 判断延时任务是否结束，只要有订单未完成则不能结束
        boolean isFinished = true;
        for (SocialWecomPermitOrderEntity orderEntity : orderEntities) {
            String orderId = orderEntity.getOrderId();
            // 2 确认订单的最新信息
            orderEntity = socialCpIsvPermitService.ensureOrder(orderId);
            // 订单的最新状态
            int orderStatus = orderEntity.getOrderStatus();
            if (orderStatus == 0 || orderStatus == 4) {
                // 2.1 待支付、申请退款中，返回延时队列
                isFinished = false;
                if (orderStatus == 0) {
                    IsvApp isvApp = weComProperties.getIsvAppList().stream()
                            .filter(isv -> isv.getSuiteId().equals(suiteId))
                            .findFirst()
                            .orElse(null);
                    LocalTime permitNotifyTimeStart = DateTimeUtil
                            .localTimeFromSource(isvApp.getPermitNotifyTimeStart(), DateTimeUtil.HOUR_MINUTE_ZONE);
                    LocalTime permitNotifyTimeEnd = DateTimeUtil
                            .localTimeFromSource(isvApp.getPermitNotifyTimeEnd(), DateTimeUtil.HOUR_MINUTE_ZONE);
                    LocalTime currentTime = DateTimeUtil.localTimeNow(8);
                    if (!currentTime.isBefore(permitNotifyTimeStart) && !currentTime.isAfter(permitNotifyTimeEnd)) {
                        // 未支付时每天都在指定时间内发送通知
                        int orderType = orderEntity.getOrderType();
                        if (orderType == 1) {
                            socialCpIsvPermitService.sendNewWebhook(suiteId, authCorpId, null, orderId, null);
                        }
                        else if (orderType == 2) {
                            socialCpIsvPermitService.sendRenewWebhook(suiteId, authCorpId, null, orderId);
                        }
                    }
                }
            }
            else if (orderStatus == 1 || orderStatus == 6) {
                // 2.2 已支付、退款被拒绝
                if (orderEntity.getOrderType() == 1) {
                    // 2.2.1 新购订单，激活账号
                    socialCpIsvPermitService.activateOrder(orderId);
                }
            }
            else if (orderStatus == 5) {
                // 2.4 退款成功，确认账号状态
                socialCpIsvPermitService.ensureAllActiveCodes(delayEntity.getSuiteId(), delayEntity.getAuthCorpId());
            }
        }
        if (isFinished) {
            socialWecomPermitDelayService.updateById(SocialWecomPermitDelayEntity.builder()
                    .id(delayId)
                    .processStatus(SocialCpIsvPermitDelayProcessStatus.FINISHED.getValue())
                    .build());
        }
        else {
            // 返回延时队列
            rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                    TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                    SocialWecomPermitDelayEntity.builder()
                            .id(delayId)
                            .authCorpId(delayEntity.getAuthCorpId())
                            .build(),
                    DLX_MILLIS_ISV_PERMIT_DELAY);
        }
    }

}
