package com.vikadata.integration.vika;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.integration.vika.model.BillingOrder;
import com.vikadata.integration.vika.model.BillingOrderItem;
import com.vikadata.integration.vika.model.BillingOrderPayment;

@Disabled
public class VikaTemplateTest {

    @Test
    public void testSyncOrder() {
        VikaTemplate vikaTemplate = new VikaTemplate("https://integration.vika.ltd", "usk8qo1Dk9PbecBlaqFIvbb");
        BillingOrder order = new BillingOrder();
        order.setOrderId("123");
        order.setSpaceId("123");
        order.setOrderChannel("vika");
        order.setOrderType("BUY");
        order.setOriginalAmount(new BigDecimal("1.23"));
        order.setDiscountAmount(new BigDecimal("1.23"));
        order.setAmount(new BigDecimal("1.23"));
        order.setCreatedTime(LocalDateTime.of(2022, 7, 18, 18, 20, 39));
        order.setPaid(true);
        order.setPaidTime(LocalDateTime.of(2022, 7, 18, 18, 30, 39));

        List<BillingOrderItem> items = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            BillingOrderItem item = new BillingOrderItem();
            item.setOrderId("123");
            item.setProductName("Silver");
            item.setProductCategory("BASE");
            item.setSeat(10);
            item.setMonths(12);
            item.setStartDate(LocalDateTime.of(2022, 7, 18, 18, 20, 39));
            item.setEndDate(LocalDateTime.of(2022, 7, 18, 18, 20, 39));
            item.setAmount(new BigDecimal("1.23"));
            items.add(item);
        }

        BillingOrderPayment payment = new BillingOrderPayment();
        payment.setOrderId("123");
        payment.setPaymentTransactionId("123");
        payment.setAmount(new BigDecimal("1.23"));
        payment.setPayChannel("wx_pub_qr");
        payment.setPayChannelTransactionId("1111111");
        payment.setPaidTime(LocalDateTime.of(2022, 7, 18, 18, 20, 39));
        payment.setRawData("{\"id\": \"ch_100220718647348910080005\", \"amount\": 0, \"orderNo\": \"2022071817333701014\", \"timePaid\": 1643714130, \"amountSettle\": 0}");

        vikaTemplate.syncOrder(order, items, Collections.singletonList(payment));
    }
}
