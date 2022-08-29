package com.vikadata.api.modular.finance.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialDingtalkOrderEntity;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;


public interface ISocialDingTalkOrderService extends IService<SocialDingtalkOrderEntity> {
    /**
     * check whether order existed
     *
     * @param orderId order id
     * @param tenantId tenant key
     * @param appId app id
     * @return boolean
     * @author zoe zheng
     * @date 2022/5/19 14:45
     */
    Integer getStatusByOrderId(String tenantId, String appId, String orderId);

    /**
     * 创建订单
     * @param event 订单购买事件数据
     * @author zoe zheng
     * @date 2022/5/19 14:55
     */
    void createOrder(SyncHttpMarketOrderEvent event);

    /**
     * 根据钉钉订单号更新订单状态
     *
     * @param orderId 钉钉订单号
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @param status 订单处理状态1:已处理，0未处理
     * @author zoe zheng
     * @date 2022/5/23 18:56
     */
    void updateTenantOrderStatusByOrderId(String tenantId, String appId, String orderId, Integer status);

    /**
     * 获取租户应用下的所有订单
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @return List<String>
     * @author zoe zheng
     * @date 2022/5/23 17:57
     */
    List<String> getOrdersByTenantIdAndAppId(String tenantId, String appId);

    /**
     * 获取租户对应商品的订单
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @param itemCode 规格编码
     * @return List<String>
     * @author zoe zheng
     * @date 2022/5/23 17:57
     */
    List<String> getOrderIdsByTenantIdAndAppIdAndItemCode(String tenantId, String appId, String itemCode);
}
