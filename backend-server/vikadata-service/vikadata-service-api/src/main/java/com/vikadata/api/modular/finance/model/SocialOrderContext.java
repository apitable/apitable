package com.vikadata.api.modular.finance.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;

import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.SubscriptionPhase;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.util.billing.model.ProductChannel;
import com.vikadata.system.config.billing.Price;
import com.vikadata.system.config.billing.Product;

/**
 * <p>
 * the third party orders
 * </p>
 * @author zoe zheng
 * @date 2022/5/18 14:19
 */
@Data
@Builder(toBuilder = true)
public class SocialOrderContext {
    /**
     * 商品渠道
     */
    private ProductChannel productChannel;

    /**
     * 第三方订单ID
     */
    private String socialOrderId;

    /**
     * 支付金额 单位：分
     */
    private Long amount;

    /**
     * 折扣金额 单位：分
     */
    @Default
    private Long discountAmount = 0L;

    /**
     * 原单总价 单位：分
     */
    private Long originalAmount;

    /**
     * 价格方案
     */
    private Price price;

    /**
     * 产品
     */
    private Product product;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 第三方订单支付时间
     */
    private LocalDateTime paidTime;

    /**
     * 第三方订单创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 计划生效时间
     */
    private LocalDateTime serviceStartTime;

    /**
     * 计划失效时间
     */
    private LocalDateTime serviceStopTime;

    /**
     * 订阅阶段
     */
    @Default
    private SubscriptionPhase phase = SubscriptionPhase.FIXEDTERM;

    /**
     * 当前激活的订阅集合
     */
    private Bundle activatedBundle;

    /**
     * 订单渠道
     */
    private OrderChannel orderChannel;

    /**
     * 订单类型
     */
    private OrderType orderType;
}
