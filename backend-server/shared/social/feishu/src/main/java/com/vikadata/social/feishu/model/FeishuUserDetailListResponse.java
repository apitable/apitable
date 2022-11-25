package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get department user details
 */
@Setter
@Getter
@ToString
public class FeishuUserDetailListResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    @ToString
    public static class Data extends BasePageInfo {

        private List<FeishuUserDetail> userInfos;
    }
}
