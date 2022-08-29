package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

/**
 * <p>
 * 飞书用户信息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/7 11:12
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
