package com.vikadata.social.wecom.model;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Interface license to get order details
 */
@Getter
@Setter
public class WxCpIsvPermitGetOrder extends WxCpBaseResp {

    /**
     * order details
     */
    @SerializedName("order")
    private Order order;

    public static WxCpIsvPermitGetOrder fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitGetOrder.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

    @Getter
    @Setter
    public static class Order implements Serializable {

        /**
         * order id
         */
        @SerializedName("order_id")
        private String orderId;

        /**
         * Order Type. 1: Purchase account; 2: Renew account; 5: Historical enterprise migration order
         */
        @SerializedName("order_type")
        private Integer orderType;

        /**
         * Order Status. 0: Pending payment; 1: Paid; 2: Not paid; Order closed; 3: Not paid, order has expired;
         * 4: Refund in progress; 5: Refund successful; 6: Refund rejected
         */
        @SerializedName("order_status")
        private Integer orderStatus;

        /**
         * Customer enterprise id, returns encrypted corpid
         */
        @SerializedName("corpid")
        private String corpId;

        /**
         * Order amount, unit points
         */
        @SerializedName("price")
        private Integer price;

        /**
         * Account number details for the order
         */
        @SerializedName("account_count")
        private AccountCount accountCount;

        /**
         * Account purchase time
         */
        @SerializedName("account_duration")
        private AccountDuration accountDuration;

        /**
         * creation time
         */
        @SerializedName("create_time")
        private Long createTime;

        /**
         * Payment time. Migration orders do not return this field
         */
        @SerializedName("pay_time")
        private Long payTime;

        @Getter
        @Setter
        public static class AccountCount implements Serializable {

            /**
             * Number of basic accounts
             */
            @SerializedName("base_count")
            private Integer baseCount;

            /**
             * Number of interworking accounts
             */
            @SerializedName("external_contact_count")
            private Integer externalContactCount;

        }

        @Getter
        @Setter
        public static class AccountDuration implements Serializable {

            /**
             * The number of months purchased, each month is calculated as 31 days
             */
            @SerializedName("months")
            private Integer months;

        }

    }

}
