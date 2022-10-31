package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Feishu User Information
 */
@Getter
@Setter
@ToString
public class FeishuUserDetailResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        private List<FeishuUserDetail> userInfos;
    }
}
