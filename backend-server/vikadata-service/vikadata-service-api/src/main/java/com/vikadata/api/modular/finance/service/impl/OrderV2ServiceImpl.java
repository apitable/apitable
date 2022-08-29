package com.vikadata.api.modular.finance.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.pingplusplus.model.Charge;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.config.properties.SubscriptionProperties;
import com.vikadata.api.context.ClockManager;
import com.vikadata.api.enums.finance.Currency;
import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.PayChannel;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.ComparableProduct;
import com.vikadata.api.modular.finance.core.DryRunArguments;
import com.vikadata.api.modular.finance.core.OrderArguments;
import com.vikadata.api.modular.finance.core.OrderPrice;
import com.vikadata.api.modular.finance.core.Subscription;
import com.vikadata.api.modular.finance.mapper.OrderMapper;
import com.vikadata.api.modular.finance.model.OrderDetailVo;
import com.vikadata.api.modular.finance.model.OrderPaymentVo;
import com.vikadata.api.modular.finance.model.OrderPreview;
import com.vikadata.api.modular.finance.model.PingChargeSuccess;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderPaymentService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.api.util.PingppUtil;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.OrderUtil;
import com.vikadata.api.util.billing.model.BillingPlanPrice;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.boot.autoconfigure.pingpp.PingProperties;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.OrderEntity;
import com.vikadata.entity.OrderItemEntity;
import com.vikadata.entity.OrderPaymentEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.OrderException.NOT_ALLOW_DOWNGRADE;
import static com.vikadata.api.enums.exception.OrderException.ORDER_EXCEPTION;
import static com.vikadata.api.enums.exception.OrderException.ORDER_HAS_CANCELED;
import static com.vikadata.api.enums.exception.OrderException.ORDER_HAS_PAID;
import static com.vikadata.api.enums.exception.OrderException.ORDER_NOT_EXIST;
import static com.vikadata.api.enums.exception.OrderException.PAYMENT_ORDER_NOT_EXIST;
import static com.vikadata.api.enums.exception.OrderException.PLAN_NOT_EXIST;
import static com.vikadata.api.enums.exception.OrderException.REPEAT_NEW_BUY_ORDER;
import static com.vikadata.api.enums.finance.PayChannel.ALIPAY_PC;
import static com.vikadata.api.enums.finance.PayChannel.WX_PUB_QR;
import static com.vikadata.api.util.billing.BillingUtil.legacyPlanId;
import static com.vikadata.api.util.billing.OrderUtil.calculateProrationBetweenDates;
import static com.vikadata.api.util.billing.OrderUtil.calculateUnusedAmount;
import static com.vikadata.api.util.billing.OrderUtil.centsToYuan;
import static com.vikadata.api.util.billing.OrderUtil.toCurrencyUnit;
import static com.vikadata.api.util.billing.OrderUtil.yuanToCents;
import static java.time.temporal.ChronoUnit.DAYS;

