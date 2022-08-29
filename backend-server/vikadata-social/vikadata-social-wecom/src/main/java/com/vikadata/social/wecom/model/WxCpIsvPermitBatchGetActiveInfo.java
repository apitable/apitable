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
 * 批量获取接口许可账号的详情
 * </p>
 * @author 刘斌华
 * @date 2022-06-29 18:32:01
 */
@Getter
@Setter
public class WxCpIsvPermitBatchGetActiveInfo extends WxCpBaseResp {

    /**
     * 帐号码信息列表
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
         * 帐号激活码
         */
        @SerializedName("active_code")
        private String activeCode;

        /**
         * 帐号类型：1:基础帐号，2:互通帐号
         */
        @SerializedName("type")
        private Integer type;

        /**
         * 帐号状态：1:未绑定，2:已绑定且有效，3:已过期，4:待转移
         */
        @SerializedName("status")
        private Integer status;

        /**
         * 帐号绑定激活的企业成员userid，未激活则不返回该字段。返回加密的userid
         */
        @SerializedName("userid")
        private String userId;

        /**
         * 创建时间，订单支付成功后立即创建。激活码必须在创建时间后的365天内激活
         */
        @SerializedName("create_time")
        private Long createTime;

        /**
         * 首次激活绑定用户的时间，未激活则不返回该字段
         */
        @SerializedName("active_time")
        private Long activeTime;

        /**
         * 过期时间。为首次激活绑定的时间加上购买时长。未激活则不返回该字段
         */
        @SerializedName("expire_time")
        private Long expireTime;

    }

}
