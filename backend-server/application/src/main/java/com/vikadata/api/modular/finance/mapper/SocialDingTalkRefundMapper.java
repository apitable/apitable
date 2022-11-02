package com.vikadata.api.modular.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialDingtalkRefundEntity;

/**
 * Subscription Billing System - DingTalk Refund Mapper
 */
public interface SocialDingTalkRefundMapper extends BaseMapper<SocialDingtalkRefundEntity> {

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
     * Update refund process status
     *
     * @param tenantId  tenant id
     * @param appId     app id
     * @param orderId   order id
     * @return number of rows affected
     */
    Integer updateStatusByTenantIdAndAppIdAndOrderId(@Param("tenantId") String tenantId,
            @Param("appId") String appId, @Param("orderId") String orderId, @Param("status") Integer status);
}
