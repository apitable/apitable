package com.vikadata.social.wecom.model;

import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * order list result
 * </p>
 */
@Setter
@Getter
public class WxCpIsvGetOrderList extends WxCpBaseResp {

    /**
     * order list
     */
    @SerializedName("order_list")
    private List<WxCpIsvGetOrder> orderList;


    public static WxCpIsvGetOrderList fromJson(String json) {

        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvGetOrderList.class);

    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }
}
