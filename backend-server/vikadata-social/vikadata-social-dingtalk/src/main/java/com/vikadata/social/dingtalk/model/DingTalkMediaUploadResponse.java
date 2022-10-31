package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Upload media files
 */
@Setter
@Getter
@ToString
public class DingTalkMediaUploadResponse extends BaseResponse {
    private String type;

    private String mediaId;

    private Long createdAt;
}
