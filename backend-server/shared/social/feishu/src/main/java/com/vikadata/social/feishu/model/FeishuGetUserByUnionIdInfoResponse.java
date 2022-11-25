package com.vikadata.social.feishu.model;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Feishu User Information
 */
@Getter
@Setter
@ToString
public class FeishuGetUserByUnionIdInfoResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        private Map<String, UserIdInfo> userInfos;
    }

    @Setter
    @Getter
    public static class UserIdInfo {

        private String userId;

        private String openId;
    }

}
