package com.vikadata.social.wecom.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Submit Account Renewal Task
 */
@Getter
@Setter
public class WxCpIsvPermitSubmitRenewOrder extends WxCpBaseResp {

    /**
     * order id
     */
    @SerializedName("order_id")
    private String orderId;

    public static WxCpIsvPermitSubmitRenewOrder fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitSubmitRenewOrder.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

}
