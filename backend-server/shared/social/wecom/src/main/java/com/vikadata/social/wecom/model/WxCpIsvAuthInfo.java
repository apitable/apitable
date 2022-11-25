package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo;
import me.chanjar.weixin.cp.util.json.WxCpGsonBuilder;

/**
 * The service provider obtains enterprise authorization information and adds order payment information
 */
@Setter
@Getter
public class WxCpIsvAuthInfo extends WxCpTpAuthInfo {

    /**
     * The company's current version information
     */
    @SerializedName("edition_info")
    private EditionInfo editionInfo;

    public static WxCpIsvAuthInfo fromJson(String json) {

        return WxCpGsonBuilder.create().fromJson(json, WxCpIsvAuthInfo.class);

    }

    @Setter
    @Getter
    public static class EditionInfo implements Serializable {

        /**
         * Authorized application information, note that it is an array,
         * but only the old multi-application suite authorization will return multiple agents,
         * and the new single-application authorization will always return only one agent
         */
        @SerializedName("agent")
        private List<Agent> agents;

        @Setter
        @Getter
        public static class Agent implements Serializable {

            /**
             * agent ID
             */
            @SerializedName("agentid")
            private Integer agentId;

            /**
             * edition id, you can view the configured paid edition information on the service provider platform
             */
            @SerializedName("edition_id")
            private String editionId;

            /**
             * edition name
             */
            @SerializedName("edition_name")
            private String editionName;

            /**
             * paid status.
             * 0-Not paid;
             * 1-Trial for a limited time;
             * 2-Trial expired;
             * 3-During the purchase period;
             * 4-Purchase expired;
             * 5-Unlimited trial;
             * 6-During the purchase period, but the number of people exceeds the standard, note that it can be used
             * for 15 days after exceeding the standard;;
             * 7-During the purchase period, but the number of people exceeds the standard, and the trial has
             * exceeded the standard for 15 days
             */
            @SerializedName("app_status")
            private Integer appStatus;

            /**
             * User limit.
             * Note that this field is meaningless and can be ignored in the following cases:
             * 1. Fixed price purchase
             * 2. app_status = Timed Trial/rial Expired/Unlimited Trial
             * 3. In the case of "app status=Unlimited trial" in Article 2,
             * if the configuration of the app is "no use limit for small businesses",
             * the user limit is valid and the number of people limited
             */
            @SerializedName("user_limit")
            private Long userLimit;

            /**
             * Edition expiry time (may be trial expiry time or paid usage expiry time depending on the purchased
             * version).
             * Note that this field is meaningless and can be ignored in the following cases:
             * 1. app_status = Unlimited trial
             */
            @SerializedName("expired_time")
            private Long expiredTime;

            /**
             * Whether it is virtual version
             */
            @SerializedName("is_virtual_version")
            private Boolean isVirtualVersion;

            /**
             * Whether it is shared and installed by Internet companies
             */
            @SerializedName("is_shared_from_other_corp")
            private Boolean isSharedFromOtherCorp;

        }

    }

}
