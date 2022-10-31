package com.vikadata.social.feishu.api.impl;

import com.vikadata.social.feishu.AbstractFeishuOperations;
import com.vikadata.social.feishu.api.ImageOperations;

/**
 * Image interface implementation
 */
public class ImageTemplate extends AbstractFeishuOperations implements ImageOperations {

    private static final String IMAGE_UPLOAD = "/image/v4/put/";

    public ImageTemplate(FeishuTemplate feishuTemplate) {
        super(feishuTemplate);
    }
}
