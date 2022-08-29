package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 获取订单中的账号列表
 * </p>
 * @author 刘斌华
 * @date 2022-06-27 10:27:40
 */
@Getter
@Setter
public class WxCpIsvPermitListOrderAccount extends WxCpBaseResp {

    /**
     * 分页游标，再下次请求时填写以获取之后分页的记录
     */
    @SerializedName("next_cursor")
    private String nextCursor;

    /**
     * 是否还有数据。0：否；1：是
     */
    @SerializedName("has_more")
    private Integer hasMore;

    /**
     * 账号列表
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
         * 帐号码，订单类型为购买帐号时，返回该字段
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * 企业续期成员userid，订单类型为续期帐号时，返回该字段。返回加密的userid
         */
        @SerializedName("userid")
        private String userId;

        /**
         * 帐号类型：1:基础帐号，2:互通帐号
         */
        @SerializedName("type")
        private Integer type;

    }

}
