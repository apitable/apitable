package com.vikadata.social.wecom.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;

/**
 * The service provider obtains the permanent authorization code information and adds the order payment information
 */
@Setter
@Getter
public class WxCpIsvPermanentCodeInfo extends WxCpTpPermanentCodeInfo {

    /**
     * The company's current edition information
     */
    @SerializedName("edition_info")
    private EditionInfo editionInfo;

    public static WxCpIsvPermanentCodeInfo fromJson(String json) {

        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermanentCodeInfo.class);

    }

}
