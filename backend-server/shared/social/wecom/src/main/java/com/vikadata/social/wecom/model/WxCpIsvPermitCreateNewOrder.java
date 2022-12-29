package com.vikadata.social.wecom.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Interface LicensePlace an Order to Purchase an Account
 */
@Getter
@Setter
public class WxCpIsvPermitCreateNewOrder extends WxCpBaseResp {

    /**
     * order id
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
