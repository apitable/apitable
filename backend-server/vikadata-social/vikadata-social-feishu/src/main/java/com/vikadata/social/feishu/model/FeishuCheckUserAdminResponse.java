package com.vikadata.social.feishu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Feishu User Information
 */
@Getter
@Setter
@ToString
public class FeishuCheckUserAdminResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        @JsonProperty("is_app_admin")
        private boolean isAppAdmin;
    }
}
