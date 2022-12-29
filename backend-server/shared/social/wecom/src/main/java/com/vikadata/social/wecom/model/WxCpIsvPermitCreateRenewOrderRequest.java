package com.vikadata.social.wecom.model;

import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Create Account Renewal Task
 */
@Getter
@Setter
public class WxCpIsvPermitCreateRenewOrderRequest {

    /**
     * Enterprise id, only supports encrypted corpid
     */
    @SerializedName("corpid")
    private String corpId;

    /**
     * A list of renewed accounts, up to 1000 at a time.
     * The same jobid can be associated with a maximum of 1,000,000 basic accounts and 1,000,000 interworking accounts
     */
    @SerializedName("account_list")
    private List<AccountList> accountList;

    /**
     * The task id, if not passed, a new task will be created by default.
     * If you specify the jobid after the first call, you can associate the jobid with multiple userids through this interface
     */
    @SerializedName("jobid")
    private String jobId;

    public static WxCpIsvPermitCreateRenewOrderRequest fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitCreateRenewOrderRequest.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

    @Getter
    @Setter
    public static class AccountList {

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
