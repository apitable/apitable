package com.vikadata.api.modular.finance.strategy.impl;

import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.modular.finance.model.SocialOrderContext;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.ISocialFeishuOrderService;
import com.vikadata.api.modular.finance.strategy.AbstractSocialOrderService;
import com.vikadata.api.modular.finance.strategy.SocialOrderStrategyFactory;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantOrderService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.LarkPlanConfigManager;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.clock.ClockUtil;
import com.vikadata.social.feishu.enums.LarkOrderBuyType;
import com.vikadata.social.feishu.enums.PricePlanType;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * lark order service
 * handle lark orders
 * </p>
 * @author zoe zheng
 * @date 2022/5/18 18:33
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
    public void retrieveOrderPaidEvent(OrderPaidEvent event) {
        SocialOrderContext context = buildSocialOrderContext(event);
        if (null == context) {
            return;
        }
        // 创建订单
        String orderId = createOrder(context);
        // 创建订单元数据
        createOrderMetaData(orderId, OrderChannel.LARK, event);
        // 升级、续费、新购、续费升级、试用
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
        // 创建订单项目
        createOrderItem(orderId, subscriptionId, context);
        // 标记飞书订单已经处理完成
        iSocialFeishuOrderService.updateTenantOrderStatusByOrderId(event.getTenantKey(), event.getAppId(), event.getOrderId(), 1);
    }

    @Override
    public void retrieveOrderRefundEvent(Object event) {
        // todo 飞书目前是人工退款
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void migrateEvent(String spaceId) {
        // 读取绑定信息
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
            log.warn("飞书企业还未收到开通应用事件:{}", event.getTenantKey());
            return null;
        }
        // 订单购买的付费方案
        Price price = LarkPlanConfigManager.getPriceByLarkPlanId(event.getPricePlanId());
        // price是null的情况，那么购买的是飞书基础版
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
        // 飞书试用时间15天
        if (SubscriptionPhase.TRIAL.equals(phase)) {
            // 飞书续费可以试用，试用覆盖试用
            if (null != context.getActivatedBundle() && !SubscriptionPhase.TRIAL.equals(context.getActivatedBundle().getBaseSubscription().getPhase())) {
                context.setServiceStopTime(context.getActivatedBundle().getBundleEndDate().plusDays(15));
            }
            else {
                context.setServiceStopTime(context.getPaidTime().plusDays(15));
            }
        }
        // 飞书续费为上一个订单结束日期
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
