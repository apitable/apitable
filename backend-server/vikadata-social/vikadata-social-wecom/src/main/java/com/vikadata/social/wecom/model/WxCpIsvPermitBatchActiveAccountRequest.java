package com.vikadata.social.wecom.model;

import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
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
public class WxCpIsvPermitBatchActiveAccountRequest {

    /**
     * 激活码所属企业corpid
     */
    @SerializedName("corpid")
    private String corpId;

    /**
     * 需要激活的帐号列表，单次激活的员工数量不超过1000
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
         * 帐号激活码
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * 待绑定激活的企业成员userid
         */
        @SerializedName("userid")
        private String userId;

    }

}
