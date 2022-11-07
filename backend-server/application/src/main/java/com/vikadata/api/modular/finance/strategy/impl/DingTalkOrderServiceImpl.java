package com.vikadata.api.modular.finance.strategy.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.finance.model.SocialOrderContext;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISocialDingTalkOrderService;
import com.vikadata.api.modular.finance.service.ISocialDingTalkRefundService;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.finance.strategy.AbstractSocialOrderService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.DingTalkPlanConfigManager;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.clock.ClockUtil;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.integration.grpc.CorpBizDataDto;
import com.vikadata.social.dingtalk.enums.DingTalkBizType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderChargeType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderType;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * ding talk orders service implements
 * handle ding talk order event
 * </p>
 */
@Service
@Slf4j
public class DingTalkOrderServiceImpl extends AbstractSocialOrderService<SyncHttpMarketOrderEvent, SyncHttpMarketServiceCloseEvent> {
    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialDingTalkOrderService iSocialDingTalkOrderService;

    @Resource
    private ISocialDingTalkRefundService iSocialDingTalkRefundService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Override
    public String retrieveOrderPaidEvent(SyncHttpMarketOrderEvent event) {
        SocialOrderContext context = buildSocialOrderContext(event);
        if (null == context) {
            return null;
        }
        // Create order
        String orderId = createOrder(context);
        // Create order metadata
        createOrderMetaData(orderId, OrderChannel.DINGTALK, event);
        // Upgrade, Renewal, New Purchase, Renewal Upgrade, Trial
        String subscriptionId;
        if (OrderType.BUY.equals(context.getOrderType()) && null == context.getActivatedBundle()) {
            // Create subscription bundle
            String bundleId = createBundle(context);
            subscriptionId = createSubscription(bundleId, context);
        }
        else if (OrderType.RENEW.equals(context.getOrderType())) {
            subscriptionId = renewSubscription(context);
        }
        else {
            subscriptionId = upgradeSubscription(context);
        }
        // Create order item
        createOrderItem(orderId, subscriptionId, context);
        // Mark the order has been processed
        iSocialDingTalkOrderService.updateTenantOrderStatusByOrderId(event.getCorpId(), event.getSuiteId(),
                event.getOrderId(), 1);
        // Sync order events
        SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
        return orderId;
    }

