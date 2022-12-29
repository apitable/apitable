package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Send card message Response structure
 */
@Setter
@Getter
@ToString
public class FeishuSendMessageResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {
        private String messageId;
    }
}
