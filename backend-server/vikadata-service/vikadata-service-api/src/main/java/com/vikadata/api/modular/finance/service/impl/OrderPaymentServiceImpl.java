package com.vikadata.api.modular.finance.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import cn.hutool.core.date.LocalDateTimeUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.clock.ClockManager;
import com.vikadata.api.enums.finance.BundleState;
import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionState;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.Subscription;
import com.vikadata.api.modular.finance.mapper.OrderPaymentMapper;
import com.vikadata.api.modular.finance.model.PingChargeSuccess;
import com.vikadata.api.modular.finance.service.IBundleService;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderPaymentService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.api.modular.finance.service.ISubscriptionService;
import com.vikadata.api.util.billing.BillingConfigManager;
import com.vikadata.api.util.billing.model.ProductEnum;
import com.vikadata.clock.ClockUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.BundleEntity;
import com.vikadata.entity.OrderEntity;
import com.vikadata.entity.OrderItemEntity;
import com.vikadata.entity.OrderPaymentEntity;
import com.vikadata.entity.SubscriptionEntity;
import com.vikadata.system.config.billing.Plan;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;
import static com.vikadata.api.enums.exception.OrderException.ORDER_EXCEPTION;
import static com.vikadata.api.enums.exception.OrderException.ORDER_NOT_EXIST;
import static com.vikadata.api.enums.finance.BundleState.ACTIVATED;

