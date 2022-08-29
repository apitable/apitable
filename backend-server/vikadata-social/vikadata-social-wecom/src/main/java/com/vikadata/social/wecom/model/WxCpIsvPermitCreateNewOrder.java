package com.vikadata.social.wecom.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 接口许可下单购买账号
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 17:22:57
 */
@Getter
@Setter
public class WxCpIsvPermitCreateNewOrder extends WxCpBaseResp {

    /**
     * 订单号
     */
    @SerializedName("order_id")
    private String orderId;

    public static WxCpIsvPermitCreateNewOrder fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitCreateNewOrder.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

}
