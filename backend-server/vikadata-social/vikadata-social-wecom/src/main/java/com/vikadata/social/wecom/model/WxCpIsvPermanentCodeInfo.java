package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * <p>
 * 服务商获取永久授权码信息，增加了订单支付信息
 * </p>
 * @author 刘斌华
 * @date 2022-04-20 15:30:18
 */
@Setter
@Getter
public class WxCpIsvPermanentCodeInfo extends WxCpTpPermanentCodeInfo {

    /**
     * 企业当前生效的版本信息
     */
    @SerializedName("edition_info")
    private EditionInfo editionInfo;

    public static WxCpIsvPermanentCodeInfo fromJson(String json) {

        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvPermanentCodeInfo.class);

    }

    @Setter
    @Getter
    public static class EditionInfo implements Serializable {

        /**
         * 授权的应用信息，注意是一个数组，但仅旧的多应用套件授权时会返回多个agent，对新的单应用授权，永远只返回一个agent
         */
        @SerializedName("agent")
        private List<Agent> agents;

        @Setter
        @Getter
        public static class Agent implements Serializable {

            /**
             * 应用 ID
             */
            @SerializedName("agentid")
            private Integer agentId;

            /**
             * 版本id，可在服务商平台查看已配置的付费版本信息
             */
            @SerializedName("edition_id")
            private String editionId;

            /**
             * 版本名称
             */
            @SerializedName("edition_name")
            private String editionName;

            /**
             * 付费状态。
             * 0-没有付费;
             * 1-限时试用;
             * 2-试用过期;
             * 3-购买期内;
             * 4-购买过期;
             * 5-不限时试用;
             * 6-购买期内，但是人数超标, 注意，超标后还可以用7天;
             * 7-购买期内，但是人数超标, 且已经超标试用7天
             */
            @SerializedName("app_status")
            private Integer appStatus;

            /**
             * 用户上限。
             * 特别注意, 以下情况该字段无意义，可以忽略：
             * 1. 固定总价购买
             * 2. app_status = 限时试用/试用过期/不限时试用
             * 3. 在第2条“app_status=不限时试用”的情况下，如果该应用的配置为“小企业无使用限制”，user_limit有效，且为限制的人数
             */
            @SerializedName("user_limit")
            private Long userLimit;

            /**
             * 版本到期时间（根据购买版本，可能是试用到期时间或付费使用到期时间）。
             * 特别注意，以下情况该字段无意义，可以忽略：
             * 1. app_status = 不限时试用
             */
            @SerializedName("expired_time")
            private Long expiredTime;

            /**
             * 是否虚拟版本
             */
            @SerializedName("is_virtual_version")
            private Boolean isVirtualVersion;

            /**
             * 是否由互联企业分享安装
             */
            @SerializedName("is_shared_from_other_corp")
            private Boolean isSharedFromOtherCorp;

        }

    }

}
