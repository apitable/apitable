package com.vikadata.api.enterprise.billing.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomOrderEntity;

/**
 * <p>
 * Subscription Billing System - Wecom Order Mapper
 * </p>
 */
@Mapper
public interface SocialWecomOrderMapper extends BaseMapper<SocialWecomOrderEntity> {

    /**
     * Query all order
     *
     * @param suiteId       suite id
     * @param paidCorpId    paid corp id
     * @param orderStatuses order statuses
     * @return SocialWecomOrderEntity List
     */
    List<SocialWecomOrderEntity> selectAllOrders(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId,
            @Param("orderStatuses") List<Integer> orderStatuses);

    /**
     * Query order
     *
     * @param orderId   order id
     * @return SocialWecomOrderEntity
     */
    SocialWecomOrderEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * Get first paid order
     *
     * @param suiteId Wecom isv suite ID
     * @param paidCorpId Paid corporation ID
     * @return Tenant's first paid order
     */
    SocialWecomOrderEntity selectFirstPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

    /**
     * Get the tenant's last successful payment order
     *
     * @param suiteId       suite id
     * @param paidCorpId    paid corp id
     * @return SocialWecomOrderEntity
     */
    SocialWecomOrderEntity selectLastPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

    /**
     * query id by order  id
     *
     * @param orderId order id
     * @return pre order status
     */
    Long selectIdByOrderId(@Param("orderId") String orderId);

    /**
     * get order status by id
     *
     * @param id primary key
     * @return id
     */
    Integer selectPreOrderStatusById(@Param("id") Long id);


    /**
     * modify order status by order id
     *
     * @param orderId social order id
     * @return number of rows affected
     */
    int updateOrderStatusByOrderId(@Param("orderId") String orderId, @Param("orderStatus") int orderStatus);
}
