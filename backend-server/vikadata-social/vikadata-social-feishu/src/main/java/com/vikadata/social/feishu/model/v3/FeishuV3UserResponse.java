package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.model.BaseResponse;

@Getter
@Setter
@ToString
public class FeishuV3UserResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        private FeishuUserObject user;
    }
}
