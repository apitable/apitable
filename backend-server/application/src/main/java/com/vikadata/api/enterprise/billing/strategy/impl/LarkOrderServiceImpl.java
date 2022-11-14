package com.vikadata.api.enterprise.billing.strategy.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.billing.model.SocialOrderContext;
import com.vikadata.api.enterprise.billing.service.IBundleService;
import com.vikadata.api.enterprise.billing.service.ISocialFeishuOrderService;
import com.vikadata.api.enterprise.billing.enums.OrderChannel;
import com.vikadata.api.enterprise.billing.enums.OrderType;
import com.vikadata.api.enterprise.billing.enums.SubscriptionPhase;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.billing.strategy.AbstractSocialOrderService;
import com.vikadata.api.enterprise.billing.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.enterprise.social.model.TenantBindDTO;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantOrderService;
import com.vikadata.api.enterprise.billing.util.BillingConfigManager;
import com.vikadata.api.enterprise.billing.util.LarkPlanConfigManager;
import com.vikadata.api.enterprise.billing.util.model.ProductChannel;
import com.vikadata.clock.ClockUtil;
import com.vikadata.social.feishu.enums.LarkOrderBuyType;
import com.vikadata.social.feishu.enums.PricePlanType;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.shared.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * lark order service
 * handle lark orders
 * </p>
 */
@Service
@Slf4j
public class LarkOrderServiceImpl extends AbstractSocialOrderService<OrderPaidEvent, Object> {

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISocialFeishuOrderService iSocialFeishuOrderService;

    @Resource
    private ISocialTenantOrderService iSocialTenantOrderService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String retrieveOrderPaidEvent(OrderPaidEvent event) {
        SocialOrderContext context = buildSocialOrderContext(event);
        if (null == context) {
            return null;
        }
        // Create order
        String orderId = createOrder(context);
        // Create order metadata
        createOrderMetaData(orderId, OrderChannel.LARK, event);
        // Upgrade, Renewal, New Purchase, Renewal Upgrade, Trial
        String subscriptionId;
        if (LarkOrderBuyType.BUY.getType().equals(event.getBuyType()) && null == context.getActivatedBundle()) {
            String bundleId = createBundle(context);
            subscriptionId = createSubscription(bundleId, context);
        }
        else if (LarkOrderBuyType.RENEW.getType().equals(event.getBuyType())) {
            subscriptionId = renewSubscription(context);
        }
        else {
            subscriptionId = upgradeSubscription(context);
        }
        // Create order item
        createOrderItem(orderId, subscriptionId, context);
        // Mark Feishu order has been processed
        iSocialFeishuOrderService.updateTenantOrderStatusByOrderId(event.getTenantKey(), event.getAppId(), event.getOrderId(), 1);
        return orderId;
    }

    @Override
    public void retrieveOrderRefundEvent(Object event) {
        // todo Feishu is currently refunding manually
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateEvent(String spaceId) {
        // read binding information
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        List<String> eventList = iSocialTenantOrderService.getOrderDataByTenantIdAndAppId(bindInfo.getTenantId(),
                bindInfo.getAppId(), SocialPlatformType.FEISHU);
        eventList.forEach(i -> {
            OrderPaidEvent event = JSONUtil.toBean(i, OrderPaidEvent.class);
            Integer status = iSocialFeishuOrderService.getStatusByOrderId(bindInfo.getTenantId(), bindInfo.getAppId(),
                    event.getOrderId());
            if (null == status) {
                iSocialFeishuOrderService.createOrder(event);
            }
            if (!SqlHelper.retBool(status)) {
                retrieveOrderPaidEvent(event);
            }
        });
    }

    @Override
    public SocialOrderContext buildSocialOrderContext(OrderPaidEvent event) {
        String spaceId = iSocialTenantBindService.getTenantDepartmentBindSpaceId(event.getAppId(), event.getTenantKey());
        if (StrUtil.isBlank(spaceId)) {
            log.warn("Feishu Enterprise「{}」 has not received the application activation event.", event.getTenantKey());
            return null;
        }
        // Paid plan for order purchase
        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(event.getPricePlanId());
        // If the price is null, then the basic version of Feishu is purchased
        Product product = ObjectUtil.isNull(price) ? BillingConfigManager.getCurrentFreeProduct(ProductChannel.LARK) : BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
        SubscriptionPhase phase = PricePlanType.TRIAL.getType().equals(event.getPricePlanType()) ? SubscriptionPhase.TRIAL : SubscriptionPhase.FIXEDTERM;
        SocialOrderContext context = SocialOrderContext.builder()
                .productChannel(ProductChannel.LARK)
                .socialOrderId(event.getOrderId())
                .amount(event.getOrderPayPrice())
                .price(price).product(product)
                .spaceId(spaceId)
                .paidTime(ClockUtil.secondToLocalDateTime(Long.parseLong(event.getPayTime()), DEFAULT_TIME_ZONE))
                .createdTime(ClockUtil.secondToLocalDateTime(Long.parseLong(event.getCreateTime()), DEFAULT_TIME_ZONE))
                .phase(phase)
                .orderType(OrderType.ofName(event.getBuyType()))
                .orderChannel(OrderChannel.LARK)
                .activatedBundle(iBundleService.getActivatedBundleBySpaceId(spaceId))
                .build();
        // Feishu trial period 15 days
        if (SubscriptionPhase.TRIAL.equals(phase)) {
            // Feishu renewal fee can be tried, and the trial covers the trial
            if (null != context.getActivatedBundle() && !SubscriptionPhase.TRIAL.equals(context.getActivatedBundle().getBaseSubscription().getPhase())) {
                context.setServiceStopTime(context.getActivatedBundle().getBundleEndDate().plusDays(15));
            }
            else {
                context.setServiceStopTime(context.getPaidTime().plusDays(15));
            }
        }
        // Feishu renewal is the end date of the previous order
        if (LarkOrderBuyType.RENEW.getType().equals(event.getBuyType()) && null != context.getActivatedBundle()) {
            context.setServiceStartTime(context.getActivatedBundle().getBundleEndDate());
        }
        return context;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        SocialOrderStrategyFactory.register(SocialPlatformType.FEISHU, this);
    }
}
