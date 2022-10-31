package com.vikadata.api.modular.finance.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomOrderEntity;

/**
 * <p>
 * 订阅计费系统-企微商店渠道订单
 * </p>
 * @date 2022-08-18 18:44:00
 */
@Mapper
public interface SocialWecomOrderMapper extends BaseMapper<SocialWecomOrderEntity> {

    /**
     * 查询所有的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @param orderStatuses 查询的订单状态。可以为空
     * @return 符合条件的所有订单
     */
    List<SocialWecomOrderEntity> selectAllOrders(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId,
            @Param("orderStatuses") List<Integer> orderStatuses);

    /**
     * 查询订单信息
     *
     * @param orderId 企微订单号
     * @return 订单信息
     */
    SocialWecomOrderEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * Get first paid order
     *
     * @param suiteId Wecom isv suite ID
     * @param paidCorpId Paid corporation ID
     * @return Tenant's first paid order
     * @author Codeman
     * @date 2022-08-25 17:01:44
     */
    SocialWecomOrderEntity selectFirstPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

    /**
     * 获取租户最后一个支付成功的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @return 租户的最后一个支付成功的订单
     */
    SocialWecomOrderEntity selectLastPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

    /**
     * query id by order  id
     * @param orderId order id
     * @return pre order status
     */
    Long selectIdByOrderId(@Param("orderId") String orderId);

    /**
     * get order status by id
     * @param id primary key
     * @return id
     */
    Integer selectPreOrderStatusById(@Param("id") Long id);


    /**
     * modify order status by order id
     * @param orderId social order id
     * @return number of rows affected
     */
    int updateOrderStatusByOrderId(@Param("orderId") String orderId, @Param("orderStatus") int orderStatus);
}
