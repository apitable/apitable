package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.ImageOperations;

/**
 * 图片接口实现
 * @author Shawn Deng
 * @date 2021-07-07 15:27:28
 */
public class ImageTemplate extends AbstractFeishuOperations implements ImageOperations {

    private static final String IMAGE_UPLOAD = "/image/v4/put/";

    public ImageTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }
}