/**
 * 订单服务实现类
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class OrderV2ServiceImpl extends ServiceImpl<OrderMapper, OrderEntity> implements IOrderV2Service {

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private IOrderPaymentService iOrderPaymentService;

    @Autowired(required = false)
    private PingProperties pingProperties;

    @Resource
    private SubscriptionProperties subscriptionProperties;

    @Override
    public OrderEntity getByOrderId(String orderId) {
        return baseMapper.selectByOrderId(orderId);
    }

    @Override
    public List<OrderEntity> getByOrderIds(List<String> orderIds) {
        return baseMapper.selectByOrderIds(orderIds);
    }

    @Override
    public OrderDetailVo getOrderDetailByOrderId(String orderId) {
        OrderEntity orderEntity = getByOrderId(orderId);
        OrderDetailVo orderDetailVo = new OrderDetailVo();
        orderDetailVo.setOrderNo(orderEntity.getOrderId());
        orderDetailVo.setPriceOrigin(centsToYuan(orderEntity.getOriginalAmount()));
        orderDetailVo.setPricePaid(centsToYuan(orderEntity.getAmount()));
        orderDetailVo.setStatus(Objects.requireNonNull(OrderStatus.of(orderEntity.getState())).getName());
        orderDetailVo.setCreatedTime(orderEntity.getCreatedAt());
        return orderDetailVo;
    }

    @Override
    public OrderPreview triggerDryRunOrderGeneration(DryRunArguments dryRunArguments) {
        String spaceId = dryRunArguments.getSpaceId();
        OrderPreview orderPreview = new OrderPreview();
        orderPreview.setSpaceId(spaceId);
        orderPreview.setCurrency(Currency.CNY.name());
        // 查找变更付费方案
        Price newPricePlan = BillingConfigManager.getPriceBySeatAndMonth(dryRunArguments.getProduct(), dryRunArguments.getSeat(), dryRunArguments.getMonth());
        if (newPricePlan == null) {
            throw new BusinessException(PLAN_NOT_EXIST);
        }
        // 获取空间的订阅信息
        Bundle activeBundle = iBundleService.getActivatedBundleBySpaceId(spaceId);
        // 设置订单类型
        orderPreview.setOrderType(parseOrderType(activeBundle, newPricePlan));
        switch (dryRunArguments.getAction()) {
            case START_BILLING:
            case RENEW:
                BillingPlanPrice planPrice = BillingPlanPrice.of(newPricePlan, ClockManager.me().getLocalDateNow());
                orderPreview.setPriceOrigin(planPrice.getOrigin());
                orderPreview.setPriceDiscount(planPrice.getDiscount());
                orderPreview.setPricePaid(planPrice.getActual());
                break;
            case UPGRADE:
                OrderPrice orderPrice = repairOrderPrice(activeBundle, newPricePlan);
                orderPreview.setPriceOrigin(toCurrencyUnit(orderPrice.getPriceOrigin()));
                orderPreview.setPriceUnusedCalculated(toCurrencyUnit(orderPrice.getPriceUnusedCalculated()));
                orderPreview.setPriceDiscount(toCurrencyUnit(orderPrice.getPriceDiscount()));
                if (orderPrice.getPricePaid().compareTo(BigDecimal.ZERO) <= 0) {
                    // 负数代表抵扣金额大于待支付金额,实际是0元
                    orderPreview.setPricePaid(BigDecimal.ZERO);
                }
                else {
                    orderPreview.setPricePaid(toCurrencyUnit(orderPrice.getPricePaid()));
                }
                break;
            default:
                throw new IllegalArgumentException("Unexpected dryRunArguments action " + dryRunArguments.getAction());
        }
        return orderPreview;
    }

    @Override
    public OrderPrice repairOrderPrice(Bundle activeBundle, Price newPricePlan) {
        if (activeBundle == null) {
            throw new RuntimeException("Space has not subscription ");
        }
        // 即将要改变的订阅
        Subscription subscriptionForChange = activeBundle.getBaseSubscription();
        List<OrderItemEntity> orderItemEntities = iOrderItemService.getBySubscriptionId(subscriptionForChange.getSubscriptionId());
        if (orderItemEntities.isEmpty()) {
            throw new RuntimeException("can not repair price for upgrade order");
        }
        List<String> orderIds = orderItemEntities.stream().map(OrderItemEntity::getOrderId).collect(Collectors.toList());
        List<OrderEntity> orderEntities = getByOrderIds(orderIds);
        int[] findUpgradeOrderItemIndexes = CollectionUtil.findIndex(orderEntities, order -> OrderType.of(order.getOrderType()) == OrderType.UPGRADE);
        // 原付费方案的总金额
        BigDecimal totalAmount = BigDecimal.ZERO;
        if (findUpgradeOrderItemIndexes.length > 0) {
            // 从最后游标开始叠加计算订单金额
            int last = findUpgradeOrderItemIndexes[findUpgradeOrderItemIndexes.length - 1];
            String lastUpgradeOrderId = orderEntities.get(last).getOrderId();
            int[] indexOfAll = CollectionUtil.findIndex(orderItemEntities, orderItem -> orderItem.getOrderId().equals(lastUpgradeOrderId));
            int lastItem = indexOfAll[0];
            for (int i = lastItem; i < orderItemEntities.size(); i++) {
                OrderItemEntity orderItem = orderItemEntities.get(i);
                totalAmount = totalAmount.add(centsToYuan(orderItem.getAmount()));
            }
        }
        else {
            totalAmount = orderItemEntities.stream()
                    .map(item -> centsToYuan(item.getAmount()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        if (log.isDebugEnabled()) {
            log.debug("old paid plan amount: {}", totalAmount);
        }
        // 旧方案期限
        LocalDate startDate = activeBundle.getBundleStartDate().toLocalDate();
        LocalDate endDate = activeBundle.getBaseSubscription().getExpireDate().toLocalDate();
        // 旧方案总天数
        long nbTotalDays = DAYS.between(startDate, endDate);
        // targetDate计算使用天数比例，此方法只有在国内使用，使用中国时区
        LocalDate targetDate = ClockManager.me().getLocalDateNow();
        BigDecimal usedDaysProrated = calculateProrationBetweenDates(startDate, targetDate, nbTotalDays);
        if (log.isDebugEnabled()) {
            log.debug("used pro-rated: {}", usedDaysProrated);
        }
        // 旧方案剩余金额
        BigDecimal unusedCalculatedAmount = calculateUnusedAmount(totalAmount, usedDaysProrated);
        if (log.isDebugEnabled()) {
            log.debug("unused plan calculated amount: {}", unusedCalculatedAmount);
        }
        // 变更付费方案的价格(单位：元)
        BillingPlanPrice planPrice = BillingPlanPrice.of(newPricePlan, ClockManager.me().getLocalDateNow());
        BigDecimal upgradePlanAmount = planPrice.getActual();
        if (log.isDebugEnabled()) {
            log.debug("ready change plan amount: {}", upgradePlanAmount);
        }
        // 支付金额
        BigDecimal paidAmount = upgradePlanAmount.subtract(unusedCalculatedAmount);
        return new OrderPrice(upgradePlanAmount, unusedCalculatedAmount, unusedCalculatedAmount, paidAmount);
    }

    @Override
    public OrderType parseOrderType(Bundle activeBundle, Price newPricePlan) {
        // 根据请求参数，分析订单类型：新购、续订、升级
        OrderType orderType = OrderType.BUY;
        if (activeBundle == null) {
            // 没有订阅，返回新购类型
            return orderType;
        }
        // 有激活中的订阅，判断基础类型产品订阅等级，确认是续订还是升级
        Subscription baseProductSubscription = activeBundle.getBaseSubscription();
        // 当前空间站的订阅方案
        Plan currentPricePlan = BillingConfigManager.getBillingConfig().getPlans().get(legacyPlanId(baseProductSubscription.getPlanId()));
        ComparableProduct currentProduct = new ComparableProduct(ProductEnum.of(currentPricePlan.getProduct()));
        if (currentProduct.getProduct().isFree()) {
            return orderType;
        }
        // 请求的订阅方案
        ComparableProduct requestProduct = new ComparableProduct(ProductEnum.of(newPricePlan.getProduct()));
        if (requestProduct.isEqual(currentProduct)) {
            // 请求产品类型一致，判断方案人数差异
            if (newPricePlan.getSeat() > currentPricePlan.getSeats()) {
                // 人数大于当前方案，升级订单
                orderType = OrderType.UPGRADE;
            }
            else if (newPricePlan.getSeat().equals(currentPricePlan.getSeats())) {
                // 人数相同，续费订单
                orderType = OrderType.RENEW;
            }
            else if (newPricePlan.getSeat() < currentPricePlan.getSeats()) {
                log.error("不允许请求订阅降级");
                throw new BusinessException(NOT_ALLOW_DOWNGRADE);
            }
        }
        else if (requestProduct.isGreaterThan(currentProduct)) {
            // 升级请求
            orderType = OrderType.UPGRADE;
        }
        else if (requestProduct.isLessThan(currentProduct)) {
            // 不允许降级，拒绝创建订单
            log.error("不允许请求订阅降级");
            throw new BusinessException(NOT_ALLOW_DOWNGRADE);
        }
        return orderType;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String createOrder(OrderArguments orderArguments) {
        Price price = orderArguments.getPrice();
        // 判断方案是否存在，不存在则异常
        if (price == null) {
            throw new BusinessException(PLAN_NOT_EXIST);
        }
        // 获取空间的订阅信息
        Bundle activeBundle = iBundleService.getActivatedBundleBySpaceId(orderArguments.getSpaceId());
        OrderType orderType = parseOrderType(activeBundle, price);
        if (orderType == OrderType.BUY) {
            // 新购场景下，必须当前空间没有基础订阅
            if (activeBundle != null && !activeBundle.isBaseForFree()) {
                throw new BusinessException(REPEAT_NEW_BUY_ORDER);
            }
        }
        BillingPlanPrice planPrice = BillingPlanPrice.of(price, ClockManager.me().getLocalDateNow());
        OrderPrice orderPrice = new OrderPrice(price.getOriginPrice(), planPrice.getDiscount(), planPrice.getDiscount(), planPrice.getActual());
        // 自营的0元订单目前只有在升级订阅时会发生
        boolean isZeroOrder = false;
        if (orderType == OrderType.UPGRADE) {
            orderPrice = repairOrderPrice(activeBundle, price);
            if (orderPrice.getPricePaid().compareTo(BigDecimal.ZERO) <= 0) {
                orderPrice.setPricePaid(BigDecimal.ZERO);
                isZeroOrder = true;
            }
        }
        int originalAmount = yuanToCents(orderPrice.getPriceOrigin());
        int discountAmount = yuanToCents(orderPrice.getPriceDiscount());
        int amount = yuanToCents(orderPrice.getPricePaid());
        // 创建订单
        String orderId = OrderUtil.createOrderId();
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setSpaceId(orderArguments.getSpaceId());
        orderEntity.setOrderId(orderId);
        orderEntity.setOrderChannel(OrderChannel.VIKA.getName());
        orderEntity.setOrderType(orderType.name());
        orderEntity.setCurrency(Currency.CNY.name());
        orderEntity.setOriginalAmount(originalAmount);
        orderEntity.setDiscountAmount(discountAmount);
        orderEntity.setAmount(amount);
        LocalDateTime nowDateTime = ClockManager.me().getLocalDateTimeNow();
        if (isZeroOrder) {
            // 0元直接创建空间订阅
            // 这里应该统一使用权益服务类管理空间订阅
            orderEntity.setState(OrderStatus.FINISHED.getName());
            orderEntity.setIsPaid(true);
            orderEntity.setPaidTime(nowDateTime);
        }
        else {
            orderEntity.setState(OrderStatus.UNPAID.getName());
        }
        orderEntity.setCreatedTime(nowDateTime);
        save(orderEntity);

        OrderItemEntity orderItemEntity = new OrderItemEntity();
        orderItemEntity.setSpaceId(orderArguments.getSpaceId());
        orderItemEntity.setOrderId(orderId);
        orderItemEntity.setAmount(amount);
        orderItemEntity.setProductName(price.getProduct());
        Product product = BillingConfigManager.getBillingConfig().getProducts().get(price.getProduct());
        orderItemEntity.setProductCategory(product.getCategory());
        orderItemEntity.setPlanId(price.getPlanId());
        orderItemEntity.setSeat(price.getSeat());
        orderItemEntity.setMonths(price.getMonth());
        orderItemEntity.setCurrency(Currency.CNY.name());
        orderItemEntity.setAmount(amount);
        if (isZeroOrder) {
            String subscriptionId = getSubscriptionId(activeBundle);
            orderItemEntity.setSubscriptionId(subscriptionId);
            orderItemEntity.setStartDate(nowDateTime);
            orderItemEntity.setEndDate(nowDateTime.plusMonths(orderItemEntity.getMonths()));
        }
        iOrderItemService.save(orderItemEntity);

        if (isZeroOrder) {
            // 过期时间
            LocalDateTime entitlementExpiredDate = nowDateTime.plusMonths(orderItemEntity.getMonths());
            // 变更订阅状态
            BundleEntity updateBundle = new BundleEntity();
            updateBundle.setEndDate(entitlementExpiredDate);
            iBundleService.updateByBundleId(activeBundle.getBundleId(), updateBundle);

            SubscriptionEntity updateSubscription = new SubscriptionEntity();
            updateSubscription.setProductName(orderItemEntity.getProductName());
            updateSubscription.setProductCategory(orderItemEntity.getProductCategory());
            updateSubscription.setPlanId(price.getPlanId());
            updateSubscription.setStartDate(nowDateTime);
            updateSubscription.setExpireDate(entitlementExpiredDate);
            iSubscriptionService.updateBySubscriptionId(getSubscriptionId(activeBundle), updateSubscription);

            TaskManager.me().execute(() -> NotificationManager.me().sendSubscribeNotify(orderEntity.getSpaceId(), orderEntity.getCreatedBy(),
                    LocalDateTimeUtil.toEpochMilli(entitlementExpiredDate), price.getGoodChTitle(),
                    orderEntity.getAmount(), orderType));
        }
        return orderId;
    }

    private String getSubscriptionId(Bundle bundle) {
        Subscription baseSubscription = bundle.getBaseSubscription();
        return baseSubscription.getSubscriptionId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderPaymentVo createOrderPayment(Long userId, String orderId, PayChannel channel) {
        // 检查订单是否存在
        OrderEntity orderEntity = getByOrderId(orderId);
        if (orderEntity == null) {
            throw new BusinessException(ORDER_NOT_EXIST);
        }
        if (orderEntity.getAmount() == 0) {
            // 0元不允许创建支付订单
            throw new BusinessException(ORDER_EXCEPTION);
        }
        // 检查用户是否在此空间
        iMemberService.checkUserIfInSpace(userId, orderEntity.getSpaceId());
        // 检查订单是否是未支付状态
        OrderStatus orderStatus = OrderStatus.of(orderEntity.getState());
        if (orderStatus != OrderStatus.UNPAID) {
            // 其他状态不允许支付
            if (orderStatus == OrderStatus.CANCELED) {
                throw new BusinessException(ORDER_HAS_CANCELED);
            }
            if (orderStatus == OrderStatus.FINISHED) {
                throw new BusinessException(ORDER_HAS_PAID);
            }
        }
        List<OrderItemEntity> orderItemEntities = iOrderItemService.getByOrderId(orderId);
        if (orderItemEntities.isEmpty()) {
            // 订单信息错误，报异常
            throw new BusinessException(ORDER_EXCEPTION);
        }
        // 只提供基础产品购买，故只有一个
        OrderItemEntity orderItem = orderItemEntities.iterator().next();
        Price price = BillingConfigManager.getPriceBySeatAndMonth(orderItem.getProductName().toUpperCase(Locale.ROOT), orderItem.getSeat(), orderItem.getMonths());
        if (price == null) {
            throw new BusinessException(ORDER_EXCEPTION);
        }

        String payTransactionId = OrderUtil.createPayTransactionId();
        int actualAmount = orderEntity.getAmount();
        // 订单总金额, 人民币单位：分（如订单总金额为 1 元，此处请填 100）
        if (subscriptionProperties.getTestMode()) {
            // 测试模式下，都是1块钱
            actualAmount = 100;
        }

        // 创建Ping++交易请求
        Charge charge = PingppUtil.createCharge(pingProperties.getAppId(), price, channel, payTransactionId, actualAmount);

        // 创建支付订单
        OrderPaymentEntity orderPaymentEntity = new OrderPaymentEntity();
        orderPaymentEntity.setOrderId(orderId);
        orderPaymentEntity.setPaymentTransactionId(payTransactionId);
        orderPaymentEntity.setCurrency(orderEntity.getCurrency());
        orderPaymentEntity.setAmount(orderEntity.getAmount());
        orderPaymentEntity.setSubject(price.getGoodChTitle());
        orderPaymentEntity.setPayChannel(channel.getName());
        orderPaymentEntity.setPayChannelTransactionId(charge.getId());
        iOrderPaymentService.save(orderPaymentEntity);
        // 返回支付订单视图
        OrderPaymentVo paymentVo = new OrderPaymentVo();
        paymentVo.setOrderNo(orderId);
        paymentVo.setPayTransactionNo(payTransactionId);
        if (channel == WX_PUB_QR) {
            paymentVo.setWxQrCodeLink(charge.getCredential().get(channel.getName()).toString());
        }
        else if (channel == ALIPAY_PC) {
            paymentVo.setAlipayPcDirectCharge(charge.toString());
        }
        return paymentVo;
    }

    @Override
    public OrderStatus getOrderStatusByOrderId(String orderId) {
        // 检查订单是否存在
        OrderEntity orderEntity = getByOrderId(orderId);
        if (orderEntity == null) {
            throw new BusinessException(ORDER_NOT_EXIST);
        }
        OrderStatus orderStatus = OrderStatus.of(orderEntity.getState());
        if (orderStatus == null) {
            return OrderStatus.UNPAID;
        }
        return orderStatus;
    }

    @Override
    public String getOrderIdByChannelOrderId(String spaceId, String channelOrderId) {
        return baseMapper.selectOrderBySpaceIdChannelOrderId(spaceId, channelOrderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderStatus checkOrderStatus(String orderId) {
        List<OrderPaymentEntity> orderPaymentEntities = iOrderPaymentService.getByOrderId(orderId);
        if (orderPaymentEntities.isEmpty()) {
            return OrderStatus.CANCELED;
        }
        OrderPaymentEntity orderPaymentEntity = orderPaymentEntities.iterator().next();
        if (orderPaymentEntity.getPaymentSuccess()) {
            return OrderStatus.FINISHED;
        }
        String payChannelTransactionId = orderPaymentEntity.getPayChannelTransactionId();
        if (StrUtil.isBlank(payChannelTransactionId)) {
            return OrderStatus.CANCELED;
        }
        Charge charge = retrieveByChargeId(payChannelTransactionId);
        if (charge == null) {
            throw new BusinessException(PAYMENT_ORDER_NOT_EXIST);
        }
        if (!charge.getPaid()) {
            return OrderStatus.UNPAID;
        }
        // 已经支付成功,存在支付成功延迟通知,立即处理
        PingChargeSuccess chargeSuccess = PingChargeSuccess.build(charge);
        iOrderPaymentService.retrieveOrderPaidEvent(chargeSuccess);
        // 同步订单事件
        SpringContextHolder.getApplicationContext().publishEvent(new SyncOrderEvent(this, orderId));
        return OrderStatus.FINISHED;
    }

    private Charge retrieveByChargeId(String chargeId) {
        try {
            return Charge.retrieve(chargeId);
        }
        catch (Exception e) {
            log.error("查询Ping++支付订单失败", e);
            throw new BusinessException(ORDER_EXCEPTION);
        }
    }
}
