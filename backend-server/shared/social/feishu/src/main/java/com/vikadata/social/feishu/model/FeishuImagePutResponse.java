package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * upload image response structure
 */
@Setter
@Getter
@ToString
public class FeishuImagePutResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {
        private String messageId;
    }
}
