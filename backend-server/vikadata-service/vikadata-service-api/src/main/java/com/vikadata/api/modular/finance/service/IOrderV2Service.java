package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.finance.OrderStatus;
import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.finance.PayChannel;
import com.vikadata.api.modular.finance.core.Bundle;
import com.vikadata.api.modular.finance.core.DryRunArguments;
import com.vikadata.api.modular.finance.core.OrderArguments;
import com.vikadata.api.modular.finance.core.OrderPrice;
import com.vikadata.api.modular.finance.model.OrderDetailVo;
import com.vikadata.api.modular.finance.model.OrderPaymentVo;
import com.vikadata.api.modular.finance.model.OrderPreview;
import com.vikadata.entity.OrderEntity;
import com.vikadata.system.config.billing.Price;

/**
 * 订单服务
 * @author Shawn Deng
 * @date 2022-05-16 14:41:27
 */
public interface IOrderV2Service extends IService<OrderEntity> {

    /**
     * 根据订单号获取订单
     * @param orderId 订单
     * @return 订单实体
     */
    OrderEntity getByOrderId(String orderId);

    /**
     * 批量查询订单
     * @param orderIds 订单号列表
     * @return order list
     */
    List<OrderEntity> getByOrderIds(List<String> orderIds);

    /**
     * 获取订单详情
     * @param orderId 订单号
     * @return 订单详情
     */
    OrderDetailVo getOrderDetailByOrderId(String orderId);

    /**
     * 试运行订单生成
     * @param dryRunArguments 参数
     * @return OrderPreview
     */
    OrderPreview triggerDryRunOrderGeneration(DryRunArguments dryRunArguments);

    /**
     * 修复订单价格
     * @param actionBundle 空间订阅集合
     * @param newPricePlan 新计划
     * @return OrderPrice
     */
    OrderPrice repairOrderPrice(Bundle actionBundle, Price newPricePlan);

    /**
     * 根据当前空间站解析订单类型
     *
     * @param bundle 空间订阅捆绑包
     * @param requestPricePlan 请求的付费方案标识
     * @return 订单类型
     */
    OrderType parseOrderType(Bundle bundle, Price requestPricePlan);

    /**
     * 创建订单
     * @param orderArguments 订单参数
     * @return 订单号
     */
    String createOrder(OrderArguments orderArguments);

    /**
     * 创建支付订单
     * @param userId 用户ID
     * @param orderId 订单号
     * @param channel 支付渠道
     * @return OrderPaymentVo
     */
    OrderPaymentVo createOrderPayment(Long userId, String orderId, PayChannel channel);

    /**
     * 获取订单的支付状态
     * @param orderId 订单号
     * @return 订单状态
     */
    OrderStatus getOrderStatusByOrderId(String orderId);

    /**
     * 根据渠道订单号获取系统订单号
     * @param spaceId 空间ID
     * @param channelOrderId 渠道订单号
     * @return String
     * @author zoe zheng
     * @date 2022/2/27 16:32
     */
    String getOrderIdByChannelOrderId(String spaceId, String channelOrderId);

    /**
     * 检查刷新订单的支付状态
     * @param orderId 订单号
     * @return 订单状态
     */
    OrderStatus checkOrderStatus(String orderId);
}
