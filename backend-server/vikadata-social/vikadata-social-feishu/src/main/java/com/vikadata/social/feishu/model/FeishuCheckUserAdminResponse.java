package com.vikadata.social.feishu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
public class FeishuCheckUserAdminResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        @JsonProperty("is_app_admin")
        private boolean isAppAdmin;
    }
}
