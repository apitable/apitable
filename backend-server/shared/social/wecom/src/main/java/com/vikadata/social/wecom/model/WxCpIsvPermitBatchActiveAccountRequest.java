package com.vikadata.social.wecom.model;

import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Volume Activation of Interface License Accounts
 */
@Getter
@Setter
public class WxCpIsvPermitBatchActiveAccountRequest {

    /**
     * The corpid of the company to which the activation code belongs
     */
    @SerializedName("corpid")
    private String corpId;

    /**
     * List of accounts that need to be activated, the number of employees to be activated at a time does not exceed 1000
     */
    @SerializedName("active_list")
    private List<ActiveList> activeList;

    public static WxCpIsvPermitBatchActiveAccountRequest fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitBatchActiveAccountRequest.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

    @Getter
    @Setter
    public static class ActiveList {

        /**
         * Account activation code
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * The userid of the enterprise member to be bound and activated
         */
        @SerializedName("userid")
        private String userId;

    }

}
