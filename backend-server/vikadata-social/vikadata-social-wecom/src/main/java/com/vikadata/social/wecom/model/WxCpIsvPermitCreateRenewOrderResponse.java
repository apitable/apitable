package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Create Account Renewal Task
 */
@Getter
@Setter
public class WxCpIsvPermitCreateRenewOrderResponse extends WxCpBaseResp {

    /**
     * Job id, when no jobid is specified in the request package, a new jobid will be generated and returned
     */
    @SerializedName("jobid")
    private String jobId;

    /**
     * List of illegal renewal accounts
     */
    @SerializedName("invalid_account_list")
    private List<InvalidAccountList> invalidAccountList;

    public static WxCpIsvPermitCreateRenewOrderResponse fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitCreateRenewOrderResponse.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

    @Getter
    @Setter
    public static class InvalidAccountList implements Serializable {

        /**
         * Illegal account related error code
         */
        @SerializedName("errcode")
        private Integer errCode;

        /**
         * Account is illegal related error description
         */
        @SerializedName("errmsg")
        private String errMsg;

        /**
         * Member userid of the renewing enterprise. Only supports encrypted userid
         */
        @SerializedName("userid")
        private String userId;

        /**
         * Renewal account type. 1: Basic account, 2: Interworking account
         */
        @SerializedName("type")
        private Integer type;

    }

}
