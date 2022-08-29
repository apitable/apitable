package com.vikadata.social.wecom.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 提交账号续期任务
 * </p>
 * @author 刘斌华
 * @date 2022-07-04 15:11:37
 */
@Getter
@Setter
public class WxCpIsvPermitSubmitRenewOrder extends WxCpBaseResp {

    /**
     * 订单号
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
