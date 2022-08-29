package com.vikadata.api.modular.finance.util;

import java.time.LocalDateTime;
import java.util.function.Predicate;

import cn.hutool.core.util.BooleanUtil;

import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.entity.OrderEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

public class OrderChecker {

    private final IOrderV2Service iOrderV2Service;

    public OrderChecker(IOrderV2Service iOrderV2Service) {
        this.iOrderV2Service = iOrderV2Service;
    }

    public void check(String orderId, ExpectedOrderCheck check) {
        OrderEntity orderEntity = iOrderV2Service.getByOrderId(orderId);
        assertThat(orderEntity).isNotNull();
        boolean checkOrderData = ((Predicate<OrderEntity>) order -> {
            if (check.getOrderType() != null && check.getOrderType() != OrderType.of(order.getOrderType())) {
                return false;
            }
            if ((check.getOriginalAmount() != order.getOriginalAmount()) ||
                    (check.getDiscountAmount() != order.getDiscountAmount()) ||
                    (check.getAmount() != order.getAmount())) {
                return false;
            }

            if (check.getOrderStatus() != OrderStatus.of(order.getState())) {
                return false;
            }

            if (check.hasPaid()) {
                boolean paidTimeCheck = check.getPaidTime().compareTo(order.getPaidTime()) == 0;
                return BooleanUtil.isTrue(order.getIsPaid()) && order.getPaidTime() != null && paidTimeCheck;
            }
            return true;
        }).test(orderEntity);
        if (!checkOrderData) {
            fail("order check fail");
        }
    }

    public static class ExpectedOrderCheck {

        private final OrderType orderType;

        private final int originalAmount;

        private final int discountAmount;

        private final int amount;

        private final OrderStatus orderStatus;

        private final boolean isPaid;

        private final LocalDateTime paidTime;

        public ExpectedOrderCheck(OrderType orderType, int originalAmount, int discountAmount, int amount, OrderStatus orderStatus, boolean isPaid, LocalDateTime paidTime) {
            this.orderType = orderType;
            this.originalAmount = originalAmount;
            this.discountAmount = discountAmount;
            this.amount = amount;
            this.orderStatus = orderStatus;
            this.isPaid = isPaid;
            this.paidTime = paidTime;
        }

        public OrderType getOrderType() {
            return orderType;
        }

        public int getOriginalAmount() {
            return originalAmount;
        }

        public int getDiscountAmount() {
            return discountAmount;
        }

        public int getAmount() {
            return amount;
        }

        public OrderStatus getOrderStatus() {
            return orderStatus;
        }

        public boolean hasPaid() {
            return isPaid;
        }

        public LocalDateTime getPaidTime() {
            return paidTime;
        }
    }
}
