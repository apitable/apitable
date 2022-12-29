package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Asynchronously send job notifications --response
 */
@Setter
@Getter
@ToString
public class DingTalkAsyncSendCorpMessageResponse extends BaseResponse {

    private String requestId;

    private String taskId;

}
