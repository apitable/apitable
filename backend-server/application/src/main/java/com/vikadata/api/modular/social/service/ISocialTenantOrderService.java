package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.entity.SocialTenantOrderEntity;

/**
 * <p>
 * Third party platform integration - order service interface
 * </p>
 */
@Deprecated
public interface ISocialTenantOrderService extends IService<SocialTenantOrderEntity> {
    /**
     * Whether the third-party order exists
     *
     * @param channelOrderId Channel order No
     * @param tenantId Enterprise ID
     * @param appId App ID
     * @param platformType Application Type
     * @return Boolean
     */
    Boolean tenantOrderExisted(String channelOrderId, String tenantId, String appId, SocialPlatformType platformType);

    /**
     * Create Third Party Orders
     *
     * @param orderId Third party order ID
     * @param tenantId Enterprise ID
     * @param appId App ID
     * @param platformType Application Type
     * @param orderData Order Data
     * @return Boolean
     */
    Boolean createTenantOrder(String orderId, String tenantId, String appId, SocialPlatformType platformType,
            String orderData);
    /**
     * Access to third party information
     *
     * @param tenantId Enterprise ID
     * @param appId App ID
     * @param platformType Application Type
     * @return  List<String> orderData
     */
    List<String> getOrderDataByTenantIdAndAppId(String tenantId, String appId, SocialPlatformType platformType);
}
