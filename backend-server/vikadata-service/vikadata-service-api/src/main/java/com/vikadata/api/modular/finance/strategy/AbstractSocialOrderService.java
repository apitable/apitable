package com.vikadata.api.modular.finance.strategy;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.enums.finance.Currency;
import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.modular.finance.core.Subscription;
import com.vikadata.api.modular.finance.model.SocialOrderContext;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderMetadataService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.OrderUtil;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.OrderEntity;
import com.vikadata.entity.OrderItemEntity;
import com.vikadata.entity.OrderMetadataEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.system.config.billing.Plan;

import static com.vikadata.api.enums.finance.BundleState.ACTIVATED;

/**
 * <p>
 * 第三方订单抽象类
 * </p>
 * @author zoe zheng
 * @date 2022/5/26 17:12
 */
public abstract class AbstractSocialOrderService<T, R> implements ISocialOrderService<T, R> {
    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private IOrderMetadataService iOrderMetadataService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Override
    public String createOrder(SocialOrderContext order) {
        String orderId = OrderUtil.createOrderId();
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setSpaceId(order.getSpaceId());
        orderEntity.setOrderId(orderId);
        orderEntity.setOrderChannel(order.getOrderChannel().getName());
        orderEntity.setChannelOrderId(order.getSocialOrderId());
        orderEntity.setOrderType(order.getOrderType().name());
        orderEntity.setCurrency(Currency.CNY.name());
        orderEntity.setAmount(order.getAmount().intValue());
        orderEntity.setOriginalAmount(order.getAmount().intValue());
        if (null != order.getOriginalAmount()) {
            orderEntity.setOriginalAmount(order.getOriginalAmount().intValue());
        }
        orderEntity.setDiscountAmount(order.getDiscountAmount().intValue());
        orderEntity.setState(OrderStatus.FINISHED.getName());
        orderEntity.setIsPaid(true);
        orderEntity.setPaidTime(order.getPaidTime());
        orderEntity.setCreatedTime(order.getCreatedTime());
        orderEntity.setCreatedBy(-1L);
        orderEntity.setUpdatedBy(-1L);
        iOrderV2Service.save(orderEntity);
        return orderId;
    }

    @Override
    public void createOrderItem(String orderId, String subscriptionId, SocialOrderContext order) {
        // 2. 创建订单明细
        OrderItemEntity orderItemEntity = new OrderItemEntity();
        orderItemEntity.setSpaceId(order.getSpaceId());
        orderItemEntity.setOrderId(orderId);
        orderItemEntity.setAmount(order.getAmount().intValue());
        orderItemEntity.setProductName(order.getProduct().getId());
        orderItemEntity.setProductCategory(order.getProduct().getCategory());
        // 2.1 基础版本没有价格方案，直接读取默认的方案
        if (null == order.getPrice()) {
            Plan plan = BillingConfigManager.getFreePlan(order.getProductChannel());
            orderItemEntity.setPlanId(plan.getId());
            orderItemEntity.setSeat(plan.getSeats());
            // 不限制使用时间，永久免费
            orderItemEntity.setMonths(-1);
        }
        else {
            orderItemEntity.setPlanId(order.getPrice().getPlanId());
            orderItemEntity.setSeat(order.getPrice().getSeat());
            orderItemEntity.setMonths(order.getPrice().getMonth());
        }
        orderItemEntity.setCurrency(Currency.CNY.name());
        if (StrUtil.isNotBlank(subscriptionId)) {
            orderItemEntity.setSubscriptionId(subscriptionId);
        }
        orderItemEntity.setCreatedBy(-1L);
        orderItemEntity.setUpdatedBy(-1L);
        iOrderItemService.save(orderItemEntity);
    }

    @Override
    public void createOrderMetaData(String orderId, OrderChannel orderChannel, T event) {
        OrderMetadataEntity metadata = OrderMetadataEntity.builder()
                .orderId(orderId).orderChannel(orderChannel.getName())
                .metadata(JSONUtil.toJsonStr(event))
                .build();
        iOrderMetadataService.save(metadata);
    }

    @Override
    public String createBundle(SocialOrderContext order) {
        // 基础版本为默认版本，不写入订阅计划中
        if (null == order.getPrice()) {
            return null;
        }
        String bundleId = UUID.randomUUID().toString();
        // 权益开始时间 定义了直接使用 没有定义使用支付时间
        LocalDateTime startDate = ObjectUtil.defaultIfNull(order.getServiceStartTime(), order.getPaidTime());
        // 权益到期时间 定义了直接使用 没有定义使用价格方案规定的时间
        LocalDateTime endDate = ObjectUtil.defaultIfNull(order.getServiceStopTime(),
                startDate.plusMonths(order.getPrice().getMonth()));
        // 创建空间站订阅集合包
        BundleEntity bundleEntity = new BundleEntity();
        bundleEntity.setBundleId(bundleId);
        bundleEntity.setSpaceId(order.getSpaceId());
        bundleEntity.setState(ACTIVATED.name());
        bundleEntity.setStartDate(startDate);
        bundleEntity.setEndDate(endDate);
        bundleEntity.setCreatedBy(-1L);
        bundleEntity.setUpdatedBy(-1L);
        iBundleService.create(bundleEntity);
        return bundleId;
    }

