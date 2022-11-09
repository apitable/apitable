package com.vikadata.api.listener;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.apitable.starter.vika.core.VikaTemplate;
import com.apitable.starter.vika.core.model.BillingOrder;
import com.apitable.starter.vika.core.model.BillingOrderItem;
import com.apitable.starter.vika.core.model.BillingOrderPayment;
import com.vikadata.api.event.SyncOrderEvent;
import com.vikadata.api.modular.finance.service.IOrderItemService;
import com.vikadata.api.modular.finance.service.IOrderPaymentService;
import com.vikadata.api.modular.finance.service.IOrderV2Service;
import com.vikadata.entity.OrderEntity;
import com.vikadata.entity.OrderItemEntity;
import com.vikadata.entity.OrderPaymentEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;
import static com.vikadata.api.util.billing.OrderUtil.centsToYuan;

@Component
public class SyncOrderListener implements ApplicationListener<SyncOrderEvent> {

    @Resource
    private IOrderV2Service iOrderV2Service;

    @Resource
    private IOrderItemService iOrderItemService;

    @Resource
    private IOrderPaymentService iOrderPaymentService;

    @Autowired(required = false)
    private VikaTemplate vikaTemplate;

    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @Override
    public void onApplicationEvent(SyncOrderEvent event) {
        if (vikaTemplate == null) {
            return;
        }
        OrderEntity orderEntity = iOrderV2Service.getByOrderId(event.getOrderId());
        BillingOrder order = ofOrderEntity(orderEntity);
        List<OrderItemEntity> orderItemEntities = iOrderItemService.getByOrderId(event.getOrderId());
        List<BillingOrderItem> orderItems = ofItemEntities(orderItemEntities);
        List<OrderPaymentEntity> orderPaymentEntities = iOrderPaymentService.getByOrderId(event.getOrderId());
        List<BillingOrderPayment> orderPayments = ofPaymentEntities(orderPaymentEntities);
        vikaTemplate.syncOrder(order, orderItems, orderPayments);
    }

    private BillingOrder ofOrderEntity(OrderEntity entity) {
        BillingOrder order = new BillingOrder();
        order.setOrderId(entity.getOrderId());
        order.setSpaceId(entity.getSpaceId());
        order.setOrderChannel(entity.getOrderChannel());
        order.setChannelOrderId(entity.getChannelOrderId());
        order.setOrderType(entity.getOrderType());
        order.setOriginalAmount(centsToYuan(entity.getOriginalAmount()));
        order.setDiscountAmount(centsToYuan(entity.getDiscountAmount()));
        order.setAmount(centsToYuan(entity.getAmount()));
        order.setCreatedTime(entity.getCreatedTime());
        order.setPaid(entity.getIsPaid());
        order.setPaidTime(entity.getPaidTime());
        return order;
    }

    private List<BillingOrderItem> ofItemEntities(List<OrderItemEntity> entities) {
        List<BillingOrderItem> items = new ArrayList<>();
        entities.forEach(entity -> {
            BillingOrderItem item = new BillingOrderItem();
            item.setOrderId(entity.getOrderId());
            item.setProductName(entity.getProductName());
            item.setProductCategory(entity.getProductCategory());
            item.setSeat(entity.getSeat());
            item.setMonths(entity.getMonths());
            item.setStartDate(entity.getStartDate());
            item.setEndDate(entity.getEndDate());
            item.setAmount(centsToYuan(entity.getAmount()));
            items.add(item);
        });
        return items;
    }

    private List<BillingOrderPayment> ofPaymentEntities(List<OrderPaymentEntity> entities) {
        List<BillingOrderPayment> items = new ArrayList<>();
        entities.forEach(entity -> {
            BillingOrderPayment payment = new BillingOrderPayment();
            payment.setOrderId(entity.getOrderId());
            payment.setPaymentTransactionId(entity.getPaymentTransactionId());
            payment.setAmount(centsToYuan(entity.getAmount()));
            payment.setPayChannel(entity.getPayChannel());
            payment.setPayChannelTransactionId(entity.getPayChannelTransactionId());
            payment.setPaidTime(entity.getPaidTime());
            payment.setRawData(entity.getRawData());
            items.add(payment);
        });
        return items;
    }
}
