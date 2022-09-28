package com.vikadata.api.modular.social.service.impl;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.codec.Base64Encoder;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.crypto.digest.DigestUtil;
import cn.hutool.crypto.digest.HmacAlgorithm;
import com.google.common.collect.Lists;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.rabbitmq.WeComRabbitConsumer;
import com.vikadata.api.config.rabbitmq.TopicRabbitMqConfig;
import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitActivateStatus;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayProcessStatus;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayType;
import com.vikadata.api.modular.social.service.ISocialCpIsvPermitService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitDelayService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitOrderAccountService;
import com.vikadata.api.modular.social.service.ISocialWecomPermitOrderService;
import com.vikadata.api.modular.social.service.IsocialWecomPermitOrderAccountBindService;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties.IsvApp;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.DateTimeUtil;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SocialWecomPermitDelayEntity;
import com.vikadata.entity.SocialWecomPermitOrderAccountEntity;
import com.vikadata.entity.SocialWecomPermitOrderEntity;
import com.vikadata.integration.rabbitmq.RabbitSenderService;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvPermitServiceImpl;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchActiveAccountRequest;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchActiveAccountRequest.ActiveList;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchGetActiveInfo;
import com.vikadata.social.wecom.model.WxCpIsvPermitBatchGetActiveInfo.ActiveInfoList;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateNewOrder;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateRenewOrderRequest;
import com.vikadata.social.wecom.model.WxCpIsvPermitCreateRenewOrderResponse;
import com.vikadata.social.wecom.model.WxCpIsvPermitGetOrder;
import com.vikadata.social.wecom.model.WxCpIsvPermitListOrderAccount;
import com.vikadata.social.wecom.model.WxCpIsvPermitListOrderAccount.AccountList;
import com.vikadata.social.wecom.model.WxCpIsvPermitSubmitRenewOrder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * <p>
 * 企微服务商接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 17:30:23
 */
@Slf4j
@Service
public class SocialCpIsvPermitServiceImpl implements ISocialCpIsvPermitService {

    private static final String WEBHOOK_TITLE_ORDER_MANUAL = "接口许可手动下单提醒";

    public static final String WEBHOOK_TITLE_ORDER_CREATED = "接口许可订单支付提醒";

    public static final String WEBHOOK_TITLE_REFUND = "接口许可退款提醒";

    private static final String WEBHOOK_CONTENT_ORDER_CREATED = "系统已自动为企业（**企业 Corp ID：%s**）创建新购订单（**订单编号：%s**），请及时前往企业微信服务商后台完成付款。";

    private static final String WEBHOOK_CONTENT_ORDER_MANUAL = "系统自动为企业（**企业 Corp ID：%s**）创建新购订单失败，请及时人工操作下单，空间站 ID：%s，应购月数：%s。";

    private static final String WEBHOOK_CONTENT_RENEWAL_CREATED = "系统已自动为企业（**企业 Corp ID：%s**）创建续期订单（**订单编号：%s**），请及时前往企业微信服务商后台完成付款。";

    private static final String WEBHOOK_CONTENT_RENEWAL_MANUAL = "系统自动为企业（**企业 Corp ID：%s**）创建续期订单失败，请及时人工操作下单，空间站 ID：%s。";

    private static final String WEBHOOK_CONTENT_REFUND = "企业（**企业 Corp ID：%s**）已退款取消购买付费订阅版本，请及时前往企业微信服务商后台对该企业的接口许可订单退款。";

    public static final String WEBHOOK_REDIRECT_WE_WORK = "点击前往企业微信服务商后台";

    @Autowired(required = false)
    private WeComProperties weComProperties;

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private RestTemplate restTemplate;

    @Autowired(required = false)
    private RabbitSenderService rabbitSenderService;

    @Resource
    private IBundleService bundleService;

    @Resource
    private ISocialWecomPermitDelayService socialWecomPermitDelayService;

    @Resource
    private ISocialWecomPermitOrderService socialWecomPermitOrderService;

    @Resource
    private ISocialWecomPermitOrderAccountService socialWecomPermitOrderAccountService;

