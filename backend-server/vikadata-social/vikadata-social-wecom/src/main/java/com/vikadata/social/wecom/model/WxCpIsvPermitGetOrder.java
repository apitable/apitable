package com.vikadata.social.wecom.model;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 接口许可获取订单详情
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 19:02:48
 */
@Getter
@Setter
public class WxCpIsvPermitGetOrder extends WxCpBaseResp {

    /**
     * 订单详情
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
         * 订单号
         */
        @SerializedName("order_id")
        private String orderId;

        /**
         * 订单类型。1：购买帐号；2：续期帐号；5：历史企业迁移订单
         */
        @SerializedName("order_type")
        private Integer orderType;

        /**
         * 订单状态。0：待支付；1：已支付；2：未支付；订单已关闭；3：未支付，订单已过期；4：申请退款中；5：退款成功；6：退款被拒绝
         */
        @SerializedName("order_status")
        private Integer orderStatus;

        /**
         * 客户企业id，返回加密的corpid
         */
        @SerializedName("corpid")
        private String corpId;

        /**
         * 订单金额，单位分
         */
        @SerializedName("price")
        private Integer price;

        /**
         * 订单的帐号数详情
         */
        @SerializedName("account_count")
        private AccountCount accountCount;

        /**
         * 帐号购买时长
         */
        @SerializedName("account_duration")
        private AccountDuration accountDuration;

        /**
         * 创建时间
         */
        @SerializedName("create_time")
        private Long createTime;

        /**
         * 支付时间。迁移订单不返回该字段
         */
        @SerializedName("pay_time")
        private Long payTime;

        @Getter
        @Setter
        public static class AccountCount implements Serializable {

            /**
             * 基础帐号个数
             */
            @SerializedName("base_count")
            private Integer baseCount;

            /**
             * 互通帐号个数
             */
            @SerializedName("external_contact_count")
            private Integer externalContactCount;

        }

        @Getter
        @Setter
        public static class AccountDuration implements Serializable {

            /**
             * 购买的月数，每个月按照31天计算
             */
            @SerializedName("months")
            private Integer months;

        }

    }

}
