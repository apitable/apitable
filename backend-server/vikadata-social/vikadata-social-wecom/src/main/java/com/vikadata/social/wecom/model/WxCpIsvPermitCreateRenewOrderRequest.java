package com.vikadata.social.wecom.model;

import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 创建账号续期任务
 * </p>
 * @author 刘斌华
 * @date 2022-07-04 11:42:20
 */
@Getter
@Setter
public class WxCpIsvPermitCreateRenewOrderRequest {

    /**
     * 企业id，只支持加密的corpid
     */
    @SerializedName("corpid")
    private String corpId;

    /**
     * 续期的帐号列表，每次最多1000个。同一个jobid最多关联1000000个基础账号跟1000000个互通账号
     */
    @SerializedName("account_list")
    private List<AccountList> accountList;

    /**
     * 任务id，若不传则默认创建一个新任务。若指定第一次调用后拿到jobid，可以通过该接口将jobid关联多个userid
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
         * 续期企业的成员userid。只支持加密的userid
         */
        @SerializedName("userid")
        private String userId;

        /**
         * 续期帐号类型。1:基础帐号，2:互通帐号
         */
        @SerializedName("type")
        private Integer type;

    }

}