/**
 * 支付订单服务实现类
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class OrderPaymentServiceImpl extends ServiceImpl<OrderPaymentMapper, OrderPaymentEntity> implements IOrderPaymentService {

    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private IBundleService iBundleService;

    @Resource
    private ISubscriptionService iSubscriptionService;

    @Override
    public OrderPaymentEntity getByPayTransactionId(String payTransactionId) {
        return baseMapper.selectByTransactionId(payTransactionId);
    }

    @Override
    public List<OrderPaymentEntity> getByOrderId(String orderId) {
        return baseMapper.selectByOrderId(orderId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String retrieveOrderPaidEvent(PingChargeSuccess chargeSuccess) {
        String chargeId = chargeSuccess.getId();
        String payTransactionId = chargeSuccess.getOrderNo();
        LocalDateTime timePaid = ClockUtil.secondToLocalDateTime(chargeSuccess.getTimePaid(), DEFAULT_TIME_ZONE);
        if (log.isDebugEnabled()) {
            log.debug("支付时间:{}", timePaid);
        }
        OrderPaymentEntity orderPaymentEntity = getByPayTransactionId(payTransactionId);
        if (orderPaymentEntity == null) {
            log.error("回调，订单[{}]支付渠道交易号[{}]不存在", payTransactionId, chargeId);
            throw new BusinessException(ORDER_NOT_EXIST);
        }
        if (orderPaymentEntity.getPaymentSuccess()) {
            // 订单已支付完成，不需要再处理
            log.warn("order [{}] paid success notify repeatedly, ignore this event", chargeId);
            return null;
        }
        // 查询订单
        OrderEntity orderEntity = iOrderV2Service.getByOrderId(orderPaymentEntity.getOrderId());
        if (orderEntity == null) {
            log.error("回调，订单号[{}]不存在", orderPaymentEntity.getOrderId());
            throw new BusinessException(ORDER_NOT_EXIST);
        }
        OrderStatus orderStatus = OrderStatus.of(orderEntity.getState());
        if (orderStatus == OrderStatus.FINISHED) {
            // 订单已支付完成，不需要再处理
            return null;
        }
        // 查询订单项目里的基础产品类型项目
        OrderItemEntity orderItemEntity = iOrderItemService.getBaseProductInOrder(orderPaymentEntity.getOrderId());
        if (orderItemEntity == null) {
            // 订单异常，没有基础产品类型项目
            log.error("订单异常[{}],未包含项目", orderEntity.getOrderId());
            throw new BusinessException(ORDER_EXCEPTION);
        }
        // 订单购买的付费方案
        Plan plan = BillingConfigManager.getPlan(ProductEnum.of(orderItemEntity.getProductName()), orderItemEntity.getSeat());
        // 设置更新数据库的操作者
        UserHolder.set(orderPaymentEntity.getCreatedBy());
        // 根据订单类型，计算订阅开始和结束时间
        OrderType orderType = OrderType.of(orderEntity.getOrderType());
        LocalDateTime entitlementStartDate = ClockManager.me().getLocalDateTimeNow();
        LocalDateTime entitlementExpiredDate;
        String subscriptionId;
        if (orderType == OrderType.BUY) {
            // 权益到期时间直接从支付时间当天开始算起
            entitlementExpiredDate = entitlementStartDate.plusMonths(orderItemEntity.getMonths());
            // 创建空间站订阅集合包
            BundleEntity bundleEntity = new BundleEntity();
            bundleEntity.setBundleId(UUID.randomUUID().toString());
            bundleEntity.setSpaceId(orderEntity.getSpaceId());
            bundleEntity.setState(ACTIVATED.name());
            bundleEntity.setStartDate(entitlementStartDate);
            bundleEntity.setEndDate(entitlementExpiredDate);

            List<SubscriptionEntity> subscriptionEntities = new ArrayList<>();
            // 创建基础类型订阅
            subscriptionId = UUID.randomUUID().toString();
            SubscriptionEntity base = new SubscriptionEntity();
            base.setSpaceId(orderEntity.getSpaceId());
            base.setBundleId(bundleEntity.getBundleId());
            base.setSubscriptionId(subscriptionId);
            base.setProductName(orderItemEntity.getProductName());
            base.setProductCategory(orderItemEntity.getProductCategory());
            base.setPlanId(plan.getId());
            base.setState(SubscriptionState.ACTIVATED.name());
            base.setBundleStartDate(entitlementStartDate);
            base.setStartDate(entitlementStartDate);
            base.setExpireDate(entitlementExpiredDate);
            subscriptionEntities.add(base);

            // 新购之前也许已经有(免费订阅+附加订阅)
            Bundle activatedBundle = iBundleService.getPossibleBundleBySpaceId(orderEntity.getSpaceId());
            if (activatedBundle != null) {
                activatedBundle.getAddOnSubscription()
                        .stream()
                        .filter(subscription -> {
                            // 过滤出未过期的附加订阅
                            LocalDate today = ClockManager.me().getLocalDateNow();
                            LocalDate expireDate = subscription.getExpireDate().toLocalDate();
                            return today.compareTo(expireDate) <= 0;
                        })
                        .forEach(addOnSub -> {
                            // 转移未失效的附加计划订阅到新的订阅
                            SubscriptionEntity addOn = new SubscriptionEntity();
                            addOn.setSpaceId(orderEntity.getSpaceId());
                            addOn.setBundleId(bundleEntity.getBundleId());
                            addOn.setSubscriptionId(addOnSub.getSubscriptionId());
                            addOn.setProductName(addOnSub.getProductName());
                            addOn.setProductCategory(addOnSub.getProductCategory().name());
                            addOn.setPlanId(addOnSub.getPlanId());
                            addOn.setState(SubscriptionState.ACTIVATED.name());
                            addOn.setBundleStartDate(addOnSub.getStartDate());
                            addOn.setStartDate(addOnSub.getStartDate());
                            addOn.setExpireDate(addOnSub.getExpireDate());
                            subscriptionEntities.add(addOn);
                        });
                // 让之前的订阅过期
                BundleEntity updateBundle = new BundleEntity();
                updateBundle.setState(BundleState.EXPIRED.name());
                iBundleService.updateByBundleId(activatedBundle.getBundleId(), updateBundle);
            }
            iBundleService.create(bundleEntity);
            iSubscriptionService.createBatch(subscriptionEntities);
        }
        else {
            // 非新购都会存在订阅状态开始时间，其他类型订单通通变更空间订阅状态
            Bundle activatedBundle = iBundleService.getActivatedBundleBySpaceId(orderEntity.getSpaceId());
            if (activatedBundle == null) {
                throw new RuntimeException("handle pay success callback error");
            }
            if (orderType == OrderType.RENEW) {
                // 续订需要延长权益结束日期
                entitlementStartDate = activatedBundle.getBaseSubscription().getExpireDate();
            }
            entitlementExpiredDate = entitlementStartDate.plusMonths(orderItemEntity.getMonths());
            // 变更订阅状态
            BundleEntity updateBundle = new BundleEntity();
            if (orderType == OrderType.UPGRADE) {
                updateBundle.setStartDate(entitlementStartDate);
            }
            updateBundle.setEndDate(entitlementExpiredDate);
            iBundleService.updateByBundleId(activatedBundle.getBundleId(), updateBundle);

            Subscription baseSubscription = activatedBundle.getBaseSubscription();
            subscriptionId = baseSubscription.getSubscriptionId();
            SubscriptionEntity updateSubscription = new SubscriptionEntity();
            updateSubscription.setProductName(orderItemEntity.getProductName());
            updateSubscription.setProductCategory(orderItemEntity.getProductCategory());
            updateSubscription.setPlanId(plan.getId());
            if (orderType == OrderType.UPGRADE) {
                updateSubscription.setBundleStartDate(entitlementStartDate);
                updateSubscription.setStartDate(entitlementStartDate);
            }
            updateSubscription.setExpireDate(entitlementExpiredDate);
            iSubscriptionService.updateBySubscriptionId(baseSubscription.getSubscriptionId(), updateSubscription);
        }

        // 更新订单状态
        OrderEntity updateOrder = new OrderEntity();
        updateOrder.setId(orderEntity.getId());
        updateOrder.setState(OrderStatus.FINISHED.getName());
        updateOrder.setIsPaid(true);
        updateOrder.setPaidTime(timePaid);
        updateOrder.setVersion(orderEntity.getVersion());
        iOrderV2Service.updateById(updateOrder);

        // 更新订单子项目
        OrderItemEntity updateOrderItem = new OrderItemEntity();
        updateOrderItem.setId(orderItemEntity.getId());
        updateOrderItem.setSubscriptionId(subscriptionId);
        updateOrderItem.setStartDate(entitlementStartDate);
        updateOrderItem.setEndDate(entitlementExpiredDate);
        iOrderItemService.updateById(updateOrderItem);

        // 更新支付订单状态
        OrderPaymentEntity updateOrderPayment = new OrderPaymentEntity();
        updateOrderPayment.setId(orderPaymentEntity.getId());
        updateOrderPayment.setPaidTime(timePaid);
        updateOrderPayment.setPaymentSuccess(true);
        updateOrderPayment.setRawData(chargeSuccess.toString());
        updateOrderPayment.setVersion(orderPaymentEntity.getVersion());
        updateById(updateOrderPayment);

        // 发送通知
        TaskManager.me().execute(() -> NotificationManager.me().sendSubscribeNotify(orderEntity.getSpaceId(), orderEntity.getCreatedBy(),
                LocalDateTimeUtil.toEpochMilli(entitlementExpiredDate), updateOrderPayment.getSubject(),
                orderEntity.getAmount(), OrderType.of(orderEntity.getOrderType())));

        return orderEntity.getOrderId();
    }
}
