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
 * 批量激活接口许可账号
 * </p>
 * @author 刘斌华
 * @date 2022-06-29 17:15:36
 */
@Getter
@Setter
public class WxCpIsvPermitBatchActiveAccountResponse extends WxCpBaseResp {

    /**
     * 激活结果列表
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
         * 帐号激活码
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * 本次激活的企业成员的加密userid
         */
        @SerializedName("userid")
        private String userId;

        /**
         * 用户激活错误码，0为成功
         */
        @SerializedName("errcode")
        private String errCode;

    }

}
