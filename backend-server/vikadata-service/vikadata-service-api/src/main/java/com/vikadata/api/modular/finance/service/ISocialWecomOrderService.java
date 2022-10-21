package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomOrderEntity;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;

/**
 * <p>
 * 订阅计费系统-企微商店渠道订单
 * </p>
 * @author 刘斌华
 * @date 2022-08-18 18:37:52
 */
public interface ISocialWecomOrderService extends IService<SocialWecomOrderEntity> {

    /**
     * 创建订单
     *
     * @param paidEvent 订单信息
     * @return 创建后的数据
     * @author 刘斌华
     * @date 2022-08-19 11:11:29
     */
    SocialWecomOrderEntity createOrder(WeComOrderPaidEvent paidEvent);

    /**
     * 查询所有的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @param orderStatuses 查询的订单状态。可以为空
     * @return 符合条件的所有订单
     * @author 刘斌华
     * @date 2022-08-22 16:03:12
     */
    List<SocialWecomOrderEntity> getAllOrders(String suiteId, String paidCorpId, List<Integer> orderStatuses);

    /**
     * 查询订单信息
     *
     * @param orderId 企微订单号
     * @return 订单信息
     * @author 刘斌华
     * @date 2022-08-24 11:40:29
     */
    SocialWecomOrderEntity getByOrderId(String orderId);

    /**
     * Get first paid order
     *
     * @param suiteId Wecom isv suite ID
     * @param paidCorpId Paid corporation ID
     * @return Tenant's first paid order
     * @author Codeman
     * @date 2022-08-25 17:01:44
     */
    SocialWecomOrderEntity getFirstPaidOrder(String suiteId, String paidCorpId);

    /**
     * 获取租户最后一个支付成功的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @return 租户的最后一个支付成功的订单
     * @author 刘斌华
     * @date 2022-08-25 17:01:44
     */
    SocialWecomOrderEntity getLastPaidOrder(String suiteId, String paidCorpId);

    /**
     * Check if the previous order is refunded
     * @param orderId order id
     * @return boolean
     */
    boolean preOrderAreRefunded(String orderId);

    /**
     * modify order status by order id
     * @param orderId social order id
     * @param orderStatus order status
     */
    void updateOrderStatusByOrderId(String orderId, int orderStatus);
}
