package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.entity.SocialTenantOrderEntity;

/**
 * <p>
 * 第三方平台集成-订单 服务接口
 * </p>
 * @Deprecated move to finance
 * @author zoe zheng
 * @date 2022/2/28 18:49
 */
@Deprecated
public interface ISocialTenantOrderService extends IService<SocialTenantOrderEntity> {
    /**
     * 第三方订单是否存在
     *
     * @param channelOrderId 渠道订单号
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @param platformType 应用类型
     * @return Boolean
     * @author zoe zheng
     * @date 2022/2/28 19:50
     */
    Boolean tenantOrderExisted(String channelOrderId, String tenantId, String appId, SocialPlatformType platformType);

    /**
     * 创建第三方订单
     *
     * @param orderId 第三方订单ID
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @param platformType 应用类型
     * @param orderData 订单数据
     * @return Boolean
     * @author zoe zheng
     * @date 2022/2/28 19:58
     */
    Boolean createTenantOrder(String orderId, String tenantId, String appId, SocialPlatformType platformType,
            String orderData);
    /**
     * 获取第三方信息
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @param platformType 应用类型
     * @return  List<String> orderData
     * @author zoe zheng
     * @date 2022/2/28 20:42
     */
    List<String> getOrderDataByTenantIdAndAppId(String tenantId, String appId, SocialPlatformType platformType);
}
