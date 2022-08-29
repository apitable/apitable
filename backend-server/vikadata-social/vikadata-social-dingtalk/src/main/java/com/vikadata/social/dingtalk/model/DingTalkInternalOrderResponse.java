package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 获取内购订单信息
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/27 19:44
 */
@Setter
@Getter
@ToString
public class DingTalkInternalOrderResponse extends BaseResponse {
    
    private InAppGoodsOrderVo result;

    @Setter
    @Getter
    @ToString
    public static class InAppGoodsOrderVo {
        /**
         * 订单创建时间
         */
        private Long createTimestamp;

        /**
         * 订单支付时间
         */
        private Long paidTimestamp;

        /**
         * 订购数量，周期型商品此字段为空
         */
        private Integer quantity;

        /**
         * 订单状态：
         * 0：订单关闭
         * 3：订单支付
         * 4：订单创建
         */
        private Integer status;

        /**
         * 实际支付总金额，单位为分(RMB)
         */
        private Long totalActualPayFee;

        /**
         * 内购商品规格码。
         */
        private String itemCode;

        /**
         * 购买商品的企业开放ID。
         */
        private String corpId;

        /**
         * 内购商品订单号。
         */
        private String bizOrderId;

        /**
         * 订购的服务结束时间。
         */
        private Long endTimestamp;

        /**
         * 订购的服务开始时间。
         */
        private Long startTimestamp;

        /**
         * 内购商品码。
         */
        private String goodsCode;
    }

}
