package com.vikadata.api.modular.finance.strategy.impl;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.eco.service.IEconomicOrderService;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.model.SocialOrderContext;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISocialWecomOrderService;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.finance.strategy.AbstractSocialOrderService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.ISocialOrderWeComService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.WeComPlanConfigManager;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties.IsvApp;
import com.vikadata.clock.ClockUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.SocialOrderWecomEntity;
import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.event.order.WeComOrderRefundEvent;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * Implementation for wecom isv order event
 * </p>
 *
 * @author Codeman
 * @date 2022-08-10 11:03:13
 */
@Slf4j
@Service
public class WeComOrderServiceImpl extends AbstractSocialOrderService<WeComOrderPaidEvent, WeComOrderRefundEvent> {

    @Autowired(required = false)
    private WeComProperties weComProperties;

    @Resource
    private IBundleService bundleService;

    @Resource
    private IEconomicOrderService economicOrderService;

    @Resource
    private IOrderItemService orderItemService;

    @Resource
    private IOrderV2Service orderV2Service;

    @Resource
    private ISocialOrderWeComService socialOrderWeComService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialWecomOrderService socialWecomOrderService;

    @Resource
    private ISubscriptionService subscriptionService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void retrieveOrderPaidEvent(WeComOrderPaidEvent event) {
        SocialOrderContext context = buildSocialOrderContext(event);
        if (Objects.isNull(context)) {
            return;
        }
        // 1 Save billing order
        String orderId = createOrder(context);
        // 2 Save billing order meta
        createOrderMetaData(orderId, OrderChannel.WECOM, event);
        // 3 Handle subscription
        String subscriptionId;
        Bundle activeBundle = context.getActivatedBundle();
        if (Objects.isNull(activeBundle) && context.getOrderType() == OrderType.BUY) {
            // 3.1 Crate bundle as first subscription
            String bundleId = createBundle(context);
            subscriptionId = createSubscription(bundleId, context);
        }
        else if (Objects.nonNull(activeBundle) && activeBundle.getBaseSubscription().getPhase() == SubscriptionPhase.TRIAL) {
            // 3.2 Upgrade while last subscription is trial
            subscriptionId = upgradeSubscription(context);
        }
        else {
            // 3.3 Renew bundle end time, and create a new subscription
            // Both upgrade and renewal in wecom should create new order, tenant will go back to last subscription while refund.
            // So we need to create a new subscription if bundle existed
            subscriptionId = renewSubscription(context);
        }
        // 4 Save order item
        createOrderItem(orderId, subscriptionId, context);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void retrieveOrderRefundEvent(WeComOrderRefundEvent event) {
        // 1 Retrieve space ID of tenant
        String spaceId = socialTenantBindService.getTenantDepartmentBindSpaceId(event.getSuiteId(), event.getPaidCorpId());
        if (CharSequenceUtil.isBlank(spaceId)) {
            log.error("Failed to handle, as this tenant haven't bind a space: {}", event.getPaidCorpId());
            return;
        }
        // 2 Retrieve vika order ID related to the wecom order
        String orderId = orderV2Service.getOrderIdByChannelOrderId(spaceId, event.getOrderId());
        List<String> subscriptionIds = orderItemService.getSubscriptionIdsByOrderId(orderId)
                .stream()
                .filter(CharSequenceUtil::isNotBlank)
                .collect(Collectors.toList());
        List<String> bundleIds = subscriptionIds.stream()
                .map(subscriptionId -> {
                    SubscriptionEntity subscription = subscriptionService.getBySubscriptionId(subscriptionId);
                    if (Objects.nonNull(subscription)) {
                        return subscription.getBundleId();
                    }
                    return null;
                })
                .filter(CharSequenceUtil::isNotBlank)
                .collect(Collectors.toList());
        if (!subscriptionIds.isEmpty()) {
            // 3 Remove subscription if needed
            subscriptionService.removeBatchBySubscriptionIds(subscriptionIds);
        }
        if (!bundleIds.isEmpty()) {
            // 4 Retrieve other subscriptions that related to bundle
            List<SubscriptionEntity> subscriptionEntities = subscriptionService.getByBundleIds(bundleIds);
            Map<String, List<SubscriptionEntity>> subscriptionsMap = subscriptionEntities.stream()
                    .collect(Collectors.groupingBy(SubscriptionEntity::getBundleId, Collectors.toList()));
            bundleIds.removeIf(bundleId -> CollUtil.isNotEmpty(subscriptionsMap.get(bundleId)));
            // 4.1 The bundle which has no subscriptions should be removed
            if (CollUtil.isNotEmpty(bundleIds)) {
                bundleService.removeBatchByBundleIds(bundleIds);
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateEvent(String spaceId) {
        // 1 get tenant info
        TenantBindDTO bindInfo = socialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (Objects.isNull(bindInfo)) {
            log.error("Failed to move trial orders, as no tenant info found: {}", spaceId);
            return;
        }
        String suiteId = bindInfo.getAppId();
        String authCorpId = bindInfo.getTenantId();
        // 2 get all deprecated economic orders
        List<EconomicOrderEntity> economicOrders = economicOrderService.getBySpaceId(spaceId);
        if (CollUtil.isEmpty(economicOrders)) {
            // no orders need to move, return
            return;
        }
        // 3 separate trial economic orders
        List<EconomicOrderEntity> trialEconomicOrders = economicOrders.stream()
                .filter(economicOrder -> SubscriptionPhase.TRIAL.getName().equals(economicOrder.getOrderPhase()))
                .collect(Collectors.toList());
        // 3.1 move trial orders
        if (CollUtil.isNotEmpty(trialEconomicOrders)) {
            String trialEditionId = weComProperties.getIsvAppList().stream()
                    .filter(isvApp -> suiteId.equals(isvApp.getSuiteId()))
                    .map(IsvApp::getSubscriptionTrialEditionId)
                    .findFirst()
                    .orElse(null);
            if (CharSequenceUtil.isBlank(trialEditionId)) {
                throw new BusinessException("The trial edition id for subscription cannot be null.");
            }
            for (EconomicOrderEntity trialEconomicOrder : trialEconomicOrders) {
                WeComOrderPaidEvent paidEvent = new WeComOrderPaidEvent();
                paidEvent.setSuiteId(suiteId);
                paidEvent.setPaidCorpId(authCorpId);
                paidEvent.setOrderType(trialEconomicOrder.getType());
                paidEvent.setEditionId(trialEditionId);
                paidEvent.setPrice(0);
                paidEvent.setOrderTime(trialEconomicOrder.getCreatedTime().toEpochSecond(ZoneOffset.ofHours(8)));
                paidEvent.setPaidTime(trialEconomicOrder.getPaidTime().toEpochSecond(ZoneOffset.ofHours(8)));
                paidEvent.setBeginTime(trialEconomicOrder.getPaidTime().toEpochSecond(ZoneOffset.ofHours(8)));
                if (Objects.nonNull(trialEconomicOrder.getExpireTime())) {
                    paidEvent.setEndTime(trialEconomicOrder.getExpireTime().toEpochSecond(ZoneOffset.ofHours(8)));
                }
                SocialOrderStrategyFactory.getService(SocialPlatformType.WECOM)
                        .retrieveOrderPaidEvent(paidEvent);
            }
        }
        // 4 move paid orders
        List<SocialOrderWecomEntity> deprecatedOrders = socialOrderWeComService.getAllOrders(suiteId, authCorpId, null);
        if (CollUtil.isNotEmpty(deprecatedOrders)) {
            List<SocialWecomOrderEntity> existedOrders = socialWecomOrderService.getAllOrders(suiteId, authCorpId, null);
            Map<String, SocialWecomOrderEntity> existedOrderMap = existedOrders.stream()
                    .collect(Collectors.toMap(SocialWecomOrderEntity::getOrderId, v -> v, (k1, k2) -> k2));
            for (SocialOrderWecomEntity deprecatedOrder : deprecatedOrders) {
                SocialWecomOrderEntity existedOrder = existedOrderMap.get(deprecatedOrder.getOrderId());
                if (Objects.isNull(existedOrder)) {
                    int deprecatedOrderStatus = deprecatedOrder.getOrderStatus();
                    if (deprecatedOrderStatus == 1) {
                        // paid
                        WeComOrderPaidEvent paidEvent = JSONUtil.toBean(deprecatedOrder.getOrderInfo(), WeComOrderPaidEvent.class);
                        socialWecomOrderService.createOrder(paidEvent);
                        retrieveOrderPaidEvent(paidEvent);
                    }
                    else if (deprecatedOrderStatus == 5) {
                        // refund
                        WeComOrderRefundEvent refundEvent = new WeComOrderRefundEvent();
                        refundEvent.setSuiteId(deprecatedOrder.getSuiteId());
                        refundEvent.setPaidCorpId(deprecatedOrder.getPaidCorpId());
                        refundEvent.setOrderId(deprecatedOrder.getOrderId());
                        retrieveOrderRefundEvent(refundEvent);
                    }
                }
                else if (existedOrder.getOrderStatus() == 5) {
                    WeComOrderRefundEvent refundEvent = new WeComOrderRefundEvent();
                    refundEvent.setSuiteId(existedOrder.getSuiteId());
                    refundEvent.setPaidCorpId(existedOrder.getPaidCorpId());
                    refundEvent.setOrderId(existedOrder.getOrderId());
                    retrieveOrderRefundEvent(refundEvent);
                }
            }
        }
    }

    @Override
    public SocialOrderContext buildSocialOrderContext(WeComOrderPaidEvent event) {
        String spaceId = socialTenantBindService
                .getTenantDepartmentBindSpaceId(event.getSuiteId(), event.getPaidCorpId());
        if (CharSequenceUtil.isBlank(spaceId)) {
            log.error("处理失败，企微企业还未绑定空间站：{}", event.getPaidCorpId());
            return null;
        }
        // 订单购买的付费方案
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(event.getEditionId(),
                event.getUserCount(), SocialFactory.getWeComOrderMonth(event.getOrderPeriod()));
        if (Objects.isNull(price)) {
            throw new BusinessException("没有找到对应的付费信息，企微订单数据为：" + JSONUtil.toJsonStr(event));
        }
        Product product = BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
        SocialOrderContext orderContext = SocialOrderContext.builder()
                .productChannel(ProductChannel.WECOM)
                .socialOrderId(event.getOrderId())
                .amount(event.getPrice().longValue())
                .price(price)
                .orderChannel(OrderChannel.WECOM)
                .product(product)
                .spaceId(spaceId)
                .orderType(SocialFactory.getOrderTypeFromWeCom(event.getOrderType()))
                .paidTime(ClockUtil.secondToLocalDateTime(event.getPaidTime(), DEFAULT_TIME_ZONE))
                .createdTime(ClockUtil.secondToLocalDateTime(event.getOrderTime(), DEFAULT_TIME_ZONE))
                .phase(WeComPlanConfigManager.getSubscriptionPhase(event.getEditionId()))
                .serviceStartTime(ClockUtil.secondToLocalDateTime(event.getBeginTime(), DEFAULT_TIME_ZONE))
                .serviceStopTime(ClockUtil.secondToLocalDateTime(event.getEndTime(), DEFAULT_TIME_ZONE))
                .build();
        orderContext.setActivatedBundle(bundleService.getActivatedBundleBySpaceId(spaceId));
        return orderContext;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        SocialOrderStrategyFactory.register(SocialPlatformType.WECOM, this);
    }

}
