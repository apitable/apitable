package com.vikadata.api.enterprise.billing.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialFeishuOrderEntity;

/**
 * Subscription Billing System - FeishuOrder Mapper
 */
public interface SocialFeishuOrderMapper extends BaseMapper<SocialFeishuOrderEntity> {

    /**
     * Query status by condition
     *
     * @param orderId   order id
     * @param tenantId  tenant id
     * @param appId     app id
     * @return count
     */
    Integer selectStatusByOrderId(@Param("orderId") String orderId, @Param("tenantId") String tenantId,
            @Param("appId") String appId);

    /**
     * Query order data
     *
     * @param tenantId  tenant id
     * @param appId     app id
     * @return order data
     */
    List<String> selectOrderDataByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId);

    /**
     * Update order process status
     *
     * @param tenantId  tenant id
     * @param appId     app id
     * @param orderId   order id
     * @return number of rows affected
     */
    Integer updateStatusByTenantIdAndAppIdAndOrderId(@Param("tenantId") String tenantId,
            @Param("appId") String appId, @Param("orderId") String orderId, @Param("status") Integer status);
}
