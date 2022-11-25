package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get in-app purchase order information
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
         * order creation time
         */
        private Long createTimestamp;

        /**
         * order payment time
         */
        private Long paidTimestamp;

        /**
         * Order quantity, this field is empty for periodic products
         */
        private Integer quantity;

        /**
         * order status
         * 0: order closed
         * 3: Order payment
         * 4: Order Creation
         */
        private Integer status;

        /**
         * The actual total payment amount, in cents (RMB)
         */
        private Long totalActualPayFee;

        /**
         * In-app purchase product specification code.
         */
        private String itemCode;

        /**
         * The open ID of the enterprise that purchased the product.
         */
        private String corpId;

        /**
         * In-app purchase order number.
         */
        private String bizOrderId;

        /**
         * The end time of the ordered service.
         */
        private Long endTimestamp;

        /**
         * The start time of the ordered service.
         */
        private Long startTimestamp;

        /**
         * In-app purchase code.
         */
        private String goodsCode;
    }

}