    @Override
    public void retrieveOrderRefundEvent(SyncHttpMarketServiceCloseEvent event) {
        // Query the subscription corresponding to the order number
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(event.getSuiteId(), event.getCorpId());
        if (StrUtil.isBlank(spaceId)) {
            log.error("Failed to process the refund, DingTalk has not yet bound the space「{}」.", event.getCorpId());
            return;
        }
        // Obtain the order ID corresponding to the refunded product.
        // The service order given by the DingTalk event also needs to be processed
        List<String> dingTalkOrderIds =
                iSocialDingTalkOrderService.getOrderIdsByTenantIdAndAppIdAndItemCode(event.getCorpId(),
                        event.getSuiteId(), event.getItemCode());
        dingTalkOrderIds.forEach(i -> {
            // Delete the subscription information corresponding to the order
            String orderId = iOrderV2Service.getOrderIdByChannelOrderId(spaceId, i);
            List<String> subscriptionIds =
                    iOrderItemService.getSubscriptionIdsByOrderId(orderId).stream().filter(StrUtil::isNotBlank).collect(Collectors.toList());
            List<String> bundleIds = subscriptionIds.stream().map(subscriptionId -> {
                SubscriptionEntity subscription = iSubscriptionService.getBySubscriptionId(subscriptionId);
                if (null != subscription) {
                    return subscription.getBundleId();
                }
                return null;
            }).filter(StrUtil::isNotBlank).collect(Collectors.toList());
            if (!subscriptionIds.isEmpty()) {
                iSubscriptionService.removeBatchBySubscriptionIds(subscriptionIds);
            }
            if (!bundleIds.isEmpty()) {
                iBundleService.removeBatchByBundleIds(bundleIds);
            }
        });
        // Refund processing completed
        iSocialDingTalkRefundService.updateTenantRefundStatusByOrderId(event.getCorpId(), event.getSuiteId(),
                event.getOrderId(), 1);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateEvent(String spaceId) {
        // Read binding information
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (null == bindInfo) {
            log.warn("DingTalk space is not bound.");
            return;
        }
        List<CorpBizDataDto> bizDataList = iDingTalkInternalIsvService.getCorpBizDataByBizTypes(bindInfo.getAppId(),
                bindInfo.getTenantId(),
                ListUtil.toList(DingTalkBizType.MARKET_ORDER, DingTalkBizType.SUBSCRIPTION_CLOSE));
        bizDataList.forEach(i -> {
            if (DingTalkBizType.MARKET_ORDER.getValue().equals(i.getBizType())) {
                // Check if it has been processed
                SyncHttpMarketOrderEvent event = JSONUtil.toBean(i.getBizData(), SyncHttpMarketOrderEvent.class);
                Integer status = iSocialDingTalkOrderService.getStatusByOrderId(bindInfo.getTenantId(), bindInfo.getAppId(),
                        i.getBizId());
                if (null == status) {
                    iSocialDingTalkOrderService.createOrder(event);
                }
                // not processed
                if (!SqlHelper.retBool(status)) {
                    retrieveOrderPaidEvent(event);
                }
            }
            if (DingTalkBizType.SUBSCRIPTION_CLOSE.getValue().equals(i.getBizType())) {
                SyncHttpMarketServiceCloseEvent event = JSONUtil.toBean(i.getBizData(),
                        SyncHttpMarketServiceCloseEvent.class);
                Integer status = iSocialDingTalkRefundService.getStatusByOrderId(bindInfo.getTenantId(),
                        bindInfo.getAppId(), event.getOrderId());
                if (null == status) {
                    iSocialDingTalkRefundService.createRefund(event);
                }
                // not processed
                if (!SqlHelper.retBool(status)) {
                    retrieveOrderRefundEvent(JSONUtil.toBean(i.getBizData(), SyncHttpMarketServiceCloseEvent.class));
                }
            }
        });
    }

    @Override
    public SocialOrderContext buildSocialOrderContext(SyncHttpMarketOrderEvent event) {
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(event.getSuiteId(), event.getCorpId());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("DingTalk enterprise「{}」 has not received the application activation event", event.getCorpId());
            return null;
        }
        // Paid plan for order purchase
        Price price = DingTalkPlanConfigManager.getPriceByItemCodeAndMonth(event.getItemCode());
        // If the price is null, then the basic version of DingTalk is purchased
        Product product = ObjectUtil.isNull(price) ? BillingConfigManager.getCurrentFreeProduct(ProductChannel.DINGTALK)
                : BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
        SubscriptionPhase phase = DingTalkOrderChargeType.TRYOUT.getValue().equals(event.getOrderChargeType()) ?
                SubscriptionPhase.TRIAL : SubscriptionPhase.FIXEDTERM;
        SocialOrderContext orderContext = SocialOrderContext.builder()
                .productChannel(ProductChannel.DINGTALK)
                .socialOrderId(event.getOrderId())
                .amount(event.getPayFee())
                .price(price)
                .orderChannel(OrderChannel.DINGTALK)
                .product(product)
                .spaceId(spaceId)
                .orderType(OrderType.of(event.getOrderType()))
                .paidTime(ClockUtil.milliToLocalDateTime(event.getPaidtime(), DEFAULT_TIME_ZONE))
                .createdTime(ClockUtil.milliToLocalDateTime(event.getPaidtime(), DEFAULT_TIME_ZONE))
                .phase(phase)
                .serviceStartTime(ClockUtil.milliToLocalDateTime(event.getServiceStartTime(), DEFAULT_TIME_ZONE))
                .serviceStopTime(ClockUtil.milliToLocalDateTime(event.getServiceStopTime(), DEFAULT_TIME_ZONE))
                .build();
        if (null != event.getDiscountFee() && event.getDiscountFee() > 0) {
            orderContext.setDiscountAmount(event.getDiscountFee());
            orderContext.setOriginalAmount(event.getPayFee() + event.getDiscountFee());
        }
        // unified for renewal
        if (event.getOrderType().equals(DingTalkOrderType.RENEW_DEGRADE.getValue()) || event.getOrderType().equals(DingTalkOrderType.RENEW_UPGRADE.getValue())) {
            orderContext.setOrderType(OrderType.RENEW);
        }
        orderContext.setActivatedBundle(iBundleService.getActivatedBundleBySpaceId(spaceId));
        return orderContext;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        SocialOrderStrategyFactory.register(SocialPlatformType.DINGTALK, this);
    }
}
