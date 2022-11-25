package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * Get the list of accounts in the order
 */
@Getter
@Setter
public class WxCpIsvPermitListOrderAccount extends WxCpBaseResp {

    /**
     * Paging cursor, fill in the next request to get the records of subsequent paging
     */
    @SerializedName("next_cursor")
    private String nextCursor;

    /**
     * whether there is still data. 0: No; 1: Yes
     */
    @SerializedName("has_more")
    private Integer hasMore;

    /**
     * Account list
     */
    @SerializedName("account_list")
    private List<AccountList> accountList;

    public static WxCpIsvPermitListOrderAccount fromJson(String json) {
        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermitListOrderAccount.class);
    }

    public String toJson() {
        return WxCpGsonBuilder.create().toJson(this);
    }

    @Getter
    @Setter
    public static class AccountList implements Serializable {

        /**
         * Account code, this field is returned when the order type is purchase account
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * Enterprise renewal member userid, when the order type is renewal account, this field is returned.
         * return encrypted userid
         */
        @SerializedName("userid")
        private String userId;

        /**
         * Account type: 1: Basic account, 2: Interworking account
         */
        @SerializedName("type")
        private Integer type;

    }

}
