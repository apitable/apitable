package com.vikadata.api.modular.finance.service;

import com.vikadata.api.modular.developer.model.CreateBusinessOrderRo;
import com.vikadata.api.modular.developer.model.CreateEntitlementWithAddOn;
import com.vikadata.api.modular.finance.model.OfflineOrderInfo;
import com.vikadata.api.modular.finance.model.SpaceSubscriptionVo;

/**
 * 财务服务
 * @author Shawn Deng
 * @date 2022-06-05 22:35:57
 */
public interface IBillingOfflineService {

    /**
     * 获取空间的订阅
     * 供商务同事查看
     * @param spaceId 空间ID
     * @return SpaceSubscriptionVo
     */
    SpaceSubscriptionVo getSpaceSubscription(String spaceId);

    /**
     * 创建商务订单
     *
     * @param data 请求参数
     * @return Message
     */
    OfflineOrderInfo createBusinessOrder(CreateBusinessOrderRo data);

    /**
     * 创建包含附加计划的订阅
     * @param data 请求参数
     */
    void createSubscriptionWithAddOn(CreateEntitlementWithAddOn data);

    /**
     * 创建赠送附件容量附加订阅计划的订阅
     *
     * @param userId   用户ID
     * @param userName 用户名称
     * @param spaceId  空间ID
     * @author liuzijing
     * @date 2022/8/19
     */
    void createGiftCapacityOrder(Long userId, String userName, String spaceId);
}
