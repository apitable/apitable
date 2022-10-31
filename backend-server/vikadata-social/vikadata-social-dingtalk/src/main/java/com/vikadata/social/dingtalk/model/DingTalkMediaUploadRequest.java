package com.vikadata.social.dingtalk.model;

import java.io.File;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Upload media files
 */
@Setter
@Getter
@ToString
public class DingTalkMediaUploadRequest {
    private String type;

    private File media;
}
