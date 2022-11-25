package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Obtain details of interface license accounts in batches
 */
@Getter
@Setter
public class WxCpIsvPermitBatchGetActiveInfo extends WxCpBaseResp {

    /**
     * Account code information list
     */
    @SerializedName("active_info_list")
    private List<ActiveInfoList> activeInfoList;

    public static WxCpIsvPermitBatchGetActiveInfo fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitBatchGetActiveInfo.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

    @Getter
    @Setter
    public static class ActiveInfoList implements Serializable {

        /**
         * Account activation code
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * Account type: 1: Basic account, 2: Interworking account
         */
        @SerializedName("type")
        private Integer type;

        /**
         * Account status: 1: unbound, 2: bound and valid, 3: expired, 4: pending transfer
         */
        @SerializedName("status")
        private Integer status;

        /**
         * The userid of the enterprise member activated by the account binding. If it is not activated, this field will not be returned. return encrypted userid
         */
        @SerializedName("userid")
        private String userId;

        /**
         * Creation time, the order is created immediately after the payment is successful. Activation code must be activated within 365 days of creation time
         */
        @SerializedName("create_time")
        private Long createTime;

        /**
         * The time when the bound user was activated for the first time, this field will not be returned if it is not activated
         */
        @SerializedName("active_time")
        private Long activeTime;

        /**
         * Expiration. Add the purchase time to the time the binding was first activated. This field is not returned if not activated
         */
        @SerializedName("expire_time")
        private Long expireTime;

    }

}
