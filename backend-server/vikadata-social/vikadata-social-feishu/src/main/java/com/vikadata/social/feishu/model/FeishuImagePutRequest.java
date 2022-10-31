package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Image upload parameters
 */
@Setter
@Getter
@ToString
public class FeishuImagePutRequest {

    private byte[] image;

    private String imageType;
}