    @Resource
    private IsocialWecomPermitOrderAccountBindService socialWecomPermitOrderAccountBindService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Override
    public SocialWecomPermitOrderEntity createNewOrder(String spaceId, Integer durationMonths) {
        // 1 获取空间站对应的信息
        SocialTenantBindEntity tenantBindEntity = socialTenantBindService.getBySpaceId(spaceId);
        if (Objects.isNull(tenantBindEntity)) {
            throw new BusinessException(SocialException.TENANT_NOT_EXIST);
        }
        String suiteId = tenantBindEntity.getAppId();
        String authCorpId = tenantBindEntity.getTenantId();
        // 1.1 先确认所有账号的激活状态
        List<String> allActiveCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId, null);
        ensureActiveCodes(suiteId, authCorpId, allActiveCodes);
        // 1.2 需要购买账号的数量
        int newAccountCount = calcNewAccountCount(suiteId, authCorpId, spaceId);
        if (newAccountCount == 0) {
            // 没有人需要激活
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_UN_NEEDED);
        }
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        // 2 下单购买账号
        String buyerUserId = weComProperties.getIsvAppList().stream()
                .filter(isv -> isv.getSuiteId().equals(suiteId))
                .findFirst()
                .map(IsvApp::getPermitBuyerUserId)
                .orElse(null);
        WxCpIsvPermitCreateNewOrder createNewOrder;
        try {
            createNewOrder = wxCpIsvPermitService.createNewOrder(authCorpId, newAccountCount, durationMonths, buyerUserId);
        }
        catch (WxErrorException ex) {
            log.error("Exception occurred while creating new order.", ex);
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
        }
        // 3 查询订单的详情
        WxCpIsvPermitGetOrder.Order getOrderDetail;
        try {
            WxCpIsvPermitGetOrder getOrder = wxCpIsvPermitService.getOrder(createNewOrder.getOrderId());
            getOrderDetail = getOrder.getOrder();
        }
        catch (WxErrorException ex) {
            log.error("Exception occurred while getting order.", ex);
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
        }
        // 4 保存订单信息
        SocialWecomPermitOrderEntity orderEntity = buildOrderEntity(null, getOrderDetail, suiteId, authCorpId, buyerUserId);
        socialWecomPermitOrderService.save(orderEntity);
        return orderEntity;
    }

    @Override
    public void activateOrder(String orderId) {
        // 1 获取接口许可订单信息
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderService.getByOrderId(orderId);
        if (Objects.isNull(orderEntity) || orderEntity.getOrderType() != 1) {
            // 只有购买账号的订单才需要激活
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_ORDER_INVALID);
        }
        String suiteId = orderEntity.getSuiteId();
        String authCorpId = orderEntity.getAuthCorpId();
        if (orderEntity.getOrderStatus() == 0) {
            // 1.1 如果订单为待支付状态，则确认订单的最新状态
            try {
                WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
                WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
                WxCpIsvPermitGetOrder getOrder = wxCpIsvPermitService.getOrder(orderId);
                orderEntity = buildOrderEntity(orderEntity, getOrder.getOrder(), null, null, null);
                socialWecomPermitOrderService.updateById(orderEntity);
            }
            catch (WxErrorException ex) {
                log.error("Exception occurred while getting order.", ex);
                throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
            }
        }
        if (orderEntity.getOrderStatus() != 1 && orderEntity.getOrderStatus() != 6) {
            // 订单需要已支付或者退款被拒绝
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_ORDER_INVALID);
        }
        // 2 获取租户信息
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        if (CharSequenceUtil.isBlank(spaceId)) {
            throw new BusinessException(SocialException.TENANT_NOT_BIND_SPACE);
        }
        // 3 判断许可订单的账号是否已经保存
        int existedCount = socialWecomPermitOrderAccountBindService.getCountByOrderId(orderId);
        if (existedCount == 0) {
            // 3.1 没有已存在的许可账号，需要获取并保存订单下的所有账号信息
            saveAllActiveCodes(suiteId, authCorpId, orderId);
        }
        else {
            // 3.2 已保存许可账号，则确认所有账号的激活状态
            List<String> allActiveCodes = socialWecomPermitOrderAccountService
                    .getActiveCodesByOrderId(suiteId, authCorpId, orderId, null);
            ensureActiveCodes(suiteId, authCorpId, allActiveCodes);
        }
        // 4 激活账号
        // 4.1 使用待激活的账号
        List<String> allActivatedCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId,
                Collections.singletonList(SocialCpIsvPermitActivateStatus.NO_ACTIVATED.getValue()));
        if (CollUtil.isNotEmpty(allActivatedCodes)) {
            activateAccount(suiteId, authCorpId, spaceId, allActivatedCodes);
        }
        // 4.2 复用待转移的账号
        List<String> allTransferredCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId,
                Collections.singletonList(SocialCpIsvPermitActivateStatus.TRANSFERRED.getValue()));
        if (CollUtil.isNotEmpty(allTransferredCodes)) {
            activateAccount(suiteId, authCorpId, spaceId, allTransferredCodes);
        }
    }

    @Override
    public SocialWecomPermitOrderEntity renewalCpUser(String spaceId, List<String> cpUserIds, Integer durationMonths) {
        // 1 获取空间站对应的信息
        SocialTenantBindEntity tenantBindEntity = socialTenantBindService.getBySpaceId(spaceId);
        if (Objects.isNull(tenantBindEntity)) {
            throw new BusinessException(SocialException.TENANT_NOT_EXIST);
        }
        String suiteId = tenantBindEntity.getAppId();
        String authCorpId = tenantBindEntity.getTenantId();
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        // 2 添加续期账号
        WxCpIsvPermitCreateRenewOrderRequest renewOrderRequest = new WxCpIsvPermitCreateRenewOrderRequest();
        renewOrderRequest.setCorpId(authCorpId);
        for (List<String> userIds : CollUtil.split(cpUserIds, 1000)) {
            List<WxCpIsvPermitCreateRenewOrderRequest.AccountList> accountList = userIds.stream()
                    .map(userId -> {
                        WxCpIsvPermitCreateRenewOrderRequest.AccountList account = new WxCpIsvPermitCreateRenewOrderRequest.AccountList();
                        account.setUserId(userId);
                        account.setType(1);
                        return account;
                    }).collect(Collectors.toList());
            renewOrderRequest.setAccountList(accountList);
            WxCpIsvPermitCreateRenewOrderResponse renewOrderResponse;
            try {
                renewOrderResponse = wxCpIsvPermitService.createRenewOrder(renewOrderRequest);
            }
            catch (WxErrorException ex) {
                log.error("Exception occurred while creating renew order.", ex);
                throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
            }
            renewOrderRequest.setJobId(renewOrderResponse.getJobId());
        }
        // 3 提交续期订单
        String buyerUserId = weComProperties.getIsvAppList().stream()
                .filter(isv -> isv.getSuiteId().equals(suiteId))
                .findFirst()
                .map(IsvApp::getPermitBuyerUserId)
                .orElse(null);
        WxCpIsvPermitSubmitRenewOrder submitRenewOrder;
        try {
            submitRenewOrder = wxCpIsvPermitService.submitRenewOrder(renewOrderRequest.getJobId(), durationMonths, buyerUserId);
        }
        catch (WxErrorException ex) {
            log.error("Exception occurred while submitting renew order.", ex);
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
        }
        // 4 查询订单的详情
        WxCpIsvPermitGetOrder.Order getOrderDetail;
        try {
            WxCpIsvPermitGetOrder getOrder = wxCpIsvPermitService.getOrder(submitRenewOrder.getOrderId());
            getOrderDetail = getOrder.getOrder();
        }
        catch (WxErrorException ex) {
            log.error("Exception occurred while getting order.", ex);
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
        }
        // 5 保存订单信息
        SocialWecomPermitOrderEntity orderEntity = buildOrderEntity(null, getOrderDetail, suiteId, authCorpId, buyerUserId);
        socialWecomPermitOrderService.save(orderEntity);
        return orderEntity;
    }

    @Override
    public void ensureOrderAndAllActiveCodes(String orderId) {
        // 1 确认订单的最新信息
        SocialWecomPermitOrderEntity orderEntity = ensureOrder(orderId);
        // 2 确认所有账号的激活状态
        String suiteId = orderEntity.getSuiteId();
        String authCorpId = orderEntity.getAuthCorpId();
        ensureAllActiveCodes(suiteId, authCorpId);
    }

    @Override
    public int calcNewAccountCount(String suiteId, String authCorpId, String spaceId) {
        List<String> noActivatedCpUserIds = socialWecomPermitOrderAccountService.getNeedActivateCpUserIds(suiteId, authCorpId, spaceId);
        List<String> availableActiveCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId,
                Arrays.asList(SocialCpIsvPermitActivateStatus.NO_ACTIVATED.getValue(), SocialCpIsvPermitActivateStatus.TRANSFERRED.getValue()));
        // 需要购买账号的数量 = 未绑定激活码的人数 - 待激活数量 - 待转移数量
        int newAccountCount = CollUtil.size(noActivatedCpUserIds) - CollUtil.size(availableActiveCodes);
        if (newAccountCount < 0) {
            newAccountCount = 0;
        }
        return newAccountCount;
    }

    @Override
    public SocialWecomPermitOrderEntity ensureOrder(String orderId) {
        // 1 获取接口许可订单信息
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderService.getByOrderId(orderId);
        if (Objects.isNull(orderEntity)) {
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_ORDER_INVALID);
        }
        // 2 确认订单的最新状态
        try {
            WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(orderEntity.getSuiteId());
            WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
            WxCpIsvPermitGetOrder getOrder = wxCpIsvPermitService.getOrder(orderId);
            orderEntity = buildOrderEntity(orderEntity, getOrder.getOrder(), null, null, null);
            socialWecomPermitOrderService.updateById(orderEntity);
        }
        catch (WxErrorException ex) {
            log.error("Exception occurred while getting order.", ex);
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
        }
        return orderEntity;
    }

    @Override
    public void ensureAllActiveCodes(String suiteId, String authCorpId) {
        List<String> allActiveCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId, null);
        ensureActiveCodes(suiteId, authCorpId, allActiveCodes);
    }

    @Override
    public void autoProcessPermitOrder(String suiteId, String authCorpId, String spaceId) {
        // 已付费用户才需要处理接口许可
        Bundle activeBundle = bundleService.getActivatedBundleBySpaceId(spaceId);
        if (Objects.isNull(activeBundle) || activeBundle.getBaseSubscription().getPhase() != SubscriptionPhase.FIXEDTERM) {
            return;
        }
        // 获取租户信息
        SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        int permitCompatibleDays = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                .findFirst()
                .map(IsvApp::getPermitCompatibleDays)
                .orElse(0);
        // 判断距离首次安装授权是否已过指定天数
        // 大于指定天数需要立即下单购买或者续期接口许可账号，否则由延时队列处理
        // 如果空间站不存在，说明是新租户安装的同时付费，此时肯定未过时效，由延时队列处理
        if (DateTimeUtil.between(tenantEntity.getCreatedAt(), DateTimeUtil.localDateTimeNow(8), ChronoField.EPOCH_DAY) <= permitCompatibleDays) {
            // 未过指定时间，保存延时信息
            socialWecomPermitDelayService.addAuthCorp(suiteId, authCorpId, tenantEntity.getCreatedAt(),
                    SocialCpIsvPermitDelayType.BUY_AFTER_SUBSCRIPTION_PAID.getValue(),
                    SocialCpIsvPermitDelayProcessStatus.PENDING.getValue());
        }
        else {
            // 已过指定时间，立即下单处理接口许可
            List<SocialWecomPermitOrderEntity> orderEntities = socialWecomPermitOrderService
                    .getByOrderStatuses(suiteId, authCorpId, Collections.singletonList(0));
            if (CollUtil.isNotEmpty(orderEntities)) {
                // 存在待支付的订单，延时处理
                socialWecomPermitDelayService.addAuthCorp(suiteId, authCorpId, tenantEntity.getCreatedAt(),
                        SocialCpIsvPermitDelayType.BUY_AFTER_SUBSCRIPTION_PAID.getValue(),
                        SocialCpIsvPermitDelayProcessStatus.PENDING.getValue());
            }
            else {
                boolean result = createPermitOrder(suiteId, authCorpId, spaceId, activeBundle.getBaseSubscription().getExpireDate());
                if (result) {
                    // 保存已下单的任务，并提交到延时队列
                    SocialWecomPermitDelayEntity delayEntity = socialWecomPermitDelayService.addAuthCorp(suiteId, authCorpId, tenantEntity.getCreatedAt(),
                            SocialCpIsvPermitDelayType.BUY_AFTER_SUBSCRIPTION_PAID.getValue(),
                            SocialCpIsvPermitDelayProcessStatus.ORDER_CREATED.getValue());
                    if (Objects.nonNull(delayEntity)) {
                        rabbitSenderService.topicSend(TopicRabbitMqConfig.WECOM_TOPIC_EXCHANGE_BUFFER,
                                TopicRabbitMqConfig.WECOM_ISV_PERMIT_TOPIC_ROUTING_KEY,
                                SocialWecomPermitDelayEntity.builder()
                                        .id(delayEntity.getId())
                                        .authCorpId(delayEntity.getAuthCorpId())
                                        .build(),
                                WeComRabbitConsumer.DLX_MILLIS_ISV_PERMIT_DELAY);
                    }
                }
            }
        }
    }

    @Override
    public boolean createPermitOrder(String suiteId, String authCorpId, String spaceId, LocalDateTime expireTime) {
        boolean result = false;
        // 判断是否需要新购账号
        int newAccountCount = calcNewAccountCount(suiteId, authCorpId, spaceId);
        if (newAccountCount > 0) {
            result = true;
            // 需要新购账号
            int durationMonths = calcDurationMonths(DateTimeUtil.localDateTimeNow(8), expireTime);
            try {
                SocialWecomPermitOrderEntity permitOrderEntity = createNewOrder(spaceId, durationMonths);
                // 下单信息通知到飞书群
                TaskManager.me().execute(() -> sendNewWebhook(suiteId, authCorpId, null, permitOrderEntity.getOrderId(), null));
            }
            catch (Exception ex) {
                log.error("Exception occurred while creating new order.", ex);
                // 待手动下单信息通知到飞书群
                TaskManager.me().execute(() -> sendNewWebhook(suiteId, authCorpId, spaceId, null, durationMonths));
            }
        }
        // 根据激活码的过期时间来判断是否续期
        Map<Integer, List<String>> needRenewCpUserIds = getNeedRenewCpUserIds(suiteId, authCorpId, spaceId, expireTime);
        if (CollUtil.isNotEmpty(needRenewCpUserIds)) {
            result = true;
            // 需要续期账号
            try {
                for (Entry<Integer, List<String>> entry : needRenewCpUserIds.entrySet()) {
                    SocialWecomPermitOrderEntity permitOrderEntity = renewalCpUser(spaceId, entry.getValue(), entry.getKey());
                    // 下单信息通知到飞书群
                    TaskManager.me().execute(() -> sendRenewWebhook(suiteId, authCorpId, null, permitOrderEntity.getOrderId()));
                }
            }
            catch (Exception ex) {
                log.error("Exception occurred while creating renewal order.", ex);
                // 待手动下单信息通知到飞书群
                TaskManager.me().execute(() -> sendRenewWebhook(suiteId, authCorpId, spaceId, null));
            }
        }
        return result;
    }

    @Override
    public boolean sendNewWebhook(String suiteId, String authCorpId, String spaceId, String orderId, Integer durationMonths) {
        IsvApp isvApp = weComProperties.getIsvAppList().stream()
                .filter(isv -> isv.getSuiteId().equals(suiteId))
                .findFirst()
                .orElse(null);
        return sendWebhook(isvApp.getPermitNotifyWebhookUrl(), isvApp.getPermitNotifyWebhookSecret(), authCorpId, spaceId,
                orderId, durationMonths, CharSequenceUtil.isNotBlank(orderId), true, false);
    }

    @Override
    public boolean sendRenewWebhook(String suiteId, String authCorpId, String spaceId, String orderId) {
        IsvApp isvApp = weComProperties.getIsvAppList().stream()
                .filter(isv -> isv.getSuiteId().equals(suiteId))
                .findFirst()
                .orElse(null);
        return sendWebhook(isvApp.getPermitNotifyWebhookUrl(), isvApp.getPermitNotifyWebhookSecret(), authCorpId, spaceId,
                orderId, null, CharSequenceUtil.isNotBlank(orderId), false, false);
    }

    @Override
    public boolean sendRefundWebhook(String suiteId, String authCorpId) {
        IsvApp isvApp = weComProperties.getIsvAppList().stream()
                .filter(isv -> isv.getSuiteId().equals(suiteId))
                .findFirst()
                .orElse(null);
        return sendWebhook(isvApp.getPermitNotifyWebhookUrl(), isvApp.getPermitNotifyWebhookSecret(), authCorpId, null,
                null, null, false, false, true);
    }

    /**
     * 保存接口许可订单下的所有账号信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param orderId 接口许可订单号
     * @author 刘斌华
     * @date 2022-07-01 10:53:29
     */
    private void saveAllActiveCodes(String suiteId, String authCorpId, String orderId) {
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        List<AccountList> allAccountList = Lists.newArrayList();
        WxCpIsvPermitListOrderAccount listOrderAccount;
        String cursor = null;
        do {
            try {
                listOrderAccount = wxCpIsvPermitService.listOrderAccount(orderId, 1000, cursor);
            }
            catch (WxErrorException ex) {
                log.error("Exception occurred while listing order account.", ex);

                throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
            }

            cursor = listOrderAccount.getNextCursor();
            List<AccountList> accountList = listOrderAccount.getAccountList();
            if (CollUtil.isNotEmpty(accountList)) {
                allAccountList.addAll(accountList);
            }
        } while (listOrderAccount.getHasMore() == 1);

        socialWecomPermitOrderAccountService.batchSaveActiveCode(suiteId, authCorpId, orderId, allAccountList);
    }

    /**
     * 确认并更新所有账号的最终状态
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param allActiveCodes 要确认的激活码列表
     * @author 刘斌华
     * @date 2022-06-30 09:45:42
     */
    private void ensureActiveCodes(String suiteId, String authCorpId, List<String> allActiveCodes) {
        if (CollUtil.isEmpty(allActiveCodes)) {
            return;
        }

        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        // 2 查询激活码的最新详情
        List<ActiveInfoList> allActiveInfoList = Lists.newArrayList();
        for (List<String> activeCodes : CollUtil.split(allActiveCodes, 1000)) {
            WxCpIsvPermitBatchGetActiveInfo batchGetActiveInfo;
            try {
                batchGetActiveInfo = wxCpIsvPermitService.batchGetActiveInfo(authCorpId, activeCodes);
            }
            catch (WxErrorException ex) {
                log.error("Exception occurred while batch getting active info.", ex);

                throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
            }
            List<ActiveInfoList> activeInfoList = batchGetActiveInfo.getActiveInfoList();
            if (CollUtil.isNotEmpty(activeInfoList)) {
                allActiveInfoList.addAll(activeInfoList);
            }
        }
        // 3 提取需要更新或者删除的激活码
        Map<String, ActiveInfoList> activeInfoListMap = allActiveInfoList.stream()
                .collect(Collectors.toMap(ActiveInfoList::getActiveCode, v -> v, (k1, k2) -> k2));
        List<SocialWecomPermitOrderAccountEntity> toBeUpdated = Lists.newArrayList();
        List<Long> toBeDeleted = Lists.newArrayList();
        CollUtil.split(allActiveCodes, 500).forEach(activeCodes -> {
            List<SocialWecomPermitOrderAccountEntity> accountEntities = socialWecomPermitOrderAccountService
                    .getByActiveCodes(suiteId, authCorpId, activeCodes);
            accountEntities.forEach(accountEntity -> {
                ActiveInfoList activeInfo = activeInfoListMap.get(accountEntity.getActiveCode());
                if (Objects.isNull(activeInfo)) {
                    // 3.1 没有最新的详情，说明该激活码已经失效，需要删除
                    toBeDeleted.add(accountEntity.getId());
                }
                else {
                    int actualActivateStatus = SocialCpIsvPermitActivateStatus.fromWecomStatus(activeInfo.getStatus()).getValue();
                    String actualCpUserId = activeInfo.getUserId();
                    LocalDateTime actualCreateTime = DateTimeUtil.localDateTimeFromSeconds(activeInfo.getCreateTime(), 8);
                    LocalDateTime actualActiveTime = DateTimeUtil.localDateTimeFromSeconds(activeInfo.getActiveTime(), 8);
                    LocalDateTime actualExpireTime = DateTimeUtil.localDateTimeFromSeconds(activeInfo.getExpireTime(), 8);
                    // 3.2 对比任一信息不同，则需要更新
                    if (accountEntity.getActivateStatus() != actualActivateStatus ||
                            !Objects.equals(accountEntity.getCpUserId(), actualCpUserId) ||
                            !Objects.equals(accountEntity.getCreateTime(), actualCreateTime) ||
                            !Objects.equals(accountEntity.getActiveTime(), actualActiveTime) ||
                            !Objects.equals(accountEntity.getExpireTime(), actualExpireTime)) {
                        accountEntity.setActivateStatus(actualActivateStatus);
                        accountEntity.setCpUserId(actualCpUserId);
                        accountEntity.setCreateTime(actualCreateTime);
                        accountEntity.setActiveTime(actualActiveTime);
                        accountEntity.setExpireTime(actualExpireTime);

                        toBeUpdated.add(accountEntity);
                    }
                }
            });
        });
        // 4 更新其最终状态
        if (CollUtil.isNotEmpty(toBeUpdated)) {
            socialWecomPermitOrderAccountService.updateBatchById(toBeUpdated);
        }
        if (CollUtil.isNotEmpty(toBeDeleted)) {
            socialWecomPermitOrderAccountService.removeBatchByIds(toBeDeleted);
        }
    }

    /**
     * 激活账号
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 成员所在的空间站 ID
     * @param activeCodes 用户激活的激活码列表
     * @author 刘斌华
     * @date 2022-07-02 12:11:54
     */
    private void activateAccount(String suiteId, String authCorpId, String spaceId, List<String> activeCodes) {
        // 1 获取需要激活成员信息
        List<String> needActivateCpUserIds = socialWecomPermitOrderAccountService.getNeedActivateCpUserIds(suiteId, authCorpId, spaceId);
        if (CollUtil.isEmpty(needActivateCpUserIds)) {
            return;
        }
        // 2 激活
        if (needActivateCpUserIds.size() > activeCodes.size()) {
            // 2.1 如果需要激活的成员数量大于可用激活码数量，则只能激活部分成员
            needActivateCpUserIds = CollUtil.sub(needActivateCpUserIds, 0, activeCodes.size());
        }
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        WxCpIsvPermitBatchActiveAccountRequest batchActiveAccountRequest = new WxCpIsvPermitBatchActiveAccountRequest();
        batchActiveAccountRequest.setCorpId(authCorpId);
        AtomicInteger activeCodeIndex = new AtomicInteger(0);
        CollUtil.split(needActivateCpUserIds, 1000).forEach(cpUserIds -> {
            List<ActiveList> activeLists = cpUserIds.stream()
                    .map(cpUserId -> {
                        ActiveList activeList = new ActiveList();
                        activeList.setActiveCode(activeCodes.get(activeCodeIndex.getAndIncrement()));
                        activeList.setUserId(cpUserId);

                        return activeList;
                    }).collect(Collectors.toList());
            batchActiveAccountRequest.setActiveList(activeLists);
            try {
                wxCpIsvPermitService.batchActiveAccount(batchActiveAccountRequest);
            }
            catch (WxErrorException ex) {
                log.error("Exception occurred while batch activating account.", ex);

                throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
            }
        });
        // 3 确认并更新激活信息
        ensureActiveCodes(suiteId, authCorpId, activeCodes);
    }

    /**
     * 构造订单信息新建对象或者更新对象
     *
     * @param originalEntity 原对象。更新时需要
     * @param getOrderDetail 最新订单信息
     * @param suiteId 应用套件 ID。新建时需要
     * @param authCorpId 授权的企业 ID。新建时需要
     * @param buyerUserId 代下单的企微用户 ID。新建时需要
     * @return 新建对象或者更新对象
     * @author 刘斌华
     * @date 2022-07-07 15:30:28
     */
    private SocialWecomPermitOrderEntity buildOrderEntity(SocialWecomPermitOrderEntity originalEntity, WxCpIsvPermitGetOrder.Order getOrderDetail,
            String suiteId, String authCorpId, String buyerUserId) {
        if (Objects.isNull(originalEntity)) {
            return SocialWecomPermitOrderEntity.builder()
                    .suiteId(suiteId)
                    .authCorpId(authCorpId)
                    .orderId(getOrderDetail.getOrderId())
                    .orderType(getOrderDetail.getOrderType())
                    .orderStatus(getOrderDetail.getOrderStatus())
                    .price(getOrderDetail.getPrice())
                    .baseAccountCount(getOrderDetail.getAccountCount().getBaseCount())
                    .externalAccountCount(getOrderDetail.getAccountCount().getExternalContactCount())
                    .durationMonths(getOrderDetail.getAccountDuration().getMonths())
                    .createTime(DateTimeUtil.localDateTimeFromSeconds(getOrderDetail.getCreateTime(), 8))
                    .payTime(DateTimeUtil.localDateTimeFromSeconds(getOrderDetail.getPayTime(), 8))
                    .buyerUserId(buyerUserId)
                    .build();
        }
        else {
            originalEntity.setOrderStatus(getOrderDetail.getOrderStatus());
            originalEntity.setPayTime(DateTimeUtil.localDateTimeFromSeconds(getOrderDetail.getPayTime(), 8));

            return originalEntity;
        }
    }

    /**
     * 计算应新购或者续期的月数
     *
     * @param currentTime 当前时间
     * @param expiredTime 付费订阅到期的时间
     * @return 应新购或者续期的月数
     * @author 刘斌华
     * @date 2022-07-25 15:40:50
     */
    private int calcDurationMonths(LocalDateTime currentTime, LocalDateTime expiredTime) {
        int durationDays = (int) DateTimeUtil.between(currentTime, expiredTime, ChronoField.EPOCH_DAY);
        // 31 天算一个月，不足的也算一个月，并且最多购买 36 个月
        int durationMonths = durationDays / 31 + (durationDays % 31 == 0 ? 0 : 1);
        if (durationMonths > 36) {
            durationMonths = 36;
        }
        return durationMonths;
    }

    /**
     * 获取所有需要续期的企微用户 ID
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 成员所在的空间站 ID
     * @param expireTime 指定的时间
     * @return 需要续期的企微用户 ID。key 为需要续期的月数，value 为需要续期该月数的企微用户 ID 列表
     * @author 刘斌华
     * @date 2022-07-28 14:56:33
     */
    private Map<Integer, List<String>> getNeedRenewCpUserIds(String suiteId, String authCorpId, String spaceId, LocalDateTime expireTime) {
        List<SocialWecomPermitOrderAccountEntity> needRenewAccounts = socialWecomPermitOrderAccountService
                .getNeedRenewAccounts(suiteId, authCorpId, spaceId, expireTime);
        if (CollUtil.isEmpty(needRenewAccounts)) {
            return Collections.emptyMap();
        }
        // 根据需要续期的月数来将企微用户 ID 分组
        LocalDateTime currentDateTime = DateTimeUtil.localDateTimeNow(8);
        return needRenewAccounts.stream()
                .collect(Collectors.groupingBy(entity -> {
                    LocalDateTime startTime;
                    if (entity.getExpireTime().isAfter(currentDateTime)) {
                        startTime = entity.getExpireTime();
                    }
                    else {
                        startTime = currentDateTime;
                    }
                    return calcDurationMonths(startTime, expireTime);
                }, Collectors.mapping(SocialWecomPermitOrderAccountEntity::getCpUserId, Collectors.toList())));
    }

    /**
     * 发送 Webhook 消息
     *
     * @param webhookUrl Webhook 地址
     * @param webhookSecret Webhook 密钥
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID
     * @param orderId 如果已下单，对应的接口许可订单号
     * @param durationMonths 下单的月数
     * @param isOrderCreated 是否已创建订单，否则需要人工手动创建
     * @param isNew 是否为新购订单，否则为续期订单或者退款通知
     * @param isRefund 是否退款通知
     * @return 是否发送成功
     * @author 刘斌华
     * @date 2022-07-27 17:36:55
     */
    public boolean sendWebhook(String webhookUrl, String webhookSecret,
            String authCorpId, String spaceId, String orderId, Integer durationMonths,
            boolean isOrderCreated, boolean isNew, boolean isRefund) {
        JsonObject body = new JsonObject();
        if (CharSequenceUtil.isNotBlank(webhookSecret)) {
            // 有密钥需要提供签名
            String currentSecondsString = Long.toString(Instant.now().getEpochSecond());
            String signData = currentSecondsString + '\n' + webhookSecret;
            byte[] signature = DigestUtil.hmac(HmacAlgorithm.HmacSHA256, signData.getBytes(StandardCharsets.UTF_8))
                    .digest(new byte[] {});
            body.addProperty("timestamp", currentSecondsString);
            body.addProperty("sign", Base64Encoder.encode(signature));
        }
        body.addProperty("msg_type", "interactive");
        JsonObject card = new JsonObject();
        JsonObject config = new JsonObject();
        config.addProperty("wide_screen_mode", true);
        config.addProperty("enable_forward", true);
        card.add("config", config);
        JsonObject header = new JsonObject();
        JsonObject title = new JsonObject();
        title.addProperty("content", isOrderCreated ? WEBHOOK_TITLE_ORDER_CREATED :
                isRefund ? WEBHOOK_TITLE_REFUND : WEBHOOK_TITLE_ORDER_MANUAL);
        title.addProperty("tag", "plain_text");
        header.add("title", title);
        card.add("header", header);
        JsonArray elements = new JsonArray();
        JsonObject elementContent = new JsonObject();
        elementContent.addProperty("tag", "div");
        JsonObject elementContentText = new JsonObject();
        if (isOrderCreated) {
            if (isNew) {
                elementContentText.addProperty("content", String.format(WEBHOOK_CONTENT_ORDER_CREATED, authCorpId, orderId));
            }
            else {
                elementContentText.addProperty("content", String.format(WEBHOOK_CONTENT_RENEWAL_CREATED, authCorpId, orderId));
            }
        }
        else if (isRefund) {
            elementContentText.addProperty("content", String.format(WEBHOOK_CONTENT_REFUND, authCorpId));
        }
        else {
            if (isNew) {
                elementContentText.addProperty("content", String.format(WEBHOOK_CONTENT_ORDER_MANUAL, authCorpId, spaceId, durationMonths));
            }
            else {
                elementContentText.addProperty("content", String.format(WEBHOOK_CONTENT_RENEWAL_MANUAL, authCorpId, spaceId));
            }
        }
        elementContentText.addProperty("tag", "lark_md");
        elementContent.add("text", elementContentText);
        elements.add(elementContent);
        if (isOrderCreated || isRefund) {
            JsonObject elementActions = new JsonObject();
            JsonArray elementActionList = new JsonArray();
            JsonObject elementActionRedirect = new JsonObject();
            elementActionRedirect.addProperty("tag", "button");
            JsonObject elementActionRedirectText = new JsonObject();
            elementActionRedirectText.addProperty("content", WEBHOOK_REDIRECT_WE_WORK);
            elementActionRedirectText.addProperty("tag", "lark_md");
            elementActionRedirect.add("text", elementActionRedirectText);
            elementActionRedirect.addProperty("url", "https://open.work.weixin.qq.com/wwopen/developer#/sass/license/service/order/list");
            elementActionRedirect.addProperty("type", "default");
            elementActionList.add(elementActionRedirect);
            elementActions.add("actions", elementActionList);
            elementActions.addProperty("tag", "action");
            elements.add(elementActions);
        }
        card.add("elements", elements);
        body.add("card", card);
        String response = restTemplate.postForObject(webhookUrl, body.toString(), String.class);
        JsonObject responseBody = Optional.ofNullable(response)
                .map(JsonParser::parseString)
                .map(JsonElement::getAsJsonObject)
                .orElse(null);
        JsonElement statusCode = Objects.isNull(responseBody) ? null : responseBody.get("StatusCode");
        if (Objects.isNull(statusCode) || statusCode.getAsInt() != 0) {
            // 发送失败
            log.error("Webhook 消息发送失败，返回结果：" + response);
            return false;
        }
        return true;
    }

}
