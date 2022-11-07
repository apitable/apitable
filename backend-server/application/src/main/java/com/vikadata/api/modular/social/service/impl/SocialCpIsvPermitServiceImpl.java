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
import com.apitable.starter.social.wecom.autoconfigure.WeComProperties;
import com.apitable.starter.social.wecom.autoconfigure.WeComProperties.IsvApp;
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
 * WeCom Service Provider Interface License
 * </p>
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
        // 1 Get the information corresponding to the space station
        SocialTenantBindEntity tenantBindEntity = socialTenantBindService.getBySpaceId(spaceId);
        if (Objects.isNull(tenantBindEntity)) {
            throw new BusinessException(SocialException.TENANT_NOT_EXIST);
        }
        String suiteId = tenantBindEntity.getAppId();
        String authCorpId = tenantBindEntity.getTenantId();
        // 1.1 Confirm the activation status of all accounts first
        List<String> allActiveCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId, null);
        ensureActiveCodes(suiteId, authCorpId, allActiveCodes);
        // 1.2 Number of accounts to be purchased
        int newAccountCount = calcNewAccountCount(suiteId, authCorpId, spaceId);
        if (newAccountCount == 0) {
            // Nobody needs to activate
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_UN_NEEDED);
        }
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        // 2 Order purchase account
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
        // 3 Query order details
        WxCpIsvPermitGetOrder.Order getOrderDetail;
        try {
            WxCpIsvPermitGetOrder getOrder = wxCpIsvPermitService.getOrder(createNewOrder.getOrderId());
            getOrderDetail = getOrder.getOrder();
        }
        catch (WxErrorException ex) {
            log.error("Exception occurred while getting order.", ex);
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
        }
        // 4 Save order information
        SocialWecomPermitOrderEntity orderEntity = buildOrderEntity(null, getOrderDetail, suiteId, authCorpId, buyerUserId);
        socialWecomPermitOrderService.save(orderEntity);
        return orderEntity;
    }

    @Override
    public void activateOrder(String orderId) {
        // 1 Obtain interface license order information
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderService.getByOrderId(orderId);
        if (Objects.isNull(orderEntity) || orderEntity.getOrderType() != 1) {
            // Only orders with purchase accounts need to be activated
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_ORDER_INVALID);
        }
        String suiteId = orderEntity.getSuiteId();
        String authCorpId = orderEntity.getAuthCorpId();
        if (orderEntity.getOrderStatus() == 0) {
            // 1.1 If the order is to be paid, confirm the latest status of the order
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
            // The order needs to be paid or the refund is rejected
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_ORDER_INVALID);
        }
        // 2 Obtain tenant information
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        if (CharSequenceUtil.isBlank(spaceId)) {
            throw new BusinessException(SocialException.TENANT_NOT_BIND_SPACE);
        }
        // 3 Judge whether the license order account has been saved
        int existedCount = socialWecomPermitOrderAccountBindService.getCountByOrderId(orderId);
        if (existedCount == 0) {
            // 3.1 There is no existing license account. You need to obtain and save all account information under the order
            saveAllActiveCodes(suiteId, authCorpId, orderId);
        }
        else {
            // 3.2 If the license account has been saved, confirm the activation status of all accounts
            List<String> allActiveCodes = socialWecomPermitOrderAccountService
                    .getActiveCodesByOrderId(suiteId, authCorpId, orderId, null);
            ensureActiveCodes(suiteId, authCorpId, allActiveCodes);
        }
        // 4 Activate account
        // 4.1 Use the account to be activated
        List<String> allActivatedCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId,
                Collections.singletonList(SocialCpIsvPermitActivateStatus.NO_ACTIVATED.getValue()));
        if (CollUtil.isNotEmpty(allActivatedCodes)) {
            activateAccount(suiteId, authCorpId, spaceId, allActivatedCodes);
        }
        // 4.2 Reuse the account to be transferred
        List<String> allTransferredCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId,
                Collections.singletonList(SocialCpIsvPermitActivateStatus.TRANSFERRED.getValue()));
        if (CollUtil.isNotEmpty(allTransferredCodes)) {
            activateAccount(suiteId, authCorpId, spaceId, allTransferredCodes);
        }
    }

    @Override
    public SocialWecomPermitOrderEntity renewalCpUser(String spaceId, List<String> cpUserIds, Integer durationMonths) {
        // 1 Get the information corresponding to the space station
        SocialTenantBindEntity tenantBindEntity = socialTenantBindService.getBySpaceId(spaceId);
        if (Objects.isNull(tenantBindEntity)) {
            throw new BusinessException(SocialException.TENANT_NOT_EXIST);
        }
        String suiteId = tenantBindEntity.getAppId();
        String authCorpId = tenantBindEntity.getTenantId();
        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        // 2 Add renewal account
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
        // 3 Submit renewal order
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
        // 4 Query order details
        WxCpIsvPermitGetOrder.Order getOrderDetail;
        try {
            WxCpIsvPermitGetOrder getOrder = wxCpIsvPermitService.getOrder(submitRenewOrder.getOrderId());
            getOrderDetail = getOrder.getOrder();
        }
        catch (WxErrorException ex) {
            log.error("Exception occurred while getting order.", ex);
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_API_ERROR);
        }
        // 5 Save order information
        SocialWecomPermitOrderEntity orderEntity = buildOrderEntity(null, getOrderDetail, suiteId, authCorpId, buyerUserId);
        socialWecomPermitOrderService.save(orderEntity);
        return orderEntity;
    }

    @Override
    public void ensureOrderAndAllActiveCodes(String orderId) {
        // 1 Confirm the latest information of the order
        SocialWecomPermitOrderEntity orderEntity = ensureOrder(orderId);
        // 2 Confirm the activation status of all accounts
        String suiteId = orderEntity.getSuiteId();
        String authCorpId = orderEntity.getAuthCorpId();
        ensureAllActiveCodes(suiteId, authCorpId);
    }

    @Override
    public int calcNewAccountCount(String suiteId, String authCorpId, String spaceId) {
        List<String> noActivatedCpUserIds = socialWecomPermitOrderAccountService.getNeedActivateCpUserIds(suiteId, authCorpId, spaceId);
        List<String> availableActiveCodes = socialWecomPermitOrderAccountService.getActiveCodes(suiteId, authCorpId,
                Arrays.asList(SocialCpIsvPermitActivateStatus.NO_ACTIVATED.getValue(), SocialCpIsvPermitActivateStatus.TRANSFERRED.getValue()));
        // The number of accounts to be purchased = the number of people with unbound activation code - the number to be activated - the number to be transferred
        int newAccountCount = CollUtil.size(noActivatedCpUserIds) - CollUtil.size(availableActiveCodes);
        if (newAccountCount < 0) {
            newAccountCount = 0;
        }
        return newAccountCount;
    }

    @Override
    public SocialWecomPermitOrderEntity ensureOrder(String orderId) {
        // 1 Obtain interface license order information
        SocialWecomPermitOrderEntity orderEntity = socialWecomPermitOrderService.getByOrderId(orderId);
        if (Objects.isNull(orderEntity)) {
            throw new BusinessException(SocialException.WECOM_ISV_PERMIT_ORDER_INVALID);
        }
        // 2 Confirm the latest status of the order
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
        // Only paid users need to process interface license
        Bundle activeBundle = bundleService.getActivatedBundleBySpaceId(spaceId);
        if (Objects.isNull(activeBundle) || activeBundle.getBaseSubscription().getPhase() != SubscriptionPhase.FIXEDTERM) {
            return;
        }
        // Obtain tenant information
        SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        int permitCompatibleDays = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                .findFirst()
                .map(IsvApp::getPermitCompatibleDays)
                .orElse(0);
        // Judge whether the specified number of days has passed since the first installation authorization
        // If the number of days is greater than the specified number of days, you need to immediately place an order to purchase or renew the interface license account, otherwise it will be processed by the delay queue
        // If the space station does not exist, it means that the new tenant is paying for the installation at the same time. At this time, it must not be expired, and it is handled by the delay queue
        if (DateTimeUtil.between(tenantEntity.getCreatedAt(), DateTimeUtil.localDateTimeNow(8), ChronoField.EPOCH_DAY) <= permitCompatibleDays) {
            // Save delay information before the specified time
            socialWecomPermitDelayService.addAuthCorp(suiteId, authCorpId, tenantEntity.getCreatedAt(),
                    SocialCpIsvPermitDelayType.BUY_AFTER_SUBSCRIPTION_PAID.getValue(),
                    SocialCpIsvPermitDelayProcessStatus.PENDING.getValue());
        }
        else {
            // After the specified time, place an order to process the interface license immediately
            List<SocialWecomPermitOrderEntity> orderEntities = socialWecomPermitOrderService
                    .getByOrderStatuses(suiteId, authCorpId, Collections.singletonList(0));
            if (CollUtil.isNotEmpty(orderEntities)) {
                // There are orders to be paid, and processing is delayed
                socialWecomPermitDelayService.addAuthCorp(suiteId, authCorpId, tenantEntity.getCreatedAt(),
                        SocialCpIsvPermitDelayType.BUY_AFTER_SUBSCRIPTION_PAID.getValue(),
                        SocialCpIsvPermitDelayProcessStatus.PENDING.getValue());
            }
            else {
                boolean result = createPermitOrder(suiteId, authCorpId, spaceId, activeBundle.getBaseSubscription().getExpireDate());
                if (result) {
                    // Save the ordered task and submit it to the delay queue
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
        // Judge whether a new account is required
        int newAccountCount = calcNewAccountCount(suiteId, authCorpId, spaceId);
        if (newAccountCount > 0) {
            result = true;
            // Need a new account
            int durationMonths = calcDurationMonths(DateTimeUtil.localDateTimeNow(8), expireTime);
            try {
                SocialWecomPermitOrderEntity permitOrderEntity = createNewOrder(spaceId, durationMonths);
                // Order information is notified to Lark Group
                TaskManager.me().execute(() -> sendNewWebhook(suiteId, authCorpId, null, permitOrderEntity.getOrderId(), null));
            }
            catch (Exception ex) {
                log.error("Exception occurred while creating new order.", ex);
                // To be notified to Lark group about manually placing an order
                TaskManager.me().execute(() -> sendNewWebhook(suiteId, authCorpId, spaceId, null, durationMonths));
            }
        }
        // Judge whether to renew according to the expiration time of the activation code
        Map<Integer, List<String>> needRenewCpUserIds = getNeedRenewCpUserIds(suiteId, authCorpId, spaceId, expireTime);
        if (CollUtil.isNotEmpty(needRenewCpUserIds)) {
            result = true;
            // Need to renew the account
            try {
                for (Entry<Integer, List<String>> entry : needRenewCpUserIds.entrySet()) {
                    SocialWecomPermitOrderEntity permitOrderEntity = renewalCpUser(spaceId, entry.getValue(), entry.getKey());
                    // Notify Lark group of order information
                    TaskManager.me().execute(() -> sendRenewWebhook(suiteId, authCorpId, null, permitOrderEntity.getOrderId()));
                }
            }
            catch (Exception ex) {
                log.error("Exception occurred while creating renewal order.", ex);
                // To be notified to Lark group about manually placing an order
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
     * Save all account information under the interface license order
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param orderId Interface license order number
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
     * Confirm and update the final status of all accounts
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param allActiveCodes List of activation codes to be confirmed
     */
    private void ensureActiveCodes(String suiteId, String authCorpId, List<String> allActiveCodes) {
        if (CollUtil.isEmpty(allActiveCodes)) {
            return;
        }

        WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
        WxCpIsvPermitServiceImpl wxCpIsvPermitService = wxCpIsvService.getWxCpIsvPermitService();
        // 2 Query the latest details of activation code
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
        // 3 Extract the activation code to be updated or deleted
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
                    // 3.1 No latest details, indicating that the activation code has expired and needs to be deleted
                    toBeDeleted.add(accountEntity.getId());
                }
                else {
                    int actualActivateStatus = SocialCpIsvPermitActivateStatus.fromWecomStatus(activeInfo.getStatus()).getValue();
                    String actualCpUserId = activeInfo.getUserId();
                    LocalDateTime actualCreateTime = DateTimeUtil.localDateTimeFromSeconds(activeInfo.getCreateTime(), 8);
                    LocalDateTime actualActiveTime = DateTimeUtil.localDateTimeFromSeconds(activeInfo.getActiveTime(), 8);
                    LocalDateTime actualExpireTime = DateTimeUtil.localDateTimeFromSeconds(activeInfo.getExpireTime(), 8);
                    // 3.2 If any information is different, it needs to be updated
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
        // 4 Update its final status
        if (CollUtil.isNotEmpty(toBeUpdated)) {
            socialWecomPermitOrderAccountService.updateBatchById(toBeUpdated);
        }
        if (CollUtil.isNotEmpty(toBeDeleted)) {
            socialWecomPermitOrderAccountService.removeBatchByIds(toBeDeleted);
        }
    }

    /**
     * Activate account
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param spaceId Space ID of the member
     * @param activeCodes User activated activation code list
     */
    private void activateAccount(String suiteId, String authCorpId, String spaceId, List<String> activeCodes) {
        // 1 Get the member information to be activated
        List<String> needActivateCpUserIds = socialWecomPermitOrderAccountService.getNeedActivateCpUserIds(suiteId, authCorpId, spaceId);
        if (CollUtil.isEmpty(needActivateCpUserIds)) {
            return;
        }
        // 2 Activation
        if (needActivateCpUserIds.size() > activeCodes.size()) {
            // 2.1 If the number of members to be activated is greater than the number of available activation codes, only some members can be activated
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
        // 3 Confirm and update activation information
        ensureActiveCodes(suiteId, authCorpId, activeCodes);
    }

    /**
     * Create order information, create new objects or update objects
     *
     * @param originalEntity The original object. Required when updating
     * @param getOrderDetail Latest order information
     * @param suiteId App Suite ID. Required when creating
     * @param authCorpId The authorized enterprise ID. Required when creating
     * @param buyerUserId The ID of the enterprise micro user who placed the order. Required when creating
     * @return Create a new object or update an object
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
     * Calculate the number of months for new purchase or renewal
     *
     * @param currentTime current time
     * @param expiredTime Expiration time of paid subscription
     * @return Number of months for new purchase or renewal
     */
    private int calcDurationMonths(LocalDateTime currentTime, LocalDateTime expiredTime) {
        int durationDays = (int) DateTimeUtil.between(currentTime, expiredTime, ChronoField.EPOCH_DAY);
        // 31 Every day counts as one month, and the less than one month counts as one month, and the maximum purchase time is 36 months
        int durationMonths = durationDays / 31 + (durationDays % 31 == 0 ? 0 : 1);
        if (durationMonths > 36) {
            durationMonths = 36;
        }
        return durationMonths;
    }

    /**
     * Obtain all WeCom user IDs that need to be renewed
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param spaceId Space station ID of the member
     * @param expireTime Specified time
     * @return WeCom user ID that needs to be renewed. Key is the number of months that need to be renewed, and value is the WeCom user ID list for the number of months that need to be renewed
     */
    private Map<Integer, List<String>> getNeedRenewCpUserIds(String suiteId, String authCorpId, String spaceId, LocalDateTime expireTime) {
        List<SocialWecomPermitOrderAccountEntity> needRenewAccounts = socialWecomPermitOrderAccountService
                .getNeedRenewAccounts(suiteId, authCorpId, spaceId, expireTime);
        if (CollUtil.isEmpty(needRenewAccounts)) {
            return Collections.emptyMap();
        }
        // Group WeCom user IDs according to the number of months that need to be renewed
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
     * Send Webhook message
     *
     * @param webhookUrl Webhook Address
     * @param webhookSecret Webhook secret key
     * @param authCorpId Authorized enterprise ID
     * @param spaceId Space ID
     * @param orderId If the order has been placed, the corresponding interface license order number
     * @param durationMonths Number of months of order
     * @param isOrderCreated Whether the order has been created, otherwise it needs to be manually created
     * @param isNew Whether it is a new purchase order, otherwise it is a renewal order or refund notice
     * @param isRefund Refund notification or not
     * @return Send successfully
     */
    public boolean sendWebhook(String webhookUrl, String webhookSecret,
            String authCorpId, String spaceId, String orderId, Integer durationMonths,
            boolean isOrderCreated, boolean isNew, boolean isRefund) {
        JsonObject body = new JsonObject();
        if (CharSequenceUtil.isNotBlank(webhookSecret)) {
            // Signature is required if there is a key
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
            // Fail in send
            log.error("Webhook Failed to send the message. The result is returned：" + response);
            return false;
        }
        return true;
    }

}
