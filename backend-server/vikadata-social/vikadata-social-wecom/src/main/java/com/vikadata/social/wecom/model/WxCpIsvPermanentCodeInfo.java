package com.vikadata.social.wecom.model;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;

/**
 * <p>
 * 服务商获取永久授权码信息，增加了订单支付信息
 * </p>
 * @author 刘斌华
 * @date 2022-04-20 15:30:18
 */
@Setter
@Getter
public class WxCpIsvPermanentCodeInfo extends WxCpTpPermanentCodeInfo {

    /**
     * 企业当前生效的版本信息
     */
    @SerializedName("edition_info")
    private EditionInfo editionInfo;

    public static WxCpIsvPermanentCodeInfo fromJson(String json) {

        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermanentCodeInfo.class);

    }

}
