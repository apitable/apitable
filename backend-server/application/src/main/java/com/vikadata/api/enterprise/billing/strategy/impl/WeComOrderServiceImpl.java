package com.vikadata.api.enterprise.billing.strategy.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.billing.core.Bundle;
import com.vikadata.api.enterprise.billing.model.SocialOrderContext;
import com.vikadata.api.enterprise.billing.service.IBundleService;
import com.vikadata.api.enterprise.billing.service.IOrderItemService;
import com.vikadata.api.enterprise.billing.service.IOrderV2Service;
import com.vikadata.api.enterprise.billing.service.ISocialWecomOrderService;
import com.vikadata.api.enterprise.billing.service.ISubscriptionService;
import com.vikadata.api.enterprise.billing.enums.OrderChannel;
import com.vikadata.api.enterprise.billing.enums.OrderType;
import com.vikadata.api.enterprise.billing.enums.SubscriptionPhase;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.billing.strategy.AbstractSocialOrderService;
import com.vikadata.api.enterprise.billing.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.enterprise.social.factory.SocialFactory;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.billing.util.BillingConfigManager;
import com.vikadata.api.enterprise.billing.util.WeComPlanConfigManager;
import com.vikadata.api.enterprise.billing.util.model.ProductChannel;
import com.vikadata.clock.ClockUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.event.order.WeComOrderRefundEvent;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo.Agent;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.shared.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * Implementation for wecom isv order event
 * </p>
 */
@Slf4j
@Service
public class WeComOrderServiceImpl extends AbstractSocialOrderService<WeComOrderPaidEvent, WeComOrderRefundEvent> {
    @Resource
    private IBundleService bundleService;

    @Resource
    private IOrderItemService orderItemService;

    @Resource
    private IOrderV2Service orderV2Service;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialWecomOrderService iSocialWecomOrderService;

    @Resource
    private ISubscriptionService subscriptionService;

    @Resource
    private ISocialCpIsvService iSocialCpIsvService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String retrieveOrderPaidEvent(WeComOrderPaidEvent event) {
        SocialOrderContext context = buildSocialOrderContext(event);
        if (Objects.isNull(context)) {
            return null;
        }
        // Handle subscription
        String subscriptionId;
        Bundle activeBundle = context.getActivatedBundle();
        if (Objects.isNull(activeBundle) && (context.getOrderType() == OrderType.BUY || context.getOrderType() == OrderType.RENEW)) {
            // 3.1 Crate bundle as first subscription
            String bundleId = createBundle(context);
            subscriptionId = createSubscription(bundleId, context);
        }
        else if (Objects.nonNull(activeBundle) && SubscriptionPhase.TRIAL.equals(context.getPhase())) {
            // 3.2 Upgrade while last subscription is trial
            subscriptionId = upgradeSubscription(context);
        }
        else {
            // 3.3 Renew bundle end time, and create a new subscription
            // Both upgrade and renewal in wecom should create new order, tenant will go back to last subscription while refund.
            // So we need to create a new subscription if bundle existed
            // remove last subscription for effective immediately
            subscriptionService.removeBatchBySubscriptionIds(Collections.singletonList(activeBundle.getBaseSubscription().getSubscriptionId()));
            subscriptionId = renewSubscription(context);
        }
        // cp which on trial have not test order, just create space subscription info
        if (!SubscriptionPhase.TRIAL.equals(context.getPhase())) {
            iSocialWecomOrderService.createOrder(event);
            // 1 Save billing order
            String orderId = createOrder(context);
            // 2 Save billing order meta
            createOrderMetaData(orderId, OrderChannel.WECOM, event);
            // 4 Save order item
            createOrderItem(orderId, subscriptionId, context);
            return orderId;
        }
        return null;
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
        // restore the lasted subscription with un refunded
        List<String> lastUnRefundSubscriptionIds = iSocialWecomOrderService.getUnRefundedLastSubscriptionIds(spaceId,
                event.getSuiteId(), event.getPaidCorpId());
        if (!lastUnRefundSubscriptionIds.isEmpty()) {
            subscriptionService.restoreBySubscriptionIds(lastUnRefundSubscriptionIds);
        }
        // retrieve vika order ID related to the wecom order
        String orderId = orderV2Service.getOrderIdByChannelOrderId(spaceId, event.getOrderId());
        List<String> subscriptionIds = orderItemService.getSubscriptionIdsByOrderId(orderId);
        List<String> bundleIds = new ArrayList<>();
        if (!subscriptionIds.isEmpty()) {
            bundleIds = subscriptionService.getBundleIdsBySubscriptionIds(subscriptionIds);
            // Remove subscription if needed
            subscriptionService.removeBatchBySubscriptionIds(subscriptionIds);
        }
        // remove bundle if it's all subscriptions was deleted
        if (!bundleIds.isEmpty() && !subscriptionService.bundlesHaveSubscriptions(bundleIds)) {
            bundleService.removeBatchByBundleIds(bundleIds);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateEvent(String spaceId) {
        // get tenant info
        SocialTenantBindEntity bindInfo = socialTenantBindService.getBySpaceId(spaceId);
        if (null == bindInfo) {
            log.warn("wecom space not bind");
            return;
        }
        // just in trail
        Agent agent = iSocialCpIsvService.getCorpEditionInfo(bindInfo.getTenantId(), bindInfo.getAppId());
        // app stopped
        if (null == agent) {
            return;
        }
        if (WeComPlanConfigManager.isWeComTrialEdition(agent.getEditionId())) {
            WeComOrderPaidEvent event = SocialFactory.formatWecomTailEditionOrderPaidEvent(bindInfo.getAppId(),
                    bindInfo.getTenantId(), bindInfo.getCreatedAt(), agent);
            retrieveOrderPaidEvent(event);
        }
    }

    @Override
    public SocialOrderContext buildSocialOrderContext(WeComOrderPaidEvent event) {
        String spaceId = socialTenantBindService
                .getTenantDepartmentBindSpaceId(event.getSuiteId(), event.getPaidCorpId());
        if (StrUtil.isBlank(spaceId)) {
            log.error("cp not bind space：{}", event.getPaidCorpId());
            return null;
        }
        // Paid plan for order purchase
        Price price = WeComPlanConfigManager.getPriceByWeComEditionIdAndMonth(event.getEditionId(),
                event.getUserCount(), SocialFactory.getWeComOrderMonth(event.getOrderPeriod()));
        if (Objects.isNull(price)) {
            throw new BusinessException("cp cannot find price：" + JSONUtil.toJsonStr(event));
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
        // enterprise WeChat renewal is the start date of the previous order
        if (OrderType.RENEW.equals(orderContext.getOrderType()) && null != orderContext.getActivatedBundle()) {
            orderContext.setServiceStartTime(orderContext.getActivatedBundle().getBundleStartDate());
        }
        return orderContext;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        SocialOrderStrategyFactory.register(SocialPlatformType.WECOM, this);
    }

}
