package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Get Enterprise Information Response
 */
@Setter
@Getter
public class FeishuTenantInfoResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        private FeishuTenantInfo tenant;
    }
}
