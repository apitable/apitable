package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 图片上传 参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/2 10:56
 */
@Setter
@Getter
@ToString
public class FeishuImagePutRequest {

    private byte[] image;

    private String imageType;
}
