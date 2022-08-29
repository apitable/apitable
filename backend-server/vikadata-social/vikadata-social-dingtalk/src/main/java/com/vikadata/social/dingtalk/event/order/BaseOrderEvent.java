package com.vikadata.social.dingtalk.event.order;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.event.sync.http.BaseSyncHttpEvent;

/**
 * <p> 
 * 事件列表 -- 基础订单信息
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 11:42
 */
@Setter
@Getter
@ToString
public class BaseOrderEvent extends BaseSyncHttpEvent {
    /**
     * 订单ID。
     */
    private String orderId;

    /**
     * 用户购买套件的suiteKey。
     */
    private String suiteKey;

    private String goodsName;

    private String goodsCode;

    private String itemName;

    /**
     *
     * 规格码。
     */
    private String itemCode;

    /**
     * 购买数量。
     */
    private String subQuantity;

    /**
     * 服务开始时间（单位：毫秒）。
     */
    private Long serviceStartTime;

    /**
     * 服务结束时间（单位：毫秒）。
     */
    private Long serviceStopTime;

    /**
     * payFee
     * 实际支付价格（单位：分）。
     * 说明 当商品类型articleType为image时不返回此字段。
     */
    private Long payFee;

    /**
     * 内购商品关联的主应用商品code。
     * 说明 当订单为内购商品订单时该字段有值。
     */
    private String mainGoodsCode;

    /**
     * 内购商品关联的主应用商品名称。
     * 说明 当订单为内购商品订单时该字段有值。
     */
    private String mainGoodsName;
}
