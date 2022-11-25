package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Volume Activation of Interface License Accounts
 */
@Getter
@Setter
public class WxCpIsvPermitBatchActiveAccountResponse extends WxCpBaseResp {

    /**
     * Activation result list
     */
    @SerializedName("active_result")
    private List<ActiveResult> activeResult;

    public static WxCpIsvPermitBatchActiveAccountResponse fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitBatchActiveAccountResponse.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

    @Getter
    @Setter
    public static class ActiveResult implements Serializable {

        /**
         * Account activation code
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * The encrypted userid of the enterprise member activated this time
         */
        @SerializedName("userid")
        private String userId;

        /**
         * User activation error code, 0 is success
         */
        @SerializedName("errcode")
        private String errCode;

    }

}
