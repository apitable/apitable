package com.vikadata.social.feishu.event.app;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.BaseEvent;

/**
 * <p>
 * 应用商店应用购买
 * </p>
 * @author zoe zheng
 * @date 2021/12/28 11:56 AM
 */
@Setter
@Getter
@ToString
@FeishuEvent("order_paid")
public class OrderPaidEvent extends BaseEvent {
    private String orderId;

    /**
     * 付费方案ID
     */
    private String pricePlanId;

    /**
     * 用户购买方案类型 "trial" -试用；"permanent"-一次性付费；"per_year"-企业年付费；"per_month"-企业月付费；
     * "per_seat_per_year"-按人按年付费；"per_seat_per_month"-按人按月付费；"permanent_count"-按次付费
     */
    private String pricePlanType;

    /**
     * 表示购买了多少人份
     */
    private Integer seats;

    /**
     * 套餐购买数量 目前都为1
     */
    private Integer buyCount;

    private String createTime;

    private String payTime;

    /**
     * 购买类型 buy普通购买 upgrade为升级购买 renew为续费购买
     */
    private String buyType;

    /**
     * 当前为升级购买时(buy_type 为upgrade)，该字段表示原订单ID，升级后原订单失效，状态变为已升级(业务方需要处理)
     */
    private String srcOrderId;

    /**
     * 订单支付价格 单位分
     */
    private Long orderPayPrice;
}
