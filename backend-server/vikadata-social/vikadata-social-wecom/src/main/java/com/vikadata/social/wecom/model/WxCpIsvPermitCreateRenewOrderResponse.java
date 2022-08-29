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
 * 创建账号续期任务
 * </p>
 * @author 刘斌华
 * @date 2022-07-04 14:57:09
 */
@Getter
@Setter
public class WxCpIsvPermitCreateRenewOrderResponse extends WxCpBaseResp {

    /**
     * 任务id，请求包中未指定jobid时，会生成一个新的jobid返回
     */
    @SerializedName("jobid")
    private String jobId;

    /**
     * 不合法的续期账号列表
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
         * 账号不合法相关错误码
         */
        @SerializedName("errcode")
        private Integer errCode;

        /**
         * 账号不合法相关错误描述
         */
        @SerializedName("errmsg")
        private String errMsg;

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