    @Override
    public String createSubscription(String bundleId, SocialOrderContext order) {
        // 基础版本为默认版本，不写入订阅计划中
        if (null == order.getPrice() || StrUtil.isBlank(bundleId)) {
            return null;
        }
        // 权益开始时间 定义了直接使用 没有定义使用支付时间
        LocalDateTime startDate = ObjectUtil.defaultIfNull(order.getServiceStartTime(), order.getPaidTime());
        // 权益到期时间 定义了直接使用 没有定义使用价格方案规定的时间
        LocalDateTime endDate = ObjectUtil.defaultIfNull(order.getServiceStopTime(),
                startDate.plusMonths(order.getPrice().getMonth()));
        String subscriptionId = UUID.randomUUID().toString();
        SubscriptionEntity subscription = new SubscriptionEntity();
        subscription.setSpaceId(order.getSpaceId());
        subscription.setBundleId(bundleId);
        subscription.setSubscriptionId(subscriptionId);
        subscription.setProductName(order.getProduct().getId());
        subscription.setProductCategory(order.getProduct().getCategory());
        subscription.setPlanId(order.getPrice().getPlanId());
        subscription.setState(SubscriptionState.ACTIVATED.name());
        subscription.setBundleStartDate(null != order.getActivatedBundle() ? order.getActivatedBundle().getBundleStartDate() : startDate);
        subscription.setStartDate(startDate);
        subscription.setExpireDate(endDate);
        subscription.setPhase(order.getPhase().getName());
        subscription.setCreatedBy(-1L);
        subscription.setUpdatedBy(-1L);
        iSubscriptionService.create(subscription);
        return subscriptionId;
    }

    @Override
    public String renewSubscription(SocialOrderContext order) {
        // 激活的集合不存在或者续费了免费版本 不需要修改 (没有激活的订阅需要新建)
        if (null == order.getActivatedBundle() || null == order.getPrice()) {
            return null;
        }
        // 修改集合失效时间
        updateBundleEndDate(order);
        // 续费创建新的订阅
        return createSubscription(order.getActivatedBundle().getBundleId(), order);
    }

    @Override
    public String upgradeSubscription(SocialOrderContext order) {
        // 激活的集合不存在或者续费了免费版本 不需要修改 (没有激活的订阅需要新建)
        if (null == order.getActivatedBundle() || null == order.getPrice()) {
            return null;
        }
        // 修改集合失效时间
        updateBundleEndDate(order);
        // 权益开始时间 定义了直接使用 没有定义使用上一条的时间
        LocalDateTime startDate = ObjectUtil.defaultIfNull(order.getServiceStartTime(), order.getActivatedBundle().getBundleStartDate());
        // 权益到期时间 定义了直接使用 没有定义使用价格方案规定的时间
        LocalDateTime endDate = ObjectUtil.defaultIfNull(order.getServiceStopTime(),
                startDate.plusMonths(order.getPrice().getMonth()));
        // 升级 立即生效(替换上一个订阅的产品) 生效开始时间不变
        SubscriptionEntity updateSubscription = SubscriptionEntity.builder()
                .productCategory(order.getProduct().getCategory())
                .startDate(startDate)
                .expireDate(endDate)
                .planId(order.getPrice().getPlanId())
                .productName(order.getPrice().getProduct())
                .phase(order.getPhase().getName()) // 试用期内购买也是立即生效
                .updatedBy(-1L)
                .build();
        Subscription baseSubscription = order.getActivatedBundle().getBaseSubscription();
        iSubscriptionService.updateBySubscriptionId(baseSubscription.getSubscriptionId(), updateSubscription);
        return baseSubscription.getSubscriptionId();
    }

    @Override
    public void updateBundleEndDate(SocialOrderContext order) {
        // 权益开始时间 定义了直接使用 没有定义使用支付时间
        LocalDateTime startDate = ObjectUtil.defaultIfNull(order.getServiceStartTime(),
                order.getActivatedBundle().getBundleStartDate());
        // 权益到期时间 定义了直接使用 没有定义使用价格方案规定的时间
        LocalDateTime endDate = ObjectUtil.defaultIfNull(order.getServiceStopTime(),
                startDate.plusMonths(order.getPrice().getMonth()));
        // 修改bundle的截止时间
        BundleEntity updateBundle = BundleEntity.builder()
                .bundleId(order.getActivatedBundle().getBundleId())
                .endDate(endDate)
                .updatedBy(-1L)
                .build();
        updateBundle.setEndDate(endDate);
        iBundleService.updateByBundleId(order.getActivatedBundle().getBundleId(), updateBundle);
    }
}
