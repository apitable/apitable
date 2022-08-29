package com.vikadata.api.modular.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialDingtalkRefundEntity;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;


public interface ISocialDingTalkRefundService extends IService<SocialDingtalkRefundEntity> {
    /**
     * check whether refund existed
     *
     * @param orderId  order id
     * @param tenantId tenant key
     * @param appId app id
     * @return boolean
     * @author zoe zheng
     * @date 2022/5/19 14:45
     */
    Integer getStatusByOrderId(String tenantId, String appId, String orderId);

    /**
     * 创建退款
     * @param event 订单退款事件数据
     * @author zoe zheng
     * @date 2022/5/19 14:55
     */
    void createRefund(SyncHttpMarketServiceCloseEvent event);

    /**
     * 根据钉钉订单号更新订单状态
     *
     * @param orderId 钉钉定单号
     * @param tenantId 租户ID
     * @param appId 应用ID
     * @param status 订单处理状态1:已处理，0未处理
     * @author zoe zheng
     * @date 2022/5/23 18:56
     */
    void updateTenantRefundStatusByOrderId(String tenantId, String appId, String orderId, Integer status);
}
